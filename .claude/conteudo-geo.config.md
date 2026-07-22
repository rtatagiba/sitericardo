# Configuração do pipeline de conteúdo GEO (gerado por /setup-conteudo)

NICHO: SEO e marketing digital (GEO/AEO, SEO técnico, SEO local, era da busca por IA)
CATEGORIA: SEO
PUBLICO: profissionais de marketing e donos de pequenas/médias empresas se adaptando ao SEO na era da IA
DOMINIO: https://ricardotatagiba.com.br
IDIOMA: pt-br

SITE_TYPE: astro
CONTENT_DIR: frontend/src/content/blog
IMAGES_DIR: frontend/public/images
IMAGE_SRC_PREFIX: /images
WP_API_BASE:

AFILIADO_ATIVO: nao
AFILIADO_PARAM:
AFILIADO_BASE:

IMAGENS_ATIVAS: sim
REPLICATE_ATIVO: sim
ESTILO_IMAGEM: render 3D estilo cyberpunk/hacker de dados: hologramas verdes, chuva de código estilo Matrix, iluminação escura com destaque neon verde. Não tentar reproduzir gráficos, dashboards ou texto de UI legível embutido na cena (modelos de imagem renderizam texto de forma inconsistente); focar no personagem e no cenário temático.

PERSONAGEM_ATIVO: sim
PERSONAGEM_REF_IMAGES: frontend/public/images/como-o-google-reescreve-sua-title-tag.jpeg,frontend/public/images/estudo-mostra-que-mais-de-80-por-cento-do-seu-trafego-de-ia-e-fake.jpeg
PERSONAGEM_DESCRICAO: homem branco, careca, barba cerrada curta, jaqueta de couro preta longa sobre camisa polo preta, calça preta; presença séria/intensa, estética de "hacker de dados"

REGRAS_ESTILO: sem travessão/em-dash; sem frases de fechamento detectáveis de IA ("Em resumo, ...", "Concluindo, ...")

PUSH_AO_PUBLICAR: perguntar

## Notas (não faz parte dos campos estruturados, ler antes de escrever frontmatter)

- O schema Astro em `frontend/src/content.config.ts` usa a chave `category` (inglês), não `categoria`. Ao completar o frontmatter (passo 7 da skill), usar `category:` com o valor de CATEGORIA, senão o campo é descartado pelo schema.
- Campos aceitos pelo schema: title, description, date/pubDate/publishDate, author, image, category, tags, draft. `slug` e `keyword_principal` já aparecem nos posts existentes mesmo não estando no schema (zod aceita passthrough implícito para campos extra não usados no template).

