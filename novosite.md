# Duas Realidades

## Storyboard completo + arquitetura Astro para ricardotatagiba.com.br

---

## 1. O conceito em uma frase

A maioria das empresas otimiza para um mundo que já não existe. O site coloca o visitante dentro dessa simulação confortável e dá-lhe uma lanterna: ao mover o rato, revela o que está por baixo (o mundo que as máquinas veem). Ao primeiro clique, a simulação rasga-se de vez e o visitante passa a navegar na realidade nova. Não há caminho de volta.

**Regra de ouro do projeto:** a metáfora nunca é explicada. É sentida. Nenhum texto diz "isto é uma simulação". O design faz esse trabalho sozinho.

---

## 2. Direção de arte: os dois mundos

### Mundo A: "A Superfície" (a simulação)

O mundo em que o visitante entra. Deve parecer familiar, correto, ligeiramente morto.

- **Paleta:** quase monocromática e fria. Fundo `#E8EAED` (o cinzento exato de interfaces Google antigas), texto `#5F6368`, azul de link clássico `#1A0DAB` como única cor. Tudo levemente dessaturado, como uma fotografia de stock.
- **Tipografia:** utilitária e mecânica. Arial/Helvetica ou uma grotesca neutra (ex.: Inter em pesos regulares). Sem personalidade, de propósito.
- **Geometria:** plana. Wireframes finos, grelhas perfeitas, sombras inexistentes ou duras. Cards retangulares com cantos de 4px. O mundo é 2D mesmo quando renderizado em 3D: profundidade zero, luz frontal chapada.
- **Movimento:** quase nenhum. Micro-animações secas, lineares, de 150ms. O mundo respira pouco.
- **Conteúdo visual:** uma SERP estilizada (não copiar o Google literalmente: uma abstração de "página de resultados", com 10 blocos de link), gráficos de posições, métricas de vaidade.

### Mundo B: "A Profundidade" (a realidade)

O mundo revelado pela lanterna e, depois do clique, permanente.

- **Paleta:** fundo profundo `#0A0E14` (azul-negro, não preto puro), luz volumétrica âmbar-dourada `#E8A855` como fonte de luz principal, acentos em ciano elétrico `#4FD8E8` para dados vivos e texto de IA, branco quente `#F5F0E8` para tipografia. A escolha do âmbar é deliberada: foge do verde-Matrix (cliché e território da Warner) e do azul-tech genérico. É luz de descoberta, quase arqueológica, coerente com a ideia de revelar o que estava escondido.
- **Tipografia:** editorial. Uma serif de display com carácter (ex.: Fraunces, GT Sectra ou Editorial New) para títulos gigantes, e uma sans humanista (ex.: Söhne, General Sans) para corpo. Uma mono (ex.: JetBrains Mono) exclusivamente para o "texto que as máquinas leem": schema, entidades, respostas de IA a gerar-se.
- **Geometria:** profundidade real. Fog exponencial, luz volumétrica em god rays vindos de cima-esquerda, partículas de pó em suspensão, objetos com peso e sombra suave.
- **Movimento:** orgânico. Easings longos (`expo.out`, `power3.inOut`), nada linear, tudo com inércia. O mundo está vivo.

### O contraste que conta a história

| Eixo   | Superfície           | Profundidade                   |
| ------ | -------------------- | ------------------------------ |
| Luz    | chapada, sem sombras | volumétrica, direcional        |
| Cor    | dessaturada, fria    | profunda, quente               |
| Tipo   | grotesca neutra      | serif editorial + mono viva    |
| Espaço | plano                | tridimensional                 |
| Tempo  | estático             | gerativo (texto a escrever-se) |

---

## 3. Storyboard frame a frame

Convenção: **[S]** = acontece na Superfície, **[P]** = na Profundidade, **[L]** = visível apenas através da lanterna.

### Cena 0: Load (0 a 1.5s)

**[S]** A página carrega instantaneamente como HTML estático (LCP rápido, sem esperar WebGL). O visitante vê o hero da Superfície: fundo cinzento, uma barra de pesquisa abstrata ao centro com um cursor a piscar, e por baixo o esqueleto de 10 resultados wireframe. Título em grotesca neutra: **"Ricardo Tatagiba. SEO."** Ponto final seco, deliberadamente banal. É a versão do site que qualquer consultor teria.

Por baixo, invisível, o canvas WebGL da Profundidade termina de inicializar.

### Cena 1: O convite (1.5 a 4s)

