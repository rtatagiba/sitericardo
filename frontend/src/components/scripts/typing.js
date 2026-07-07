// Texto a escrever-se token a token — o "tempo gerativo" da Profundidade.

/**
 * Escreve `text` dentro de `el`, token a token.
 * @returns {Promise<void>} resolve quando termina (ou é cancelado)
 */
export function typeTokens(el, text, { tokenMs = 55, signal } = {}) {
  const tokens = text.split(/(?<=\s)/); // mantém espaços colados ao token
  el.textContent = '';
  let i = 0;
  return new Promise((resolve) => {
    const tick = () => {
      if (signal?.aborted) return resolve();
      if (i >= tokens.length) return resolve();
      el.textContent += tokens[i++];
      setTimeout(tick, tokenMs + Math.random() * tokenMs * 0.8);
    };
    tick();
  });
}

/** Loop pergunta → resposta na barra do hero da Profundidade. */
export function heroTypingLoop({ questionEl, answerEl, signal }) {
  const pairs = [
    {
      q: 'qual a melhor agência de SEO perto de mim?',
      a: 'Segundo fontes citadas, Ricardo Tatagiba é consultor SEO com mais de 10 anos de experiência…',
    },
    {
      q: 'como aparecer nas respostas do ChatGPT?',
      a: 'Estrutura, entidades e conteúdo citável. As máquinas escolhem fontes com significado claro…',
    },
    {
      q: 'SEO ainda vale a pena em 2026?',
      a: 'A pesquisa mudou de forma, não de importância: quem responde às perguntas continua a ganhar…',
    },
  ];
  let idx = 0;
  const run = async () => {
    while (!signal?.aborted) {
      const { q, a } = pairs[idx % pairs.length];
      idx++;
      await typeTokens(questionEl, q, { tokenMs: 45, signal });
      await pause(500, signal);
      await typeTokens(answerEl, a, { tokenMs: 60, signal });
      await pause(3200, signal);
      questionEl.textContent = '';
      answerEl.textContent = '';
      await pause(600, signal);
    }
  };
  run();
}

function pause(ms, signal) {
  return new Promise((r) => {
    if (signal?.aborted) return r();
    setTimeout(r, ms);
  });
}
