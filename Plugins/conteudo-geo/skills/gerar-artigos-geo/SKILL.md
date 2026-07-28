---
name: gerar-artigos-geo
description: Orquestra a geração de artigos de blog otimizados para GEO/AEO a partir de uma lista de tópicos ou keywords, para QUALQUER nicho. Use SEMPRE que o usuário fornecer temas/palavras-chave e quiser gerar um lote de artigos para um site, seja em modo planilha CSV (para pipeline externo) ou em modo artigos completos. Lê a configuração do site em .claude/conteudo-geo.config.md (gerada por /setup-conteudo), monta o silo de links internos, resolve imagens (Creative Commons ou geração via Replicate) e delega a escrita de cada artigo para a skill geo-blog-post e a revisão para humanizar-conteudo-ia. Não escreve o artigo do zero por conta própria no modo artigos.
---

# Gerar Artigos GEO (agnóstico de nicho)

Skill de **orquestração** (workflow) genérica. Não é uma skill de escrita: ela conduz o processo e delega a prosa para a `geo-blog-post`. É a versão niche-agnostic do fluxo — todo o comportamento específico de um site vem do arquivo de configuração, não do código da skill.

Composição:

```
gerar-artigos-geo   (esta skill: config, silo, imagens, CSV)
   └─ por artigo → geo-blog-post   (estrutura GEO, frontmatter, humaniza)
          └─ humanizar-conteudo-ia   (revisão final)
```

Detalhes pesados (formato CSV, template de prompt, regras de silo) estão em `references/orquestracao.md`. **Leia esse arquivo antes de gerar qualquer output.**

## 0. Carregar a configuração do site

Antes de tudo, ler `.claude/conteudo-geo.config.md` na raiz do projeto atual.

- Se **não existir**: avisar que o site ainda não foi configurado e pedir para rodar `/setup-conteudo` primeiro. Não inventar valores.
- Se existir: extrair os campos (nicho, categoria, idioma, tipo de site, diretórios, programa de afiliado opcional, estilo de imagem, regras de estilo). Todo o restante do workflow usa esses valores; nunca hard-codar nada de um nicho específico dentro da skill.

Campos esperados na config (ver `/setup-conteudo` para o gabarito):

```
NICHO, CATEGORIA, IDIOMA, PUBLICO, DOMINIO
SITE_TYPE, CONTENT_DIR, IMAGES_DIR, IMAGE_SRC_PREFIX
AFILIADO_ATIVO, AFILIADO_PARAM, AFILIADO_BASE   (opcionais)
ESTILO_IMAGEM
IMAGENS_ATIVAS, REPLICATE_ATIVO
PERSONAGEM_ATIVO, PERSONAGEM_REF_IMAGES, PERSONAGEM_DESCRICAO   (opcionais)
REGRAS_ESTILO
```

## Modos de saída

Perguntar sempre na box inicial:

- **CSV** — só a planilha no formato do template (uma linha por artigo, com a coluna `prompt` pronta para outro sistema). Não escreve artigos nem materializa imagens. A `geo-blog-post` NÃO é chamada.
- **Artigos** — escreve os artigos finais delegando para a `geo-blog-post`, insere o silo de links internos (e links de afiliado se `AFILIADO_ATIVO`), e resolve cada imagem inline.
- **Ambos** — as duas saídas.

## Workflow

### 1. Ler os tópicos/keywords de entrada

A entrada é uma lista de tópicos ou palavras-chave (uma por artigo). Para cada item, derivar:

- keyword principal (minúsculas)
- intenção de busca provável
- abordagem editorial (passo 4, sem repetir entre artigos do lote)

Se o usuário passou poucos detalhes, tudo bem inferir a intenção do tópico; não pedir link nem fonte externa (este fluxo é keyword-driven, não link-driven).

### 2. Pesquisa de ancoragem (sugerir quando fizer sentido)

