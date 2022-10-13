// Блин, я забыл в чем тут суть круглых скобок... Один ведь хрен шаблонная строка. В чем вообще суть круглых скобок? (кроме приоритетов... фокус с IIFE) Выражение возвращают?

const layoutStart = (`

  <!-- НАЧАЛО layoutStart -->

  <link
    rel="stylesheet" 
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" 
    integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" 
    crossorigin="anonymous"
  />

  <div class="container pt-5">

  <!-- КОНЕЦ layoutStart -->
`);

const layoutEnd = `
  <!-- НАЧАЛО layoutEnd -->

  </div>

  <!-- КОНЕЦ layoutEnd -->
`

module.exports = { layoutStart, layoutEnd };