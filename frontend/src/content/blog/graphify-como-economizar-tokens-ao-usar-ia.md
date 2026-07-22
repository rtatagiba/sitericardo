---
title: "Graphify: como a ferramenta open source economiza tokens ao usar IA no código"
titulos_alternativos:
  - "O que é o Graphify e como ele economiza tokens de IA?"
  - "Graphify: a ferramenta open source que transforma código em grafo de conhecimento"
  - "Graphify: até 71x menos tokens gastos com IA, segundo testes independentes"
  - "Como economizar tokens de IA no dia a dia com o Graphify"
  - "Grafo de conhecimento vs. busca por arquivo: o que o Graphify muda no uso de IA"
description: "Graphify é uma ferramenta open source que transforma qualquer código em um grafo de conhecimento, reduzindo tokens gastos por assistentes de IA como Claude Code."
slug: "graphify-como-economizar-tokens-ao-usar-ia"
keyword_principal: "graphify"
date: 2026-07-22
image: "/images/grafo-de-conhecimento-do-codigo.webp"
category: "Ferramentas de IA"
author: Editorial
draft: true
---

# Graphify: como a ferramenta open source economiza tokens ao usar IA no código

Graphify é uma ferramenta open source que transforma qualquer projeto, código, documentação, esquemas de banco de dados, configurações e PDFs, em um grafo de conhecimento consultável. Em vez de um assistente de IA reler arquivos brutos a cada pergunta, ele passa a consultar esse grafo já pronto, o que reduz a quantidade de tokens gastos por consulta.

O projeto é mantido pela Graphify-Labs, tem licença MIT, é apoiado pela Y Combinator (turma S26) e já passou de 93 mil estrelas no GitHub.

## O que é o Graphify?

Graphify é um skill de linha de comando para assistentes de codificação por IA. Ele roda uma vez sobre uma pasta de projeto e constrói um grafo persistente: os nós são funções, arquivos e conceitos, as arestas são as chamadas, importações e relações semânticas entre eles. Esse grafo vira o contexto que a IA consulta antes de tocar em qualquer arquivo bruto, em vez de o assistente varrer o repositório inteiro toda vez que precisa de uma resposta.

## Como o Graphify funciona?

O Graphify analisa código com tree-sitter, o mesmo parser que o GitHub usa para o realce de sintaxe. Essa etapa roda inteiramente local, é determinística e não consome token nenhum, porque não depende de LLM para extrair a estrutura do código. Documentos, PDFs, imagens e vídeos são a exceção: para esses formatos, o Graphify usa o modelo do próprio assistente de IA, ou uma chave de API configurada à parte, numa passada semântica.

Cada conexão do grafo recebe uma etiqueta: EXTRACTED, quando está explícita no código-fonte, ou INFERRED, quando foi deduzida pela análise. Essa distinção separa o que é fato direto do arquivo do que é interpretação da ferramenta, algo que uma busca por similaridade de texto não entrega.

O resultado sai em três arquivos: `graph.html`, um grafo interativo para abrir no navegador, clicar nos nós e filtrar; `GRAPH_REPORT.md`, um relatório em markdown com os conceitos-chave e conexões relevantes; e `graph.json`, o grafo completo para consultar programaticamente sem reler o projeto inteiro.

![Grafo de nós e conexões verdes representando a estrutura de um projeto de código](/images/grafo-de-nos-do-codigo.webp)

Diferente de uma busca por embeddings, não existe banco vetorial por trás disso. É um grafo percorrível de verdade, com citações no formato arquivo:linha em cada resposta, o que facilita conferir de onde veio cada afirmação.

## Quanto o Graphify economiza em tokens?

O README oficial do projeto cita benchmarks nos datasets LOCOMO e LongMemEval: 45,3% de acurácia em perguntas e respostas no LOCOMO e 76% no LongMemEval-S. Fora do repositório oficial, avaliações independentes de terceiros relataram até 71,5 vezes menos tokens por consulta num corpus misto de repositórios, artigos e imagens, comparado a reler os arquivos brutos a cada pergunta.

Vale tratar o número de 71,5x como resultado de um teste específico, não como garantia universal. A primeira rodada custa tokens, porque é quando o grafo é construído. A economia aparece a partir da segunda consulta em diante, quando o assistente já lê o grafo compacto em vez de reabrir arquivo por arquivo, e cresce conforme mais perguntas são feitas sobre o mesmo projeto.

## Como instalar o Graphify?

A instalação usa gerenciadores de pacote Python. Primeiro, o CLI:

```
uv tool install graphifyy
```

ou

```
pipx install graphifyy
```

Depois, é preciso registrar o skill no assistente de IA:

```
graphify install
```

E rodar dentro do assistente, apontando para a pasta do projeto:

```
/graphify .
```

![Tela de computador exibindo linhas de código em um terminal, representando onde o Graphify é instalado](/images/instalacao-do-graphify-no-terminal.webp)

## Quais assistentes de IA funcionam com o Graphify?

A lista de integrações inclui Claude Code, Cursor, Codex, Gemini CLI, GitHub Copilot e OpenCode, entre outros. A instalação é a mesma em todos: registrar o skill uma vez com `graphify install` e chamar `/graphify` de dentro do assistente escolhido.

## O Graphify é seguro para código proprietário?

Para a parte de código, sim: o parsing roda localmente com tree-sitter, sem chamada de LLM e sem nada saindo da máquina, segundo a documentação oficial. A ferramenta declara zero telemetria e zero rastreamento de uso. A exceção fica por conta de documentos, PDFs, imagens e vídeos, que passam pela passada semântica do modelo de IA configurado, seja o do próprio assistente ou uma chave de API à parte. Quem trabalha com código proprietário sensível deve considerar essa exceção antes de apontar o Graphify para pastas com PDFs ou documentos confidenciais.

## Vale a pena usar o Graphify no dia a dia?

Para quem já usa assistentes de IA para programar e sente o consumo de tokens subir conforme o projeto cresce, sim. O ganho é maior em projetos grandes, com muitas consultas repetidas sobre a mesma base de código, onde reler arquivos inteiros a cada pergunta pesa mais no orçamento de tokens. Em projetos pequenos ou consultas pontuais, o custo de montar o grafo na primeira rodada pode não compensar.

## Resumo

Graphify troca a leitura repetida de arquivos brutos por um grafo de conhecimento construído uma vez e consultado depois, com etiquetas claras entre o que é extraído direto do código (EXTRACTED) e o que é inferido pela análise (INFERRED). A instalação é local, via `uv tool install graphifyy` ou `pipx install graphifyy`, o parsing de código não gasta token nem sai da máquina, e a saída em `graph.html`, `GRAPH_REPORT.md` e `graph.json` fica disponível para qualquer assistente de IA compatível consultar sem reler o projeto inteiro.
