---
title: "How to Compare Your Site's Sitemap Against a Competitor's"
description: "Comparing your site's sitemap with a competitor's reveals content ideas that keyword-gap tools miss. See how sitemap gap analysis works."
date: 2026-07-17
image: "/images/capas/lacuna-de-conteudo-comparar-sitemap-concorrente.webp"
---

**Quick summary:** comparing your site's sitemap with a direct competitor's is a way to find content ideas that slip past keyword-gap tools like [Ahrefs Content Gap](https://ahrefs.com/content-gap) or [SEMrush Keyword Gap](https://www.semrush.com/analytics/keywordgap/), because the comparison starts from the actual structure of published URLs, not a keyword database. The cross-check usually splits topics into three groups: what only the competitor covers, what both of you cover, and where you already have more depth. Each group points to a different editorial decision.

Most B2B editorial calendars are born from gut feeling. Someone looks at what drove traffic last month, looks at a pile of ideas accumulated in Notion, and decides what goes live. That works, but it ignores a piece of data that's public and free: the [direct competitor's](/en/blog/analise-de-concorrentes-em-seo-como-identificar-e-superar-seus-competidores-nos-resultados-de-busca/) content map.

## What is sitemap-based content gap analysis?

Sitemap-based content gap analysis is the cross-check between the URLs listed in the [sitemap.xml](/en/blog/como-criar-um-sitemap-melhorar-indexacao-site/) of two sites to identify topics one covers and the other doesn't. Unlike a traditional content audit, which only looks inward at your own site, this comparison uses the competitor as a direct reference point.

The sitemap.xml already exists for indexing purposes. It generally lists every published article, category, and page. That turns it into a ready-made content inventory, without having to manually crawl the site with a crawling tool.

## Why is this different from using Ahrefs Content Gap or SEMrush Keyword Gap?

Tools like Ahrefs Content Gap and SEMrush Keyword Gap compare keywords competitors rank for that you don't. The starting point is the tool's own search database, which doesn't always cover smaller niches or highly specific terms in a B2B sector.

Sitemap comparison starts somewhere else: from the content structure the competitor decided to publish, regardless of whether the keyword tool logged that term as covered or not. A competitor might have a URL that's been indexed for three months with no meaningful search volume yet, and that already signals an editorial bet. Keyword gap doesn't catch that in time. Sitemap comparison does.

The two approaches don't compete, they complement each other. Keyword gap shows you where the competitor ranks better. Sitemap comparison shows you what they decided to publish, which usually happens before the ranking shows up in search tools.

A practical example: an HR SaaS publishes a new article on multi-state payroll compliance and still has no meaningful organic traffic for that term. In Ahrefs or SEMrush, that gap doesn't show up yet, because there's no ranking data to compare. In their sitemap, the URL is already there, along with the category it was published under and the nearby URLs that show the context of the content series. Whoever compares sitemaps sees the editorial bet three months before anyone who only compares rankings.

## How does comparing two sitemaps actually work?

The process has three steps: collect both sitemaps, extract the topics behind each URL, and cross-reference the lists. That's exactly the workflow the [Lacuna de Conteúdo](/ferramentas/lacuna-de-conteudo/) (Content Gap) tool I'm building right now automates.

The mechanics are simple to describe: you paste in your site's sitemap URL and the competitor's. The tool reads both lists of URLs, interprets the topic behind each slug and title, and cross-references the two sets. It's not a string comparison of URLs, because that would miss the fact that "/blog/automacao-de-vendas" and "/resources/sales-automation-guide" cover the same subject under different naming conventions.

[Screaming Frog](https://www.screamingfrog.co.uk/seo-spider/) also reads sitemap.xml and does a full crawl, but its focus is technical auditing: status codes, redirects, click depth. It doesn't interpret topics or cross-reference two sites to find editorial gaps. It's a different tool for a different job.

## What are the three result groups this comparison reveals?

Cross-referencing two sitemaps usually produces three groups, each tied to a different editorial action:

- **Topics exclusive to the competitor**: subjects present on their site and absent from yours. Action: evaluate whether it fits your editorial line and create it.
- **Topics both of you cover**: direct overlap. Action: compare depth and format, decide whether it's worth reinforcing or leaving as is.
- **Topics where you have more depth**: content you already cover more broadly than the competitor. Action: no new creation needed, but it's a signal to push harder on distributing content that's already winning.

Splitting things into groups avoids the most common mistake in competitive audits, which is treating every gap as "I need to create this right now." Not every absence is an opportunity. Sometimes the competitor is testing a subject that doesn't convert for anyone in the niche.

## How do you apply this to your editorial calendar?

Running the comparison once already delivers a better list of ideas than most brainstorming meetings. But the bigger payoff comes from making it a routine.

Pick one to three direct competitors, the ones fighting for the same audience and buying cycle, not by default the biggest names in the market. Run the comparison every quarter, because the sitemap changes with every new publication, and today's gap might already be covered in ninety days.

Cross-reference the sitemap comparison results with [search volume](/en/blog/como-escolher-as-melhores-palavras-chave-para-seu-negocio-local/) before deciding what goes on the calendar. A topic exclusive to the competitor with no volume attached to it yet might still be worth pursuing, but for a different reason: a positioning bet, not immediate traffic.

Document the group for each topic alongside the decision, not just the topic on its own. A spreadsheet with columns "topic," "group (competitor-exclusive, overlap, your advantage)," and "action" keeps the same discussion from repeating itself next quarter, when someone brings up the same idea again without remembering it was already evaluated and dropped for lack of volume.

[Lacuna de Conteúdo](/ferramentas/lacuna-de-conteudo/) is still being tested with real sites before opening up to more people. The idea behind it came from a simple question: if the competitor's sitemap is already public, why keep deciding on content by gut feeling?
