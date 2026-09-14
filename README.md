# NAGORI 名残

**Japanese Contemporary Dining — São Paulo, Brasil**
Landing page conceitual para um restaurante japonês fictício de alto padrão. Peça de portfólio.

---

## O nome

**名残 — nagori.** No calendário da cozinha japonesa, os ingredientes atravessam três
estágios: *hashiri* (a primeira aparição da estação), *sakari* (o auge) e *nagori* (o
vestígio — o último e mais concentrado sabor antes de o ingrediente sumir do ano).

É um termo real do vocabulário kaiseki, e resolve o conceito inteiro da marca de uma vez:
sazonalidade obsessiva, tempo como ingrediente, e uma ponte natural entre a técnica
japonesa e o que o Brasil dá em cada época. Como marca é raro, curto e fácil de falar em
português — três coisas que "Kage" (sombra), muito usado em sushi bar no mundo todo, não
entrega da mesma forma.

---

## Direção de arte

O mundo visual não veio de "restaurante japonês de luxo". Veio do cruzamento de duas
tradições gráficas que compartilham a mesma obsessão — **間 MA, o espaço entre as coisas**:

| | |
|---|---|
| **Kondate** 献立 | A carta de curso do kaiseki: escrita vertical, fio finíssimo, margem enorme, sequência como estrutura. |
| **Poesia concreta paulistana** | Noigandres, anos 1950, São Paulo: grade rígida, tipografia como objeto espacial, silêncio entre as palavras. |

Daí saem as decisões:

- **A ordem da página é a ordem da refeição.** Não é hero → sobre → menu → galeria → contato.
- **Espinha fixa à esquerda** (≥1024px): fio de 1px com o nome da seção em escrita vertical
  (`writing-mode: vertical-rl`) e o progresso do scroll. É orientação, não decoração.
- **Vermelho profundo só como selo** (hanko), nunca como cor de interface. Aparece duas vezes na página; uma terceira ao confirmar a reserva.
- **Dourado só em fio de 1px.** O luxo vem da composição, da foto e do espaço negativo.
- **Sem cards.** Cada prato é uma composição editorial em grade de 12 colunas, alternando lado.

### Tipografia

| Papel | Fonte | Por quê |
|---|---|---|
| Display + corpo + japonês | **Shippori Mincho B1** | Uma mincho japonesa de verdade. A cultura está na letra, não em um ornamento colado por cima. |
| Navegação, rótulos, numerais | **Jost** | Linhagem Futura — a mesma geometria que os concretistas paulistas usaram. |

### Paleta

```
--ink        #090909   fundo
--ink-2      #11100E   painel
--ink-3      #16130F   painel profundo
--ivory      #F1E9DC   texto
--ash        #8C8982   texto secundário   (5.6:1 sobre --ink)
--gold       #A98A58   fios e rótulos     (6.1:1 sobre --ink)
--oxblood    #8C1D18   apenas preenchimento do selo, nunca texto sobre preto
```

---

## Estrutura

```
01  Hero            名残   fotografia full-bleed, manchete no negativo da própria foto
02  Manifesto       細部   "Cada detalhe importa" + o conceito de 間 MA
03  Omakase        お任せ   doze tempos, R$ 490, CTA
04  Pratos          一品   quatro pratos em composição editorial alternada
05  Origem          産地   Japão na técnica, Brasil na essência
06  Chef            板前   Haruo Sena, de Registro a Nihonbashi
07  Salão           空間   mosaico de arquitetura, textura e objeto
08  Menu            献立   seis momentos numerados
09  Depoimento       声   uma citação, sem estrelas
10  Reservas        予約   formulário funcional com validação e estado de sucesso
11  Rodapé
```

---

## Front-end

Sem framework, sem build, sem dependência. Abra `index.html`.

```
nagori/
├─ index.html                 HTML semântico, JSON-LD, OG, contrato de direção em comentário
├─ assets/
│  ├─ css/nagori.css          tokens → base → componentes → seções → breakpoints
│  ├─ js/nagori.js            ~250 linhas, sem libs
│  └─ img/                    15 fotografias, 36 arquivos, 1,37 MB no total
├─ CREDITS.md
└─ README.md
```

### Motion

Um momento orquestrado (o hero) e o resto responde ao usuário.