**[L]** Antes de o visitante fazer qualquer coisa, um círculo de revelação de ~180px aparece sozinho e deambula lentamente pelo hero, num percurso suave (uma curva de Lissajous lenta). Por onde passa, vê-se a Profundidade: dentro do círculo, o mesmo hero mas transformado, com o título em serif dourada **"O SEO que as máquinas leem."**, fog, partículas.

Uma micro-legenda em serif pequena, canto inferior: _"move o rato"_. Desaparece ao primeiro movimento.

Ao primeiro movimento do rato, o círculo é "entregue" ao cursor com uma transição spring de ~0.6s (o círculo voa até ao cursor). A partir daqui, a lanterna é do visitante.

### Cena 2: Exploração livre no hero

**[L]** O visitante varre o hero com a lanterna. Cada elemento da Superfície tem um contraparte na Profundidade, alinhado pixel a pixel:

- O título banal → o título editorial dourado
- A barra de pesquisa vazia → a mesma barra com uma pergunta real a escrever-se em mono ciano: _"qual a melhor agência de SEO perto de mim?"_ seguida de uma resposta de IA a gerar-se token a token
- Os 10 wireframes de resultados → dissolvem-se; no lugar deles, um único bloco de resposta citada, com uma marca destacada como fonte
- O rodapé de métricas de vaidade ("posição #3", "2.400 visitas") → entidades e schema em mono: `Organization`, `sameAs`, `FAQPage`, ligadas por linhas finas de luz

Comportamento da lanterna: segue o cursor com lerp (fator ~0.08, sensação de peso), raio respira ±6% num ciclo de 3s, e cresce ~20% quando o cursor para por mais de 800ms (a realidade alarga-se quando o visitante hesita). Na borda: 12px de zona de transição com distorção suave e 3 a 5 partículas âmbar que escapam pela fresta por segundo.

### Cena 3: O rasgo (o primeiro clique, em qualquer lugar)

O momento central do site. Qualquer clique ou tap dispara a sequência, com origem no ponto exato do clique:

1. **0 a 150ms:** freeze. Tudo para por um instante. Um frame de "falha": a Superfície estremece 2px e mostra, por um flash, o seu próprio HTML por baixo (tags cinzentas semi-transparentes sobre os elementos).
2. **150 a 900ms:** o círculo da lanterna expande-se em onda de choque a partir do clique, com easing `expo.in` a acelerar. A borda da onda arrasta distorção e partículas.
3. **400 a 1200ms:** a Superfície estilhaça. Os wireframes quebram-se em fragmentos planos que rodam, perdem opacidade e são sugados na direção da onda. (Instancing de quads no Three.js, barato.)
4. **900 a 1800ms:** a Profundidade acende. A luz volumétrica sobe de intensidade 0 → 1 com `power2.out`, o fog entra, as partículas de pó materializam-se, e a tipografia serif "assenta" com um movimento de 20px vindo de baixo.
5. **1800ms:** uma única linha escreve-se em mono ciano, ao centro, token a token: **_"Agora vês o que as máquinas veem."_** Segura 1.2s, dissolve. O scroll fica disponível (antes do rasgo, o scroll está bloqueado no hero).

Estado guardado em `sessionStorage`: o visitante nunca volta à Superfície nesta sessão, mesmo navegando entre páginas.

### Cena 4: "O que mudou" (primeira secção de scroll) [P]

A câmara avança em dolly suave (Lenis a controlar). Tipografia editorial gigante ocupa o ecrã em frases curtas, uma por viewport, com parallax leve:

> "As pessoas já não pesquisam."
> "Perguntam."
> "E as máquinas escolhem quem responde."

Entre a segunda e a terceira frase, ao fundo, dezenas de perguntas reais em mono pequena atravessam o espaço como tráfego distante (dados do WhatTheyAsk: reutilização direta de um ativo teu).

### Cena 5: "O que eu faço" (serviços) [P]

Os serviços não aparecem como cards. Aparecem como **camadas de um site a ser iluminado**: um plano 3D representando uma página web flutua ao centro, e a cada avanço de scroll uma camada invisível acende-se por cima dela com a luz âmbar:

1. Estrutura (SEO técnico): o wireframe da página ganha esqueleto de headings
2. Significado (conteúdo + entidades): palavras-chave ligam-se em grafo
3. Prova (E-E-A-T / dados estruturados): blocos de schema em mono encaixam como peças
4. Presença local (GMB / local SEO): um pin de mapa materializa-se ao lado
5. Automação (IA): a página começa a gerar variações de si própria

