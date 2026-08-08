---
title: "Graphify: How This Open-Source Tool Saves AI Tokens When Working With Code"
description: "Graphify is an open-source tool that turns any codebase into a knowledge graph, cutting the tokens AI assistants like Claude Code spend per query."
date: 2026-07-22
image: "/images/capas/graphify-como-economizar-tokens-ao-usar-ia.webp"
category: "AI Tools"
draft: true
---

# Graphify: How This Open-Source Tool Saves AI Tokens When Working With Code

Graphify is an open-source tool that turns an entire project — code, documentation, database schemas, config files, and PDFs — into a queryable knowledge graph. Instead of an AI assistant re-reading raw files every time it's asked a question, it queries this pre-built graph instead, which cuts the number of tokens spent per query.

The project is maintained by Graphify-Labs, is [MIT-licensed](https://en.wikipedia.org/wiki/MIT_License), backed by [Y Combinator](https://www.ycombinator.com/) (S26 batch), and has already passed 93,000 stars on GitHub.

## What is Graphify?

Graphify is a command-line skill for AI coding assistants. It runs once over a project folder and builds a persistent graph: the nodes are functions, files, and concepts; the edges are the calls, imports, and semantic relationships between them. That graph becomes the context the AI queries before touching any raw file, instead of the assistant scanning the entire repository every time it needs an answer.

## How does Graphify work?

Graphify analyzes code with [tree-sitter](https://tree-sitter.github.io/tree-sitter/), the same parser GitHub uses for syntax highlighting. This step runs entirely locally, is deterministic, and burns no tokens at all, because it doesn't rely on an LLM to extract the code's structure. Documents, PDFs, images, and videos are the exception: for those formats, Graphify uses the assistant's own model, or a separately configured API key, in a semantic pass.

Every connection in the graph gets a label: EXTRACTED, when it's explicit in the source code, or INFERRED, when it was deduced through analysis. That distinction separates hard fact taken directly from the file from the tool's own interpretation — something a text-similarity search doesn't give you.

The output comes as three files: `graph.html`, an interactive graph you open in the browser, click through nodes, and filter; `GRAPH_REPORT.md`, a markdown report with key concepts and relevant connections; and `graph.json`, the full graph for querying programmatically without re-reading the entire project.

![Graph of nodes and green connections representing the structure of a code project](/images/grafo-de-nos-do-codigo.webp)

Unlike an embedding-based search, there's no vector database behind this. It's a genuinely traversable graph, with citations in the file:line format on every answer, which makes it easy to verify where a claim came from.

## How many tokens does Graphify actually save?

The project's official README cites benchmarks on the LOCOMO and LongMemEval datasets: 45.3% question-answering accuracy on LOCOMO and 76% on LongMemEval-S. Outside the official repository, independent third-party evaluations reported up to 71.5 times fewer tokens per query on a mixed corpus of repositories, papers, and images, compared to re-reading raw files on every question.

It's worth treating the 71.5x figure as the result of one specific test, not a universal guarantee. The first run costs tokens, because that's when the graph gets built. The savings show up from the second query onward, once the assistant is reading the compact graph instead of reopening file after file, and grow as more questions get asked about the same project.

## How do you install Graphify?

Installation uses Python package managers. First, the CLI:

```
uv tool install graphifyy
```

or

```
pipx install graphifyy
```

Then you need to register the skill with your AI assistant:

```
graphify install
```

And run it from inside the assistant, pointing at the project folder:

```
/graphify .
```

![Computer screen showing lines of code in a terminal, representing where Graphify is installed](/images/instalacao-do-graphify-no-terminal.webp)

## Which AI assistants work with Graphify?

The list of integrations includes Claude Code, Cursor, Codex, Gemini CLI, GitHub Copilot, and OpenCode, among others. Installation is the same across all of them: register the skill once with `graphify install` and call `/graphify` from inside your chosen assistant — the same category of tool that shows up in our list of [free SEO tools for AI, AEO, and GEO](/en/blog/ferramentas-gratuitas-seo-para-ia-aeo-geo/). Anyone who uses Claude Code day to day to produce content optimized for AI citation will also benefit from the [guide to showing up in ChatGPT (AEO/GEO)](/en/blog/como-aparecer-no-chatgpt-guia-aeo-geo/).

## Is Graphify safe for proprietary code?

For the code portion, yes: parsing runs locally with tree-sitter, with no LLM call and nothing leaving the machine, according to the official documentation. The tool claims zero telemetry and zero usage tracking. The exception is documents, PDFs, images, and videos, which go through the semantic pass of the configured AI model, whether the assistant's own model or a separate API key. Anyone working with sensitive proprietary code should factor in that exception before pointing Graphify at folders containing PDFs or confidential documents.

## Is it worth using Graphify day to day?

For anyone already using AI assistants to code who feels token consumption climb as the project grows, yes. The payoff is bigger on large projects with many repeated queries against the same codebase, where re-reading entire files on every question weighs more heavily on the token budget. On small projects or one-off queries, the cost of building the graph on the first run may not pay off.

## Summary

Graphify replaces repeated reading of raw files with a knowledge graph built once and queried afterward, with clear labels distinguishing what's extracted directly from the code (EXTRACTED) from what's inferred through analysis (INFERRED). Installation is local, via `uv tool install graphifyy` or `pipx install graphifyy`, code parsing costs no tokens and never leaves the machine, and the output in `graph.html`, `GRAPH_REPORT.md`, and `graph.json` is available for any compatible AI assistant to query without re-reading the entire project.
