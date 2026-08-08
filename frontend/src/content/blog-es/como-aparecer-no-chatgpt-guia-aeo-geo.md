---
title: "Cómo aparecer en ChatGPT: guía AEO/GEO para sitios y empresas"
description: "AEO es el conjunto de prácticas para que un sitio sea leído y citado por ChatGPT, Gemini y Perplexity. Descubre cómo entran en esto el schema, el JSON-LD, los crawlers y el llms.txt."
image: "/images/capas/como-aparecer-no-chatgpt-guia-aeo-geo.webp"
date: 2026-07-20
category: ""
tags:
  - IA
  - SEO
---

AEO (Answer Engine Optimization) es el conjunto de prácticas para estructurar un sitio de forma que ChatGPT, Gemini, Perplexity y Copilot puedan leer, entender y citar el contenido en las respuestas que le dan al usuario. GEO (Generative Engine Optimization) es el término hermano, acuñado por investigadores de la Universidad de Cornell, y en la práctica los dos nombres describen el mismo movimiento: salir de la lista de 10 enlaces azules y entrar en la respuesta que la IA ya formuló.

La diferencia central con el SEO tradicional es el destino del texto. Google manda a un visitante hasta tu página. Una IA generativa lee tu página, extrae lo que necesita y entrega la respuesta lista, a veces sin ningún clic de vuelta. Esto cambia lo que significa "posicionar bien": no basta con aparecer, hay que ser la fuente que el modelo elige citar dentro de la respuesta.

## GEO, AEO y SEO: ¿cuál es la diferencia en la práctica?

El SEO optimiza para posicionar en una lista de resultados que el usuario todavía va a hacer clic. El AEO optimiza para ser la respuesta directa a una pregunta, dentro de un motor que ya formula texto (asistentes de voz, snippets destacados, el propio AI Overviews de Google). El GEO es el paraguas más reciente, enfocado específicamente en motores generativos como ChatGPT, Gemini, Perplexity y Copilot, que no solo responden, sino que sintetizan texto nuevo a partir de múltiples fuentes.

| Eje | SEO tradicional | AEO | GEO |
|---|---|---|---|
| Objetivo | Posición alta en la SERP | Ser la respuesta directa | Ser citado dentro del texto generado |
| Métrica principal | Ranking, clics, tráfico | Apariciones en snippet/voz | Menciones y citas en respuestas de IA |
| Motores objetivo | Google, Bing | Google Featured Snippets, Alexa, Siri | ChatGPT, Gemini, Perplexity, Copilot |
| Qué debe hacer el texto | Convencer al algoritmo de relevancia | Responder en 1-2 frases extraíbles | Aportar un fragmento autocontenido y lo bastante denso para ser reescrito o citado |

En la práctica, los tres no compiten entre sí. Un post bien estructurado para AEO y GEO, con definición directa y schema correcto, también tiende a rendir mejor en SEO tradicional, porque las señales de claridad y estructura que ayudan a una IA a extraer una respuesta son las mismas que ayudan a Google a entender de qué trata la página.

## ¿Por qué mi sitio no aparece en ChatGPT aunque posicione bien en Google?

Posicionar en Google y ser citado por una IA son procesos distintos, aunque compartan parte de la base técnica. Google usa PageRank y cientos de señales de ranking para ordenar enlaces. Una IA generativa hace retrieval: busca fragmentos de texto semánticamente cercanos a la pregunta del usuario y decide, según la densidad de entidades y la claridad de la definición, qué fragmento vale la pena citar.

Tres causas comunes de un sitio que posiciona pero no es citado:

Falta de estructura técnica legible por máquina. El schema.org y el JSON-LD ausentes o incompletos hacen que el modelo pierda contexto sobre lo que la página realmente afirma. Un post que ya explica esto en detalle es [creación de FAQ programadas con datos estructurados JSON-LD](/es/blog/criacao-de-faqs-programadas-com-dados-estruturados-json-ld-um-guia-completo-para-seo-na-era-da-ia), que muestra cómo marcar preguntas y respuestas de forma que la IA extraiga el par pregunta-respuesta directo del HTML.

Bloqueo, intencional o no, de los crawlers de IA. Cloudflare pasó a separar los bots en tres categorías (búsqueda, agente y entrenamiento) y, a partir del 15 de septiembre de 2026, todo dominio nuevo en la plataforma nace con entrenamiento y agente bloqueados por defecto en páginas con anuncios, como se describe en [cómo bloquear el entrenamiento de IA sin desaparecer de Google](/es/blog/como-bloquear-treinamento-de-ia-sem-sumir-do-google-a-mudanca-que-a-cloudflare-fez-em-julho-de-2026). Si la configuración de bots de tu sitio no distingue esas categorías, puede que estés bloqueando exactamente el crawler que lleva tu contenido hasta la respuesta de ChatGPT.