Densidade de entidades é o fator de citação mais forte. Se o nicho envolve ferramentas, marcas, dados ou pessoas que você não conhece com segurança, **sugerir uma pesquisa web** antes de escrever, para ancorar em entidades reais e atuais. Não é obrigatório para tópicos atemporais. Nunca inventar nomes de ferramentas, números ou estatísticas.

### 3. Box interativa (aguardar confirmação)

Mostrar e esperar resposta:

- Nicho e categoria (vindos da config, a confirmar)
- Lista dos tópicos com o título de trabalho, um por linha
- "Qual será o ARTIGO PRINCIPAL (hub do silo)?"
- Modo de saída: CSV | Artigos | Ambos
- Número de imagens por artigo (default: 3; se o artigo cobrir muitos subtópicos, oferecer "uma por item citado" e indicar quantos itens são). Só perguntar se `IMAGENS_ATIVAS`.
- Idioma do artigo (default: o `IDIOMA` da config; a geo-blog-post é PT-BR nativa, outras variantes exigem override, ver seção Idioma)

### 4. Abordagens editoriais

Pesquisar dúvidas reais do público (Reddit, fóruns do nicho, Quora, comentários) para alimentar FAQ e ângulos. Atribuir uma abordagem editorial diferente a cada artigo, sem repetir. Repertório agnóstico de nicho:

Guia completo | FAQ de dúvidas | Comparativo (X vs Y) | Passo a passo / tutorial | Como escolher | Erros comuns + correção | Melhores {itens} de {ano} | Iniciante vs avançado | Estudo de caso | Mitos vs realidade | Checklist | Tendências

### 5. Silo de links internos

- O hub é o guia geral do tema/categoria.
- Todo secundário linka para o hub (obrigatório).
- O hub linka para 2 a 3 secundários relevantes, não todos.
- Nenhum secundário linka direto para outro secundário.
- Anchor natural com a keyword do artigo de destino. URLs internas: `{DOMINIO}/blog/slug/` (ou o padrão de URL da config).

### 6. Escrita (modo Artigos/Ambos): delegar para geo-blog-post

Para CADA artigo, invocar a skill `geo-blog-post` (pelo nome, via ferramenta Skill), passando o que já foi decidido para ela NÃO reperguntar:

- keyword principal, intenção de busca, tópico (derivados da abordagem editorial)
- tamanho do post (definir por abordagem: FAQ e Como escolher ~short/médio; Guia completo e Passo a passo ~long-form)
- público e site de destino (vindos da config: `PUBLICO`, `DOMINIO`)

Depois que a geo-blog-post entrega o rascunho, ESTA skill injeta os elementos de domínio (passo 7).

**Precedência em conflito de estrutura:**

- A `geo-blog-post` manda na FORMA da prosa: insight nos primeiros 20-30%, H2 como perguntas, densidade de entidades, linguagem definitiva, resumo forte antes do fim.
- Esta skill manda nos ELEMENTOS de orquestração: silo, posições e pipeline de imagem, links de afiliado (se ativos), frontmatter do site.
- Reconciliações obrigatórias:
  - Abertura: gancho curto pela dor/dúvida do público que aterra numa resposta definitiva ainda nos primeiros 20-30%.
  - Fecho: resumo dos pontos-chave e SÓ DEPOIS qualquer CTA. Nunca terminar em CTA vazio como último conteúdo substantivo.

### 7. Injetar elementos de domínio no rascunho

No texto vindo da geo-blog-post:

- Se `AFILIADO_ATIVO`: inserir o(s) link(s) de afiliado, limpos com `AFILIADO_PARAM`, integrados naturalmente no corpo. Se não houver afiliado nesse nicho, pular.
- Inserir a seção de links internos do silo (hub obrigatório + relevantes).
- Marcar as posições de imagem SEMPRE com o assunto explícito: `[IMG_n: assunto exato]`. Regras de posicionamento contextual:
  - `[IMG_1: ...]` após a introdução; o assunto é o tema principal do artigo.
  - As demais: cada marcador entra colado ao parágrafo/seção que fala DESSE subtópico. O assunto do marcador tem de ser algo citado no texto imediatamente adjacente (mesma seção, no máximo 1 parágrafo de distância). Nunca posicionar a imagem de um subtópico junto a texto que fala de outro.
  - Artigos que citam vários itens (listas, comparativos, guias): distribuir os marcadores para cobrir os itens citados, um por seção. Se o nº de imagens acordado não chegar para todos, avisar e sugerir aumentar (imagens CC não custam nada; só as geradas via Replicate têm custo).
