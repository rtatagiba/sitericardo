# Blog Admin Worker

Proxy seguro entre o painel `/admin` do site e a API do GitHub. Recebe os comandos do painel (publicar, editar, excluir artigos) e faz os commits em `frontend/src/content/blog/` — o Cloudflare Pages detecta o commit e rebuilda o site automaticamente.

Arquitetura completa documentada em [.agent/Skill-posts](../.agent/Skill-posts).

## Deploy

```bash
cd cloudflare-worker
npx wrangler deploy
```

## Configuração (uma vez só)

1. **Token do GitHub** — crie um [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new) restrito ao repositório `rtatagiba/sitericardo` com a permissão **Contents: Read and write**:

   ```bash
   npx wrangler secret put GITHUB_TOKEN
   ```

2. **Senha do painel** — invente uma chave forte (ex.: `openssl rand -hex 24`). É ela que você digitará no painel `/admin`:

   ```bash
   npx wrangler secret put API_SECRET_KEY
   ```

3. **URL do Worker no frontend** — após o deploy, o wrangler mostra a URL (ex.: `https://blog-admin.xxx.workers.dev`). Configure-a no build do site:
   - Local: crie `frontend/.env` com `PUBLIC_ADMIN_WORKER_URL=https://blog-admin.xxx.workers.dev`
   - Produção: adicione a mesma variável em Cloudflare Pages → Settings → Environment variables

4. *(Recomendado)* Descomente `ALLOWED_ORIGIN` no [wrangler.toml](wrangler.toml) para restringir o CORS ao domínio do site.

## Endpoints

Todos exigem o header `Authorization: Bearer <API_SECRET_KEY>`.

| Método | Rota | Ação |
|---|---|---|
| GET | `/posts` | Lista os artigos (slug, sha, tamanho) |
| GET | `/posts/:slug` | Retorna o markdown bruto do artigo |
| PUT | `/posts/:slug` | Cria ou atualiza (`{ "content": "..." }`) |
| DELETE | `/posts/:slug` | Exclui o artigo |
