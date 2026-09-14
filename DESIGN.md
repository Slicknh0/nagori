# DESIGN — Nagori

Registro do sistema **como foi construído**, lido do código e das capturas. Verdade de
implementação, não de intenção. Fonte: `assets/css/nagori.css`, `assets/js/nagori.js`.

---

## 1. O mundo

**Kondate 献立 × poesia concreta paulistana.** A carta de curso do kaiseki (escrita
vertical, fio finíssimo, margem enorme, sequência como estrutura) cruzada com a grade
rígida dos concretistas de São Paulo, onde a tipografia é objeto espacial e o silêncio
entre as palavras carrega sentido. As duas tradições compartilham a mesma obsessão —
間 MA, o espaço entre as coisas — e essa é a ponte Brasil×Japão no nível gráfico, antes
de ser no ingrediente.

Consequência estrutural: **a ordem de scroll é a ordem da refeição.** Não é
hero → sobre → menu → galeria → contato.

---

## 2. Tokens

```css
--ink        #090909    fundo base
--ink-2      #11100E    painel (omakase, origem, salão)
--ink-3      #16130F    painel profundo (depoimento)

--ivory      #F1E9DC    texto primário          14.9:1 sobre --ink
--white-soft #F7F5F0    hover de botão sólido
--ash        #8C8982    texto secundário         5.6:1 sobre --ink

--oxblood    #8C1D18    APENAS preenchimento do selo. Nunca texto, nunca UI.
--gold       #A98A58    fios de 1px e rótulos    6.1:1 sobre --ink

--line        rgba(241,233,220,.13)   régua padrão
--line-soft   rgba(241,233,220,.07)   divisor de seção
--line-strong rgba(241,233,220,.30)   borda de input, sublinhado inativo
--line-gold   rgba(169,138,88,.34)    espinha, citações, glosa
```

**Regras de cor, verificadas no build:**
- `--oxblood` aparece no preenchimento do selo e no `::selection`. Em nenhum texto sobre
  preto — daria 2,1:1.
- `--gold` nunca preenche superfície. Só fio de 1px, rótulo e os kanji conceituais (間, 一期一会).
- Todo texto corrido passa AA. Numerais do menu a 3,6:1 (texto grande, piso 3:1).

### Escala de ritmo

```css
--g     clamp(1.5rem, 5.6vw, 7rem)    goteira da página
--gap   clamp(1.25rem, 2.4vw, 2.5rem) coluna
--sec-y clamp(6rem, 13vw, 12rem)      respiro vertical de seção
--spine clamp(1.6rem, 2.6vw, 3rem)    recuo da espinha
```

---

## 3. Tipografia

| Papel | Fonte | Peso | Notas |
|---|---|---|---|
| Display, corpo, japonês | Shippori Mincho B1 | 400 / 500 | Mincho japonesa real; carrega a cultura na letra, não em ornamento colado. Fallback: Yu Mincho → Hiragino Mincho ProN → Songti SC → Georgia. |
| Navegação, rótulos, numerais, preços | Jost | 200 / 300 / 400 / 500 | Linhagem Futura, a geometria dos concretistas paulistas. |

```css
.h-display   clamp(2.2rem, 5.4vw, 4.7rem)   lh 1.06   ls -.024em   text-wrap:balance
.hero__title clamp(3rem, 11.5vw, 8rem)      lh .94    ls -.038em
             ≥1440: clamp(8rem, 8.9vw, 9.5rem)   /* retoma onde o base para */
.h-sub       clamp(1.2rem, 2.1vw, 1.75rem)  itálico, --gold
.lede        clamp(1.04rem, .98rem + .34vw, 1.28rem)  lh 1.72  max 44ch
corpo        clamp(1rem, .96rem + .18vw, 1.09rem)     lh 1.82  max 66ch
rótulo       .68–.78rem, uppercase, ls .18–.28em, Jost
```

