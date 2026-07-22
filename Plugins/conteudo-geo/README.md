# conteudo-geo

Plugin do Claude Code para gerar conteúdo de blog otimizado para **GEO/AEO** (citação por IAs como ChatGPT, Perplexity, AI Overviews) em **qualquer nicho**. É a versão agnóstica do pipeline criado para o itinereo.com, sem nenhum viés de viagem.

## O que vem dentro

| Componente | Tipo | Papel |
|---|---|---|
| `geo-blog-post` | skill | Escreve o post: estrutura "ski ramp", H2 como perguntas, densidade de entidades, frontmatter com 5 variações de título. |
| `humanizar-conteudo-ia` | skill | Revisão final que reduz padrões detectáveis de IA (baseado no estudo StoryScope). |
| `gerar-artigos-geo` | skill | Orquestrador: lê a config do site, monta o silo de links internos, resolve imagens (Creative Commons + Replicate) e delega a escrita. |
| `/setup-conteudo` | comando | Faz 6-8 perguntas e grava `.claude/conteudo-geo.config.md` para o site. |
| `/gerar-artigos` | comando | Gera um lote de artigos a partir de tópicos/keywords, em rascunho. |

## Como usar num site novo

1. **Instalar o plugin** no projeto (via marketplace do Claude Code, ou copiando esta pasta para onde seu Claude Code lê plugins).
2. Rodar **`/setup-conteudo`** e responder às perguntas (nicho, categoria, domínio, idioma, tipo de site, afiliado opcional, estilo de imagem). Isso cria `.claude/conteudo-geo.config.md`.
3. Rodar **`/gerar-artigos`** com os tópicos, ex.:
   ```
   /gerar-artigos como escolher um bom fone bluetooth; melhores fones até 300 reais; fone com ou sem fio
   ```
4. Revisar os rascunhos (`draft: true`), aprovar, e publicar.

## Configuração por site

Todo comportamento específico de um site vive em `.claude/conteudo-geo.config.md` — a skill nunca hard-coda nicho. Campos principais: `NICHO`, `CATEGORIA`, `DOMINIO`, `IDIOMA`, `SITE_TYPE` (astro/estático ou wordpress), diretórios de conteúdo/imagem, afiliado opcional (`AFILIADO_PARAM`), `ESTILO_IMAGEM` e `REGRAS_ESTILO`.

## Requisitos

- **Node 22** e os pacotes `replicate` e `sharp` (`npm i replicate sharp`) para o script de imagem.
- **`REPLICATE_API_TOKEN`** no ambiente, apenas se `REPLICATE_ATIVO: sim` (geração de imagens quando não há Creative Commons). Modelos usados: `flux-1.1-pro` (hero) e `flux-schnell` (secundárias) — ambos com licença comercial.
- Sem afiliado e sem imagens geradas, o plugin funciona só com texto e busca de imagens CC, sem custo.
- Toda imagem gerada sai recortada (crop inteligente) para ~700x400px e comprimida em WebP, para bater com o padrão de peso/tamanho do site.

## Personagem consistente (opcional)

Se o site quiser um personagem/rosto fixo aparecendo nas imagens de capa dos artigos (reforço de marca), configure em `/setup-conteudo`:

- `PERSONAGEM_ATIVO: sim`
- `PERSONAGEM_REF_IMAGES`: 1 a 3 caminhos de fotos de referência do personagem (o usuário fornece; o plugin nunca inventa um personagem sozinho).
- `PERSONAGEM_DESCRICAO`: descrição curta (aparência/roupa) que ancora a identidade junto das fotos.

Nessas condições, a imagem de capa (`[IMG_1]`) é gerada com `google/nano-banana` (Gemini 2.5 Flash Image, multi-imagem de referência), passando as fotos de referência junto do prompt da cena. As imagens secundárias continuam sem o personagem, geradas normalmente por `flux-schnell`.

## Diferenças vs. a versão itinereo

- Entrada = **lista de tópicos/keywords**, não links do GetYourGuide.
- Sem detecção de cidade/país nem parâmetro de afiliado fixo; afiliado é opcional e configurável.
- Abordagens editoriais genéricas (Comparativo, Passo a passo, Como escolher…) em vez de Roteiro/Gastronomia/Vida noturna.
- Prompt de imagem parametrizado por `ESTILO_IMAGEM` em vez de "fotografia de viagem".