- **Entrada do hero:** manchete sobe por máscara de `overflow`, linha a linha (200/310/420 ms);
  a fotografia sai de `scale(1.07)` ao longo de 2,4 s.
- **Névoa WebGL:** shader de fbm em `mix-blend-mode: screen`, apenas no hero, apenas
  enquanto o hero está na tela (`IntersectionObserver` pausa o loop). Se o WebGL falhar,
  o canvas se remove e a foto fica limpa.
- **Reveal de imagem:** `clip-path: inset()` subindo + `scale(1.12 → 1)` — máscara, não fade.
- **Parallax:** quatro camadas, todas pequenas. A fotografia do hero desloca ±50px contra a página; omakase, chef e o salão respiram ±24–28px dentro dos próprios quadros. Anda na propriedade `translate` para nunca brigar com o `scale` do reveal — as duas ficam no compositor. Desligado abaixo de 768px (scroll de toque) e sob `prefers-reduced-motion`.
- **As réguas do menu se desenham:** cada linha do kondate risca da esquerda para a direita ao entrar, com `scaleX`. A sequência é escrita, não aparece.
- **Stagger real:** o `IntersectionObserver` ordena os elementos que entram no mesmo quadro
  por posição vertical e escalona o `--d`. A seção chega como um movimento só.
- **Grão de filme** global em `feTurbulence`, 5,5% em `overlay` — costura foto e página.
- **O selo (hanko):** um `<symbol>` SVG com filtro `feDisplacementMap` sobre `feTurbulence`, para a borda sair irregular como tinta prensada em papel, não como vetor limpo. Prensa-se em três lugares: no depoimento (com animação de carimbo na entrada), no rodapé e na confirmação da reserva. É o único vermelho da página.

### Acessibilidade

- Landmarks, `skip link`, `aria-expanded`/`aria-controls` no menu mobile, `Esc` fecha.
- Foco visível em dourado com `outline-offset`.
- Contraste AA em todo texto corrido; o vermelho nunca carrega texto.
- `prefers-reduced-motion: reduce` desliga toda animação, congela o shader no quadro 0
  e entrega todo o conteúdo já visível.
- `alt` descritivo em todas as imagens; imagens decorativas e glifos com `aria-hidden`.

### Performance

- WebP em três larguras com `srcset`/`sizes`; `fetchpriority=high` no hero, `loading=lazy`
  no resto. Total de imagens: **1,37 MB**.
- Zero JavaScript de terceiros. Uma requisição de fonte.
- Nenhuma animação de propriedade de layout — só `transform`, `opacity`, `clip-path`.
- Contêineres com `aspect-ratio`: nenhum layout shift.

### Breakpoints

| Faixa | Comportamento |
|---|---|
| ≥1440px | manchete do hero continua de onde o clamp base para (8rem) e segue até 9,5rem; linhas do menu ganham respiro |
| 1024–1439 | espinha, navegação horizontal, grade de 12 colunas, hero bottom-anchored |
| 768–1023 | grades de 3 e 6 colunas, menu vira drawer |
| ≤767 | hero full-bleed com **recorte retrato dedicado** (`hero-portrait-*`, servido por `<picture>`): o nigiri sobe para o terço superior e a manchete cai no preto da própria fotografia — a mesma ideia do desktop, em pé |

### Verificado no navegador

Auditado em **320, 360, 390, 430, 768, 834, 1024, 1280, 1440 e 1920px**: zero overflow
horizontal em todas, nenhum elemento ultrapassando o viewport. Espinha, navegação e o
indicador de scroll aparecem a partir de 1024; grades trocam em 768; formulário e reservas
em três colunas a partir de 600. Parallax medido ativo no desktop, inerte no mobile e
parado sob `prefers-reduced-motion`. Formulário, drawer, estados de erro e sucesso testados
por automação a cada rodada.

---

## O que é fictício

Tudo. Restaurante, marca, chef, endereço, telefone, preços, depoimento e horários foram
escritos para este exercício e não correspondem a nenhum negócio real. O rodapé declara
isso na própria página.

O formulário de reservas valida de verdade e mostra um estado de sucesso, mas **não tem
back-end** — nada é enviado a lugar nenhum.

Antes de qualquer uso comercial: trocar as fotografias por produção própria (ver
`CREDITS.md`), confirmar as licenças das fontes e ligar o formulário a um serviço real.
