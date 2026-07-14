// Cliente do painel /admin — fala com o Cloudflare Worker (cloudflare-worker/index.js)

// Configure em frontend/.env: PUBLIC_ADMIN_WORKER_URL=https://blog-admin.SEU-SUBDOMINIO.workers.dev
export const WORKER_URL =
  import.meta.env.PUBLIC_ADMIN_WORKER_URL || 'https://blog-admin.SEU-SUBDOMINIO.workers.dev';

const STORAGE_KEY = 'admin_api_key';

export function getSavedKey() {
  return localStorage.getItem(STORAGE_KEY) || '';
}

export function saveKey(key) {
  localStorage.setItem(STORAGE_KEY, key);
}

export function clearKey() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Chama o Worker. Lança Error com mensagem amigável em caso de falha;
 * em 401 a chave salva é descartada para forçar novo login.
 * @param {string} path
 * @param {{ method?: string, body?: unknown, key?: string }} [options]
 */
export async function api(path, { method = 'GET', body, key } = {}) {
  const apiKey = key ?? getSavedKey();
  if (!apiKey) throw new Error('Informe a chave de API.');

  let res;
  try {
    res = await fetch(`${WORKER_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar ao Worker. Verifique a URL configurada.');
  }

  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    clearKey();
    throw new Error('Chave de API inválida.');
  }
  if (!res.ok) throw new Error(data.error || `Erro ${res.status}.`);

  // Login bem-sucedido: persiste a chave para os próximos acessos
  if (key) saveKey(key);
  return data;
}

/** Gera slug a partir do título (sem acentos, kebab-case). */
export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Escapa valor para uso em YAML entre aspas duplas. */
export function yamlString(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

/** Lê um File e devolve o conteúdo em Base64 puro (sem o prefixo data:). */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).replace(/^data:[^;]+;base64,/, ''));
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}

/** Sobe uma imagem para o repositório e retorna { path: '/images/...' }. */
export async function uploadImage(file) {
  const content = await fileToBase64(file);
  return api('/images', { method: 'POST', body: { filename: file.name, content } });
}