- A imagem de capa (`image:` do frontmatter) NUNCA pode ser a `[IMG_1]`: o layout já a exibe como hero no topo. Usar imagens diferentes. Mesma regra de nome kebab-case do passo 8 vale para o arquivo da capa.
- Completar o frontmatter da geo-blog-post com os campos do site: `categoria` (= `CATEGORIA` da config) e quaisquer campos que o `SITE_TYPE` exija.

### 8. Imagens (modo Artigos/Ambos): resolver cada uma inline

Só executar se `IMAGENS_ATIVAS`. Para cada `[IMG_n]`, seguir a árvore:

1. Procurar imagem CC real e verificável (Unsplash, Pexels, Wikimedia) do assunto exato do marcador. A imagem tem de mostrar ESSE assunto. Se a busca só devolver imagens de outros itens, tratar como "não achou" e cair para o passo 3; nunca aproveitar imagem de assunto diferente só porque está disponível.

   Exceção: se `PERSONAGEM_ATIVO` e o marcador for `[IMG_1]` (hero), pular a busca CC e ir direto para geração via Replicate com personagem (passo 3) — imagem de banco de imagens não tem como mostrar o personagem da marca.

2. Se achar URL direto verificável: baixar para `{IMAGES_DIR}/{slug}/{nome-kebab-case}.webp` (ver regra de nome abaixo), redimensionando/recortando (crop inteligente) para ~700x400px e comprimindo em WebP, no mesmo padrão das imagens geradas (passo 3). Confirmar que existe e não está vazio. Se Wikimedia CC BY/BY-SA, registrar atribuição.
3. Se não achar (ou for o caso do personagem) E `REPLICATE_ATIVO`: montar prompt no estilo `ESTILO_IMAGEM` da config e gerar via Replicate. O script fica em `scripts/gerar-uma-imagem.js` DENTRO desta skill:
   `node <caminho-da-skill>/scripts/gerar-uma-imagem.js --prompt "..." --out {IMAGES_DIR}/{slug}/{nome-kebab-case}.webp --tier hero`
   (tier `hero` para `[IMG_1]`, `secundario` para as demais). O script já recorta para 700x400px e converte pra WebP sozinho (flags `--w`/`--h` só se o site pedir outro tamanho) e recusa `--out` que não seja kebab-case. Se `REPLICATE_ATIVO` for falso, pular a geração e deixar o marcador para o usuário resolver.

   Se `PERSONAGEM_ATIVO` e o marcador for `[IMG_1]`, acrescentar as flags de personagem (o personagem só se aplica ao hero, nunca às imagens secundárias):
   `... --tier hero --personagem-refs "{PERSONAGEM_REF_IMAGES}" --personagem-desc "{PERSONAGEM_DESCRICAO}"`
   Nesse caso o `--prompt` deve descrever a CENA/ação do personagem no contexto do artigo (ex.: "mulher analisando um notebook em uma mesa de escritório iluminada"), sem repetir rosto/roupa (isso já vem das fotos de referência + `PERSONAGEM_DESCRICAO`).

4. Só depois do arquivo existir no disco, trocar o marcador pela tag Markdown com o `alt` no padrão de acessibilidade (ver regra abaixo).
5. Se ambos falharem, manter `[IMG_n]`, registrar o erro e avisar no output final. Nunca inserir tag para arquivo inexistente.

