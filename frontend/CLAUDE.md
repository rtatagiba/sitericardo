## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## WhatTheyAsk (`/ferramentas/whattheyask`)

Keyword question explorer — expands seeds into real questions via Google Suggest.

### Rules
- Zero new dependencies — no React, no paid APIs
- JSONP via `client=chrome` (not `client=firefox` — ignored as JSONP)
- Calls use the end-user's IP, never the server's
- Cache: localStorage TTL 24h, key `wta_{keyword.trim().toLowerCase()}_{lang}`
- Rate limiting: max 5 JSONP in parallel + 100–200ms jitter between batches
- Site is 100% static — no SSR, no server-side endpoints
