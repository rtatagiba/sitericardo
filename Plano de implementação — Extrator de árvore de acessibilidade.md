# Plano de implementação — Extrator de árvore de acessibilidade

Spec para execução via Claude Code. Cada fase é uma sessão fechada com critério de aceite
verificável. Não avance de fase sem o critério cumprido.

---

## Decisão pendente antes da fase 0

**Onde a ferramenta vive.** Três opções, com consequências diferentes:

| Opção | A favor | Contra |
|---|---|---|
| Subdomínio próprio (`ax.seudominio.com`) | Isolamento de custo e risco; não contamina site principal | Domínio novo sem autoridade |
| Path no site profissional (`/ferramentas/ax`) | Herda autoridade; vira ativo de topo de funil | Abuso no endpoint afeta reputação do domínio |
| Repo separado, deploy próprio | Mais limpo pra abrir código depois | Mais uma coisa pra manter |

Recomendação: **path no site profissional**, Worker em rota separada. Ferramenta gratuita é
ativo de captação — só faz sentido se aponta pra você. Mas decida antes da fase 3, porque muda
o roteamento.

**Diferenciação.** O AXray do McAlpin já existe, é grátis e vai ser citado como referência em
todo artigo sobre o tema. Clonar não vale o esforço. Ângulos reais:

1. **Score e priorização**, não só dump da árvore. O AXray mostra a árvore; você entrega
   diagnóstico com severidade e correção.
2. **Diff JS ligado/desligado em um clique.** O caso de uso mais acionável e o mais chato de
   fazer à mão.
3. **Português.** Mercado PT/BR não tem equivalente.

Escolha pelo menos um antes de escrever código. Sem ângulo, é trabalho para ficar em segundo
lugar numa comparação.

---

## Fase 0 — Spike de viabilidade (1 sessão, não pule)

Uma pergunta a responder: **o Browser Run do Cloudflare expõe a AX tree completa via CDP?**

`page.accessibility.snapshot()` do Puppeteer existe, mas vem filtrado (esconde nós ignorados)
e não serve pra auditoria séria. O que a ferramenta precisa é
`Accessibility.getFullAXTree` via sessão CDP. Isso deveria funcionar — mas o fork da Cloudflare
não é o Puppeteer upstream, e é barato descobrir agora em vez de na fase 2.

```
Worker mínimo, sem frontend:
- binding MYBROWSER (Browser Run)
- POST /debug { url } → conecta, page.createCDPSession(),
  send('Accessibility.enable'), send('Accessibility.getFullAXTree')
- devolve nodeCount e os 20 primeiros nós crus
```

**Critério de aceite:** retorna nós com `ignored` e `ignoredReasons` presentes. Se só vier a
versão filtrada, pare e reavalie — o plano B é VPS pequena com Playwright (Fly.io / Railway),
que muda custo e arquitetura mas não o resto do plano.

**Teste também:** `javaScriptEnabled: false` funciona no fork? É o que viabiliza o diff de JS.
Se não funcionar via contexto, o fallback é `Emulation.setScriptExecutionDisabled` por CDP.

---

## Fase 1 — Núcleo de captura (1–2 sessões)

Porte a lógica do `capture_ax.js` da skill para o Worker.

```
src/
  lib/capture.ts      # conecta, captura, normaliza para schema ax-snapshot/1
  lib/probes.ts       # DIV_SOUP_PROBE e PAGE_META_PROBE (page.evaluate)
  routes/api/capture.ts
```

Pontos que vão morder:

- **`page.evaluate` no workerd**: o bundler pode renomear funções e quebrar a serialização
  (erro clássico `__name is not defined`). Se aparecer, declare as probes como string em vez
  de função, ou desligue o minify de nomes no build.
- **Sempre `browser.close()`**, inclusive no caminho de erro. Sessão que fecha por
  `BrowserIdle` em vez de `NormalClosure` continua contando minuto. Use `try/finally`.
- **Timeout duro** de 20s por captura. Site lento não pode consumir seu orçamento.
- Mantenha o schema **idêntico** ao da skill (`ax-snapshot/1`). Assim o JSON da web pode ser
  baixado e analisado pela skill local, e vice-versa. Essa compatibilidade é o que faz a
  ferramenta valer mais que a soma das partes.

**Critério de aceite:** POST com uma URL real devolve snapshot válido; o `analyze_ax.py` da
skill consome esse JSON sem adaptação.

---

## Fase 2 — Blindagem (1–2 sessões) — **bloqueante para publicar**

Endpoint público com browser headless é proxy de scraping grátis e vetor de SSRF. Nada disso é
opcional.

### 2.1 Validação de URL (contra SSRF)

Rejeitar antes de abrir o browser:

- esquema diferente de `http`/`https`
- hostname que resolve para privado: `127.0.0.0/8`, `10/8`, `172.16/12`, `192.168/16`,
  `169.254.0.0/16` (inclui o endpoint de metadata `169.254.169.254`), `::1`, `fc00::/7`
- `localhost`, `.local`, `.internal`
- porta fora de 80/443

Resolva o DNS **e revalide após redirect** — validar só a URL de entrada deixa passar
redirect para IP interno.

### 2.2 Rate limiting

