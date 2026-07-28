# Referência: silo, afiliado e CSV (genérico)

Todos os valores específicos de site (nicho, categoria, domínio, programa de afiliado, diretórios) vêm de `.claude/conteudo-geo.config.md`. Este arquivo só descreve as regras estruturais, que são iguais em qualquer nicho.

## Silo de links internos

- Hub = guia geral do tema/categoria.
- Todo secundário linka para o hub (obrigatório).
- Hub linka para 2 a 3 secundários relevantes, não todos.
- Nenhum secundário linka direto para outro secundário.
- Anchor natural com a keyword do artigo de destino.
- URL interna: `{DOMINIO}/blog/{slug}/` (ou o padrão de URL definido na config).

Slug interno: minúsculas, sem acentos, palavras com hífen, gerado do título.

## Afiliado (opcional — só se AFILIADO_ATIVO na config)

- Manter só o path canônico do produto/página e adicionar `AFILIADO_PARAM` (ex.: `?tag=meucodigo-20` para Amazon, `?partner_id=XXXX&utm_medium=online_publisher` para outros programas).
- Remover qualquer tracking de origem (ranking_uuid, q=, d=, gclid, etc.).
- Se o nicho não tem afiliado, ignorar esta seção inteira.

## Abordagens editoriais (uma por artigo, sem repetir)

Guia completo | FAQ de dúvidas | Comparativo (X vs Y) | Passo a passo / tutorial | Como escolher | Erros comuns + correção | Melhores {itens} de {ano} | Iniciante vs avançado | Estudo de caso | Mitos vs realidade | Checklist | Tendências

## CSV (modo CSV e Ambos)

Uma linha por artigo. Colunas na ordem exata:

`keyword_principal, titulo, descricao, categoria, tema, img_1_query, img_2_query, img_3_query, keywords_secundarias, links_internos_url, links_externos_url, prompt`

| Coluna | Regra |
|---|---|
| keyword_principal | minúsculas |
| titulo | 50 a 60 caracteres |
| descricao | 150 a 160 caracteres |
| categoria | `CATEGORIA` da config |
| tema | tópico do artigo (ex.: "Melhores fones bluetooth até 500 reais") |
| img_1_query / img_2_query / img_3_query | query CC real OU prompt de imagem no estilo `ESTILO_IMAGEM` |
| keywords_secundarias | 3 a 5, separadas por vírgula |
| links_internos_url | URLs internas do silo, separadas por vírgula |
| links_externos_url | link(s) de afiliado limpos, se `AFILIADO_ATIVO`; senão vazio |
| prompt | prompt de geração completo, sem placeholders |

Template da coluna `prompt` (substituir TODOS os campos, nunca deixar `[ ]`):

```
Você é um redator especialista em [NICHO]. Escreva um artigo SEO/GEO completo sobre [KEYWORD_PRINCIPAL]. Título: [TITULO]. Use [IMG_1] após a introdução, [IMG_2] e [IMG_3] nas seções principais. Links internos obrigatórios: [LINKS_INTERNOS_URL]. [SE AFILIADO: Inclua estes links de afiliado naturalmente no texto: [LINKS_EXTERNOS_URL].] Estrutura: abra com a resposta direta nos primeiros 20-30%, H2s como perguntas, alta densidade de entidades reais, resumo forte antes do fim. Sem travessão. Retorne APENAS Markdown puro, sem frontmatter.
```

Nota: no modo CSV o artigo é gerado por outro sistema a partir deste prompt, não pela geo-blog-post.

## Licenciamento de imagem

- Unsplash e Pexels: sem atribuição obrigatória, uso comercial ok.
- Wikimedia Commons: normalmente CC BY ou CC BY-SA, exige crédito. Guardar atribuição e colocar linha de crédito sob a imagem ou no rodapé.
- Nunca inventar URLs de imagem.
