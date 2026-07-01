import { writeFile } from 'node:fs/promises';

/**
 * Astro integration implementing IndexNow (https://www.indexnow.org/).
 *
 * Always writes the key verification file (`/{key}.txt`) into the build
 * output. URL submission to the IndexNow API only runs when the
 * INDEXNOW_SUBMIT env var is set to "true" (set it in CI/deploy, never
 * locally), so local builds don't ping search engines.
 */
export function indexNow({ key, siteUrl }) {
  return {
    name: 'indexnow',
    hooks: {
      'astro:build:done': async ({ dir, pages, logger }) => {
        const keyFile = new URL(`${key}.txt`, dir);
        await writeFile(keyFile, key, 'utf-8');
        logger.info(`key file written: /${key}.txt`);

        if (process.env.INDEXNOW_SUBMIT !== 'true') {
          logger.info('submission skipped (INDEXNOW_SUBMIT != "true")');
          return;
        }

        const urlList = pages
          .map((p) => new URL(p.pathname, siteUrl).href)
          .filter((u) => !u.includes('/404'));

        const host = new URL(siteUrl).host;
        try {
          const res = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({
              host,
              key,
              keyLocation: new URL(`/${key}.txt`, siteUrl).href,
              urlList,
            }),
          });
          logger.info(`submitted ${urlList.length} URLs — HTTP ${res.status}`);
        } catch (err) {
          logger.warn(`submission failed: ${err.message}`);
        }
      },
    },
  };
}