**Regra fixa de nome de arquivo** (toda imagem, CC ou gerada): kebab-case a partir do assunto do marcador, não `img_n`. Minúsculas, sem acento, sem espaço, só `[a-z0-9-]` antes da extensão. Ex.: assunto "O clique que não aconteceu" → `o-clique-que-nao-aconteceu.webp`. O script já rejeita nome fora desse padrão; para as imagens CC, aplicar a mesma conversão manualmente antes de salvar.

**Regra fixa de alt text** (toda imagem, CC ou gerada): descrição de cena em linguagem natural, para leitor de tela / acessibilidade — não é o prompt de geração. Frase que qualquer pessoa entenderia sem contexto técnico, incluindo a keyword de forma natural (nunca stuffada). Proibido usar jargão de prompt de imagem no alt: nada de "câmera", "lente", "profundidade de campo", "iluminação volumétrica", "render 3D/CGI", "4K/8K", "octane render", "unreal engine", "fotorrealista", "editorial photography" etc. — esses termos são só para o `--prompt` enviado ao modelo, nunca para o texto que o usuário/leitor de tela vê. Exemplo: prompt de geração pode ser "render 3D estilo cyberpunk, iluminação volumétrica verde, personagem apontando para um notebook"; o alt correspondente é algo como "Homem analisando dados de palavras-chave em um notebook".

Prompt de imagem padrão (o assunto é o do marcador `[IMG_n: assunto]`, o estilo vem de `ESTILO_IMAGEM`):
`[ESTILO_IMAGEM] de [assunto do marcador], sem texto, qualidade editorial`

Modelos (licença comercial): hero = `black-forest-labs/flux-1.1-pro` (~$0.04); hero com personagem = `google/nano-banana` (Gemini 2.5 Flash Image, multi-imagem de referência, confirmar preço atual na página do modelo); secundário = `black-forest-labs/flux-schnell` (~$0.003). NÃO usar `flux-dev` (licença não comercial). Registrar tudo em `{IMAGES_DIR}/registo.json` (fonte cc/gerar, modelo, prompt, alt_text, url_origem, atribuicao, e se usou personagem).

### 9. Rascunho e gate de aprovação

Gravar cada artigo em `CONTENT_DIR` com `draft: true` no frontmatter. Imagens em `IMAGES_DIR/{slug}/`; as tags Markdown usam `IMAGE_SRC_PREFIX/{slug}/{nome-kebab-case}.webp` (ver regra de nome no passo 8).

Terminada a geração, PARAR e apresentar:

- Tabela resumo do silo (hub + secundários + links entre eles).
- Por artigo: título recomendado, slug, links de afiliado (se ativos), contagem de imagens CC baixadas vs geradas (com custo estimado das geradas), e qualquer `[IMG_n]` não resolvido.
- No modo CSV/Ambos: também a planilha populada (formato em `references/orquestracao.md`).

Não publicar nada aqui. Aguardar aprovação explícita. O usuário pode aprovar tudo, aprovar alguns, ou pedir ajustes (iterar no mesmo ficheiro).

### 10. Publicação (só após aprovação explícita)

Para os aprovados, conforme `SITE_TYPE`:

- **astro** (ou qualquer site estático versionado): trocar `draft: false`, `git add` + `git commit`; push conforme a preferência da config/comando (o push costuma disparar o deploy).
- **wordpress**: upload das imagens para a media library, criar o post via REST em `WP_API_BASE`, ajustando os src das imagens para os URLs retornados; status draft ou publish conforme indicado.

## Idioma

A `geo-blog-post` é escrita e pensada em PT-BR.

- Se `IDIOMA` = pt-br: chamar a geo-blog-post normalmente.
- Se pt-pt ou outra variante: passar override explícito à geo-blog-post ("escrever em português europeu, léxico e ortografia de Portugal") e revisar o léxico no passo 7.

## Regras de estilo fixas

Aplicar sempre o que estiver em `REGRAS_ESTILO` da config. Defaults recomendados: sem travessão/em-dash no corpo; sem frases de fechamento detectáveis de IA ("Em resumo, ...", "Concluindo, ..."). Nunca inserir tag de imagem para arquivo que não existe.
