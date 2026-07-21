---
name: humanizar-conteudo-ia
description: >-
  Revisa e "humaniza" conteúdo informativo gerado por IA (artigos de blog, posts
  de LinkedIn, legendas de Instagram, carrosséis) reduzindo padrões estruturais
  típicos de LLM identificados no estudo StoryScope. Use SEMPRE que o usuário
  pedir para revisar, editar, melhorar, "humanizar" ou "tirar cara de IA" de um
  texto de blog ou rede social — mesmo que não use a palavra "humanizar". Também
  se aplica quando o usuário gerou um rascunho com IA e quer publicá-lo, ou quer
  reduzir "AI slop", superexplicação, linguagem genérica ou padrões detectáveis.
  Foca em escolhas de conteúdo e estrutura (especificidade, variação, confiar no
  leitor), não em estilo de superfície. Escreve em português brasileiro natural.
---

# Humanizar Conteúdo de IA

Revisa conteúdo informativo (blog, redes sociais) para reduzir os padrões
estruturais que separam texto de IA de texto humano, segundo o estudo StoryScope
(Russell et al., 2026). O estudo analisou ficção, mas os padrões foram traduzidos
aqui para conteúdo informativo.

**Princípio central:** o ganho durável não está no estilo de superfície (travessão,
"delve", "mergulhar") — que os próprios modelos já estão aprendendo a evitar — mas
nas escolhas de **conteúdo e estrutura**: especificidade, variação de forma e
confiar no leitor. O objetivo é aumentar diversidade e concretude, NÃO trocar um
tique de IA por outro. Se a mesma correção for aplicada sempre, ela vira uma nova
assinatura detectável.

## Como aplicar

Esta skill edita **cirurgicamente** um texto já escrito. Não reescreve do zero,
não infla o tamanho, não inventa fatos. Trabalhe na ordem de prioridade abaixo —
os dois primeiros padrões têm o maior peso no estudo e valem mais que os três
restantes somados.

Se o usuário forneceu regras de estilo próprias (ex.: proibição de travessão,
palavras vetadas, tom específico), respeite-as e some a elas — não as substitua.

## Ordem de prioridade

| # | Padrão | Peso (gap H vs IA no estudo) |
|---|--------|------------------------------|
| 1 | Performatividade sensorial (abstração vazia) | 81% vs 38% — o maior gap |
| 2 | Superexplicação do tema / "moral" | 77% vs 52% |
| 3 | Referências vagas em vez de específicas | 47% vs 24% |
| 4 | Estrutura previsível e repetida entre peças | resolução previsível 69% vs 46% |
| 5 | Ausência de endereçamento ao leitor | 28% vs 7% |

## Os 5 padrões e a correção

### 1. Performatividade sensorial (prioridade máxima)
Abstrações sensoriais que enchem linguiça sem carregar informação: "mergulhar
fundo em", "sentir na pele", "abrir os olhos para", "desvendar os segredos de".
**Correção:** troque por afirmação concreta, número ou fato verificável.
- Ruim: "Ao mergulhar no mundo da automação, você sente na pele a diferença."
- Bom: "Automatizar os rascunhos cortou o tempo de publicação de 40 min para 6 min por artigo."

### 2. Superexplicação do tema
Parágrafo ou frase que só recapitula ou diz ao leitor o que concluir ("isso prova
que", "em suma", "no final das contas", o fechamento que repete tudo).
**Correção:** corte. Termine no último ponto útil ou numa aplicação concreta.
Confie no leitor para inferir o significado.

### 3. Referências vagas
"Uma ferramenta", "um cliente", "estudos mostram", "muitas empresas".
**Correção:** troque por nomes próprios, números, marcas, lugares específicos.
Se não houver dado concreto disponível no contexto, sinalize `[FALTA DADO]` em vez
de inventar. Meta prática: pelo menos 1 dado/nome concreto por bloco de ~150 palavras.

### 4. Estrutura previsível e repetida
O risco não é uma peça isolada, é **todas terem a mesma forma** (gancho → 3 pontos
→ CTA). Os modelos de IA convergem para um molde estreito; humanos variam.
**Correção (entre peças, não dentro de uma só):** rotacione a abertura (dado,
pergunta, caso, afirmação contraintuitiva) e a arquitetura (1 ideia desenvolvida,
passo a passo, antes/depois, erro comum + correção). Sem sacrificar a clareza.

### 5. Endereçamento ao leitor (com moderação)
Humanos falam com o leitor com mais frequência. **Cuidado:** não use fórmula fixa
("se você já tentou isso, sabe que...") em toda peça — isso vira assinatura.
**Correção:** garanta um interlocutor no texto, mas varie a forma (pergunta direta,
"você" pontual, imperativo prático).

## Prompt de revisão automatizável

Para rodar como etapa de pipeline (segunda chamada à API após a geração do
rascunho), use o prompt em `references/prompt-revisao.md`. Ele já embute a ordem
de prioridade, o tratamento `[FALTA DADO]` contra alucinação, permissão para
encurtar e um log de alterações no fim.

## Verificação antes de automatizar

A correção "referência vaga → específica" é a que mais pode gerar fatos inventados
se automatizada sem controle. Antes de rodar a skill sem supervisão:
- Confirme que substituições de referência são verdadeiras, não inventadas.
- Confirme que a variação de forma acontece ENTRE peças, sem criar novo molde único.
- Confirme que nenhum corte de "superexplicação" removeu informação útil.

Rode em 5–10 textos com revisão manual antes de confiar na automação total.
