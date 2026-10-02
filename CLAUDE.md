# Site Essenza — Vitrine (contexto para Claude Code)

Site estático de vitrine para a Essenza, loja de perfumes árabes, importados e
cosméticos em Morada Nova, CE. HTML/CSS/JS puro — **sem framework, sem build
step, sem npm run dev**. O site não vende direto: cada botão de produto abre
uma conversa no WhatsApp com mensagem pré-preenchida. Isso não muda nesta
rodada.

## Estrutura atual do projeto

```
index.html       — página única com todas as seções
style.css        — todo o CSS do site
robots.txt       — SEO
sitemap.xml      — SEO
manifest.json    — PWA / mobile
```

Renan vai adicionar dois arquivos PNG na raiz do projeto com a logo da marca:
uma versão **com fundo** (creme) e uma **sem fundo**/fundo diferente. Se esses
arquivos ainda não existirem quando você começar, pule a Tarefa 7, avise que
está esperando os arquivos, e siga com as outras tarefas — não invente nomes
de arquivo nem crie uma logo própria para substituir.

## Identidade visual — não mudar sem perguntar

| Token | Valor | Uso |
| --- | --- | --- |
| Cacau | `#2C2420` | texto principal, fundo escuro (hero, footer) |
| Caramelo | `#C4956A` | destaque, preço, acento |
| Areia | `#E8D5C0` | superfícies alternadas, bordas |
| Creme | `#F5EDE6` | fundo claro, seções alternadas |
| Bronze | `#8B6F4E` | texto secundário |
| Dourado | `#D4A574` | hover, destaque secundário |
| Verde WhatsApp | `#2A7D5B` | todo CTA de compra/contato |

Fontes: **Cormorant Garamond** (serifada, títulos) + **Inter** (corpo), via
Google Fonts, carregadas no `<head>`.

Tom: elegante mas acolhedor — sofisticação acessível, não luxo inacessível.
Público: 18-35 anos, homens e mulheres.

## Tarefas desta rodada

Trabalhe nesta ordem. Ao final de cada tarefa, rode o teste Playwright
correspondente (ver seção de testes) antes de passar pra próxima.

### 0. Baseline no git

Se este projeto ainda não tem repositório git, rode `git init`, confira
`.gitignore` (nada sensível a versionar aqui, mas exclua `node_modules/` já
que você vai instalar o Playwright), e faça um commit inicial com o estado
atual **antes de mudar qualquer coisa** — isso dá um ponto de volta seguro.

### 1. Nome e logo "Essenza"

Quando os dois arquivos PNG existirem na raiz:
- Abra os dois e avalie qual funciona melhor em cada contexto: nav (fundo
  claro/transparente ao rolar), footer (fundo escuro cacau), favicon (muito
  pequeno, precisa ser legível reduzido). Pode ser que a resposta seja "usar
  a versão sem fundo na nav e no footer, gerar o favicon a partir dela" —
  decida com critério e explique a escolha.
- Troque todo texto placeholder "Sua Marca" por "Essenza" — isso inclui: logo
  no nav, footer, `<title>`, meta description, Open Graph, JSON-LD
  (schema.org Store), textos de WhatsApp que mencionem o nome da loja.
- Gere um favicon a partir da logo (substituindo o emoji ✨ atual) e os
  tamanhos de ícone que fizerem sentido (apple-touch-icon, etc).
- Atualize `manifest.json` com o nome real e ícones, se aplicável.

### 2. Scroll mais suave

O `scroll-behavior: smooth` nativo do CSS já existe mas pode parecer abrupto
em alguns navegadores. Avalie se vale implementar um scroll customizado com
easing (ex: uma função de easing suave em JS para os links âncora do nav),
sempre respeitando `prefers-reduced-motion` (usuário com essa preferência
NUNCA deve ter scroll ou animação forçada). Teste em Chrome e, se possível,
em um motor diferente.

### 3. Revisar o reveal de elementos/seções

O sistema atual usa `IntersectionObserver` com a classe `.reveal`. Audite:
- Threshold e rootMargin estão disparando a animação no momento certo (nem
  cedo demais escondendo conteúdo, nem tarde demais parecendo que travou)?
- Cards dentro de uma mesma seção (ex: grid de produtos) deveriam revelar em
  sequência com pequeno delay entre eles (stagger), não todos de uma vez —
  implemente isso se ainda não existir.
- A animação nunca deve re-disparar de forma estranha ao redimensionar a
  janela ou rolar pra cima e pra baixo repetidamente.
- Respeita `prefers-reduced-motion` (mostra tudo direto, sem fade/translate).

### 4. Redesenhar a seção de confiança

