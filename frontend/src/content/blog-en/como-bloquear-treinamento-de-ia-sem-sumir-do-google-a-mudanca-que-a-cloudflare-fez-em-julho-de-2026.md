---
title: "How to Block AI Training Without Disappearing From Google: The Change Cloudflare Made in July 2026"
description: "Cloudflare split AI bots into three categories: search, agent, and training. Starting September 15, 2026, every new domain on the platform is born with training and agent blocked by default"
date: 2026-07-08
image: "/images/capas/como-bloquear-treinamento-de-ia-sem-sumir-do-google-a-mudanca-que-a-cloudflare-fez-em-julho-de-2026.webp"
tags:
  - AI
---

Cloudflare split AI bots into three categories: search, agent, and training. Starting September 15, 2026, every new domain created on the platform is born with training and agent blocked by default on pages that carry ads, while search stays allowed. In practice, this puts an end to the all-or-nothing choice that existed until now, and hands site owners back control over who profits from their content.

The block-everything button never solved the right problem. Until July 2026, Cloudflare offered one solution for AI bots: a toggle. On or off. Block everything, or let everything through. The problem is that this binary logic ignored a massive difference.

Googlebot crawling your site to index it and send you visitors has nothing to do with a crawler that sucks up your content to train a model and never sends anyone back. Treating the two the same has always been bad for content creators, and worse for small sites, a point already raised in [Google's official acknowledgment of grounding as the future of organic traffic](/en/blog/a-oficializacao-do-grounding-o-futuro-do-trafego-organico-segundo-o-google/).

If nobody can find your site, you're forced to choose between appearing in search (accepting that your text becomes training data) or protecting your content and risking that nobody ever finds you again. The one who wins in that trap is always whoever already has an established position, because the same bots that index also train, an imbalance that also shows up in [free SEO tools for AI, AEO, and GEO](/en/blog/ferramentas-gratuitas-seo-para-ia-aeo-geo/).

The three categories Cloudflare created. Instead of continuing to try to define what does or doesn't count as AI (that line became impossible to draw), Cloudflare started classifying each bot's behavior instead. This applies to every customer, including those on the free plan.

**Search**: indexes content to answer questions and, ideally, sends referral traffic back.

**Agent**: acts in real time on behalf of a specific person. A browser agent operating Chrome to complete a task someone requested, right then.

**Training**: collects data to train or fine-tune a model. The content enters the model's architecture permanently and never comes back as a visit. This makes it possible to let your page appear in search while blocking that same text from feeding model training. That middle ground didn't exist before.

What changes in September. Starting September 15, 2026, every [new domain on Cloudflare is born with training](https://blog.cloudflare.com/agentic-internet-bot-report/) and agent blocked by default on pages that carry ads.

**Search stays allowed.** The logic is straightforward: an ad on the page is a signal that the content was made to be seen by real people, and it's human attention that pays the bills there. There's a technical detail that changes the game for anyone operating a multi-purpose bot. Googlebot indexes for search and also collects data that can end up feeding training.

Under the new rule, blocking training blocks the entire bot in that function, even if it's also doing legitimate search crawling in parallel. This forces AI companies to separate behaviors instead of hiding everything behind a single crawler. Anyone with an existing site can keep the old configuration until the deadline. Nobody's default changes without notice. The extra package that came with it.

**BotBase**: a searchable database, available to Enterprise customers, listing every verified bot and its exact classification.

**Content usage signal**: an extension of the traditional robots.txt. Now you can specify not just whether a bot can access your content, but what it can do with it afterward: interact without storing anything, index with a link back, or summarize and reproduce the material.

## "Verified" now means something different

Before, a verified bot essentially meant unrestricted access. Now it means permission within the specific category that applies to that bot, and nothing more.

Transitive trust: a technical header called Forwarded ensures that the trust granted to an AI company holds even when access passes through an intermediary along the way.

It closes the loophole of routing around the rule through a proxy. What to do with this. Cloudflare sits in front of more than a fifth of all domains on the internet, so this isn't a cosmetic tweak.

If you run a site, it's worth logging into the dashboard before September arrives and reviewing your bot rules one by one. Deciding what to allow for search, what to lock down for training, and how to handle autonomous agents is the kind of choice that separates a site that keeps bringing in visitors from one that just feeds a model in exchange for nothing, the same dilemma we cover in [how to monitor your site's SEO performance with free tools](/en/blog/como-monitorar-desempenho-seo-seu-site-ferramentas-gratuitas/).

Google Search Central's own [crawler documentation](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers) explains how Googlebot distinguishes crawling for indexing from other uses, which reinforces why separating bot categories makes a practical difference. The discussion over the line between AI training and indexing also comes up frequently on [Search Engine Land](https://searchengineland.com/library/seo), which covers updates like this as soon as they happen.
