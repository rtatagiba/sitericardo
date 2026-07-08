---
pubDate: 2026-07-08T17:33:59.422Z
date: 2026-07-08
updatedDate: 2026-07-08T17:33:59.422Z
author: Editorial
draft: false
title: Como bloquear treinamento de IA sem sumir do Google (a mudança que a Cloudflare fez em julho de 2026)
description: "A Cloudflare separou bots de IA em três categorias: busca, agente e treinamento. A partir de 15 de setembro de 2026, todo domínio novo criado na plataforma nasce com treinamento e agente bloqueados por padrão"
category: ""
image: /images/como-bloquear-treinamento-de-ia-sem-sumir-do-google-a-mudanca-que-a-cloudflare-fez-em-julho-de-2026/img-1783531885540.jpeg
tags:
  - IA
---

A Cloudflare separou bots de IA em três categorias: busca, agente e treinamento. A partir de 15 de setembro de 2026, todo domínio novo criado na plataforma nasce com treinamento e agente bloqueados por padrão nas páginas que têm anúncio, mantendo busca liberada. Na prática, isso acaba com a escolha de tudo ou nada que existia até agora, e devolve pro dono do site o controle sobre quem lucra em cima do conteúdo dele.

\## O botão de bloquear tudo nunca resolveu o problema certo Até julho de 2026, a Cloudflare oferecia uma solução de bot de IA: um botão. Ligado ou desligado. Bloqueia tudo ou deixa tudo passar. O problema é que essa lógica binária ignorava uma diferença enorme.

O Googlebot passando pelo seu site pra te indexar e te mandar visitante de volta não tem nada a ver com um crawler que suga seu conteúdo pra treinar um modelo e nunca mais aparece. Tratar os dois do mesmo jeito sempre foi ruim pra quem produz conteúdo, e pior ainda pra site pequeno.

Se ninguém encontra seu site, você é obrigado a escolher entre aparecer na busca (aceitando que seu texto vire dado de treinamento) ou proteger o conteúdo e correr o risco de ninguém nunca mais te achar. Quem sai ganhando nessa armadilha é sempre quem já tem posição consolidada, porque os mesmos bots que indexam também treinam.

\## As três categorias que a Cloudflare criou Em vez de continuar tentando definir o que é ou não IA (essa linha já ficou impossível de traçar), a Cloudflare passou a classificar o comportamento de cada bot. Vale pra todo cliente, inclusive quem está no plano gratuito. 

\*\*Busca\*\*: indexa conteúdo pra responder perguntas e, idealmente, devolve tráfego de referência.

\*\*Agente\*\*: age em tempo real representando uma pessoa específica. Um agente de navegador operando o Chrome pra completar uma tarefa que alguém pediu ali, na hora.

\*\*Treinamento\*\*: coleta dado pra treinar ou ajustar modelo. O conteúdo entra de forma permanente na arquitetura do modelo e não volta como visita. Com isso, dá pra permitir que sua página apareça em busca e, ao mesmo tempo, bloquear que o mesmo texto alimente treinamento de modelo. Antes não existia esse meio termo.

\## O que muda em setembro A partir de 15 de setembro de 2026, todo [domínio novo na Cloudflare nasce com treinamento](https://blog.cloudflare.com/agentic-internet-bot-report/) e agente bloqueados de saída nas páginas com anúncio.

Busca continua liberada. A lógica é direta: um anúncio na página é sinal de que aquele conteúdo foi feito pra ser visto por gente de verdade, e é a atenção humana que paga a conta ali. Tem um detalhe técnico que muda o jogo pra quem opera bot multipropósito. O Googlebot indexa pra busca e também coleta dado que pode virar treinamento.

Com a regra nova, bloquear treinamento bloqueia o bot inteiro naquela função, mesmo que ele esteja fazendo busca de forma legítima em paralelo. Isso obriga empresa de IA a separar comportamento em vez de esconder tudo atrás de um crawler só. Quem já tem site rodando pode manter a configuração antiga até a data limite. Ninguém muda de padrão sem avisar. ## O pacote extra que veio junto 

\*\*BotBase\*\*: base de dados pesquisável, disponível pra cliente Enterprise, com todo bot verificado e a classificação exata de cada um.

\*\*Sinal de uso de conteúdo\*\*: extensão do robots.txt tradicional. Agora dá pra dizer não só se um bot pode acessar o conteúdo, mas o que ele pode fazer depois: interagir sem guardar nada, indexar com link de volta, ou resumir e reproduzir o material.

\*\*"Verified" com novo significado

\*\*: antes, bot verificado praticamente significava acesso livre. Agora significa permissão dentro da categoria específica que se aplica àquele bot, e só.

\*\*Confiança transitiva\*\*: um cabeçalho técnico chamado Forwarded garante que a confiança dada a uma empresa de IA se mantém mesmo quando o acesso passa por intermediário no caminho. Fecha a brecha de contornar a regra usando proxy. ## O que fazer com essa informação A Cloudflare está atrás de mais de um quinto dos domínios da internet, então isso não é ajuste cosmético.

Se você administra um site, vale entrar no painel antes de setembro chegar e revisar suas regras de bot uma por uma. Decidir o que liberar em busca, o que travar em treinamento e como tratar agente autônomo é o tipo de escolha que separa um site que continua trazendo visitante de um que só alimenta modelo em troca de nada.
