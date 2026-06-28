const fs = require('fs');
const path = require('path');

const blogDir = 'c:/Users/Ricardo Guedes/Desktop/projects/Site Ricardo/frontend/src/content/blog';

const filesToUpdate = [
    "como-calcular-seu-orcamento-de-seo-um-guia-completo-para-empresas-brasileiras.md",
    "como-escolher-as-melhores-palavras-chave-para-seu-negocio-local.md",
    "como-fazer-seo-para-hoteis-na-nova-era-da-ia.md",
    "como-fazer-seo-para-pequenas-empresas-um-guia-completo.md",
    "como-fazer-seo-para-sites-de-turismo-atraia-mais-visitantes.md",
    "como-medir-o-share-of-search-o-gps-da-sua-relevancia-no-mercado-digital.md",
    "o-poder-do-schema-org-para-empresas-de-servicos-um-guia-completo-para-o-seo-local.md"
];

filesToUpdate.forEach(f => {
    const filePath = path.join(blogDir, f);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/(image:\s*"[^"]+)\.(jpg|jpeg|png)(")/gi, '$1.webp$3');
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${f}`);
});
