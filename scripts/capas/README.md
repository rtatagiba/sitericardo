# Capas do blog

Substituem as capas antigas (personagem 3D, hologramas verdes, chuva de código
estilo Matrix), que vinham de prompts de geração e não combinavam com a paleta
Prancheta Noturna.

Uma capa tem três camadas:

1. **Retrato real** do Ricardo, tratado em duotone ocre sobre grafite;
2. **Tipografia** — Fraunces para o título, JetBrains Mono para data, categoria
   e assinatura;
3. **Camada gráfica** desenhada a partir do título do artigo — um grafo de nós
   (default) ou barras num eixo (`"graphic": "bars"`, para artigos de dados).

A camada gráfica usa o título como semente, por isso cada artigo tem um desenho
diferente e o mesmo artigo gera sempre o mesmo desenho.

Saída: `frontend/public/images/capas/<slug>.webp`, 1200×675 — o tamanho que o
`BaseLayout` já declara em `og:image`.

## Gerar capas

```bash
node scripts/capas/gerar-capas.js            # gera as que faltam
node scripts/capas/gerar-capas.js --forcar   # regenera todas
node scripts/capas/gerar-capas.js <slug>     # só uma
```

Lê `capas.json`. Cada entrada:

| campo        | obrigatório | notas                                              |
| ------------ | ----------- | -------------------------------------------------- |
| `slug`       | sim         | nome do `.md` em `src/content/blog/`, não o `slug:` do frontmatter |
| `title`      | sim         | aceita `<br>` para forçar quebras de linha         |
| `date`       | sim         | ex: `28 JUL 2026`                                  |
| `category`   | sim         | o eyebrow — ver os temas abaixo                    |
| `retrato`    | sim         | nome de um ficheiro em `retratos/`                 |
| `photoPos`   | não         | `object-position` do retrato, default `52% 30%`    |
| `titleSize`  | não         | px, default `54` — baixar para títulos longos      |
| `graphic`    | não         | `graph` (default) ou `bars`                        |

O `slug` é o nome do ficheiro porque é isso que o gerador usa para nomear o
`.webp`. Um artigo pode publicar noutro endereço (`autoridade-topic-…` publica em
`/blog/autoridade-topica-…` por causa do `slug:` do frontmatter) e não faz
diferença: o `image:` aponta para um caminho explícito.

### Temas

Conjunto fechado, para o eyebrow não virar campo livre:

`IA & GEO` · `SEO Técnico` · `SEO Local` · `Conteúdo` · `Estratégia` ·
`Ferramentas` · `Notícia`

São temas, não formatos — dizem de que trata o artigo, como no Search Engine
Roundtable. `bars` fica reservado aos artigos assentes em números medidos.

### Tamanho do título

A caixa tem 470 px de largura, que é o que cabe antes da lâmina ocre na linha
mais baixa. A Fraunces bold ocupa ~0,505 × tamanho por caractere, e esta escala
mantém toda a gente entre 3 e 4,5 linhas:

| caracteres | `titleSize` |
| ---------- | ----------- |
| ≤ 45       | 58          |
| 46–60      | 52          |
| 61–75      | 48          |
| 76–90      | 42          |
| > 90       | 38          |

O render é feito por Chrome headless a 2× e reduzido para 1200×675. Se o Chrome
não estiver no caminho habitual, define `CHROME_BIN`.

## Fluxo completo

Ao publicar um artigo novo, três comandos por esta ordem:

```bash
node scripts/capas/montar-capas.js       # refaz capas.json a partir dos .md
node scripts/capas/gerar-capas.js        # gera as capas em falta
node scripts/capas/aplicar-frontmatter.js  # aponta o image: de cada artigo
```

`montar-capas.js` lê o frontmatter dos artigos e trata do que é mecânico —
data, tamanho do título, quebra a seguir aos dois pontos, rotação dos retratos.
O que não consegue adivinhar é o tema: cada slug tem de estar no mapa `TEMA` no
topo do ficheiro, e o script rebenta de propósito se faltar algum.

Os três são idempotentes: correr outra vez sem alterações não faz nada.
`aplicar-frontmatter.js` nunca apaga as imagens antigas de `public/images/` —
algumas ainda são usadas no corpo dos artigos.

## Gerar retratos

```bash
node scripts/capas/gerar-retratos.mjs
```

Parte de `retratos/_base.webp` e pede ao `google/nano-banana` (via Replicate)
para mudar só a expressão e o gesto, mantendo rosto, roupa e cenário. É isto que
evita que o blog inteiro tenha a mesma cara repetida.

Os seis retratos em uso — cinco fotografados, um gerado a partir deles:

| retrato       | origem   | o que mostra                          |
| ------------- | -------- | ------------------------------------- |
| `cafe-laptop` | foto     | sentado ao portátil, sorriso aberto   |
| `gesto`       | foto     | de pé, chávena na mão, a conversar    |
| `de-pe`       | foto     | de pé, copo na mão, de frente         |
| `blazer`      | foto     | blazer azul-escuro, sentado, a rir    |
| `perfil`      | foto     | de perfil, ao ar livre, a olhar para cima |
| `pensativo`   | nano-banana | queixo na mão, a pensar            |

`capas.json` roda por eles pela ordem de publicação, para que duas capas
vizinhas na listagem do blog nunca tenham o mesmo retrato.

Precisa de `REPLICATE_API_TOKEN` em `frontend/.env`. Custa ~$0.04 por imagem.
O script salta o que já existe: para refazer uma variação, apaga o `.webp` dela
primeiro.

Para acrescentar uma expressão nova, junta uma entrada a `VARIACOES` no script.
O bloco `IDENT` tem de ficar em todos os prompts — sem ele o modelo deriva para
outra cara ao fim de duas gerações. Vale a pena olhar para as mãos no resultado:
foi por mãos deformadas que uma quarta variação (`apresentar`) ficou de fora.
