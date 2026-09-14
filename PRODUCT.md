# PRODUCT — Nagori

## O que é

Landing page de marca para o **Nagori**, um restaurante japonês contemporâneo fictício em
São Paulo. Superfície única, modo **Persuade**: o visitante decide e reserva.

O projeto é uma **peça de portfólio**, não um site comercial em operação. O critério de
sucesso é ser apresentável como case profissional — não gerar reservas reais.

## Público

Quem já come em restaurante japonês caro em São Paulo e escolhe pela mão do chef, não pelo
cardápio. Chega pelo Instagram ou por indicação, quase sempre à noite, quase sempre no
celular, decidindo onde jantar nos próximos dias. Segundo público, igualmente importante
aqui: diretores de arte e recrutadores avaliando o projeto como trabalho.

## O que o visitante precisa entender, acreditar e fazer

- **Entender:** balcão de doze lugares, omakase de doze tempos, técnica japonesa com
  pescados e cítricos brasileiros, R$ 490 por pessoa.
- **Acreditar:** que a precisão é real. Provada pelas mãos, pela faca, pela origem
  nomeada dos ingredientes e pela biografia do chef — não por adjetivos.
- **Fazer:** reservar.

## Decisões tomadas com o cliente

| Decisão | Escolha | Por quê |
|---|---|---|
| Nome da marca | **NAGORI 名残** (sobre a sugestão original "KAGE") | Termo real do vocabulário kaiseki para o fim da estação, o vestígio. Resolve sazonalidade, tempo e a ponte Brasil×Japão de uma vez. "Kage" (sombra) é nome muito usado em sushi bar mundo afora. |
| Nível de 3D | **Sutil** | Véu de névoa em WebGL apenas no hero. Sem objeto 3D protagonista, que ofuscaria a fotografia gastronômica. |
| Idioma | Português do Brasil | Palavras japonesas pontuais, sempre com contexto. |
| Fotografia | Escura, cinematográfica, contraste alto | Banco de imagens com gradação própria unificada; a substituir por produção autoral antes de uso comercial. |

## Compromissos de marca (pinados pelo cliente, não negociáveis)

- Paleta: `#090909`, `#11100E`, marfim `#F1E9DC`, branco suave `#F7F5F0`, vermelho profundo
  `#8C1D18`, dourado queimado `#A98A58`, cinza `#8C8982`. Dourado e vermelho com parcimônia.
- Serif editorial para títulos + sans minimalista para navegação e função.
- Onze seções nomeadas: hero, manifesto, omakase, pratos, Brasil×Japão, chef, atmosfera,
  menu degustação, depoimento, reservas, rodapé.
- Preços e textos ficcionais fornecidos no briefing, mantidos.
- Motion de 400–800 ms, `prefers-reduced-motion` respeitado.
- Responsivo específico em 1440+, 1024–1439, 768–1023, 320–767 — mobile não pode ser uma
  redução do desktop.
- Sem aparência de template de restaurante, sem visual de SaaS, sem excesso de cards.

## Restrições técnicas

- Sem framework, sem build, sem dependência de terceiros. Abre por `file://`.
- Sem back-end: o formulário de reservas valida e confirma no cliente.
- Nenhuma ferramenta de geração de imagem disponível no ambiente — toda a fotografia é
  selecionada e gradada, não gerada.

## O que é ficcional

Restaurante, marca, chef (Haruo Sena), crítica (Marina Prado), endereço, telefone, e-mail,
preços, horários e depoimento. Declarado na própria página, no rodapé, e detalhado em
`CREDITS.md`.
