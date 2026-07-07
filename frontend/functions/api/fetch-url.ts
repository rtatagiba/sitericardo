// Cloudflare Pages Function — same-origin CORS proxy for the Content Gap tool.
// Locked down (origin allowlist + target allowlist) so it can't become an
// open relay / SSRF vector and doesn't drain the shared Workers quota.

// Allow sitemap XML, robots.txt, and RSS feeds in both the /feed/ path form
// and the WordPress ?feed=rss2 query-string form (e.g. camillodantas.com.br).
const ALLOWED_TARGET = /(\.xml(\?.*)?$)|(\/robots\.txt$)|(\/feed\/?(\?.*)?$)|([?&]feed=)/i;

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol === 'http:' && hostname === 'localhost') return true;
    if (hostname.endsWith('.pages.dev')) return true;
    return hostname === 'ricardotatagiba.com.br' || hostname === 'www.ricardotatagiba.com.br';
  } catch {
    return false;
  }
}

export const onRequestGet = async ({ request }: { request: Request }): Promise<Response> => {
  const origin = request.headers.get('Origin');
  if (!isAllowedOrigin(origin)) {
    return new Response('forbidden', { status: 403 });
  }

  const target = new URL(request.url).searchParams.get('url');
  if (!target || !ALLOWED_TARGET.test(target)) {
    return new Response('bad target', { status: 400 });
  }

  const corsHeaders = { 'Access-Control-Allow-Origin': origin! };

  // caches.default is a Cloudflare Workers extension, absent from lib.dom's CacheStorage.
  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(target);
  const cached = await cache.match(cacheKey);
  if (cached) {
    const res = new Response(cached.body, cached);
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      redirect: 'follow',
      headers: { Accept: 'application/xml, text/xml, text/plain, */*' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'fetch failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  if (!upstream.ok) {
    return new Response(JSON.stringify({ error: `HTTP ${upstream.status}` }), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const body = await upstream.text();
  const res = new Response(body, {
    status: 200,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'text/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      ...corsHeaders,
    },
  });
  await cache.put(cacheKey, res.clone());
  return res;
};
