// Guard contra SSRF (Fase 2.1 do plano). Endpoint público com browser
// headless é proxy de scraping grátis e vetor de SSRF por padrão — nada
// aqui é opcional. Validamos a URL de entrada E cada navegação subsequente
// (redirects incluídos, via request interception em capture.ts), porque
// validar só a URL de entrada deixa passar redirect pra IP interno.

const BLOCKED_HOSTNAME_SUFFIXES = ['.local', '.internal'];
const BLOCKED_HOSTNAMES = new Set(['localhost']);
const ALLOWED_PORTS = new Set(['', '80', '443']);

export class SsrfBlockedError extends Error {
  constructor(reason: string) {
    super(`URL bloqueada: ${reason}`);
    this.name = 'SsrfBlockedError';
  }
}

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  let value = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const n = Number(part);
    if (n > 255) return null;
    value = (value << 8) | n;
  }
  return value >>> 0;
}

function inIpv4Range(ip: string, base: string, prefix: number): boolean {
  const ipInt = ipv4ToInt(ip);
  const baseInt = ipv4ToInt(base);
  if (ipInt === null || baseInt === null) return false;
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  return (ipInt & mask) === (baseInt & mask);
}

function isPrivateIpv4(ip: string): boolean {
  return (
    inIpv4Range(ip, '127.0.0.0', 8) ||
    inIpv4Range(ip, '10.0.0.0', 8) ||
    inIpv4Range(ip, '172.16.0.0', 12) ||
    inIpv4Range(ip, '192.168.0.0', 16) ||
    inIpv4Range(ip, '169.254.0.0', 16) || // inclui 169.254.169.254 (metadata)
    inIpv4Range(ip, '0.0.0.0', 8)
  );
}

function isPrivateIpv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1' || normalized === '::') return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true; // fc00::/7
  if (normalized.startsWith('fe8') || normalized.startsWith('fe9') || normalized.startsWith('fea') || normalized.startsWith('feb')) {
    return true; // fe80::/10 link-local
  }
  // IPv4-mapped (::ffff:a.b.c.d) — valida o IPv4 embutido.
  const mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateIpv4(mapped[1]);
  return false;
}

function isIpLiteral(hostname: string): boolean {
  return ipv4ToInt(hostname) !== null || hostname.includes(':');
}

/** Resolve A/AAAA via DNS-over-HTTPS — Workers não tem API de DNS nativa. */
async function resolveHostnameIps(hostname: string): Promise<string[]> {
  const ips: string[] = [];
  for (const type of ['A', 'AAAA'] as const) {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=${type}`,
      { headers: { Accept: 'application/dns-json' } },
    );
    if (!res.ok) continue;
    const data = (await res.json()) as { Answer?: Array<{ type: number; data: string }> };
    for (const answer of data.Answer ?? []) {
      if (answer.type === 1 || answer.type === 28) ips.push(answer.data);
    }
  }
  return ips;
}

/**
 * Lança SsrfBlockedError se a URL não puder ser auditada com segurança.
 * Chamar antes de abrir o browser E de novo pra cada navegação (redirects).
 */
export async function assertUrlIsSafe(rawUrl: string): Promise<void> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new SsrfBlockedError('URL inválida');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new SsrfBlockedError('esquema deve ser http ou https');
  }
  if (!ALLOWED_PORTS.has(url.port)) {
    throw new SsrfBlockedError('porta deve ser 80 ou 443');
  }

  const hostname = url.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(hostname) || BLOCKED_HOSTNAME_SUFFIXES.some((s) => hostname.endsWith(s))) {
    throw new SsrfBlockedError('hostname interno');
  }

  if (isIpLiteral(hostname)) {
    const blocked = hostname.includes(':') ? isPrivateIpv6(hostname) : isPrivateIpv4(hostname);
    if (blocked) throw new SsrfBlockedError('IP privado ou reservado');
    return;
  }

  const ips = await resolveHostnameIps(hostname);
  if (ips.length === 0) {
    throw new SsrfBlockedError('hostname não resolveu');
  }
  for (const ip of ips) {
    const blocked = ip.includes(':') ? isPrivateIpv6(ip) : isPrivateIpv4(ip);
    if (blocked) throw new SsrfBlockedError('hostname resolve para IP privado ou reservado');
  }
}