Cada camada tem título serif + uma frase + link "ver serviço". Cinco batidas de scroll, mesma cena, câmara a orbitar lentamente 30°.

### Cena 6: A prova viva (WhatTheyAsk embutido) [P]

A câmara mergulha "para dentro" da barra de pesquisa da Cena 4. Secção interativa: um input real onde o visitante escreve uma palavra e vê perguntas reais materializarem-se à volta em 3D, flutuando com física suave. Título: **"Experimenta: o que perguntam sobre o teu negócio?"** É demo, não panfleto, e alimenta o funil do WhatTheyAsk.

### Cena 7: A galeria (blog) [P]

Travelling lateral: os artigos como quadros iluminados individualmente por spots volumétricos, numa galeria escura (herança direta do conceito "museu"). 4 a 6 artigos em destaque, cada um com moldura fina dourada, imagem de capa e título serif. Hover: o quadro inclina 3° e o spot intensifica. O resto do blog vive numa página normal (a galeria é montra, não arquivo).

### Cena 8: O CTA final [P]

Todo o ambiente escurece gradualmente com o scroll. As partículas de pó começam a convergir para um ponto central. A pergunta final, serif gigante, uma linha de cada vez:

> "Até quando vais otimizar
> para um mundo
> que já não existe?"

As partículas condensam-se num único botão luminoso âmbar: **"Falar comigo"**. Sem formulário gigante, sem três CTAs concorrentes. Um ponto de luz. O botão é, visualmente, a escolha, sem nunca dizer "pílula".

Rodapé mínimo por baixo, em mono pequena, com um easter egg: `<!-- se estás a ler isto, também gostas de ver por baixo -->` visível no código-fonte.

---

## 4. Especificação técnica da lanterna

### Abordagem recomendada: híbrida DOM + WebGL (fase 1)

- **Camada Profundidade:** canvas Three.js fixo, `z-index: 0`, sempre a renderizar.
- **Camada Superfície:** DOM/HTML normal, `z-index: 1`, com `mask-image: radial-gradient(circle Rpx at Xpx Ypx, transparent 0%, transparent 70%, black 100%)` atualizada via CSS custom properties (`--mx`, `--my`, `--mr`) num `requestAnimationFrame` com lerp.
- Vantagens: o conteúdo da Superfície é HTML real (acessível, indexável), a máscara é barata (GPU-composited), e o rasgo final é só animar `--mr` até cobrir o viewport e depois remover a camada do DOM.
- A "distorção na borda" nesta versão é simulada com um anel SVG/canvas 2D sobreposto que segue o cursor (turbulence filter leve ou sprite pré-renderizado). 90% do efeito, 10% do custo.

### Upgrade opcional: versão shader (fase 3)

Duas cenas Three.js → dois `WebGLRenderTarget` → quad final com shader de mistura usando distância ao cursor como máscara, com aberração cromática e displacement na borda. Só vale a pena se a versão híbrida deixar a desejar visualmente. Nota: nesta versão o texto da Superfície teria de ser texturizado, o que complica SEO; por isso, mesmo na versão shader, manter os textos como DOM e só as partes gráficas no canvas.

### Parâmetros de partida (afinar depois)

```
raio base: 180px (desktop) / 140px (touch)
lerp cursor: 0.08
respiração: ±6%, ciclo 3s, easing sine.inOut
crescimento em pausa: +20% após 800ms parado
borda: 30% do raio em gradiente
partículas na borda: 3-5/s, vida 1.2s, deriva ascendente
```

### Mobile / touch

A lanterna é o dedo: `touchmove` revela enquanto arrasta, o primeiro `tap` num elemento interativo dispara o rasgo. Raio ligeiramente maior que a área do dedo para o utilizador ver o que revela. Alternativa de segurança se o arrasto conflituar com o scroll: zona de revelação fixa a 40% da altura do viewport, por onde o conteúdo passa ao fazer scroll.

---

## 5. Arquitetura Astro

### Princípio estrutural

Três camadas independentes, do fundo para a frente:

1. **`<DepthWorld />`**: canvas Three.js persistente (client-side), gere cena, luz volumétrica, partículas, fog e as sub-cenas por secção.
2. **Conteúdo semântico**: HTML/Markdown real de todas as secções, sempre presente no DOM. É o que o Google e os LLMs leem. Visualmente estilizado como "mundo Profundidade".
3. **`<SurfaceLayer />`**: a simulação, um overlay HTML com a máscara da lanterna. Destruído após o rasgo.

