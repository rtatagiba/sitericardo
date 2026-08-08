---
title: "The Experiment That Proved Most 'Crawlers' in Your Logs Are Fake"
description: "An IP-verification test found that most AI bots and Googlebot hits on a new site were fake. See the method and how to run it on your own logs."
date: 2026-07-14
image: "/images/capas/o-experimento-que-provou-a-maior-parte-do-crawler-no-seu-log-e-fake.webp"
---

Every bot that hits a page identifies itself with a name in the request header: ChatGPT-User, Claude-User, CCBot, Googlebot. That name is a self-declared string.

It costs any script nothing to forge, and that's exactly why credential scanners love impersonating a trusted AI assistant to try to access files like `.env.production`, `secrets.yaml`, or `config.json`.

Forrester found exactly that pattern: hits using the ChatGPT name went straight after config files, something no legitimate assistant use would ever do.

The analogy he uses works well: the name in the header is like a stranger knocking on your door in a delivery driver's uniform. The uniform is easy to fake. What actually proves something is different information.

## How do you verify whether a bot is real?

![Study shows over 80 percent of your AI traffic is fake](/images/estudo-mostra-que-mais-de-80-por-cento-do-seu-trafego-de-ia-e-fake.jpeg)OpenAI, Anthropic, Google, Perplexity, and the operator of Common Crawl all publish official lists of the IP ranges their bots actually use. The verification is a cross-check between the declared name and the request's origin IP:

* ChatGPT-User: list published by OpenAI at [openai.com/chatgpt-user.json](http://openai.com/chatgpt-user.json)
* Claude (all bots): Anthropic's list at [claude.com/crawling/bots.json](http://claude.com/crawling/bots.json)
* Perplexity-User: list at [perplexity.com/perplexity-user.json](http://perplexity.com/perplexity-user.json)
* Googlebot: Google's list at [developers.google.com](http://developers.google.com), in the common-crawlers.json file
* CCBot: list published by Common Crawl

Forrester's script uses three categories, not two: verified (the IP is on the published list), spoofed (the list loaded and the IP isn't on it), and unverifiable (couldn't confirm, because the list failed to load or a record was missing). That third category matters: treating "unverifiable" as "fake" is a mistake, and it was precisely the discipline of not making that mix-up that let him get to the most interesting finding of the study, about CCBot.

## The CCBot case: when "unverifiable" turns into an investigation

Of 20 requests carrying the CCBot name on Forrester's site, zero matched the official IP list, four were flagged as spoofed, and sixteen were left as unverifiable.

Instead of dismissing those sixteen, he chased them down four different ways: checked the published IP list, ran reverse DNS (the real CCBot resolves to a [commoncrawl.org](http://commoncrawl.org) hostname), consulted the public Common Crawl index to see if the domain had been captured in the most recent three months, and traced the IPs' origin via WHOIS.

All four checks landed on the same conclusion: the 20 requests were impostors, running on cheap hosting spread across Europe. Common Crawl matters here because it feeds a large share of the datasets used to train language models, so confirming impersonation on this specific bot carries more weight than it looks like at first glance.

## Retrieval and training are two different games

It's worth separating two types of crawler that tend to get lumped together. Bots like ChatGPT-User and Claude-User do real-time retrieval: they fire when someone is mid-conversation and the assistant goes to fetch a source to answer, the same citation mechanism detailed in the [guide to showing up in ChatGPT (AEO/GEO)](/en/blog/como-aparecer-no-chatgpt-guia-aeo-geo/).

GPTBot and ClaudeBot, on the other hand, do background indexing — material that might eventually end up baked into a future trained model's weights, generating zero referral traffic today.

In Forrester's verified data, the most active crawler on the domain wasn't Google's. It was Anthropic's ClaudeBot, with 166 confirmed hits, ahead of verified Googlebot (107), GPTBot (46), and OpenAI's search crawler (40). Small sample, new site, no promoted traffic, but the composition already tells you something: whoever spends crawl budget on an unknown domain is a signal worth paying attention to once volume grows.

## The blind spot called Gemini

Unlike OpenAI, Anthropic, and Perplexity, which expose separate, verifiable crawlers for training, indexing, and live search, Google bundles everything into a single Googlebot.

What decides whether content feeds Gemini's training is a robots.txt tag called Google-Extended — the same bot-category logic Cloudflare adopted, which we detailed in [how to block AI training without disappearing from Google](/en/blog/como-bloquear-treinamento-de-ia-sem-sumir-do-google-a-mudanca-que-a-cloudflare-fez-em-julho-de-2026/). It isn't a crawler, it's a permission over a collection that already happened, with no fetch of its own. Forrester found four requests identifying as Google-Extended, and since that name should never make a direct request, all four were unmasked from the start, no IP check needed.

The practical consequence is that you can confirm Googlebot and nothing beyond that. The rest, once again, is "not provided," echoing what happened in 2011 when Google encrypted search referrers.

## How do you apply this to your own site?

The script used in the study is about fifteen lines of Python, using only the standard library: it downloads a provider's IP list, extracts the network ranges from the JSON, and checks whether an IP falls inside any of them. That's just the core.

A working version needs to read the actual lines from your log, map each bot name to its corresponding list, keep the unverifiable category, and use reverse DNS as a fallback for operators like Common Crawl.

Forrester himself is upfront about this: his numbers mean little outside their context, because they're two weeks of data on a site with no promoted traffic. The value is in the method, not the statistics.

If your site has real traffic, the dataset in your own access logs is far better than his, and the check can be done today. Pull a date range, cross-reference the names against the official lists, and see what fraction of your "AI traffic" survives the IP test. Then look at the Googlebot line, remember it's the same central piece in [the shift to grounding as the future of organic traffic](/en/blog/a-oficializacao-do-grounding-o-futuro-do-trafego-organico-segundo-o-google/), and get ready.
