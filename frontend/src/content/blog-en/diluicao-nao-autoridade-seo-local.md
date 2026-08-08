---
title: "A Site Removed 4 Million Pages and Gained 600,000 More Clicks"
description: "A site removed 4 million near-duplicate pages and gained 600,000 more clicks. See why fewer, better-chosen pages build more local authority than mass-produced ones."
image: "/images/capas/diluicao-nao-autoridade-seo-local.webp"
date: 2026-07-28
---

# A Site Removed 4 Million Pages and Gained 600,000 More Clicks

**Quick summary:** a doctor-listing aggregator called Doktorsitesi.com had 4 million unindexed pages, most of them nearly duplicates of each other. Just by removing those pages, with no other significant change, the site gained 600,000 more organic clicks while keeping impression volume stable. The case comes from Koray Tuğberk GÜBÜR, published on Search Engine Land, and it illustrates a principle a lot of local SEO agencies ignore: publishing neighborhood pages in bulk doesn't build authority, it dilutes the signal the site already has. The right question isn't "how many pages do I publish," it's "does this specific query deserve its own page."

## What does "this query deserves a page" mean?

Query Deserves a Page, or QDP, is the central concept behind this thesis. The idea comes from an older Google concept, Query Deserves Freshness, which former Google engineer Amit Singhal used to decide when a search result needed more recent content. QDP asks the equivalent question about structure: does a search variation deserve its own page, or should it live as a section within a larger page?

There are two ways to build topical authority under this framework. One is processing all the attributes of an entity, covering every relevant characteristic of what the site sells or explains. The other is processing all the variations of a search pattern, like every variation of the question "can X cause dependency?" for a rehab site. Both approaches produce real authority when executed well, and produce dilution when a site tries to cover volume without checking whether each individual page has a reason to exist.

## Why can more pages mean less authority?

Every search engine operates under what the article calls [retrieval cost](https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget): satisfying the intent behind a search while spending the least possible computational effort. Every unnecessary page a site publishes raises that cost. A car accident lawyer in California doesn't need a page for every combination of city, neighborhood, and accident type — that would generate hundreds of nearly identical pages competing with each other for the same handful of searches.

The technical mechanism behind this is [near-duplicate document detection](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), described in a Google patent on query-specific duplication. Two pages can be treated as completely different for one query and as duplicates for another. A healthy level of overlap between pages helps justify internal linking. Past that threshold, the pages become, in the search engine's eyes, the same thing competing for the same space, and the ranking signal that could be concentrated on one strong page gets spread too thin to make a difference for any of them.

The Doktorsitesi case shows the scale of the problem once it escalates. The site had more than 40,000 pages related just to the term "cancer," split across doctor, hospital, city, and department. Which of those 40,000 is the most relevant for "cancer"? For "cancer plus treatment"? For "cancer plus treatment in Istanbul"? Without a clear answer to that question, Google historically resolved it by leaving most of them out of the index.

## How do you decide whether a search variation deserves its own page?

The article proposes four metrics for that decision. The query has search demand high enough to justify a dedicated page. The query carries different entities than the "parent" query that already has a page. The query has low similarity to other variations already covered. And the query follows a recognizable pattern, like a question or a specific attribute (price, review, comparison) that other pages of the same type already answer.

A practical example from the article itself: "Glock Holster" and "Nylon Glock Holster" carry the same core entity. If the "Nylon" variation doesn't have enough search demand, it doesn't get its own page, it becomes a section within the main page about Glock holsters. "IWB Kimber Holster," on the other hand, follows the opposite logic when all four criteria line up in favor of a dedicated page.

## What is the entity-attribute coverage framework?

Instead of multiplying pages by geographic combination, the framework recommends mapping the attributes that actually define the quality of a local service and distributing those attributes within a leaner structure. For a car accident lawyer, for example, the article lists attributes like certification in personal injury trial law, a proven track record of jury verdicts (not just settlements), available capital to fund expensive expert witnesses, contingency fee structure, years of litigation against insurers, and frequency of appearing in local courts.

Each attribute comes with a predicate and a verifiable unit of measurement: it's not "experienced lawyer," it's "handles primarily vehicle collision cases" with the actual percentage of the caseload dedicated to it. That's the difference between a generic neighborhood page, which repeats the same structure for each location, and a page that builds real authority by spelling out [specific, verifiable attributes](/en/blog/o-poder-do-schema-org-para-empresas-de-servicos-um-guia-completo-para-o-seo-local/) that both a user and a search engine can check.

