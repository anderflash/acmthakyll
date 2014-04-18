------------------------------
author: Anderson Tavares
title: Tutorial WebGL 6: Teclado e filtro de texturas
description: Manipulando o teclado e adicionando alguns filtros nas texturas
tags: WebGL, OpenGL
thumbnail: assets/images/webgl-keyboard-filter-thumb.png
biblio: library.bib
csl: ieee-with-url.csl
math: true
------------------------------

Oi pessoal, neste post ensinarei como interpretar um objeto no formato OBJ para usá-los nas nossas aplicações em WebGL. O que precisamos fazer é: carregar o arquivo e ler seu conteúdo, iterar pelo conteúdo para obter os vértices, normais e coordenadas de textura (se houver), carregar os materiais (as referências de texturas), e construir as nossas faces. O interpretador (_parser_) será feito de um modo simples, provavelmente não funcionará para todos as configurações possíveis no formato OBJ. Além disso há outros aspectos dentro do formato que não abordaremos, como transparência e faces quadradas.

Primeiramente comece com um arcabouço em HTML para carregar nosso script.

~~~~ {#mycode .html .numberLines startFrom="1"}
<html>
  <head>
    <script src=""></script>
  </head>
  <body></body>
</html>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

# Usando o FileReader

# Lendo o arquivo
