---
title: "How to Appear in ChatGPT: An AEO/GEO Guide for Sites and Businesses"
description: "AEO is the set of practices that get a site read and cited by ChatGPT, Gemini, and Perplexity. Here's how schema, JSON-LD, crawlers, and llms.txt fit in."
date: 2026-07-20
image: "/images/capas/como-aparecer-no-chatgpt-guia-aeo-geo.webp"
tags:
  - AI
  - SEO
---

AEO (Answer Engine Optimization) is the set of practices for structuring a site so ChatGPT, Gemini, Perplexity, and Copilot can read, understand, and cite its content in the answers they give users. GEO (Generative Engine Optimization) is the sibling term, coined by researchers at Cornell University, and in practice both names describe the same shift: getting out of the list of 10 blue links and into the answer the AI has already formulated.

The core difference from traditional SEO is the target of the text. Google sends a visitor to your page. A generative AI reads your page, extracts what it needs, and delivers a finished answer, sometimes with no click back at all. That changes what "ranking well" means: it's not enough to appear, you need to be the source the model chooses to cite within the answer.

## GEO, AEO, and SEO: what's the practical difference?

SEO optimizes to rank in a results list the user still has to click. AEO optimizes to be the direct answer to a question, inside an engine that already formulates text (voice assistants, featured snippets, Google's own AI Overviews). GEO is the newest umbrella term, focused specifically on generative engines like ChatGPT, Gemini, Perplexity, and Copilot, which don't just answer, they synthesize new text from multiple sources.

| Dimension | Traditional SEO | AEO | GEO |
|---|---|---|---|
| Goal | High SERP ranking | Being the direct answer | Being cited within generated text |
| Main metric | Ranking, clicks, traffic | Appearances in snippet/voice | Mentions and citations in AI answers |
| Target engines | Google, Bing | Google Featured Snippets, Alexa, Siri | ChatGPT, Gemini, Perplexity, Copilot |
| What the text needs to do | Convince the relevance algorithm | Answer in 1-2 extractable sentences | Provide a self-contained excerpt dense enough to be rewritten or cited |

In practice, the three don't compete with each other. A post well structured for AEO and GEO, with a direct definition and correct schema, also tends to perform better in traditional SEO, because the clarity and structure signals that help AI extract an answer are the same ones that help Google understand what the page is about.

## Why doesn't my site show up in ChatGPT even though it ranks well on Google?

Ranking on Google and being cited by an AI are different processes, even though they share part of the same technical foundation. Google uses PageRank and hundreds of ranking signals to order links. A generative AI does retrieval: it searches for text passages semantically close to the user's question and decides, based on entity density and clarity of definition, which passage is worth citing.

Three common reasons a site ranks but isn't cited:

Lack of machine-readable technical structure. Missing or incomplete Schema.org and JSON-LD make the model lose context about what the page actually claims. A post that already covers this in detail is [programmatic FAQs with JSON-LD structured data](/en/blog/criacao-de-faqs-programadas-com-dados-estruturados-json-ld-um-guia-completo-para-seo-na-era-da-ia/), which shows how to mark up questions and answers so AI can extract the question-answer pair directly from the HTML.

Blocking AI crawlers, intentionally or not. Cloudflare started splitting bots into three categories (search, agent, and training) and, starting September 15, 2026, every new domain on the platform is born with training and agent blocked by default on pages with ads, as described in [how to block AI training without disappearing from Google](/en/blog/como-bloquear-treinamento-de-ia-sem-sumir-do-google-a-mudanca-que-a-cloudflare-fez-em-julho-de-2026/). If your site's bot settings don't distinguish between these categories, you might be blocking the exact crawler that carries your content into ChatGPT's answer.

Content written in the wrong format for retrieval. Text with a long introduction, an insight buried in the middle, and no direct definition is harder to cite than a paragraph that opens with "X is Y" followed immediately by an entity-dense sentence.

## How do you structure data for generative AI (schema, JSON-LD, and FAQ)?

Schema.org is the shared vocabulary that describes a page's content for machines: article type, author, date, questions and answers, reviews, products. JSON-LD is the most commonly used technical format for implementing that vocabulary, a block of code in the `<head>` or body of the page that declares this information in a structured way, without changing what the human visitor sees.

For AEO, three markups pay off the most:

[`Article` or `BlogPosting`](https://schema.org/Article), with author, publish date, and update date. This helps the model assess whether the information is still current, an increasingly relevant criterion as generative AI prioritizes recent sources.

[`FAQPage`](https://developers.google.com/search/docs/appearance/structured-data/faqpage), marking up question-and-answer pairs that already exist in the text. It's the same principle as the post on programmatic FAQs: each question becomes a literal H2, and the answer right below it is the passage the model is most likely to extract and cite. Worth noting that Google removed the FAQ rich result from search results in 2026; the markup is still useful for generative AI retrieval, but it no longer produces the visual highlight it once had in the SERP.

[`Organization`](https://developers.google.com/search/docs/appearance/structured-data/organization), declaring the company's name, official site, and verified profiles. This helps the model associate the content with a recognizable entity, instead of treating it as anonymous text. The [guide to schema.org for service businesses](/en/blog/o-poder-do-schema-org-para-empresas-de-servicos-um-guia-completo-para-o-seo-local/) walks through this markup step by step for local businesses.

![Connected data blocks representing a page's schema and JSON-LD structure](/images/dados-estruturados-schema-json-ld.webp)

None of these markups guarantee citation. They reduce the ambiguity the AI has to resolve on its own, and less ambiguity raises the odds the right passage gets picked.

## Which AI crawlers should you allow first?

Each AI company runs its own crawler, with a distinct name and behavior, and allowing "AI" as a generic category in your firewall isn't enough to know what's actually getting through. The main ones today:

[GPTBot and OAI-SearchBot](https://developers.openai.com/api/docs/bots), from OpenAI. The first collects data to train models; the second does real-time search to feed ChatGPT's answers with current information. They're different behaviors and, following the categorization logic Cloudflare adopted (search, agent, training), it makes sense to treat each one differently.

[ClaudeBot](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), from Anthropic, playing a role equivalent to GPTBot for Claude.

[PerplexityBot](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), from Perplexity, whose product model depends heavily on citing sources in real time, which makes this crawler particularly relevant for anyone who wants to be cited with a link.

[Google-Extended](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers), a Google-specific signal for controlling whether content feeds Gemini model training, separate from the traditional Googlebot that indexes for search.

![Robot representing an AI crawler analyzing a site's content](/images/crawler-de-ia-escaneando-conteudo-do-site.webp)

The temptation is to block everything that looks like an unfamiliar bot in the server log. The post on [the experiment that proved most crawlers in your log are fake](/en/blog/o-experimento-que-provou-a-maior-parte-do-crawler-no-seu-log-e-fake/) shows why that assumption tends to be wrong: a large share of traffic that presents itself as an AI crawler in a raw log isn't the official crawler, and blocking decisions made on top of that noisy data end up shutting out the right bot for the wrong reason.

## What is llms.txt, and is it worth implementing?

[llms.txt](https://llmstxt.org/) is a simple text file, hosted at the root of a domain, that lists a site's most relevant documents and sections so a language model can prioritize them when processing the content. It works like a summary aimed at AI, similar in spirit to the [sitemap.xml](/en/blog/como-criar-um-sitemap-melhorar-indexacao-site/) aimed at traditional search engines, but without the same level of formal adoption yet.

Adoption of the standard by AI crawlers like GPTBot (OpenAI), Anthropic's crawler, and Perplexity's is still at an early stage and shifted quickly throughout 2026. Before investing significant time in this, it's worth checking the official documentation for each crawler that matters to your business, because real support might be ahead of or behind what the file promises.

That said, the cost of creating a basic llms.txt is low: a simple markdown file listing the site's most important posts and pages, with a one-line summary each. For a site that already documents how it blocks and allows crawlers via Cloudflare, as covered in the post on [the experiment that proved most crawlers in your log are fake](/en/blog/o-experimento-que-provou-a-maior-parte-do-crawler-no-seu-log-e-fake/), llms.txt is the natural complement: one file says who can come in, the other says what's worth reading first.

## How do you know if your brand is already being cited by AI?

AI citation still doesn't have an official dashboard equivalent to Google Search Console. The free, manual path is to ask directly: open ChatGPT, Gemini, and Perplexity, and test questions a potential customer would ask about your niche, without mentioning your brand, and see if your name shows up in the answer. The same [free SEO monitoring tools](/en/blog/como-monitorar-desempenho-seo-seu-site-ferramentas-gratuitas/) that already track ranking and traffic help cross-reference that manual signal with referral data coming from AI domains.

Another indirect signal comes from Google itself. [Google's official acknowledgment of grounding](/en/blog/a-oficializacao-do-grounding-o-futuro-do-trafego-organico-segundo-o-google/) changed how AI Overviews chooses and cites sources within search results, and monitoring whether your domain appears in those blocks is a reasonable proxy for citability, since AI Overviews' retrieval logic and conversational AI's share similar principles: entity density, clear definitions, direct-answer structure.

Worth noting that claims about percentage gains in visibility from GEO circulate across different market sources, but none of them have a publicly verified methodology so far. Better to treat these as market hypotheses than as facts to repeat.

## Is it worth hiring AEO/GEO consulting, or can you do it yourself?

For a small site with few pages, most of the work described here, schema markup, reviewing bot settings in Cloudflare, rewriting H2s as questions, is doable in-house with time and attention to technical detail. Specialized consulting tends to pay off in two scenarios: sites with dozens or hundreds of pages, where manually auditing schema and structure doesn't scale, and businesses where AI citation is already a significant enough acquisition channel to justify ongoing monitoring, since crawlers and model behavior change more frequently than traditional SEO cycles.

## Summary: the 4 factors that decide whether you show up in ChatGPT

Machine-readable technical structure. Schema.org and JSON-LD on `Article`, `FAQPage`, and `Organization` reduce the ambiguity the model has to resolve on its own before deciding to cite you.

Access allowed for the right crawlers. Reviewing your AI bot settings in Cloudflare (or equivalent) by category, not as an all-or-nothing switch, avoids accidentally blocking the crawler that carries your content into the answer.

Content in answer format, not narrative format. A direct definition right at the start of each section, H2s written as literal questions, and an entity-dense sentence right after each question.

Experimental signaling via llms.txt. Low implementation cost, adoption still building among the major crawlers, but aligned with where the industry is heading.

None of these four factors works alone. A site with no schema but a perfect llms.txt is still ambiguous to the model. A well-marked-up site that blocks the right crawler never gets read at all. The gain shows up when all four work together.

Worth noting that these four factors operate per article. The compounding gain shows up when the whole domain builds [topical authority with connected content clusters](/en/blog/autoridade-topica-clusters-de-conteudo-seo-geo/): a single post, no matter how well marked up, carries less weight than that same post surrounded by related content that demonstrates complete coverage of the subject.
