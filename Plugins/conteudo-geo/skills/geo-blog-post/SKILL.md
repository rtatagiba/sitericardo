---
name: geo-blog-post
description: Escreve posts de blog em português (PT-BR) otimizados para citação por IAs (GEO/AEO), aplicando o modelo "ski ramp" e as 5 características de citabilidade do estudo Growth Memo/Gauge (1,2M respostas do ChatGPT). Use SEMPRE que o usuário pedir para escrever, criar, rascunhar ou otimizar um post de blog, artigo, conteúdo para site ou texto informativo — mesmo que não mencione GEO, SEO ou IA. Também se aplica quando o usuário quer reestruturar um post existente para aumentar visibilidade em ChatGPT, Perplexity, AI Overviews ou outros mecanismos generativos. Gera frontmatter completo com variações de título e aplica a skill humanizar-conteudo-ia como revisão final obrigatória.
---

# GEO Blog Post

Skill para escrever posts de blog em PT-BR estruturados como **briefing, não como narrativa** — o formato que os dados mostram ter maior chance de citação por LLMs.

Base: estudo Growth Memo (Kevin Indig) + Gauge, fev/2026 — 18.012 citações verificadas do ChatGPT. As diretrizes completas estão em `references/diretrizes-geo.md`. **Leia esse arquivo antes de escrever o primeiro rascunho** — ele contém os números, exemplos bons/ruins e as hipóteses por trás de cada regra.

## Workflow

### 1. Coletar briefing

Antes de escrever, confirme com o usuário (uma pergunta por vez ou em bloco, conforme o contexto):

1. **Tamanho do post** — SEMPRE perguntar, oferecendo:
   - Short (600–900 palavras)
   - Médio (900–1.500 palavras)
   - Long-form (1.500–2.500+ palavras)
   - Outro (usuário define)
2. **Tópico, keyword principal e intenção de busca** — se não estiver claro no pedido.
3. **Público-alvo e site de destino** — se relevante e ainda não conhecido.

Se o usuário já forneceu tudo no pedido, não pergunte de novo — só o tamanho, se estiver ausente.

### 2. Pesquisa de entidades (sugerir quando fizer sentido)

Densidade de entidades é o fator com maior gap entre citados e não citados (20,6% vs 5–8%). Se o tópico envolve ferramentas, marcas, dados, estatísticas, pessoas ou empresas que você não conhece com segurança, **sugira ao usuário fazer uma pesquisa web** antes de escrever, para ancorar o texto em entidades reais e atuais. Não é obrigatório — se o usuário recusar ou o tópico for atemporal, siga com o conhecimento disponível, mas nunca invente nomes de ferramentas, números ou estatísticas.

### 3. Estruturar o esqueleto (ski ramp)

Monte o outline antes do texto:

- **Primeiros 20–30% do post**: a resposta/insight principal. Abrir com definição direta ("X é...", "X refere-se a...") e o "Quem, O quê, Onde" do tópico. Nada de introdução de aquecimento.
- **H2s como perguntas literais** que espelham a intenção de busca ("Quando o SEO começou?" em vez de "A História do SEO"). Nem todo H2 precisa ser pergunta, mas os que respondem dúvidas-chave devem ser.
- **Meio do post**: desenvolvimento, exemplos, dados. Cada seção deve funcionar de forma autônoma (a IA extrai trechos, não lê o todo).
- **Conclusão/Resumo forte antes do rodapé**: a IA "acorda" nos últimos 30%. Uma seção de resumo com os pontos-chave reafirmados vale a pena. Nunca terminar com CTA vazio como último conteúdo substantivo.

### 4. Escrever aplicando as 5 características

Checklist por parágrafo/seção (detalhes e exemplos em `references/diretrizes-geo.md`):

1. **Linguagem definitiva**: abrir seções-chave com "X é / X refere-se a". Nada de "num mundo cada vez mais...".
2. **Eco de entidade**: a primeira palavra da resposta a um H2-pergunta repete a entidade da pergunta.
3. **Densidade de entidades alta**: citar nomes de ferramentas, marcas, pessoas, números específicos — inclusive concorrentes. Substituir "existem várias ferramentas" por "Salesforce, HubSpot e Pipedrive".
4. **Voz de analista** (subjetividade ~0,47): fato verificável + uma linha de interpretação na mesma frase. Nem Wikipédia seca, nem opinião pura.
5. **Nível business, não acadêmico** (Flesch-Kincaid ~16): frases sujeito-verbo-objeto, jargão só quando necessário. Clareza + especificidade, nunca "emburrecer".

### 5. Gerar frontmatter

Todo post sai com frontmatter YAML no topo do .md contendo:

```yaml
---
title: "[título escolhido/principal]"
titulos_alternativos:
  - "[variação 1]"
  - "[variação 2]"
  - "[variação 3]"
  - "[variação 4]"
  - "[variação 5]"
description: "[meta description 140-160 caracteres, com a keyword e linguagem definitiva]"
slug: "[slug-curto-com-keyword]"
keyword_principal: "[keyword]"
data: [YYYY-MM-DD]
---
```

**Gerar 5 variações de título** usando técnicas de copywriting + SEO moderno para LLMs, misturando ângulos diferentes:
- Pergunta literal (espelha a query do usuário)
- Definitivo/BLUF (a resposta já no título)
- Número/especificidade (dados, quantidades, entidades no título)
- Benefício/promessa (framework de leads do *Great Leads* quando couber)
- Contraste/tensão (mito vs realidade, antes vs depois)

Marcar qual variação você recomenda e por quê (1 linha).

### 6. Revisão final obrigatória: humanizar-conteudo-ia

**SEMPRE**, antes de entregar, aplicar a skill `humanizar-conteudo-ia` (invocá-la pelo nome via ferramenta Skill) como passo de revisão do rascunho completo. Ler a skill e aplicar suas regras ao texto.

Regra de precedência em caso de conflito: as diretrizes GEO estruturais (posição do insight, H2-pergunta, linguagem definitiva, densidade de entidades) **vencem**; a humanização atua na camada de naturalidade, variação e especificidade da escrita — as duas são compatíveis na maioria dos casos, já que ambas combatem texto genérico.

Regras de estilo fixas do usuário (aplicar sempre, independente da humanização):
- **Nunca usar travessão/em-dash (—)** no corpo do post.
- **Nunca usar frases de fechamento detectáveis de IA** ("Em resumo, ...", "Concluindo, ...", "Esperamos que este artigo...").

### 7. Entregar

- Quando chamada isoladamente, salvar como arquivo `.md` no diretório de saída combinado (ou apresentar inline se o usuário não pediu arquivo), usando o slug como nome. Quando chamada dentro do orquestrador `gerar-artigos-geo`, é o orquestrador que decide o destino final (ele grava no repositório do site).
- Apresentar o arquivo ao usuário com um resumo curto: tamanho final, título recomendado e 2-3 decisões estruturais que você tomou (ex.: "insight principal movido para o primeiro H2", "adicionei seção de resumo antes do fim").
- Se o usuário pedir ajustes, iterar no mesmo arquivo.

## Modo auditoria (post existente)

Se o usuário trouxer um post já escrito para otimizar em vez de criar do zero:

1. Ler o post e mapear: onde está o insight principal (% da página)? Os H2s são tópicos abstratos ou perguntas? Qual a densidade de entidades aproximada? Há conclusão/resumo?
2. Reportar o diagnóstico contra o checklist (seção 6 de `references/diretrizes-geo.md`).
3. Reescrever aplicando o workflow a partir do passo 3, preservando a voz e os fatos do original.