Maiúsculas com tracking ficam confinadas a navegação, botões, rótulos de campo e metadados.
Nenhum título usa maiúsculas. Numerais tabulares em preços e na sequência do menu.

---

## 4. Grade e composição

Doze colunas a partir de 1024px, `gap: 0 var(--gap)`, conteúdo deliberadamente fora do eixo:

| Seção | Esquerda | Direita |
|---|---|---|
| Manifesto | título 1–6, 間 MA 1–6 (linha 2) | texto 7–12 |
| Omakase | imagem 1–7 | texto 8–13 |
| Pratos | alterna 1–7 / 7–13 / 2–8 / 6–12 | contra-alterna, com desvio vertical negativo em b e d |
| Origem | cabeçalho 1–7 | apoio 8–12; três cartões em escada de 0 / 1,2 / 2,4rem |
| Chef | imagem 1–6 | texto 7–12 |
| Salão | mosaico de 6 colunas, 4 figuras, `align-items:start` |
| Menu | numeral / nome / descrição em `clamp(3.5rem,6vw,6rem) minmax(12rem,21rem) minmax(0,1fr)` |
| Reservas | formulário 1–8 | informação 9–13 |

Sem cards. Cada prato é composição editorial com régua superior, não contêiner.

---

## 5. Componentes

**Espinha** (`.spine`, ≥1024px) — fio fixo de 1px à esquerda com o nome da seção em
`writing-mode: vertical-rl` e o progresso do scroll preenchendo de cima. Trocado por
`IntersectionObserver` com `rootMargin: -46% 0px -46% 0px`, ou seja, pela seção no centro
do viewport. É orientação, não decoração. Não há barra de progresso no topo — seria o
chrome de template que a tese recusa.

**Selo (hanko)** — um `<symbol>` SVG definido uma vez, usado três: acima do depoimento,
no rodapé, na confirmação da reserva. Um `feDisplacementMap` sobre `feTurbulence` quebra a
borda, então a marca lê como tinta prensada, não como retângulo vetorial. É o único
vermelho do projeto.

**Marca conceitual** (`.ma`) — kanji grande em ouro ao lado de rótulo romanizado e
significado. Duas instâncias: 間 MA no manifesto (horizontal) e 一期一会 no omakase, este
em `writing-mode: vertical-rl` a 51px — o único lugar onde a escrita vertical deixa de ser
running head de 0,82rem e vira tipografia.

**Botões** — raio zero. `.btn--solid` marfim sobre tinta; `.btn--ghost` fio de 1px.
Nenhuma sombra em nenhum lugar do projeto.

**Links** — fio permanente em `--line-strong` mais um segundo fio em `currentColor` que
cresce da esquerda com `scaleX` em 500 ms.

**Campos** — sem caixa. Só linha de base de 1px que acende para marfim no foco, `#C2564E`
em erro, com mensagem em `#D98078` e `aria-invalid`.

---

## 6. Motion

Um momento autoral, o resto responde a quem age.

| Gesto | Implementação |
|---|---|
| Entrada do hero | manchete sobe por máscara de `overflow`, linha a linha em 200 / 310 / 420 ms; fotografia de `scale(1.07)` a 1 em 2,4 s |
| Névoa | shader fbm em WebGL, `mix-blend-mode: screen`, `opacity .45`, só no hero e só enquanto o hero está visível; se `getContext` falhar, o canvas se remove |
| Reveal de imagem | `clip-path: inset(0 0 100% 0)` → `inset(0)` com `scale(1.12 → 1)` — máscara, não fade. **A máscara fica na `<img>`, nunca no elemento observado**: clipar o wrapper a altura zero faz o `IntersectionObserver` medir ratio 0, então o observer que removeria o clip nunca dispara. O reveal trava e a imagem some para sempre — e, de quebra, `loading="lazy"` dentro de um ancestral de área zero nunca chega a pedir o arquivo |
| Stagger | o observer ordena os elementos que entram no mesmo quadro por posição vertical e escalona `--d` em 75 ms; a seção chega como um movimento só |
| Carimbo | `@keyframes stamp` — entra em `scale(1.5) rotate(-9deg)`, passa de `.96`, assenta em `rotate(-1.5deg)`. Dispara na entrada do depoimento e na confirmação da reserva |
| Parallax | quatro camadas em `translate`: hero ±50px, omakase e chef ±28px, salão ±24px. Nunca colide com o `scale` do reveal porque usa a propriedade independente. Desligado abaixo de 768px e sob reduced motion |
| Régua do kondate | cada linha do menu risca em `scaleX` da esquerda ao entrar, 1,1 s |
| Hover | imagem `scale(1.045)` em 1,1 s; sublinhado que cresce em 500 ms |

