# 🔑 Skill: Conversão de WordPress para Astro v6 + Tailwind CSS v4 + Cloudflare

> **Objetivo:** Guia geral para converter sites do WordPress para a estrutura AstroWind (Astro v6 + Tailwind CSS v4) com deploy no Cloudflare Pages.

---

## 📋 Índice
1. [Arquitetura e Configuração](#1-arquitetura-e-configuração)
2. [Otimização de Memória e Compilação](#2-otimização-de-memória-e-compilação)
3. [Limpeza e Formatação de Conteúdo WordPress](#3-limpeza-e-formatação-de-conteúdo-wordpress)
4. [Tratamento de Links e URLs Quebradas](#4-tratamento-de-links-e-urls-quebradas)
5. [Otimização de Imagens e Resolução de Erros](#5-otimização-de-imagens-e-resolução-de-erros)
6. [Resolução de Conflitos de Rotas](#6-resolução-de-conflitos-de-rotas)
7. [Deploy no Cloudflare Pages](#7-deploy-no-cloudflare-pages)
8. [Checklist Final de Migração](#8-checklist-final-de-migração)

---

## 1. Arquitetura e Configuração
- **Node.js:** Versão `>= 22.12.0` recomendada.
- **Variáveis Globais:** Utilize `src/config.yaml` para configurações globais. Dados de negócio ou contatos devem ficar neste arquivo, e nunca direto no código.
- **Tailwind v4:** A configuração é baseada em CSS em `src/assets/styles/tailwind.css`. Utilize variáveis CSS em `src/components/CustomStyles.astro` para controle de temas (claro/escuro).

---

## 2. Otimização de Memória e Compilação
Migrações de WordPress podem trazer milhares de arquivos de mídia antigos (`wp-content/uploads`).
- **Problemas comuns:**
  1. **Heap Out of Memory:** O Vite tenta processar arquivos pesados na pasta `src/`, causando falha de memória.
  2. **Tamanho limite no Cloudflare Pages:** O Cloudflare Pages rejeita arquivos estáticos individuais maiores de **25 MiB** (comum em áudios `.mp3` e vídeos `.mp4` de migrações antigas do WordPress).
- **Soluções:** 
  1. Mantenha mídias históricas leves na pasta `public/` (onde são copiadas sem processamento do Vite).
  2. **Backup Local:** Mova mídias gigantes (> 25 MiB) não lincadas no código para um diretório local fora de `public/` (ex: `wp-lixeira/`) e adicione essa pasta ao `.gitignore` para servir de backup seguro apenas na máquina de desenvolvimento.
  3. **Hospedagem Externa:** Se a mídia pesada for indispensável, hospede-a em serviços externos (YouTube, SoundCloud, Google Drive, Cloudflare R2) e aponte o link no código-fonte para a URL externa.
  4. Ajuste o arquivo `tsconfig.json` para excluir diretórios de mídias pesadas da validação:
     ```json
     {
       "exclude": ["node_modules", "dist", "public", ".astro"]
     }
     ```

---

## 3. Limpeza e Formatação de Conteúdo WordPress
Posts migrados do WordPress frequentemente contêm sujeiras de HTML e formatação inválida.
- **Tags de Estilo Legadas:** Remova tags `<span>`, `<div>` internas desnecessárias, atributos `style` e tags `<br>` repetidas que quebram o layout moderno.
- **Subtítulos Artificiais e Repetitivos:** Remova subtítulos gerados automaticamente por plugins de SEO antigos do WordPress (ex: títulos repetidos com números). Substitua por uma hierarquia semântica limpa de `h2` e `h3`.
- **Scripts de Automação:** Use scripts Node.js para buscar e substituir tags HTML inválidas em lote dentro dos arquivos Markdown (`.md` / `.mdx`) da pasta `src/data/post/`.

---

## 4. Tratamento de Links e URLs Quebradas
- **Caminhos Internos:** Altere links que apontam para o domínio antigo ou caminhos como `https://meusite.com/nome-do-post` para caminhos relativos `/nome-do-post`.
- **Remoção do sufixo `.html`:** Caso o WordPress utilizasse extensões de página, trate-as no Astro para rotas amigáveis.
- **Links para Arquivos:** Substitua referências diretas de links a arquivos `/wp-content/uploads/...` para o novo caminho na pasta `/public/uploads/` ou no CDN.

---

## 5. Otimização de Imagens e Resolução de Erros
Evite usar tags HTML `<img>` puras com atributos `onerror` recursivos, pois podem causar loops infinitos de recarregamento e travamento do navegador.
- **Componente Nativo:** Sempre prefira usar o componente de imagem otimizado do AstroWind:
  ```astro
  ---
  import Image from '~/components/common/Image.astro';
  ---
  <Image 
    src="~/assets/images/foto-autor.jpg" 
    alt="Descrição da Foto" 
    width={400}
    height={400}
    layout="responsive"
  />
  ```
- **Nomes de Arquivos:** Remova espaços e caracteres especiais dos nomes das imagens. Use hifens (ex: `carlos-magalhaes.jpg` em vez de `Carlos Magalhães.jpg`).
- **Organização de Pastas:**
  - Imagens de design, banners e fotos fixas importantes: Salve em `src/assets/images/` para compressão e conversão automática para formatos modernos (WebP/AVIF).
  - Imagens dinâmicas ou volumosas (ex: galerias antigas): Salve em `public/images/` ou use URLs absolutas com CDNs.

---

## 6. Resolução de Conflitos de Rotas
- **Conflito de Páginas Estáticas e Posts:** Se uma página do WordPress foi convertida em uma página estática interativa no Astro (ex: `src/pages/sobre.astro`), você **deve deletar** o arquivo markdown correspondente (ex: `src/data/post/sobre.md`).
- **Motivo:** Manter ambos cria conflito de rotas e faz com que a página institucional apareça indevidamente na listagem dinâmica de artigos/blog.

---

## 7. Deploy no Cloudflare Pages
- **Conflito de Adaptador em Builds Estáticos:**
  - **Problema:** Em builds 100% estáticos (`output: 'static'`), o uso do adaptador `@astrojs/cloudflare` no `astro.config.ts` gera um arquivo temporário `wrangler.json` que declara uma binding de ativos com o nome `ASSETS`. O compilador do Cloudflare Pages reserva essa palavra internamente e rejeita o build com o erro `The name 'ASSETS' is reserved in Pages projects`.
  - **Solução:** Remova ou comente o adaptador Cloudflare no `astro.config.ts` em projetos estáticos. A Cloudflare Pages servirá a pasta `dist` nativamente sem necessidade de Workers de backend.
- **Gerenciamento de Versão do Node.js:**
  - **Problema de Timeout:** Arquivos `.node-version` ou `.nvmrc` com versões exatas do Node não existentes no cache da Cloudflare (ex: `22.12.0`) forçam o `asdf` a compilar o Node do zero a partir do código-fonte, estourando o tempo limite de build de 20 minutos.
  - **Solução:** Remova os arquivos `.node-version` e `.nvmrc` locais. Defina e controle a versão do Node.js exclusivamente usando a variável de ambiente `NODE_VERSION = 22` (apenas o número principal) no painel do Cloudflare Pages.

---

## 8. Checklist Final de Migração
- [ ] Nenhum link interno apontando para o domínio do WordPress antigo.
- [ ] Imagens migradas renomeadas sem caracteres especiais ou espaços.
- [ ] Nenhum arquivo maior que **25 MiB** no diretório público (áudios `.mp3` ou vídeos `.mp4` movidos para `wp-lixeira/`).
- [ ] Arquivos `.node-version` e `.nvmrc` locais removidos para evitar timeouts de compilação do Node.js.
- [ ] Adaptador `@astrojs/cloudflare` desativado no `astro.config.ts` se o site for estático (`output: 'static'`).
- [ ] Tags HTML invasivas de formatação antiga removidas dos posts Markdown.
- [ ] Páginas institucionais removidas da pasta de posts para evitar duplicidade de rotas.
- [ ] Variável `NODE_VERSION = 22` configurada nas variáveis de ambiente do Cloudflare.
- [ ] Executado `npm run check` com sucesso no terminal local antes do envio.
