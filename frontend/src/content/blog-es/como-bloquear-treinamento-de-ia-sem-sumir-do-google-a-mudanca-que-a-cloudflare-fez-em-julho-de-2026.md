---
title: "Cómo bloquear el entrenamiento de IA sin desaparecer de Google (el cambio que hizo Cloudflare en julio de 2026)"
description: "Cloudflare separó los bots de IA en tres categorías: búsqueda, agente y entrenamiento. A partir del 15 de septiembre de 2026, todo dominio nuevo creado en la plataforma nace con entrenamiento y agente bloqueados por defecto"
date: 2026-07-08
category: ""
image: "/images/capas/como-bloquear-treinamento-de-ia-sem-sumir-do-google-a-mudanca-que-a-cloudflare-fez-em-julho-de-2026.webp"
tags:
  - IA
---

Cloudflare separó los bots de IA en tres categorías: búsqueda, agente y entrenamiento. A partir del 15 de septiembre de 2026, todo dominio nuevo creado en la plataforma nace con entrenamiento y agente bloqueados por defecto en las páginas que tienen anuncios, manteniendo la búsqueda liberada. En la práctica, esto acaba con la elección de todo o nada que existía hasta ahora, y le devuelve al dueño del sitio el control sobre quién se lucra con su contenido.

El botón de bloquear todo nunca resolvió el problema correcto. Hasta julio de 2026, Cloudflare ofrecía una única solución para bots de IA: un botón. Encendido o apagado. Bloquea todo o deja pasar todo. El problema es que esa lógica binaria ignoraba una diferencia enorme.

El Googlebot pasando por tu sitio para indexarte y mandarte visitantes de vuelta no tiene nada que ver con un crawler que absorbe tu contenido para entrenar un modelo y nunca más aparece. Tratar a los dos de la misma forma siempre fue malo para quien produce contenido, y peor todavía para un sitio pequeño, tema que ya aparece en la [oficialización del grounding como futuro del tráfico orgánico según Google](/es/blog/a-oficializacao-do-grounding-o-futuro-do-trafego-organico-segundo-o-google).

Si nadie encuentra tu sitio, estás obligado a elegir entre aparecer en la búsqueda (aceptando que tu texto se convierta en dato de entrenamiento) o proteger el contenido y correr el riesgo de que nadie vuelva a encontrarte. Quien sale ganando en esa trampa es siempre quien ya tiene una posición consolidada, porque los mismos bots que indexan también entrenan, un desequilibrio que también aparece en las [herramientas gratuitas de SEO para IA, AEO y GEO](/es/blog/ferramentas-gratuitas-seo-para-ia-aeo-geo).

Las tres categorías que creó Cloudflare. En vez de seguir intentando definir qué es o no es IA (esa línea ya se volvió imposible de trazar), Cloudflare pasó a clasificar el comportamiento de cada bot. Vale para todos los clientes, incluso quien está en el plan gratuito.

**Búsqueda**: indexa contenido para responder preguntas y, idealmente, devuelve tráfico de referencia.

**Agente**: actúa en tiempo real representando a una persona específica. Un agente de navegador operando Chrome para completar una tarea que alguien pidió ahí, en el momento.

**Entrenamiento**: recolecta datos para entrenar o ajustar un modelo. El contenido entra de forma permanente en la arquitectura del modelo y no vuelve como visita. Con esto, se puede permitir que tu página aparezca en la búsqueda y, al mismo tiempo, bloquear que ese mismo texto alimente el entrenamiento de un modelo. Antes no existía ese punto medio.

Qué cambia en septiembre. A partir del 15 de septiembre de 2026, todo [dominio nuevo en Cloudflare nace con entrenamiento](https://blog.cloudflare.com/agentic-internet-bot-report/) y agente bloqueados de salida en las páginas con anuncios.

**La búsqueda sigue liberada**. La lógica es directa: un anuncio en la página es señal de que ese contenido fue hecho para ser visto por gente de verdad, y es la atención humana la que paga la cuenta ahí. Hay un detalle técnico que cambia el juego para quien opera un bot multipropósito. El Googlebot indexa para la búsqueda y también recolecta datos que pueden convertirse en entrenamiento.

Con la regla nueva, bloquear el entrenamiento bloquea al bot entero en esa función, incluso si está haciendo búsqueda de forma legítima en paralelo. Esto obliga a la empresa de IA a separar comportamientos en vez de esconder todo detrás de un solo crawler. Quien ya tiene un sitio funcionando puede mantener la configuración antigua hasta la fecha límite. Nadie cambia de patrón sin avisar. El paquete extra que vino junto:

**BotBase**: base de datos consultable, disponible para clientes Enterprise, con todos los bots verificados y la clasificación exacta de cada uno.

**Señal de uso de contenido**: extensión del robots.txt tradicional. Ahora se puede decir no solo si un bot puede acceder al contenido, sino qué puede hacer después: interactuar sin guardar nada, indexar con enlace de vuelta, o resumir y reproducir el material.

## Verified con un nuevo significado

Antes, bot verificado prácticamente significaba acceso libre. Ahora significa permiso dentro de la categoría específica que se aplica a ese bot, y solo eso.

Confianza transitiva: un encabezado técnico llamado Forwarded garantiza que la confianza otorgada a una empresa de IA se mantiene incluso cuando el acceso pasa por un intermediario en el camino.

Cierra la brecha de contornar la regla usando un proxy. Qué hacer con esta información: Cloudflare está detrás de más de una quinta parte de los dominios de internet, así que esto no es un ajuste cosmético.

Si administras un sitio, vale la pena entrar al panel antes de que llegue septiembre y revisar tus reglas de bot una por una. Decidir qué liberar en búsqueda, qué bloquear en entrenamiento y cómo tratar al agente autónomo es el tipo de decisión que separa un sitio que sigue trayendo visitantes de uno que solo alimenta modelos a cambio de nada, el mismo dilema que discutimos en [cómo monitorear el desempeño de SEO de tu sitio con herramientas gratuitas](/es/blog/como-monitorar-desempenho-seo-seu-site-ferramentas-gratuitas).

La propia [documentación de crawlers de Google Search Central](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers) explica cómo el Googlebot distingue el rastreo para indexación de otros usos, lo que refuerza por qué separar categorías de bots hace una diferencia práctica. La discusión sobre los límites entre entrenamiento de IA e indexación también aparece con frecuencia en [Search Engine Land](https://searchengineland.com/library/seo), que cubre actualizaciones de este tipo apenas salen.
