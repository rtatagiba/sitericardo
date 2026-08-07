---
description: Gera um lote de artigos GEO a partir de tópicos/keywords, em rascunho, para aprovar e publicar. Lê a config do site em .claude/conteudo-geo.config.md.
---

# Gerar artigos GEO

Recebi tópicos ou keywords em `$ARGUMENTS` (ou na mensagem). Execute a skill `gerar-artigos-geo` seguindo o workflow dela.

## Fase 0 — Config

Ler `.claude/conteudo-geo.config.md`. Se não existir, parar e pedir para rodar `/setup-conteudo` primeiro. Todo destino, nicho, idioma e pipeline de imagem vêm desse arquivo.

## Fase 1 — Rascunho (não publica nada)

1. Rodar o workflow da skill: ler os tópicos, box interativa (nicho a confirmar, lista de títulos, hub do silo, modo de saída, nº de imagens), pesquisa de ancoragem, abordagens editoriais, silo.
2. No modo Artigos, delegar a escrita para `geo-blog-post`. Idioma = `IDIOMA` da config; se pt-pt, passar override de português europeu.
3. Gravar cada artigo em `CONTENT_DIR` com `draft: true`. Imagens em `IMAGES_DIR/{slug}/`; tags Markdown usando `IMAGE_SRC_PREFIX/{slug}/{nome-kebab-case}.webp`. Nome de arquivo e alt text seguem a regra fixa da skill (kebab-case sem acento/espaço; alt em linguagem natural acessível, sem jargão de prompt).
4. Resolver as imagens inline conforme a árvore da skill (só se `IMAGENS_ATIVAS`).

## Fase 2 — Gate de aprovação (parar e esperar)

Mostrar um resumo e PARAR. Não publicar. O resumo traz:
- Tabela do silo (hub + secundários + links entre eles).
- Por artigo: título recomendado, slug, links de afiliado (se ativos), e fontes de imagem (quantas CC, quantas geradas + custo estimado).
- Qualquer `[IMG_n]` por resolver.

Aguardar resposta. O usuário pode aprovar tudo, aprovar alguns, ou pedir ajustes.

## Fase 3 — Publicar (só quando o usuário disser "publicar")

Para os aprovados, conforme `SITE_TYPE`:

- **astro/estático**: trocar `draft: true` por `draft: false`; `git add` + `git commit`; push conforme `PUSH_AO_PUBLICAR` (sim | nao | perguntar). O push costuma disparar o deploy.
- **wordpress**: upload das imagens para `WP_API_BASE/media`, criar o post via `WP_API_BASE/posts` ajustando os src das imagens; status draft ou publish conforme indicado (default draft).

Regras fixas: aplicar `REGRAS_ESTILO` da config. Nunca inserir tag de imagem para arquivo que não existe. Cada imagem do corpo deve retratar algo citado no texto imediatamente adjacente.
