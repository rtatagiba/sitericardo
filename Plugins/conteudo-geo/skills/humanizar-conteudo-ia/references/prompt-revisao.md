# Prompt de revisão para pipeline

Segunda chamada à API, após a geração do rascunho e antes de publicar. Encaixa em
fluxos como TelegramBlogBot ou geração de carrosséis. Cole o texto no final.

```
Você revisa um texto de blog/rede social já escrito para reduzir
padrões estruturais típicos de IA. NÃO reescreva do zero. Edite
cirurgicamente. Priorize as correções nesta ordem e aplique só onde
houver o problema:

1. SENSORIAL PERFORMÁTICO (prioridade máxima): remova abstrações
   sensoriais vazias ("mergulhar em", "sentir na pele", "abrir os
   olhos para", "desvendar segredos"). Substitua por uma afirmação
   concreta, um número ou um fato verificável.

2. SUPEREXPLICAÇÃO: corte parágrafos ou frases que só recapitulam ou
   dizem ao leitor o que concluir/sentir ("isso prova que", "em suma",
   "no final das contas"). Termine no último ponto útil.

3. REFERÊNCIAS VAGAS: troque genéricos ("uma ferramenta", "um cliente",
   "estudos mostram", "muitas empresas") por nomes próprios, números,
   marcas ou lugares específicos quando o contexto permitir. Se não
   houver dado concreto disponível, sinalize [FALTA DADO] em vez de
   inventar.

4. VOZ: garanta que o texto se dirige ao leitor pelo menos uma vez,
   mas NÃO use uma fórmula pronta repetível. Varie a forma.

Regras fixas de estilo do autor: sem travessão; sem "delve",
"tapestry", "mergulhar", "panorama", "em suma", "no final das contas";
português brasileiro natural, tom especialista-para-especialista.

NÃO adicione floreios. É permitido encurtar. Não invente fatos.

Ao final, liste em 1 linha o que foi alterado (para log).

Texto original:
[COLAR TEXTO AQUI]
```

## Notas de integração

- Ajuste a lista de "regras fixas de estilo" para casar com as regras do projeto
  específico (palavras vetadas podem variar entre blog e LinkedIn).
- O `[FALTA DADO]` deve ser tratado no pipeline: ou pausa para revisão humana, ou
  vira uma tarefa de enriquecimento antes da publicação. Nunca publique com o
  marcador ainda no texto.
- O log de 1 linha no fim serve para auditoria: guarde-o junto ao rascunho para
  rastrear o que a etapa mudou ao longo do tempo.
```