Easing padrão `cubic-bezier(.22,1,.36,1)`. Nenhuma propriedade de layout é animada.

`prefers-reduced-motion: reduce` — verificado no navegador: manchete em transform
identidade, imagem sem escala, animações a 0,001 ms, shader congelado no quadro 0, cue
parado, `scroll-behavior: auto`, todo conteúdo visível.

---

## 7. Estados

| Estado | Comportamento |
|---|---|
| Hover | links, botões, imagens de prato e origem, linhas do menu |
| Foco | `:focus-visible` com fio de 1px em `--gold` e `outline-offset: 5px`; suprimido no `h3` que recebe foco programático após a reserva |
| Erro | três campos, mensagem por campo, `aria-invalid`, foco no primeiro inválido |
| Sucesso | formulário oculto, painel com `role="status"`, selo carimbado, resumo da reserva, foco movido |
| Sem JS | `<noscript>` libera todos os reveals — verificado: sem ele, tudo abaixo do hero ficava invisível |
| Sem WebGL | canvas removido, fotografia limpa |

> **Armadilha registrada.** Todo screenshot de verificação deste projeto injetava
> `classList.add('is-in')` antes de capturar, para não esperar o scroll. Isso mascarou por
> completo o deadlock acima: as capturas mostravam a página perfeita enquanto o site real
> abria com 14 das 15 imagens invisíveis. Verificação de reveal só vale rolando de verdade,
> sem injetar estado.

---

## 8. Breakpoints

| Faixa | Comportamento |
|---|---|
| ≥1440 | manchete retoma exatamente onde o clamp base para (8rem) e segue até 9,5rem — verificado monotônico: 48 → 88 → 118 → 128 → 152px de 320 a 1920; linhas do menu com mais respiro |
| 1024–1439 | espinha, navegação horizontal, grade de 12 colunas, hero ancorado embaixo com cue à direita |
| 768–1023 | grades de 3 e 6 colunas, menu vira drawer, cabeçalhos de seção em dois eixos |
| ≤767 | hero full-bleed com **recorte retrato autoral** servido por `<picture>`: a fotografia ocupa 66svh e se dissolve na tinta da página, o bloco de texto começa em 40svh e a manchete cai dentro do preto da própria foto — a ideia do desktop, em pé |

---

## 9. Proibições deste projeto

Sombras. Raio de borda acima de 0. Gradiente como decoração. Texto em gradiente. Cards
como estrutura de página. Rótulo em cima de título. Ícone feito de emoji ou glifo unicode.
Monoespaçada como fantasia técnica. Barra de progresso no topo. Vermelho como cor de
interface. Dourado preenchendo superfície.

---

## 10. Distância até o topo do mundo

Registrado na revisão de fechamento como próximo passo, não como falha:

- **Moldura.** Um kondate é uma carta com régua. Nada na página é emoldurado; a carta como
  objeto nunca aparece.
- **Profundidade.** Fora do hero, tipografia nunca entra na fotografia. Sem sangria, sem
  sobreposição, sem camada.
- **Densidade de ornamento.** Um 間, dois fios de ouro e o selo é todo o orçamento.
