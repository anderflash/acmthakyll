------------------------------
author: Anderson Tavares
title: Tutorial WebGL 4: Agora é em 3D
description: Criando objetos tridimensionais
tags: WebGL, OpenGL
thumbnail: assets/images/webgl-real-3d-thumb.png
biblio: library.bib
csl: ieee-with-url.csl
math: True
------------------------------

<div style="width:100%; height:30px">
<span style="float:left">[<< T03: Movimentando Formas](2014-03-01-webgl-movimentando-triangulo.html)</span>
<span style="float:right">[T05: Texturas >>](2014-03-04-webgl-texture.html)</span>
</div>

Bem vindo ao tutorial número 4 nessa série de tutoriais WebGL. Ao invés de um triângulo e um quadrado, vamos agora criar uma pirâmide e um cubo. O tutorial é baseado na [lição 4](http://learningwebgl.com/blog/?p=370) do LearningWebGL.

Veja o resultado obtido:

<iframe class="sombreado" width="640" height="360" src="//www.youtube.com/embed/Oa71cNJdkts?feature=player_embedded" frameborder="0" allowfullscreen></iframe>

<a href="http://vision.ime.usp.br/~acmt/hakyll/webgl/demo-agora-em-3d" target="_blank">Veja o resultado</a>. 
<a href="http://github.com/anderflash/webgl_tutorial" target="_blank">Baixe todos os demos</a>.

Um aviso (de novo): estas lições estão baseadas no conteúdo dado na disciplina de Introdução à Computação Gráfica do Instituto de Matemática e Estatística da USP. Mesmo assim, outras pessoas que não sejam alunos dessa disciplina podem aproveitar e compreender o conteúdo destes tutoriais. Se você não fez o [tutorial 1](2014-02-26-webgl-criando-triangulo.html), o [tutorial 2](2014-02-28-webgl-colorindo-triangulo.html) e o [tutorial 3](2014-03-01-webgl-movimentando-triangulo.html), recomendo fazê-lo antes de avançar para este tutorial. Se você se sente seguro em compreender o que se passa aqui, pode continuar. Se houver falhas ou achar que falta alguma coisa para melhorar o tutorial, não hesite em me avisar.

As diferenças entre o código desta lição e da anterior se concentram exclusivamente nas funções `animar`, `iniciarBuffers`, e `desenharCena`. Antes disso, uma pequena mudança: ao invés de rTri e rQuad, vamos renomeá-las para `rPiramide` e `rCubo` (na declaração e nos usos pelas funções).

**Tarefa:** Renomeie as variáveis (a localização está indicada nos comentários).

~~~~ {#mycode .javascript .numberLines startFrom="1"}
  /*---Edite isso na função animar---*/
  rPiramide  += ((90*diferenca)/1000.0) % 360.0;
  rCubo += ((75*diferenca)/1000.0) % 360.0;
  
  /*---Edite isso na declaração das variáveis---*/
  var rPiramide = 0;
  var rCubo = 0;
  
  /*---Edite isso na função desenharCena---*/
  mat4.rotate(mMatrix, degToRad(rPiramide), [0, 1, 0]);
  
  /*---Edite isso na função desenharCena---*/
  /*---Note o [1,1,1] ao invés de [1,0,0]---*/
  mat4.rotate(mMatrix, degToRad(rCubo), [1, 1, 1]);
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Uma pirâmide e um cubo contém mais vértices do que um triângulo e um quadrado. O código para enviar o triângulo ou a pirâmide é o mesmo (só adicionando mais vértices, posições e cores).

Vamos renomear tudo que tenha a palavra _triangle_ para colocar _piramide_ (para fazer mais sentido ao tutorial).

**Tarefa:** Mude na função `desenharCena` os nomes `triangleVertexPositionBuffer` e `triangleVertexColorBuffer` para `piramideVertexPositionBuffer` e `piramideVertexColorBuffer`.

~~~~ {#mycode .javascript .numberLines startFrom="1"}
  gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, piramideVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, piramideVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, piramideVertexPositionBuffer.numItems);
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Tarefa:** Mude também para o cubo

~~~~ {#mycode .javascript .numberLines startFrom="1"}
gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexPositionBuffer);
gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cuboVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexColorBuffer);
gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cuboVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


**Tarefa:** Renomeie também na declaração das variáveis

~~~~ {#mycode .javascript .numberLines startFrom="1"}
var piramideVertexPositionBuffer;
var piramideVertexColorBuffer;
var cuboVertexPositionBuffer;
var cuboVertexColorBuffer;
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Agora vamos mostrar algo diferente para desenhar o cubo. Há 3 estratégias para desenhá-lo:

- Usar um "fita" de triângulos (TRIANGLE_STRIP), no qual após os três pontos de um triângulo, você define apenas mais um ponto e ele forma um outro triângulo aproveitando os dois últimos pontos do triângulo anterior, fazendo esse processo repetidamente. O problema é que queremos faces de cores diferentes do cubo, e três faces compartilham um mesmo ponto no cubo, mas não é possível determinar 3 cores para o mesmo vértice.
- Desenhar as 6 faces separadamente (4 vértices cada, totalizando 24 posições e 24 cores), mas aí precisaríamos chamar o `drawArrays` 6 vezes. Imagina todo um ambiente virtual sendo desenhado dessa forma, multiplicando as chamadas `drawArrays`. É bastante custoso computacionalmente. Preferimos ter o mínimo de chamadas de desenho.
- Enviar os 8 vértices do cubo + 4 cores, e referenciá-los usando índices nos triângulos. Então os 12 triângulos do cubo (2 para cada face) fariam referência a 3 vértices e uma cor. Separando os dados dos vértices com suas referências (triângulos) faz com que você possa reusar os vértices para outros triângulos, economizando dados enviados à GPU. Obviamente você precisa adicionar as referências, mas elas são números inteiros, de poucos bytes. Vou apresentar esse modo para esclarecer um pouco (talvez seja necessário mais um ou dois tutoriais para compreender a real vantagem disso, não se preocupe).

Não vamos mais usar o `drawArrays`, e sim `drawElements`. É que o primeiro trabalha diretamente com os vértices, e o segundo trabalha com índices, referências aos vértices. Então precisamos:

- Criar o buffer para os índices desses vértices;
- Usá-los no momento do desenho.

Para usá-los, simplesmente execute o `bindBuffer` nesse _buffer_ dos índices (para o cubo, vamos chamar de `cuboVertexIndexBuffer`).

**Tarefa:** Renomeie também na declaração das variáveis

~~~~ {#mycode .javascript .numberLines startFrom="1"}
/*---Troque também gl.ARRAY_BUFFER por gl.ELEMENT_ARRAY_BUFFER---*/
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cuboVertexIndexBuffer);
setMatrixUniforms();
gl.drawElements(gl.TRIANGLES, cuboVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

O tipo do buffer para os índices é o `ELEMENT_ARRAY_BUFFER` ao invés de `ARRAY_BUFFER`.

A função `drawElements` precisa do tipo de polígono a ser desenhado, o número de polígonos (você não é obrigado a desenhar todos os triângulos naquele momento), o tipo de dado (os índices geralmente são guardados como inteiros não-negativos de 1 byte - *UNSIGNED_BYTE* - ou 2 bytes - *UNSIGNED_SHORT*) e a referência para o buffer (com o bindBuffer, não precisamos dessa opção).

**Tarefa:** Adicione a declaração da variável para o buffer de índices do cubo.

~~~~ {#mycode .javascript .numberLines startFrom="1"}
var piramideVertexPositionBuffer;
var piramideVertexColorBuffer;
var cuboVertexPositionBuffer;
var cuboVertexColorBuffer;
/*--Adicione esta linha--*/
var cuboVertexIndexBuffer;
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Vamos atualizar os buffers lá na função `iniciarBuffers`.

**Tarefa:** Renomeie as variáveis e edite os vértices e índices dos buffers na função `iniciarBuffers` (buffer de posição)

~~~~ {#mycode .javascript .numberLines startFrom="1"}
piramideVertexPositionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexPositionBuffer);
var vertices = [
    // Frente
      0.0,  1.0,  0.0,
    -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,
    // Direita
      0.0,  1.0,  0.0,
      1.0, -1.0,  1.0,
      1.0, -1.0, -1.0,
    // Trás
      0.0,  1.0,  0.0,
      1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,
    // Esquerda
      0.0,  1.0,  0.0,
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
piramideVertexPositionBuffer.itemSize = 3;
piramideVertexPositionBuffer.numItems = 12; // Mudar
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Tarefa:** Renomeie as variáveis e edite os vértices e índices dos buffers na função `iniciarBuffers` (buffer de cores)

~~~~ {#mycode .javascript .numberLines startFrom="1"}
piramideVertexColorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexColorBuffer);
var cores = [
    // Frente
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    // Direita
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    // Trás
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    // Esquerda
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cores), gl.STATIC_DRAW);
piramideVertexColorBuffer.itemSize = 4;
piramideVertexColorBuffer.numItems = 12; // Mudar
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Tarefa:** Agora para o cubo => Renomeie as variáveis e edite os vértices e índices dos buffers na função `iniciarBuffers` (buffer de posições)

~~~~ {#mycode .javascript .numberLines startFrom="1"}
cuboVertexPositionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexPositionBuffer);
vertices = [
  // Frente
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,

  // Trás
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,

  // Topo
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,

  // Base
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // Direita
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,

  // Esquerda
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
cuboVertexPositionBuffer.itemSize = 3;
cuboVertexPositionBuffer.numItems = 24; // Mudar
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

No OpenGL (e WebGL) se dois vértices tiverem qualquer um dos atributos diferentes entre si (posição ou cor ou coordenada de textura ou ...), mesmo que todos os outros sejam idênticos, então eles são diferentes vértices. Nesse exemplo, os dados que se repetem são as cores (4 vezes). Então vamos criar as cores distintas e replicá-los.

**Tarefa:** Renomeie as variáveis e edite os vértices e índices dos buffers na função `iniciarBuffers` (buffer de cores)

~~~~ {#mycode .javascript .numberLines startFrom="1"}
cuboVertexColorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexColorBuffer);
cores = [
  [1.0, 0.0, 0.0, 1.0],     // Frente
  [1.0, 1.0, 0.0, 1.0],     // Trás
  [0.0, 1.0, 0.0, 1.0],     // Topo
  [1.0, 0.5, 0.5, 1.0],     // Base
  [1.0, 0.0, 1.0, 1.0],     // Direita
  [0.0, 0.0, 1.0, 1.0],     // Esquerda
];
var coresReplicadas = [];
for (var i in cores) {
  var cor = cores[i];
  for (var j=0; j < 4; j++) {
    coresReplicadas = coresReplicadas.concat(cor);
  }
}
/*---Veja que coresReplicadas está sendo usado, e não cores---*/
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coresReplicadas), gl.STATIC_DRAW);
cuboVertexColorBuffer.itemSize = 4;
cuboVertexColorBuffer.numItems = 24;
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

E agora vamos criar os nossos índices para desenhar nosso cubo. Se um triângulo precisar dos vértices que estão na segunda, quarta e quinta posições do buffer (de posição ou de cor), então precisamos inserir os valores 1, 3 e 4 (o primeiro está no índice 0).

**Tarefa:** Adicione esse código abaixo do último código supracitado na função `iniciarBuffers`.

~~~~ {#mycode .javascript .numberLines startFrom="1"}
cuboVertexIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cuboVertexIndexBuffer);
var indices = [
  0, 1, 2,      0, 2, 3,    // Frente
  4, 5, 6,      4, 6, 7,    // Trás
  8, 9, 10,     8, 10, 11,  // Topo
  12, 13, 14,   12, 14, 15, // Base
  16, 17, 18,   16, 18, 19, // Direita
  20, 21, 22,   20, 22, 23  // Esquerda
]
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
cuboVertexIndexBuffer.itemSize = 1;
cuboVertexIndexBuffer.numItems = 36;
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Lembra do UNSIGNED_SHORT? Ele usa 2 bytes (16 bits), por isso estamos usando Uint16Array.

**Exercícios**:

- Se o cubo for de apenas uma cor, a variável `vertices` só precisa de 8 vértices e `cores` de 1 cor (o número de índices é o mesmo usando `gl.TRIANGLES`). Tente fazer isso.

<div style="width:100%; height:30px">
<span style="float:left">[<< T03: Movimentando Formas](2014-03-01-webgl-movimentando-triangulo.html)</span>
<span style="float:right">[T05: Texturas >>](2014-03-04-webgl-texture.html)</span>
</div>