- **Cloudflare Turnstile** no formulário. Corta bot trivial sem atrito pro humano.
- **KV com contador por IP**: N capturas por hora. Comece conservador (5/h) — dá pra afrouxar.
- **Kill switch de orçamento**: contador global diário em KV. Estourou, o endpoint devolve 503
  com mensagem honesta. Sem isso, um dia ruim vira fatura ruim.
- Trate **429 do próprio Browser Run** com `Retry-After` — ele existe e você vai bater nele.

### 2.3 Cache

Chave = hash de `url + modo + viewport`, valor em KV com TTL de 6–24h. Duas pessoas auditando
a mesma home popular não devem custar duas sessões de browser. É a economia mais barata do
projeto e melhora a latência percebida.

**Critério de aceite:** teste com `http://169.254.169.254/`, `http://localhost:8080` e um
redirect público→privado. Os três recusados antes de abrir browser. Loop de 20 requests
dispara rate limit.

---

## Fase 3 — Analisador compartilhado em TypeScript (2 sessões)

**Este é o passo que evita divergência.** Hoje os checks estão em `analyze_ax.py` (skill).
Reimplementar em TS cria duas fontes de verdade que separam em três meses.

```
packages/ax-core/          # sem dependência de runtime
  checks/                  # landmarks, headings, nomes, div-soup, links, form, ruido
  score.ts                 # PESOS e faixas
  diff.ts                  # js | migracao | concorrente
  types.ts                 # ax-snapshot/1, ax-findings/1
```

Consumido por: o Worker (web) e a skill (via `node` em vez de `python3`). Depois de portar,
**substitua o `analyze_ax.py` por um wrapper que chama o pacote** e apague a lógica duplicada.
Se ficar com os dois, você escolheu a divergência.

Porte junto os testes: use o snapshot sintético com defeitos plantados como fixture, e trave
o score esperado. Regressão silenciosa em regra de scoring é difícil de perceber a olho.

**Critério de aceite:** mesmo snapshot, mesmo score nas duas implementações, antes de remover
a versão Python.

---

## Fase 4 — Frontend Astro (2 sessões)

Uma página. Resista a expandir.

```
[ input de URL ] [ ☐ comparar sem JavaScript ] [ Auditar ]

→ Score 62/100 + barra por dimensão
→ Outline de headings como o agente vê   (o "aha" visual — priorize)
→ Achados por severidade, evidência colapsada
→ Árvore navegável (colapsável, virtualizada)
→ [Baixar JSON] [Baixar relatório .md]
```

- **Streaming ou progresso real.** Captura leva 5–15s. Barra falsa destrói confiança logo no
  primeiro uso; use SSE ou polling com etapas nomeadas ("abrindo browser", "capturando árvore").
- **Virtualize a árvore.** Página real dá milhares de nós; renderizar tudo trava o navegador do
  usuário — ironia ruim numa ferramenta de acessibilidade.
- **A própria página precisa passar na própria auditoria.** Isso não é piada: é o primeiro
  teste que qualquer SEO técnico vai rodar, e é conteúdo de divulgação pronto.
- Estados de erro explícitos: site bloqueou, timeout, rate limit, URL inválida. Cada um com
  texto próprio, não um "erro" genérico.

**Critério de aceite:** rodar a ferramenta contra ela mesma e contra o itinereo, com resultado
coerente com o que a skill local produz para as mesmas URLs.

---

## Fase 5 — Distribuição (1 sessão)

- Página com conteúdo real explicando o que é a árvore e por que importa para agentes — não só
  o formulário. Sem isso não ranqueia nem é citada.
- Marcação `SoftwareApplication` + `FAQPage`.
- Captura de lead honesta: relatório completo na tela, e-mail opcional só para relatório
  multi-página ou monitoramento recorrente. Gate no resultado básico queima a ferramenta.
- Divulgação: rode contra sites conhecidos, publique os achados agregados. Dado próprio é o
  que gera citação — e alimenta `radar-de-pautas` e `geo-blog-post`.

---

## Sequência resumida

| Fase | Entrega | Bloqueia |
|---|---|---|
| 0 | Spike CDP | tudo |
| 1 | Captura funcionando | 2 |
| 2 | Blindagem + cache | publicar |
| 3 | `ax-core` em TS | web e skill convergirem |
| 4 | Frontend | publicar |
| 5 | Conteúdo e distribuição | — |

Fases 3 e 4 podem ir em paralelo se você tiver dois contextos de Claude Code abertos —
o contrato entre elas são os tipos de `ax-core`.

---

## Riscos, do mais provável ao menos

1. **Sites bloqueiam o browser da Cloudflare.** Bot detection vai barrar parte das capturas
   (o Search Engine Land, ironicamente, é um deles). Não há solução completa. Mitigação:
   mensagem de erro honesta distinguindo "site bloqueou" de "ferramenta falhou".
2. **Custo escapa.** Kill switch e cache da fase 2 existem por isso. Monitore minutos de
   browser na primeira semana, todo dia.
3. **Divergência web/skill.** Endereçada pela fase 3. Se você pular, ela acontece.
4. **Escopo inflando.** "Já que estamos aqui, também podia auditar Core Web Vitals / schema /
   llms.txt." Não. Uma ferramenta que faz uma coisa bem é citável; uma que faz sete é mais um
   auditor genérico. Foi o que afundou a ideia anterior de auditoria self-service.
5. **`getFullAXTree` limitado no fork.** Endereçado pela fase 0. Plano B: VPS com Playwright.