### Estrutura de ficheiros

```
src/
├── layouts/
│   └── ImmersiveLayout.astro      # carrega Lenis, GSAP, gere reduced-motion
├── pages/
│   └── index.astro                 # composição das secções
├── components/
│   ├── surface/
│   │   ├── SurfaceLayer.astro      # overlay simulação + máscara CSS
│   │   └── SurfaceHero.astro       # SERP wireframe, título banal
│   ├── depth/
│   │   ├── DepthCanvas.astro       # <canvas> + init Three.js
│   │   └── scenes/                 # uma sub-cena JS por secção
│   │       ├── hero.js
│   │       ├── services.js
│   │       ├── gallery.js
│   │       └── cta.js
│   ├── sections/                   # HTML semântico real
│   │   ├── Hero.astro
│   │   ├── WhatChanged.astro
│   │   ├── Services.astro
│   │   ├── LiveDemo.astro          # WhatTheyAsk embed
│   │   ├── BlogGallery.astro
│   │   └── FinalCTA.astro
│   └── scripts/
│       ├── lantern.js              # lógica da lanterna (rAF, lerp, máscara)
│       ├── rip.js                  # sequência do rasgo
│       ├── scroll.js               # Lenis + ScrollTrigger sync
│       └── state.js                # sessionStorage (revelado ou não)
└── styles/
    └── worlds.css                  # tokens dos dois mundos como CSS vars
```

### Decisões-chave

- **Sem framework de UI.** Three.js vanilla + GSAP + Lenis em scripts client-side dentro de componentes `.astro`. Zero React: menos peso, e nada aqui precisa de estado reativo complexo. A única exceção possível é a secção do WhatTheyAsk, se quiseres reaproveitar componentes React existentes (aí, ilha isolada com `client:visible`).
- **Sincronização Lenis + ScrollTrigger:** o padrão oficial (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`). Uma timeline GSAP mestre mapeada ao scroll progress global; cada cena Three.js subscreve o seu intervalo de progresso.
- **Assets 3D:** o conceito quase não precisa de modelos GLTF (é luz, partículas, planos e tipografia), o que é uma enorme vantagem de peso face ao prompt original. Se entrarem modelos (ex.: o pin do mapa), comprimir com Draco e carregar com `client:visible`.
- **Estado do rasgo:** `state.js` lê `sessionStorage` no arranque; se já revelado, `SurfaceLayer` nem monta e a página abre direta na Profundidade.

### SEO, acessibilidade e performance (inegociável, este site é o teu cartão de visita)

- Todo o texto real vive nas `sections/` como HTML desde o primeiro render. A Superfície cobre, não substitui. Crawlers e LLMs leem tudo sem interagir.
- `prefers-reduced-motion: reduce` → o site carrega já na Profundidade, versão calma: sem lanterna, sem rasgo, luz estática, transições em fade simples.
- Budget de performance: LCP < 2.0s (o hero da Superfície é HTML puro, garante isso), canvas inicializado com `requestIdleCallback`, partículas via instancing, `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, cenas fora do viewport pausadas (`ScrollTrigger` onEnter/onLeave), Superfície removida da memória após o rasgo.
- Meta: Core Web Vitals verde em mobile real. Publicar o resultado no próprio site como prova ("este site corre WebGL e passa no CWV") é conteúdo de marketing gratuito.

---

## 6. Roadmap de implementação

**Fase 1 (o esqueleto que já funciona):** secções HTML semânticas + layout + Lenis + tipografia dos dois mundos. O site já é publicável e indexável aqui, sem nenhum efeito.

**Fase 2 (a lanterna):** SurfaceLayer com máscara CSS, lantern.js, comportamento do cursor, versão touch. Testar a descoberta com 2 ou 3 pessoas reais: percebem sem instruções?

**Fase 3 (o rasgo):** rip.js, sequência completa de 5 passos, sessionStorage, bloqueio de scroll pré-rasgo.

**Fase 4 (a Profundidade viva):** DepthCanvas, luz volumétrica, fog, partículas, sub-cenas por secção ligadas ao ScrollTrigger.

**Fase 5 (polimento):** easings, timings, bordas da lanterna, áudio opcional, easter eggs, auditoria CWV e reduced-motion.

Cada fase termina num site funcional. Se parares na Fase 2, já tens algo que ninguém no teu mercado tem.
