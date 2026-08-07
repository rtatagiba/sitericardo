# Diretrizes GEO — Como a IA cita conteúdo

Fonte: Growth Memo, Kevin Indig (fev/2026), "The science of how AI pays attention". Base: 1,2 milhão de respostas do ChatGPT, 18.012 citações verificadas (dados Gauge, matching via sentence-transformer `all-MiniLM-L6-v2`, threshold 0,55 de similaridade de cosseno).

Ideia central: a IA lê como **um editor ocupado, não um estudante paciente**. Ela escaneia em busca do que precisa. Conteúdo com alta visibilidade em IA funciona como um **briefing estruturado**, não como uma história com revelação lenta.

## 1. O padrão "Ski Ramp" (onde a IA cita)

| Posição no texto | % das citações | Leitura |
|---|---|---|
| Primeiros 30% (intro) | **44,2%** | A IA busca "Quem, O quê, Onde" no topo |
| 30%–70% (meio) | 31,1% | Insight enterrado no parágrafo 12 de 20 tem 2,5x menos chance de citação |
| Últimos 30% (conclusão) | 24,7% | A IA "acorda" no fim: adora Resumo/Conclusão, ignora rodapé |

Por quê: modelos são treinados em jornalismo e papers, que seguem **BLUF (Bottom Line Up Front)**. O modelo tenta estabelecer o "frame" interpretativo o mais rápido possível e lê o resto através dele. Validação: p < 0,0001, padrão estável em lotes aleatórios.

### Nível do parágrafo

- 53% das citações vêm do **meio** do parágrafo
- 24,5% da primeira frase
- 22,5% da última frase

A IA não lê só a primeira frase: ela busca a frase com maior **ganho de informação** (mais densa em entidades). Combinação prática: **as maiores chances de citação estão nos parágrafos dos primeiros 20% da página**, na frase mais densa de cada um.

## 2. As 5 características de citabilidade

### 2.1 Linguagem definitiva vs. vaga
- Conteúdo citado é quase 2x mais propenso (36,2% vs 20,2%) a usar linguagem definitiva ("é definido como", "refere-se a").
- Mecânica: o verbo "é" cria uma ponte vetorial forte entre sujeito e definição. Pergunta "O que é X?" → o modelo busca o caminho mais forte, quase sempre uma frase "X é Y".
- Ruim: "Num mundo cada vez mais acelerado, a automação está se tornando essencial..."
- Bom: "Automação de demonstrações é o processo de usar software para..."

### 2.2 Escrita conversacional (pergunta → resposta)
- Texto citado tem 2x mais chance (18% vs 8,9%) de conter ponto de interrogação.
- **78,4% das citações com pergunta vêm de headings (H2).** A IA trata o H2 como o prompt do usuário e o parágrafo seguinte como a resposta.

| Perdedor | Vencedor |
|---|---|
| `<h2>A História do SEO</h2>` | `<h2>Quando o SEO começou?</h2>` |
| "Começou no início dos anos 90..." | "O SEO começou em..." |

- **Eco de entidade**: a primeira palavra da resposta repete o termo da pergunta (pergunta sobre SEO → resposta começa com "SEO").

### 2.3 Riqueza de entidades
- Texto comum: densidade de entidades de 5–8%. Texto muito citado: **20,6%**.
- Perdedor: "Existem muitas boas ferramentas para essa tarefa." (0%)
- Vencedor: "As principais ferramentas incluem Salesforce, HubSpot e Pipedrive." (30%)
- Mecânica: entidades específicas são âncoras verificáveis que reduzem a perplexidade do modelo. Não ter medo de citar nomes, inclusive de concorrentes.
- **Nunca inventar entidades**: se não souber nomes/números reais, pesquisar ou omitir.

### 2.4 Sentimento equilibrado (voz de analista)
- Score médio de subjetividade do texto citado: **0,47** (0 = fato seco tipo Wikipédia; 1 = pura opinião).
- Alvo: fato + análise na mesma frase.
- Exemplo (~0,5): "Embora o iPhone 15 tenha um chip A16 padrão (fato), seu desempenho em fotos com pouca luz o torna uma escolha superior para criadores de conteúdo (análise)."

### 2.5 Nível "business", não acadêmico
- Vencedores: Flesch-Kincaid ~16 (universitário). Perdedores: 19,1 (acadêmico/PhD).
- Estrutura sujeito-verbo-objeto facilita a extração de fatos, mesmo em temas complexos.
- "Emburrecer" não é a resposta: os vencedores combinam vocabulário business **e** alta densidade de entidades. A fórmula é **clareza + especificidade**.

## 3. Antipadrões (o que evitar)

- Introdução longa de aquecimento antes do insight ("guia definitivo" clássico)
- Insight principal escondido no meio do texto
- H2s como tópicos abstratos quando poderiam ser perguntas literais
- Generalizações sem entidades ("várias ferramentas", "muitos especialistas")
- Frases longas encadeadas com jargão acadêmico
- Terminar o conteúdo substantivo antes de uma seção de resumo (deixando só CTA/rodapé no fim)
- Tom 100% opinativo ou 100% enciclopédico

## 4. Checklist final (auditar antes de entregar)

- [ ] Insight/resposta principal nos primeiros 20–30% do conteúdo
- [ ] H2s-chave como perguntas literais que espelham a intenção de busca
- [ ] Resposta de cada H2-pergunta com eco de entidade na primeira palavra
- [ ] Seções-chave abrindo com definição direta ("X é...", "X refere-se a...")
- [ ] Densidade de entidades alta: ferramentas, marcas, nomes, números reais
- [ ] Tom de analista: fato + interpretação, sem extremos
- [ ] Escrita nível ~16 Flesch-Kincaid (frases diretas, jargão mínimo)
- [ ] Seção de Resumo/Conclusão substantiva antes do rodapé
- [ ] Zero travessões (—) no corpo do texto
- [ ] Zero frases de fechamento detectáveis de IA

## 5. Limitações do estudo (contexto para o autor, não para o post)

- Dados proprietários (Gauge, parceira comercial do autor), sem dataset aberto para replicação.
- p < 0,0001 confirma consistência da correlação, não tamanho de efeito nem causalidade.
- Mede citações **no ChatGPT** especificamente; Perplexity, AI Overviews e Claude têm arquiteturas de retrieval diferentes — os princípios provavelmente transferem, mas os números exatos podem variar.