Contenido redactado en el formato equivocado para el retrieval. Un texto con introducción larga, insight enterrado en medio y sin definición directa es más difícil de citar que un párrafo que abre con "X es Y" y una frase densa en entidades justo después.

## ¿Cómo estructurar datos para IA generativa (schema, JSON-LD y FAQ)?

Schema.org es el vocabulario compartido que describe el contenido de una página para las máquinas: tipo de artículo, autor, fecha, preguntas y respuestas, reseñas, productos. JSON-LD es el formato técnico más usado para implementar ese vocabulario, un bloque de código en el `<head>` o en el cuerpo de la página que declara esa información de forma estructurada, sin alterar lo que ve el visitante humano.

Para AEO, tres marcados rinden más:

[`Article` o `BlogPosting`](https://schema.org/Article), con autor, fecha de publicación y fecha de actualización. Esto ayuda al modelo a evaluar si la información sigue vigente, un criterio cada vez más relevante a medida que las IA generativas priorizan fuentes recientes.

[`FAQPage`](https://developers.google.com/search/docs/appearance/structured-data/faqpage), marcando pares de pregunta y respuesta que ya existen en el texto. Es el mismo principio del post sobre FAQ programadas: cada pregunta se convierte en un H2 literal, y la respuesta justo debajo es el fragmento que el modelo tiene más probabilidades de extraer y citar. Vale la pena notar que Google eliminó el rich result de FAQ de los resultados de búsqueda en 2026; el marcado sigue siendo útil para el retrieval de IA generativa, pero ya no genera el destacado visual que tenía en la SERP.

[`Organization`](https://developers.google.com/search/docs/appearance/structured-data/organization), declarando nombre, sitio oficial y perfiles verificados de la empresa. Esto ayuda al modelo a asociar el contenido con una entidad reconocible, en lugar de tratarlo como texto anónimo. La [guía de schema.org para empresas de servicios](/es/blog/o-poder-do-schema-org-para-empresas-de-servicos-um-guia-completo-para-o-seo-local) detalla ese marcado paso a paso para negocios locales.

![Bloques de datos conectados que representan la estructura de schema y JSON-LD de una página](/images/dados-estruturados-schema-json-ld.webp)

Ninguno de esos marcados garantiza la citación. Reducen la ambigüedad que la IA tiene que resolver por su cuenta, y menos ambigüedad aumenta la probabilidad de que se elija el fragmento correcto.

## ¿Qué crawlers de IA necesitas liberar primero?

Cada empresa de IA opera su propio crawler, con nombre y comportamiento distintos, y liberar "IA" como categoría genérica en tu firewall no basta para saber qué está pasando realmente. Los principales hoy:

[GPTBot y OAI-SearchBot](https://developers.openai.com/api/docs/bots), de OpenAI. El primero recolecta datos para entrenar modelos; el segundo hace búsqueda en tiempo real para alimentar las respuestas de ChatGPT con información actual. Son comportamientos distintos y, siguiendo la lógica de categorización que adoptó Cloudflare (búsqueda, agente, entrenamiento), tiene sentido darles tratamientos diferentes.

[ClaudeBot](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), de Anthropic, con un rol equivalente al de GPTBot para Claude.

[PerplexityBot](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), de Perplexity, cuyo modelo de producto depende fuertemente de citar fuentes en tiempo real, lo que hace que este crawler sea particularmente relevante para quien quiere aparecer citado con enlace.

[Google-Extended](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers), una señal específica de Google para controlar si el contenido alimenta el entrenamiento de los modelos Gemini, separada del Googlebot tradicional que indexa para la búsqueda.

![Robot que representa un crawler de inteligencia artificial analizando el contenido de un sitio](/images/crawler-de-ia-escaneando-conteudo-do-site.webp)

La tentación es bloquear todo lo que parece un bot desconocido en el log del servidor. El post sobre [el experimento que demostró que la mayor parte del crawler en tu log es falso](/es/blog/o-experimento-que-provou-a-maior-parte-do-crawler-no-seu-log-e-fake) muestra por qué esa suposición suele estar equivocada: buena parte del tráfico que se presenta como crawler de IA en un log bruto no es el crawler oficial, y las decisiones de bloqueo tomadas sobre ese dato ruidoso terminan bloqueando al bot correcto por el motivo equivocado.

## ¿Qué es el llms.txt y vale la pena implementarlo?

[llms.txt](https://llmstxt.org/) es un archivo de texto simple, alojado en la raíz del dominio, que lista los documentos y secciones más relevantes de un sitio para que un modelo de lenguaje los priorice al procesar el contenido. Funciona como un sumario dirigido a las IA, parecido en espíritu al [sitemap.xml](/es/blog/como-criar-um-sitemap-melhorar-indexacao-site) dirigido a los motores de búsqueda tradicionales, pero sin el mismo nivel de adopción formal todavía.

La adopción del estándar por parte de crawlers de IA como GPTBot (OpenAI), el crawler de Anthropic y el de Perplexity está en etapa inicial y cambió rápido a lo largo de 2026. Antes de invertir tiempo relevante en esto, vale la pena revisar la documentación oficial de cada crawler que te importe, porque el soporte real puede ir por delante o por detrás de lo que promete el archivo.

Dicho esto, el costo de crear un llms.txt básico es bajo: un archivo markdown simple que lista los posts y páginas más importantes del sitio, con un resumen de una línea cada uno. Para un sitio que ya documenta cómo bloquea y libera crawlers vía Cloudflare, como queda claro en el post sobre [el experimento que demostró que la mayor parte del crawler en tu log es falso](/es/blog/o-experimento-que-provou-a-maior-parte-do-crawler-no-seu-log-e-fake), el llms.txt es el complemento natural: uno ya dice quién puede entrar, el otro dice qué vale la pena leer primero.

## ¿Cómo saber si tu marca ya está siendo citada por las IA?

La citación por IA todavía no tiene un panel oficial equivalente a Google Search Console. El camino manual y gratuito es preguntar directamente: abrir ChatGPT, Gemini y Perplexity y probar preguntas que un cliente potencial haría sobre tu nicho, sin mencionar tu marca, y ver si el nombre aparece en la respuesta. Las mismas [herramientas gratuitas de monitoreo de SEO](/es/blog/como-monitorar-desempenho-seo-seu-site-ferramentas-gratuitas) que ya hacen seguimiento de ranking y tráfico ayudan a cruzar esa señal manual con datos de referencia (referral) provenientes de dominios de IA.

Otra señal indirecta viene del propio Google. La [oficialización del grounding por parte de Google](/es/blog/a-oficializacao-do-grounding-o-futuro-do-trafego-organico-segundo-o-google) cambió la forma en que AI Overviews elige y cita fuentes dentro de los resultados de búsqueda, y monitorear si tu dominio aparece en esos bloques es un proxy razonable de citabilidad, ya que la lógica de retrieval de AI Overviews y la de las IA conversacionales comparten principios parecidos: densidad de entidades, definición clara, estructura de respuesta directa.

Vale la pena reforzar que las proyecciones de aumento porcentual de visibilidad con GEO circulan en distintas fuentes del mercado, pero ninguna de ellas tiene metodología pública verificada hasta el momento. Mejor tratarlas como hipótesis de mercado que como dato para repetir.

## ¿Vale la pena contratar consultoría de AEO/GEO o se puede hacer solo?

Para un sitio pequeño con pocas páginas, buena parte del trabajo descrito aquí, marcado de schema, revisión de bots en Cloudflare, reescritura de H2 como preguntas, es ejecutable internamente con tiempo y atención al detalle técnico. El punto en el que la consultoría especializada compensa suele aparecer en dos escenarios: sitios con decenas o cientos de páginas, donde la auditoría manual de schema y estructura no escala, y negocios en los que la citación por IA ya es un canal de adquisición lo bastante relevante como para justificar seguimiento continuo, ya que los crawlers y el comportamiento de los modelos cambian con más frecuencia que los ciclos tradicionales de SEO.

## Resumen: los 4 puntos que deciden si apareces en ChatGPT

Estructura técnica legible por máquina. El schema.org y el JSON-LD en `Article`, `FAQPage` y `Organization` reducen la ambigüedad que el modelo tiene que resolver por su cuenta antes de decidir citar.

Acceso liberado para los crawlers correctos. Revisar la configuración de bots de IA en Cloudflare (o equivalente) por categoría, no como llave general de todo o nada, evita bloquear sin querer el crawler que lleva tu contenido hasta la respuesta.

Contenido en formato de respuesta, no de narrativa. Definición directa justo al principio de cada sección, H2 como preguntas literales, y frase densa en entidades justo después de cada pregunta.

Señalización experimental vía llms.txt. Bajo costo de implementación, adopción todavía en construcción por parte de los principales crawlers, pero alineado con la dirección que está tomando el sector.

Ninguno de estos cuatro puntos funciona solo. Un sitio sin schema pero con llms.txt perfecto sigue siendo ambiguo para el modelo. Un sitio bien marcado pero que bloquea al crawler correcto nunca llega a leerse. La ganancia aparece cuando los cuatro van de la mano.

Vale la pena reforzar que estos cuatro puntos operan por artículo. La ganancia compuesta aparece cuando el dominio entero construye [autoridad temática con clusters de contenido conectados](/es/blog/autoridade-topica-clusters-de-conteudo-seo-geo/): un post aislado, por bien marcado que esté, pesa menos que ese mismo post rodeado de contenido relacionado que demuestra cobertura completa del tema.
