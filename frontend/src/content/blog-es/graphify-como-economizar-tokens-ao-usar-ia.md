---
title: "Graphify: cómo esta herramienta open source ahorra tokens al usar IA en el código"
description: "Graphify es una herramienta open source que convierte cualquier código en un grafo de conocimiento, reduciendo los tokens que gastan asistentes de IA como Claude Code."
date: 2026-07-22
image: "/images/capas/graphify-como-economizar-tokens-ao-usar-ia.webp"
category: "Herramientas de IA"
draft: true
---

# Graphify: cómo esta herramienta open source ahorra tokens al usar IA en el código

Graphify es una herramienta open source que convierte cualquier proyecto (código, documentación, esquemas de base de datos, configuraciones y PDFs) en un grafo de conocimiento consultable. En vez de que un asistente de IA vuelva a leer archivos crudos en cada pregunta, pasa a consultar ese grafo ya construido, lo que reduce la cantidad de tokens gastados por consulta.

El proyecto lo mantiene Graphify-Labs, tiene [licencia MIT](https://en.wikipedia.org/wiki/MIT_License), cuenta con el respaldo de [Y Combinator](https://www.ycombinator.com/) (promoción S26) y ya superó las 93 mil estrellas en GitHub.

## ¿Qué es Graphify?

Graphify es un skill de línea de comandos para asistentes de codificación por IA. Se ejecuta una vez sobre una carpeta de proyecto y construye un grafo persistente: los nodos son funciones, archivos y conceptos, las aristas son las llamadas, importaciones y relaciones semánticas entre ellos. Ese grafo se convierte en el contexto que la IA consulta antes de tocar cualquier archivo crudo, en vez de que el asistente recorra el repositorio entero cada vez que necesita una respuesta.

## ¿Cómo funciona Graphify?

Graphify analiza el código con [tree-sitter](https://tree-sitter.github.io/tree-sitter/), el mismo parser que usa GitHub para el resaltado de sintaxis. Esta etapa corre enteramente en local, es determinista y no consume ningún token, porque no depende de un LLM para extraer la estructura del código. Documentos, PDFs, imágenes y vídeos son la excepción: para esos formatos, Graphify usa el modelo del propio asistente de IA, o una clave de API configurada aparte, en una pasada semántica.

Cada conexión del grafo recibe una etiqueta: EXTRACTED, cuando está explícita en el código fuente, o INFERRED, cuando fue deducida por el análisis. Esa distinción separa lo que es un hecho directo del archivo de lo que es interpretación de la herramienta, algo que una búsqueda por similitud de texto no entrega.

El resultado sale en tres archivos: `graph.html`, un grafo interactivo para abrir en el navegador, hacer clic en los nodos y filtrar; `GRAPH_REPORT.md`, un informe en markdown con los conceptos clave y conexiones relevantes; y `graph.json`, el grafo completo para consultar programáticamente sin volver a leer todo el proyecto.

![Grafo de nodos y conexiones verdes que representa la estructura de un proyecto de código](/images/grafo-de-nos-do-codigo.webp)

A diferencia de una búsqueda por embeddings, no hay una base vectorial detrás de esto. Es un grafo recorrible de verdad, con citas en formato archivo:línea en cada respuesta, lo que facilita comprobar de dónde vino cada afirmación.

## ¿Cuánto ahorra Graphify en tokens?

El README oficial del proyecto cita benchmarks en los datasets LOCOMO y LongMemEval: 45,3% de precisión en preguntas y respuestas en LOCOMO y 76% en LongMemEval-S. Fuera del repositorio oficial, evaluaciones independientes de terceros reportaron hasta 71,5 veces menos tokens por consulta en un corpus mixto de repositorios, artículos e imágenes, comparado con volver a leer los archivos crudos en cada pregunta.

Vale la pena tratar el número de 71,5x como el resultado de una prueba específica, no como una garantía universal. La primera ronda cuesta tokens, porque es cuando se construye el grafo. El ahorro aparece a partir de la segunda consulta en adelante, cuando el asistente ya lee el grafo compacto en vez de reabrir archivo por archivo, y crece conforme se hacen más preguntas sobre el mismo proyecto.

## ¿Cómo instalar Graphify?

La instalación usa gestores de paquetes de Python. Primero, el CLI:

```
uv tool install graphifyy
```

o

```
pipx install graphifyy
```

Después, hay que registrar el skill en el asistente de IA:

```
graphify install
```

Y ejecutarlo dentro del asistente, apuntando a la carpeta del proyecto:

```
/graphify .
```

![Pantalla de computadora con líneas de código en una terminal, que representa dónde se instala Graphify](/images/instalacao-do-graphify-no-terminal.webp)

## ¿Qué asistentes de IA funcionan con Graphify?

La lista de integraciones incluye Claude Code, Cursor, Codex, Gemini CLI, GitHub Copilot y OpenCode, entre otros. La instalación es la misma en todos: registrar el skill una vez con `graphify install` y llamar a `/graphify` desde dentro del asistente elegido, el tipo de herramienta que también aparece en nuestra lista de [herramientas gratuitas de SEO para IA, AEO y GEO](/es/blog/ferramentas-gratuitas-seo-para-ia-aeo-geo). Quien usa Claude Code en el día a día para producir contenido optimizado para citación en IA también se beneficia de la [guía para aparecer en ChatGPT (AEO/GEO)](/es/blog/como-aparecer-no-chatgpt-guia-aeo-geo).

## ¿Es seguro Graphify para código propietario?

Para la parte de código, sí: el parsing corre localmente con tree-sitter, sin llamadas a LLM y sin que nada salga de la máquina, según la documentación oficial. La herramienta declara cero telemetría y cero rastreo de uso. La excepción son los documentos, PDFs, imágenes y vídeos, que pasan por la pasada semántica del modelo de IA configurado, ya sea el del propio asistente o una clave de API aparte. Quien trabaja con código propietario sensible debe considerar esa excepción antes de apuntar Graphify a carpetas con PDFs o documentos confidenciales.

## ¿Vale la pena usar Graphify en el día a día?

Para quien ya usa asistentes de IA para programar y siente que el consumo de tokens sube conforme crece el proyecto, sí. La ganancia es mayor en proyectos grandes, con muchas consultas repetidas sobre la misma base de código, donde volver a leer archivos enteros en cada pregunta pesa más en el presupuesto de tokens. En proyectos pequeños o consultas puntuales, el costo de construir el grafo en la primera ronda puede no compensar.

## Resumen

Graphify cambia la lectura repetida de archivos crudos por un grafo de conocimiento construido una vez y consultado después, con etiquetas claras entre lo que se extrae directo del código (EXTRACTED) y lo que se infiere por el análisis (INFERRED). La instalación es local, vía `uv tool install graphifyy` o `pipx install graphifyy`, el parsing de código no gasta tokens ni sale de la máquina, y la salida en `graph.html`, `GRAPH_REPORT.md` y `graph.json` queda disponible para que cualquier asistente de IA compatible la consulte sin volver a leer todo el proyecto.