A seção com "Produtos 100% originais · Nota fiscal em todo pedido · Entrega
em Morada Nova · Pix sem taxa" está como texto corrido com separadores. Dê a
ela identidade visual própria: um ícone pequeno por item (selo/check para
originalidade, nota fiscal, localização para entrega, cartão/pix para
pagamento), layout em grade ou linha com espaçamento generoso, hierarquia
tipográfica clara. Deve parecer uma seção desenhada, não uma lista de texto.

### 5. Corrigir o menu mobile

- Hoje o menu mobile abre como um painel; troque para **tela cheia**
  (overlay cobrindo 100% da viewport) com fundo creme (ou a cor mais
  adequada da paleta — decida e justifique).
- O ícone de hambúrguer que vira "X" ao abrir não está formando um X
  perfeito — as duas linhas provavelmente não têm o mesmo comprimento, ou a
  origem da rotação (`transform-origin`) não está centrada, ou os valores de
  `translate`/`rotate` não se encontram exatamente no centro. Corrija isso
  com precisão — compare visualmente antes/depois com screenshot.
- Garanta que o scroll do body trava enquanto o menu full-screen está
  aberto (comum esquecer isso).

### 6. Caça a bugs visuais

Faça uma varredura própria, sem esperar eu apontar: overflow horizontal em
qualquer largura, contraste ruim, elemento cortado, ícone desalinhado,
espaçamento inconsistente entre seções, erro no console. Documente cada um
encontrado (mesmo os pequenos) antes de corrigir.

### 7. Sugestões do que adicionar ao site

Isso é uma entrega de **texto**, não de código: liste ideias de seções ou
funcionalidades que fariam sentido pra essa vitrine (ex: depoimentos de
clientes, seção de perguntas frequentes, mapa da área de entrega, mini-blog
para SEO, integração com feed do Instagram). Não implemente nenhuma sem eu
aprovar — só proponha com uma frase de justificativa por item.

### 8. SEO ao máximo

- Revise todo o HTML semântico (hierarquia de headings, uso de `<section>`,
  `<nav>`, `<footer>` corretos).
- Confirme que todo ícone/SVG decorativo tem `aria-hidden="true"` e que
  imagens/ícones com significado têm texto alternativo.
- Enriqueça o JSON-LD (schema.org `Store`) com mais campos se fizer sentido
  (ex: `image`, `sameAs` para redes sociais, horário de atendimento).
- Confirme `sitemap.xml` e `robots.txt` corretos e atualizados.
- O domínio final ainda não existe — mantenha o placeholder atual
  (`seudominio.com.br`) em `canonical`, Open Graph e sitemap, mas deixe
  fácil de substituir depois (não espalhe o domínio em muitos lugares sem
  necessidade).
- Verifique performance básica: nada bloqueando renderização
  desnecessariamente, fontes carregadas com `display=swap` (já deveria
  estar), sem recursos externos além dos já permitidos (Google Fonts).

## Testes — use Playwright para TUDO

Este projeto ainda não tem Playwright configurado. Instale
(`@playwright/test` como dev dependency) e configure para servir o
`index.html` localmente (um servidor estático simples, não precisa de
Next.js nem build). Para cada tarefa acima, escreva ou rode um teste que
prove — não presuma — que o pedido foi atendido:

- Screenshots full-page em 375px, 768px, 1024px e 1440px, para cada seção
  tocada. **Visualize os screenshots você mesmo** antes de considerar
  concluído — não baseie sucesso só em ausência de erro de código.
- `document.documentElement.scrollWidth` igual à largura do viewport em
  cada tamanho (zero overflow horizontal).
- Console do navegador limpo (zero erros/warnings) em cada página/tamanho.
- Teste específico do menu mobile: abrir, confirmar que cobre 100% da tela,
  confirmar que o ícone vira um X geometricamente correto (compare
  screenshot antes/depois), confirmar que fecha corretamente, confirmar que
  o scroll do body trava enquanto aberto.
- Teste do reveal: simular scroll e confirmar que elementos recebem a
  classe de visível no momento esperado, sem flicker nem disparo duplicado.

## Regras de trabalho (mesmo fluxo de sempre)

- Se tiver uma dúvida real (decisão de produto não coberta aqui), pare e
  escreva a pergunta isolada em texto simples para eu copiar e levar à
  discussão. Não adivinhe decisões de marca/conteúdo importantes.
- Commit local ao final de cada tarefa aprovada, sem perguntar. Nunca dê
  push sem eu pedir explicitamente.
- Não transforme isso num projeto React/Next — mantenha HTML/CSS/JS puro,
  um único `index.html` como já está.
