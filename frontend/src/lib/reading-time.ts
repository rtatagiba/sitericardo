/** Palavras por minuto — média conservadora para leitura técnica em português. */
const WORDS_PER_MINUTE = 200;

/**
 * Tempo de leitura, em minutos, a partir do markdown cru do post.
 *
 * Blocos de código, HTML e URLs de link são descartados antes da contagem:
 * ninguém lê um `<img src="...">` no ritmo de prosa, e deixá-los inflava
 * o número em posts com muitas imagens.
 */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;

  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^[#>\-*|]+/gm, ' ');

  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