This attribute map also becomes input for building external consensus, through links from local and industry sources that reinforce the same attributes. According to the article, these connections help both traditional ranking and how AI systems build an answer when someone asks, for example, [who the best lawyer in a specific city is](/en/blog/concorrente-venceu-categoria-chatgpt/).

## The numbers behind consolidation

Beyond the Doktorsitesi case, the article gathers other examples of sites that gained traffic by reducing pages, not adding them.

A law firm in Melbourne, specializing in accidents and injuries, had 19 nearly identical pages for very similar neighborhoods, like "Melbourne Beach" and "Melbourne Center." After consolidating those redundant pages, the site gained more than 232 new ranking queries and improved position on another 60.

A yacht charter project removed model-plus-city-plus-neighborhood combination pages that had insufficient search demand. Result: a 248% increase in clicks, 37% in impressions, and 29% in average position. A CBD retail chain, after removing unnecessary location pages and fixing a rendering issue in parallel, saw a 57% jump in clicks. A luxury cruise company, by trimming temporary itinerary pages that expired within a few weeks, cut more than 60% of its unindexed pages and still grew 38% in clicks.

The pattern repeats across industry after industry: removing or consolidating redundant pages concentrates ranking signal into fewer URLs, and that more concentrated signal ranks better than the same content spread too thin.

## How do you apply this in a local SEO audit?

Before suggesting any new page to a local client, it's worth running the Query Deserves a Page exercise for each neighborhood, service, or attribute variation the agency is considering. The four questions get simpler in practice: does this variation have real search volume? Does it carry a genuinely different entity from the page that already exists? Is it a poor match for the content already live? Does it follow a pattern that's already proven to work on other pages of the same type?

If the answer to most of these is no, the variation becomes a section of an existing page, with an [internal link](/en/blog/clareza-e-a-nova-estrategia-seo-ia/) and spelled-out attributes, instead of a new URL.

It's also worth reinforcing a prioritization rule audits often skip: the [most important local pair](/en/blog/como-escolher-as-melhores-palavras-chave-para-seu-negocio-local/), the one that generates the most business for the client, should be the target of the site's strongest page, usually the homepage. The homepage concentrates the highest PageRank and tends to be the most crawled page after robots.txt, so spending that strength on a secondary neighborhood combination wastes the site's most valuable asset.

The article also recommends tracking four technical indicators throughout this process: an HTML crawl rate of at least 99%, a combined 200 and 304 status rate also at 99% or higher, a discovery rate above 20%, and 100% of HTML crawls targeting indexable URLs that appear both in the sitemap and in internal links.

It's worth pairing this logic with [content gap auditing](/en/blog/analise-de-concorrentes-em-seo-como-identificar-e-superar-seus-competidores-nos-resultados-de-busca/), which looks at the opposite side of the same problem. Gap analysis asks where coverage is missing. Dilution analysis asks where coverage is artificially excessive. Both questions come from the same criterion: coverage should follow real search demand, not the number of combinations you can generate automatically by crossing service with neighborhood. A site can, at the same time, be missing content a competitor already has and have an excess of neighborhood pages nobody searches for. A complete audit looks at both sides together, not just one.

## Summary: fewer pages, more concentrated signal

- Query Deserves a Page asks whether a search variation deserves its own URL or should become a section of an existing page
- Every unnecessary page raises the cost for a search engine to evaluate a site, the so-called retrieval cost
- Four criteria decide this: search demand, distinct entity, low similarity with what already exists, and a recognizable pattern
- Mapping specific, verifiable entity attributes replaces the logic of multiplying pages by geographic combination
- Real consolidation cases: Doktorsitesi gained 600,000 clicks by removing 4 million pages, the Melbourne site gained 232 new queries by merging 19 neighborhood pages, the yacht charter grew 248% in clicks

If you work with local clients and a previous agency left a trail of duplicate neighborhood pages, this is the technical ammunition to explain why less, in this specific case, ranks more — the same principle that explains why [organic traffic grows in a curve, not a straight line](/en/blog/trafego-organico-benchmark-real/). To review the basics before applying this framework, it's worth rereading [why local SEO is essential for small business](/en/blog/por-que-seo-local-e-fundamental-para-pequenos-negocios/) and how to [track rankings, conversions, and calls](/en/blog/sucesso-em-seo-local-como-acompanhar-rankings-conversoes-e-chamadas/) after consolidation. If you'd rather have a [strategic SEO audit](/en/services) to map this on a client's site, that's a good place to start.

Source: [How semantics and topical authority improve local SEO](https://searchengineland.com/how-semantics-and-topical-authority-improve-local-seo-482980), by Koray Tuğberk GÜBÜR, Search Engine Land.
