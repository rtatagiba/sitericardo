---
pubDate: 2026-07-20T12:00:00.000Z
date: 2026-07-20
updatedDate: 2026-07-20T12:00:00.000Z
author: Editorial
draft: false
title: "Como aparecer no ChatGPT: guia AEO/GEO para sites e empresas"
titulos_alternativos:
  - "Como aparecer no ChatGPT, Gemini e Perplexity"
  - "AEO e GEO: o guia definitivo para ser citado pela IA"
  - "Por que seu site não aparece no ChatGPT (mesmo rankeando no Google)"
  - "5 passos para sua marca ser citada por ChatGPT, Gemini e Perplexity"
  - "GEO vs SEO: o que muda quando quem lê seu site é uma IA"
description: "AEO é o conjunto de práticas para um site ser lido e citado por ChatGPT, Gemini e Perplexity. Veja como schema, JSON-LD, crawlers e llms.txt entram nisso."
image: "/images/citacao-de-fonte-por-chatbot-de-ia.webp"
category: ""
slug: como-aparecer-no-chatgpt-guia-aeo-geo
keyword_principal: "como aparecer no ChatGPT"
tags:
  - IA
  - SEO
---

AEO (Answer Engine Optimization) é o conjunto de práticas para estruturar um site de forma que ChatGPT, Gemini, Perplexity e Copilot consigam ler, entender e citar o conteúdo nas respostas que dão ao usuário. GEO (Generative Engine Optimization) é o termo irmão, cunhado no [paper acadêmico que criou o termo](https://arxiv.org/abs/2311.09735), de pesquisadores de Princeton, Georgia Tech e IIT Delhi, e na prática os dois nomes descrevem o mesmo movimento: sair da lista de 10 links azuis e entrar na resposta que a IA já formulou.

A diferença central para o SEO tradicional é o alvo do texto. O Google manda um visitante até a sua página. Uma IA generativa lê a sua página, extrai o que precisa e entrega a resposta pronta, às vezes sem nenhum clique de volta. Isso muda o que "ranquear bem" significa: não basta aparecer, é preciso ser a fonte que o modelo escolhe citar dentro da resposta.

## GEO, AEO e SEO: qual a diferença na prática?

SEO otimiza para ranquear numa lista de resultados que o usuário ainda vai clicar. AEO otimiza para ser a resposta direta a uma pergunta, dentro de um mecanismo que já formula texto (assistentes de voz, snippets em destaque, o próprio AI Overviews do Google). GEO é o guarda-chuva mais recente, focado especificamente em mecanismos generativos como ChatGPT, Gemini, Perplexity e Copilot, que não apenas respondem, mas sintetizam texto novo a partir de múltiplas fontes.

| Eixo | SEO tradicional | AEO | GEO |
|---|---|---|---|
| Objetivo | Posição alta na SERP | Ser a resposta direta | Ser citado dentro de texto gerado |
| Métrica principal | Ranking, cliques, tráfego | Aparições em snippet/voz | Menções e citações em respostas de IA |
| Mecanismos alvo | Google, Bing | Google Featured Snippets, Alexa, Siri | ChatGPT, Gemini, Perplexity, Copilot |
| O que o texto precisa fazer | Convencer o algoritmo de relevância | Responder em 1-2 frases extraíveis | Fornecer trecho autocontido e denso o suficiente para ser reescrito ou citado |

Na prática, os três não competem entre si. Um post bem estruturado para AEO e GEO, com definição direta e schema correto, também tende a performar melhor em SEO tradicional, porque os sinais de clareza e estrutura que ajudam uma IA a extrair uma resposta são os mesmos que ajudam o Google a entender do que a página trata. É o mesmo princípio por trás da [mudança para o SEO semântico e o uso de vetores de embedding](/blog/a-mudanca-para-o-seo-semantico-o-que-os-vetores-significam-para-sua-estrategia) para representar significado em vez de apenas casar palavras-chave.

## Por que meu site não aparece no ChatGPT mesmo rankeando bem no Google?

Rankear no Google e ser citado por uma IA são processos diferentes, mesmo que compartilhem parte da base técnica. O Google usa PageRank e [centenas de sinais de ranking](/blog/como-melhorar-o-ranking-do-seu-site-no-google-dicas-praticas) para ordenar links. Uma IA generativa faz retrieval: busca trechos de texto semanticamente próximos da pergunta do usuário e decide, com base em densidade de entidades e clareza da definição, qual trecho vale citar.

Três causas comuns para um site que ranqueia mas não é citado:

Falta de estrutura técnica legível por máquina. Schema.org e JSON-LD ausentes ou incompletos fazem o modelo perder contexto sobre o que a página realmente afirma. Um post que já explica isso em detalhe é [criação de FAQs programadas com dados estruturados JSON-LD](/blog/criacao-de-faqs-programadas-com-dados-estruturados-json-ld-um-guia-completo-para-seo-na-era-da-ia), que mostra como marcar perguntas e respostas de forma que a IA extraia o par pergunta-resposta direto do HTML.

Bloqueio, intencional ou não, dos crawlers de IA. A Cloudflare passou a separar bots em três categorias (busca, agente e treinamento) e, a partir de 15 de setembro de 2026, todo domínio novo na plataforma nasce com treinamento e agente bloqueados por padrão em páginas com anúncio, como descrito em [como bloquear treinamento de IA sem sumir do Google](/blog/como-bloquear-treinamento-de-ia-sem-sumir-do-google-a-mudanca-que-a-cloudflare-fez-em-julho-de-2026). Se a configuração de bots do seu site não distingue essas categorias, você pode estar barrando exatamente o crawler que leva seu conteúdo até a resposta do ChatGPT.

Conteúdo redigido no formato errado para retrieval. Texto com introdução longa, insight enterrado no meio e sem definição direta é mais difícil de citar do que um parágrafo que abre com "X é Y" e uma frase densa em entidades logo em seguida.

## Como estruturar dados para IA generativa (schema, JSON-LD e FAQ)?

Schema.org é o vocabulário compartilhado que descreve o conteúdo de uma página para máquinas: tipo de artigo, autor, data, perguntas e respostas, avaliações, produtos. JSON-LD é o formato técnico mais usado para implementar esse vocabulário, um bloco de código no `<head>` ou no corpo da página que declara essas informações de forma estruturada, sem alterar o que o visitante humano vê.

Para AEO, três marcações rendem mais retorno:

[`Article` ou `BlogPosting`](https://schema.org/Article), com autor, data de publicação e data de atualização. Isso ajuda o modelo a avaliar se a informação ainda é atual, um critério cada vez mais relevante à medida que IAs generativas priorizam fontes recentes.

[`FAQPage`](https://developers.google.com/search/docs/appearance/structured-data/faqpage), marcando pares de pergunta e resposta que já existem no texto. É o mesmo princípio do post sobre FAQs programadas: cada pergunta vira um H2 literal, e a resposta logo abaixo é o trecho que o modelo tem mais chance de extrair e citar. Vale notar que o Google removeu o rich result de FAQ dos resultados de busca em 2026; a marcação continua útil para retrieval de IA generativa, mas não volta a gerar o destaque visual que tinha na SERP.

[`Organization`](https://developers.google.com/search/docs/appearance/structured-data/organization), declarando nome, site oficial e perfis verificados da empresa. Isso ajuda o modelo a associar o conteúdo a uma entidade reconhecível, em vez de tratá-lo como texto anônimo. O [guia de schema.org para empresas de serviços](/blog/o-poder-do-schema-org-para-empresas-de-servicos-um-guia-completo-para-o-seo-local) detalha essa marcação passo a passo para negócios locais.

![Blocos de dados conectados representando a estrutura de schema e JSON-LD de uma página](/images/dados-estruturados-schema-json-ld.webp)

Nenhuma dessas marcações garante citação. Elas reduzem a ambiguidade que a IA precisa resolver sozinha, e menos ambiguidade aumenta a chance de o trecho certo ser escolhido.

## Quais crawlers de IA você precisa liberar primeiro?

Cada empresa de IA opera o próprio crawler, com nome e comportamento distintos, e liberar "IA" como categoria genérica no seu firewall não é suficiente para saber o que realmente está passando. Os principais hoje:

[GPTBot e OAI-SearchBot](https://developers.openai.com/api/docs/bots), da OpenAI. O primeiro coleta dado para treinar modelos; o segundo faz busca em tempo real para alimentar respostas do ChatGPT com informação atual. São comportamentos diferentes e, seguindo a lógica de categorização que a Cloudflare adotou (busca, agente, treinamento), fazem sentido tratamentos diferentes para cada um.

[ClaudeBot](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), da Anthropic, com papel equivalente ao GPTBot para o Claude.

[PerplexityBot](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), do Perplexity, cujo modelo de produto depende fortemente de citar fontes em tempo real, o que torna esse crawler particularmente relevante para quem quer aparecer citado com link.

[Google-Extended](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers), um sinal específico do Google para controlar se o conteúdo alimenta o treinamento de modelos Gemini, separado do Googlebot tradicional que indexa para a busca.

![Robô representando um crawler de inteligência artificial analisando o conteúdo de um site](/images/crawler-de-ia-escaneando-conteudo-do-site.webp)

A tentação é bloquear tudo que parece bot desconhecido no log do servidor. O post sobre [o experimento que provou que a maior parte do crawler no log é fake](/blog/o-experimento-que-provou-a-maior-parte-do-crawler-no-seu-log-e-fake) mostra por que essa suposição costuma estar errada: boa parte do tráfego que se apresenta como crawler de IA num log bruto não é o crawler oficial, e decisões de bloqueio tomadas em cima desse dado ruidoso acabam barrando o bot certo pelo motivo errado.

## O que é o llms.txt e vale a pena implementar?

[llms.txt](https://llmstxt.org/) é um arquivo de texto simples, hospedado na raiz do domínio, que lista os documentos e seções mais relevantes de um site para que um modelo de linguagem os priorize ao processar o conteúdo. Funciona como um sumário dirigido a IAs, parecido em espírito com o [sitemap.xml](/blog/como-criar-um-sitemap-melhorar-indexacao-site) dirigido a mecanismos de busca tradicionais, mas sem o mesmo nível de adoção formal ainda.

A adoção do padrão por crawlers de IA como GPTBot (OpenAI), o crawler da Anthropic e o do Perplexity está em estágio inicial e mudou rápido ao longo de 2026. Antes de investir tempo relevante nisso, vale checar a documentação oficial de cada crawler que importa para o seu negócio, porque o suporte real pode estar à frente ou atrás do que o arquivo promete.

Dito isso, o custo de criar um llms.txt básico é baixo: um arquivo markdown simples listando os posts e páginas mais importantes do site, com um resumo de uma linha cada. Para um site que já documenta como bloqueia e libera crawlers via Cloudflare, como fica claro no post sobre [o experimento que provou que a maior parte do crawler no log é fake](/blog/o-experimento-que-provou-a-maior-parte-do-crawler-no-seu-log-e-fake), o llms.txt é o complemento natural: um já diz quem pode entrar, o outro diz o que vale a pena ler primeiro.

## Como saber se sua marca já está sendo citada por IAs?

Citação por IA ainda não tem um painel oficial equivalente ao Google Search Console. O caminho manual e gratuito é perguntar diretamente: abrir ChatGPT, Gemini e Perplexity e testar perguntas que um cliente em potencial faria sobre o seu nicho, sem mencionar sua marca, e ver se o nome aparece na resposta. As mesmas [ferramentas gratuitas de monitoramento de SEO](/blog/como-monitorar-desempenho-seo-seu-site-ferramentas-gratuitas) que já acompanham ranking e tráfego ajudam a cruzar esse sinal manual com dados de referência (referral) vindos de domínios de IA.

Outro sinal indireto vem do próprio Google. A [oficialização do grounding pelo Google](/blog/a-oficializacao-do-grounding-o-futuro-do-trafego-organico-segundo-o-google) mudou a forma como o AI Overviews escolhe e cita fontes dentro dos resultados de busca, e monitorar se o seu domínio aparece nesses blocos é um proxy razoável de citabilidade, já que a lógica de retrieval do AI Overviews e a das IAs conversacionais compartilham princípios parecidos: densidade de entidades, definição clara, estrutura de resposta direta.

Vale reforçar que projeções de aumento percentual de visibilidade com GEO circulam em diferentes fontes do mercado, mas nenhuma delas tem metodologia pública verificada até o momento. Melhor tratar como hipótese de mercado do que como dado a repetir.

## Vale a pena contratar consultoria de AEO/GEO ou dá para fazer sozinho?

Para um site pequeno com poucas páginas, boa parte do trabalho descrito aqui, marcação de schema, revisão de bots no Cloudflare, reescrita de H2s como perguntas, é executável internamente com tempo e atenção ao detalhe técnico. O ponto em que consultoria especializada compensa costuma aparecer em dois cenários: sites com dezenas ou centenas de páginas, onde a auditoria manual de schema e estrutura não escala, e negócios em que a citação por IA já é canal de aquisição relevante o suficiente para justificar acompanhamento contínuo, já que os crawlers e o comportamento dos modelos mudam com frequência maior do que os ciclos tradicionais de SEO.

## Resumo: os 4 pontos que decidem se você aparece no ChatGPT

Estrutura técnica legível por máquina. Schema.org e JSON-LD em `Article`, `FAQPage` e `Organization` reduzem a ambiguidade que o modelo precisa resolver sozinho antes de decidir citar.

Acesso liberado para os crawlers certos. Revisar a configuração de bots de IA no Cloudflare (ou equivalente) por categoria, não como chave geral de tudo ou nada, evita bloquear sem querer o crawler que leva seu conteúdo até a resposta.

Conteúdo no formato de resposta, não de narrativa. Definição direta logo no início de cada seção, H2s como perguntas literais, e frase densa em entidades logo após cada pergunta.

Sinalização experimental via llms.txt. Baixo custo de implementação, adoção ainda em construção pelos principais crawlers, mas alinhado com a direção que o setor está tomando.

Nenhum desses quatro pontos funciona sozinho. Site sem schema mas com llms.txt perfeito continua ambíguo para o modelo. Site bem marcado mas bloqueando o crawler certo nunca chega a ser lido. O ganho aparece quando os quatro andam juntos.

Vale reforçar que esses quatro pontos operam por artigo. O ganho composto aparece quando o domínio inteiro constrói [autoridade tópica com clusters de conteúdo conectados](/blog/autoridade-topic-clusters-de-conteudo-seo-geo): um post isolado, por mais bem marcado que esteja, pesa menos do que o mesmo post cercado de conteúdo relacionado que demonstra cobertura completa do assunto.
