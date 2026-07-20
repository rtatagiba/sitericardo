---
title: "O experimento que provou: a maior parte do 'crawler' no seu log é fake"
date: 2026-07-14
description: "Um teste com IPs revelou que a maioria dos bots de IA e do Googlebot em um site novo eram falsos. Veja o método e como aplicá-lo nos seus próprios logs."
image: "/images/seu-trafego-e-mesmo-real.jpeg"
---

Todo bot que acessa uma página se identifica com um nome no cabeçalho da requisição: ChatGPT-User, Claude-User, CCBot, Googlebot. Esse nome é uma string autodeclarada. 

Custa zero para qualquer script forjar, e é exatamente por isso que scanners de credenciais adoram se passar por um assistente de IA confiável para tentar acessar arquivos como `.env.production`, `secrets.yaml` ou `config.json`. 

Forrester encontrou justamente esse padrão: acessos que usavam o nome do ChatGPT foram direto atrás de arquivos de configuração, algo que nenhum uso legítimo de assistente faria.

A analogia que ele usa funciona bem: o nome no header é como um estranho batendo na sua porta de uniforme de entregador. O uniforme é fácil de falsificar. O que prova alguma coisa é outra informação.

## Como verificar se um bot é real

![Estudo mostra que mais de 80 por cento do seu trafego de IA e fake](/images/estudo-mostra-que-mais-de-80-por-cento-do-seu-trafego-de-ia-e-fake.jpeg)OpenAI, Anthropic, Google, Perplexity e a operadora do Common Crawl publicam listas oficiais dos intervalos de IP que seus bots realmente usam. A verificação é cruzar o nome declarado com o IP de origem da requisição:

* ChatGPT-User: lista publicada pela OpenAI em [openai.com/chatgpt-user.json](http://openai.com/chatgpt-user.json)
* Claude (todos os bots): lista da Anthropic em [claude.com/crawling/bots.json](http://claude.com/crawling/bots.json)
* Perplexity-User: lista em [perplexity.com/perplexity-user.json](http://perplexity.com/perplexity-user.json)
* Googlebot: lista do Google em [developers.google.com](http://developers.google.com), no arquivo common-crawlers.json
* CCBot: lista publicada pelo Common Crawl

O script de Forrester usa três categorias, não duas: verificado (o IP está na lista publicada), spoofed (a lista carregou e o IP não está nela) e não verificável (não deu pra confirmar, porque a lista falhou ou faltou registro). Essa terceira categoria importa: tratar "não verificável" como "falso" é um erro, e foi justamente a disciplina de não fazer essa confusão que permitiu a ele chegar à investigação mais interessante do estudo, sobre o CCBot.

## O caso CCBot: quando "não verificável" vira investigação

De 20 requisições com o nome CCBot no site de Forrester, zero bateram com a lista oficial de IPs, quatro foram identificadas como spoofed e dezesseis ficaram como não verificáveis. 

Em vez de descartar essas dezesseis, ele foi atrás por quatro caminhos: checou a lista de IPs publicada, rodou DNS reverso (o CCBot real resolve para um hostname [commoncrawl.org](http://commoncrawl.org)), consultou o índice público do Common Crawl para ver se o domínio tinha sido capturado nos três meses mais recentes, e rastreou a origem dos IPs via WHOIS. 

As quatro checagens bateram na mesma conclusão: as 20 eram impostoras, rodando em hospedagem barata espalhada pela Europa. O Common Crawl importa porque alimenta boa parte dos datasets usados para treinar modelos de linguagem, então confirmar impersonação nesse bot específico tem peso maior do que parece à primeira vista.

## Retrieval e treinamento são dois jogos diferentes

Vale separar dois tipos de crawler que costumam ser tratados como a mesma coisa. Bots como ChatGPT-User e Claude-User fazem busca em tempo real: disparam quando uma pessoa está numa conversa e o assistente vai buscar uma fonte pra responder. 

Já GPTBot e ClaudeBot fazem indexação em background, o material que pode acabar dentro do peso de um modelo treinado no futuro, sem gerar tráfego de referência nenhum hoje.

No levantamento verificado de Forrester, o crawler mais ativo no domínio não foi do Google. Foi o ClaudeBot, da Anthropic, com 166 acessos confirmados, à frente do Googlebot verificado (107), do GPTBot (46) e do crawler de busca da OpenAI (40). Amostra pequena, site novo, sem tráfego promovido, mas a composição já indica algo: quem gasta orçamento de rastreamento num domínio desconhecido é sinal de peso quando o volume crescer.

## O ponto cego chamado Gemini

Diferente de OpenAI, Anthropic e Perplexity, que expõem crawlers separados e verificáveis para treinamento, indexação e busca ao vivo, o Google concentra tudo num único Googlebot. 

O que decide se o conteúdo alimenta o treinamento do Gemini é uma tag de robots.txt chamada Google-Extended, que não é um crawler: é uma permissão sobre uma coleta que já aconteceu, sem fetch próprio. Forrester encontrou quatro requisições se identificando como Google-Extended, e como esse nome não deveria nunca fazer uma requisição direta, as quatro já nascem desmascaradas, sem precisar checar IP. 

A consequência prática é que dá pra confirmar o Googlebot e nada além disso. O resto, mais uma vez, "não é fornecido", numa repetição do que aconteceu em 2011 quando o Google encriptou os referrers de busca.

## Como aplicar isso no seu site

O script usado no estudo tem cerca de quinze linhas de Python, usando só biblioteca padrão: ele baixa a lista de IPs de um provedor, extrai os intervalos de rede do JSON e checa se um IP cai dentro de algum deles. Isso é só o núcleo. 

Uma versão funcional precisa ler as linhas reais do seu log, mapear cada nome de bot pra sua lista correspondente, manter a categoria de não verificável e usar DNS reverso como fallback para operadores como o Common Crawl.

O próprio Forrester reforça: os números dele valem pouco fora do contexto, porque são duas semanas de dados num site sem tráfego promovido. O valor está no método, não na estatística. 

Se seu site tem tráfego de verdade, o dataset nos seus logs de acesso é bem melhor que o dele, e a checagem pode ser feita ainda hoje. Puxe um intervalo de datas, cruze os nomes contra as listas oficiais e veja qual fração do seu "tráfego de IA" resiste à prova do IP. Depois olhe pra linha do Googlebot e se prepare.

Saber quais bots são reais é só metade do trabalho. A outra metade é decidir o que cada um pode fazer no seu site, e como estruturar o conteúdo para o crawler certo levar ele até a resposta de uma IA. O guia [como aparecer no ChatGPT, Gemini e Perplexity](/blog/como-aparecer-no-chatgpt-guia-aeo-geo) detalha os dois lados dessa equação.
