---
title: "El experimento que probó que la mayor parte del 'crawler' en tu log es falso"
description: "Una prueba con IPs reveló que la mayoría de los bots de IA y del Googlebot en un sitio nuevo eran falsos. Mira el método y cómo aplicarlo en tus propios logs."
date: 2026-07-14
image: "/images/capas/o-experimento-que-provou-a-maior-parte-do-crawler-no-seu-log-e-fake.webp"
---

Todo bot que accede a una página se identifica con un nombre en el encabezado de la solicitud: ChatGPT-User, Claude-User, CCBot, Googlebot. Ese nombre es una cadena autodeclarada.

Falsificarlo no cuesta nada para ningún script, y es exactamente por eso que los escáneres de credenciales adoran hacerse pasar por un asistente de IA confiable para intentar acceder a archivos como `.env.production`, `secrets.yaml` o `config.json`.

Forrester encontró justamente ese patrón: accesos que usaban el nombre de ChatGPT fueron directo tras archivos de configuración, algo que ningún uso legítimo de asistente haría.

La analogía que usa funciona bien: el nombre en el header es como un desconocido tocando tu puerta con uniforme de repartidor. El uniforme es fácil de falsificar. Lo que prueba algo es otra información.

## Cómo verificar si un bot es real

![Estudio muestra que más del 80 por ciento de tu tráfico de IA es falso](/images/estudo-mostra-que-mais-de-80-por-cento-do-seu-trafego-de-ia-e-fake.jpeg)OpenAI, Anthropic, Google, Perplexity y la operadora de Common Crawl publican listas oficiales de los rangos de IP que realmente usan sus bots. La verificación consiste en cruzar el nombre declarado con la IP de origen de la solicitud:

* ChatGPT-User: lista publicada por OpenAI en [openai.com/chatgpt-user.json](http://openai.com/chatgpt-user.json)
* Claude (todos los bots): lista de Anthropic en [claude.com/crawling/bots.json](http://claude.com/crawling/bots.json)
* Perplexity-User: lista en [perplexity.com/perplexity-user.json](http://perplexity.com/perplexity-user.json)
* Googlebot: lista de Google en [developers.google.com](http://developers.google.com), en el archivo common-crawlers.json
* CCBot: lista publicada por Common Crawl

El script de Forrester usa tres categorías, no dos: verificado (la IP está en la lista publicada), suplantado (la lista cargó y la IP no está en ella) y no verificable (no se pudo confirmar, porque la lista falló o faltó el registro). Esta tercera categoría importa: tratar "no verificable" como "falso" es un error, y fue justamente la disciplina de no cometer esa confusión lo que le permitió llegar a la investigación más interesante del estudio, sobre CCBot.

## El caso CCBot: cuando "no verificable" se vuelve investigación

De 20 solicitudes con el nombre CCBot en el sitio de Forrester, cero coincidieron con la lista oficial de IPs, cuatro fueron identificadas como suplantadas y dieciséis quedaron como no verificables.

En vez de descartar esas dieciséis, las investigó por cuatro caminos: revisó la lista de IPs publicada, corrió DNS inverso (el CCBot real resuelve a un hostname [commoncrawl.org](http://commoncrawl.org)), consultó el índice público de Common Crawl para ver si el dominio había sido capturado en los tres meses más recientes, y rastreó el origen de las IPs vía WHOIS.

Las cuatro comprobaciones llegaron a la misma conclusión: las 20 eran impostoras, corriendo en hosting barato repartido por Europa. Common Crawl importa porque alimenta buena parte de los datasets usados para entrenar modelos de lenguaje, así que confirmar la suplantación de este bot específico pesa más de lo que parece a primera vista.

## Recuperación y entrenamiento son dos juegos distintos

Vale la pena separar dos tipos de crawler que suelen tratarse como si fueran lo mismo. Bots como ChatGPT-User y Claude-User hacen búsqueda en tiempo real: se disparan cuando una persona está en una conversación y el asistente va a buscar una fuente para responder, el mismo mecanismo de citación que detallamos en la [guía para aparecer en ChatGPT (AEO/GEO)](/es/blog/como-aparecer-no-chatgpt-guia-aeo-geo).

En cambio, GPTBot y ClaudeBot hacen indexación en segundo plano, el material que puede terminar dentro del peso de un modelo entrenado en el futuro, sin generar tráfico de referencia hoy.

En el relevamiento verificado de Forrester, el crawler más activo en el dominio no fue el de Google. Fue ClaudeBot, de Anthropic, con 166 accesos confirmados, por delante del Googlebot verificado (107), de GPTBot (46) y del crawler de búsqueda de OpenAI (40). Muestra pequeña, sitio nuevo, sin tráfico promovido, pero la composición ya indica algo: quien gasta presupuesto de rastreo en un dominio desconocido es una señal de peso cuando el volumen crezca.

## El punto ciego llamado Gemini

A diferencia de OpenAI, Anthropic y Perplexity, que exponen crawlers separados y verificables para entrenamiento, indexación y búsqueda en vivo, Google concentra todo en un único Googlebot.

Lo que decide si el contenido alimenta el entrenamiento de Gemini es una etiqueta de robots.txt llamada Google-Extended, la misma lógica de categorías de bot que adoptó Cloudflare y que detallamos en [cómo bloquear el entrenamiento de IA sin desaparecer de Google](/es/blog/como-bloquear-treinamento-de-ia-sem-sumir-do-google-a-mudanca-que-a-cloudflare-fez-em-julho-de-2026); no es un crawler, es un permiso sobre una recolección que ya ocurrió, sin fetch propio. Forrester encontró cuatro solicitudes identificándose como Google-Extended, y como ese nombre nunca debería hacer una solicitud directa, las cuatro nacen ya desenmascaradas, sin necesidad de comprobar IP.

La consecuencia práctica es que solo se puede confirmar el Googlebot y nada más. El resto, una vez más, "no está disponible", en una repetición de lo que pasó en 2011 cuando Google cifró los referrers de búsqueda.

## Cómo aplicar esto en tu sitio

El script usado en el estudio tiene cerca de quince líneas de Python, usando solo librería estándar: descarga la lista de IPs de un proveedor, extrae los rangos de red del JSON y comprueba si una IP cae dentro de alguno de ellos. Eso es solo el núcleo.

Una versión funcional necesita leer las líneas reales de tu log, mapear cada nombre de bot a su lista correspondiente, mantener la categoría de no verificable y usar DNS inverso como respaldo para operadores como Common Crawl.

El propio Forrester lo remarca: sus números valen poco fuera de contexto, porque son dos semanas de datos en un sitio sin tráfico promovido. El valor está en el método, no en la estadística.

Si tu sitio tiene tráfico de verdad, el dataset en tus logs de acceso es mucho mejor que el suyo, y la comprobación puede hacerse hoy mismo. Toma un rango de fechas, cruza los nombres contra las listas oficiales y mira qué fracción de tu "tráfico de IA" resiste la prueba de la IP. Después mira la línea del Googlebot, recuerda que es la misma pieza central de la [oficialización del grounding como futuro del tráfico orgánico](/es/blog/a-oficializacao-do-grounding-o-futuro-do-trafego-organico-segundo-o-google), y prepárate.
