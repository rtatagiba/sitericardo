---
description: Configura o pipeline de conteúdo GEO para este site. Faz 6-8 perguntas e grava .claude/conteudo-geo.config.md pronto para usar com /gerar-artigos.
---

# Setup do pipeline de conteúdo GEO

Objetivo: fazer as perguntas de configuração deste site e gravar o arquivo `.claude/conteudo-geo.config.md` na raiz do projeto atual. Depois disso, o usuário usa `/gerar-artigos` para gerar lotes de artigos sem reconfigurar nada.

## Como conduzir

1. Se `.claude/conteudo-geo.config.md` **já existir**, ler e mostrar a config atual, e perguntar se é para reconfigurar do zero ou editar campos específicos.

2. Fazer as perguntas abaixo. Aceitar respostas em bloco ou uma a uma. Onde houver default, oferecer o default e seguir se o usuário não especificar. Não inventar `DOMINIO` nem programa de afiliado — se o usuário não souber, deixar em branco.

### Perguntas

1. **Nicho / tema do site** (ex.: "finanças pessoais", "jardinagem", "ferramentas de IA", "cafés especiais"). → `NICHO`
2. **Categoria padrão dos posts** (o valor que vai no frontmatter `categoria`; default = o próprio nicho capitalizado). → `CATEGORIA`
3. **Público-alvo** (uma frase; ex.: "iniciantes montando a primeira carteira"). → `PUBLICO`
4. **Domínio do site** (ex.: `https://meusite.com`; usado para as URLs internas do silo). → `DOMINIO`
5. **Idioma** (pt-br | pt-pt | outro; default pt-br). → `IDIOMA`
6. **Tipo de site** (astro/estático versionado em git | wordpress). → `SITE_TYPE`
   - Se **astro/estático**: perguntar `CONTENT_DIR` (onde os .md aterram, ex.: `src/content/blog`), `IMAGES_DIR` (ex.: `src/assets/blog`) e `IMAGE_SRC_PREFIX` (como o .md referencia a imagem, ex.: `../../assets/blog`).
   - Se **wordpress**: perguntar `WP_API_BASE` (ex.: `https://meusite.com/wp-json/wp/v2`).
7. **Tem programa de afiliado?** (sim/não; default não). Se sim: perguntar `AFILIADO_PARAM` (o parâmetro/sufixo a anexar aos links, ex.: `?tag=meucodigo-20`) e opcionalmente `AFILIADO_BASE` (domínio do programa). → `AFILIADO_ATIVO`, `AFILIADO_PARAM`, `AFILIADO_BASE`
8. **Imagens** — ativar pipeline de imagens? (sim/não; default sim). Se sim:
   - `ESTILO_IMAGEM`: estilo visual dos prompts de geração, adaptado ao nicho (ex.: "fotografia editorial de produto, fundo neutro", "ilustração flat vetorial", "fotografia lifestyle luz natural"). Default: "fotografia editorial realista, luz natural".
   - `REPLICATE_ATIVO`: pode gerar imagens pagas via Replicate quando não achar Creative Commons? (sim/não; default sim). Requer `REPLICATE_API_TOKEN` no ambiente.
   - **Personagem consistente** (só perguntar se `REPLICATE_ATIVO: sim`): usar um personagem/rosto fixo nas imagens de capa dos artigos, para reforçar identidade de marca? (sim/não; default não). → `PERSONAGEM_ATIVO`
     - Se sim: pedir 1 a 3 caminhos de fotos de referência do personagem (o usuário já precisa ter essas fotos; nunca gerar/inventar um personagem sem que o usuário forneça ou aprove explicitamente a referência). Caminhos relativos à raiz do projeto, ex.: `assets/personagem/ref_1.jpg`. → `PERSONAGEM_REF_IMAGES` (separados por vírgula)
     - Pedir também uma descrição curta do personagem (aparência, roupa típica) para ancorar a identidade junto das fotos. → `PERSONAGEM_DESCRICAO`
     - Deixar claro: por ora o personagem só aparece na imagem de capa/hero de cada artigo (modelo `black-forest-labs/flux-2-pro`, multi-referência), não nas imagens secundárias.
9. **Regras de estilo fixas** (default: sem travessão/em-dash; sem frases de fechamento de IA). Aceitar adições do usuário (palavras vetadas, tom). → `REGRAS_ESTILO`

## Gravar o arquivo

Escrever exatamente este gabarito em `.claude/conteudo-geo.config.md`, preenchido com as respostas (deixar em branco os campos não aplicáveis, nunca com placeholder `[ ]`):

```markdown
# Configuração do pipeline de conteúdo GEO (gerado por /setup-conteudo)

NICHO: <...>
CATEGORIA: <...>
PUBLICO: <...>
DOMINIO: <...>
IDIOMA: pt-br

SITE_TYPE: astro
CONTENT_DIR: src/content/blog
IMAGES_DIR: src/assets/blog
IMAGE_SRC_PREFIX: ../../assets/blog
WP_API_BASE:

AFILIADO_ATIVO: nao
AFILIADO_PARAM:
AFILIADO_BASE:

IMAGENS_ATIVAS: sim
REPLICATE_ATIVO: sim
ESTILO_IMAGEM: fotografia editorial realista, luz natural

PERSONAGEM_ATIVO: nao
PERSONAGEM_REF_IMAGES:
PERSONAGEM_DESCRICAO:

REGRAS_ESTILO: sem travessão/em-dash; sem frases de fechamento detectáveis de IA

PUSH_AO_PUBLICAR: perguntar
```

## Fechar

Depois de gravar, mostrar um resumo dos valores e dizer: "Config salva em `.claude/conteudo-geo.config.md`. Agora use `/gerar-artigos <tópicos ou keywords>` para gerar um lote." Se `AFILIADO_ATIVO: sim` ou `REPLICATE_ATIVO: sim`, lembrar que `REPLICATE_API_TOKEN` precisa estar no ambiente para gerar imagens. Se `PERSONAGEM_ATIVO: sim`, confirmar que os arquivos em `PERSONAGEM_REF_IMAGES` existem no caminho informado.
