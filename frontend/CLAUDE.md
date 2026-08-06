## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Blocos de destaque nos posts

Os posts são `.md` puro (a coleção, o `lastmod` do sitemap e o editor do
`/admin` assumem essa extensão — não migrar para `.mdx`). Os blocos de corpo
vêm de `src/lib/markdown/satteri-boxes.mjs`, ligado em `astro.config.mjs` via
`markdown.processor`.

Callouts — o rótulo ("Aviso", "Dica"…) é gerado em CSS, não se escreve:

```md
> [!AVISO]
> Texto do aviso.
```

Tipos: `NOTA`, `AVISO`, `DICA`, `DESTAQUE` e `CITACAO` (esta vira citação em
destaque, centrada e fora da coluna de texto; um segundo parágrafo dentro dela
é formatado como atribuição).

Prós e contras — o contentor de fora leva **quatro** dois-pontos, senão o de
dentro fecha-o antes do tempo:

```md
::::pros-contras

:::pros

**Prós**

- Ponto a favor

:::

:::contras

**Contras**

- Ponto contra

:::

::::
```

Os `:::` precisam de linha em branco antes e depois, e têm de estar sozinhos na
linha. O cabeçalho de cada lado é `**negrito**`, não `###` — um heading entraria
no sumário como se fosse secção do artigo.

## Extrator de Árvore de Acessibilidade (`/ferramentas/arvore-de-acessibilidade`)

Usa Cloudflare Pages Functions (`functions/api/capture.ts`, `functions/api/lead.ts`) com
bindings de Browser Rendering (`MYBROWSER`) e KV (`AX_TOOL_KV`). **`astro dev` não executa
Pages Functions** — `/api/capture` vai dar 404 nele. Pra testar de verdade:

```
npm run build
npx wrangler pages dev dist
```

Isso sobe em `http://127.0.0.1:8788` (não 4321), mas com bindings **locais** (KV emulado em
disco, browser sem emulação real — a captura vai crashar). `wrangler pages dev` não aceita
`--remote` nem `--account-id` como flags, e também não aceita `-c`/`--config` pra apontar outro
arquivo de config (erro visto: `Pages does not support custom paths for the Wrangler
configuration file`) — então não dá pra manter um `wrangler.toml` separado só pra teste local
com bindings remotos.

Pra testar a captura de verdade (browser remoto real), edite `wrangler.toml` **temporariamente**,
adicionando `account_id = "8c908063ae111ab2da3236363710ff35"` no topo e `remote = true` dentro
dos blocos `[browser]` e `[[kv_namespaces]]`, rode `wrangler pages dev dist`, e **reverta antes
de commitar** — o build de produção do Cloudflare Pages rejeita esses campos (erros vistos:
`Configuration file for Pages projects does not support "account_id"` e `Unexpected fields
found ...: "remote"`). Os bindings de produção (`MYBROWSER`, `AX_TOOL_KV`) ainda precisam ser
configurados manualmente no dashboard do Cloudflare Pages — deploy é via integração Git, não
`wrangler deploy`.

## WhatTheyAsk (`/ferramentas/whattheyask`)

Keyword question explorer — expands seeds into real questions via Google Suggest.

### Rules
- Zero new dependencies — no React, no paid APIs
- JSONP via `client=chrome` (not `client=firefox` — ignored as JSONP)
- Calls use the end-user's IP, never the server's
- Cache: localStorage TTL 24h, key `wta_{keyword.trim().toLowerCase()}_{lang}`
- Rate limiting: max 5 JSONP in parallel + 100–200ms jitter between batches
- Site is 100% static — no SSR, no server-side endpoints
