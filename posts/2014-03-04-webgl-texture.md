------------------------------
author: Anderson Tavares
title: Tutorial WebGL 5: Texturas
description: Aplicação de Texturas aos Objetos
tags: WebGL, OpenGL
thumbnail: assets/images/webgl-texture-thumb.png
biblio: library.bib
csl: ieee-with-url.csl
math: true
------------------------------

<div style="width:100%; height:30px">
<span style="float:left">[<< T04: Agora em 3D](2014-03-02-webgl-real-3d.html)</span>
<span style="float:right">[T06: Teclado e Filtro de Texturas >>](2014-03-05-webgl-keyboard-filter.html)</span>
</div>

Bem vindo ao tutorial número 5 nessa série de tutoriais WebGL. Dessa vez vamos aplicar uma textura no objeto, ou seja, daremos uma roupagem mais complexa do que uma simples cor, sem precisar modelar cada pedaço do objeto. Por exemplo, para modelar uma pedra, você não precisa modelar tamanha complexidade (a menos que você use [fractais](http://pt.wikipedia.org/wiki/Fractal) para adicionar realismo, mas fractal é custoso computacionalmente). Basta apenas tirar uma foto de uma pedra e aplicá-la em cima de um poliedro com poucos polígonos. Em um muro você não precisa modelar todos os detalhes dos tijolos, basta uma foto de um pequeno grupo de tijolos e aplicá-lo a um paralelepípedo do tamanho do muro (repetindo a foto).

Veja o resultado obtido:

<iframe class="sombreado" width="640" height="360" src="//www.youtube.com/embed/KF8nxNGBOYg?feature=player_detailpage" frameborder="0" allowfullscreen></iframe>

<a href="http://vision.ime.usp.br/~acmt/hakyll/webgl/demo-textura" target="_blank">Veja o resultado</a>. 
<a href="http://github.com/anderflash/webgl_tutorial" target="_blank">Baixe todos os demos</a>.

Um aviso (de novo): estas lições estão baseadas no conteúdo dado na disciplina de Introdução à Computação Gráfica do Instituto de Matemática e Estatística da USP. Mesmo assim, outras pessoas que não sejam alunos dessa disciplina podem aproveitar e compreender o conteúdo destes tutoriais. Faça os tutoriais anteriores para melhor compreensão do que está acontecendo. O código mostrado é apenas a diferença para o [tutorial 4](2014-03-02-webgl-real-3d.html). Se houver falhas ou achar que falta alguma coisa para melhorar o tutorial, não hesite em me avisar.

Há um capítulo inteiro no livro [Interactive Computer Graphics: A Top-Down Approach with Shader-Based OpenGL](http://www.amazon.com/Interactive-Computer-Graphics-Top-Down-Shader-Based/dp/0132545233/ref=pd_sim_b_4/190-6068278-8888545?ie=UTF8&refRID=00S3HRHWSJDJFNXMK0P9) sobre imagens e texturas. De uma forma prática, você pode pensar na textura como uma forma de colorir os fragmentos na etapa do processo do _shader_ de fragmentos. Então precisamos enviar a imagem para a GPU para que possa ser usada no shader de fragmentos. Além disso, cada vértice precisa conter sua posição na textura. Imagine a imagem contendo um sistema de coordenadas 2D, com cada posição sendo uma tupla (s,t). Também pode ser denominada de coordenada UV.

Vamos começar do ínicio: criando uma função `iniciarTextura`. 

**Tarefa:** Adicione a chamada para `iniciarTextura` em `iniciaWebGL`

~~~~ {#mycode .javascript .numberLines startFrom="1"}
  function iniciaWebGL()
  {
    var canvas = $('#licao01-canvas')[0];
    iniciarGL(canvas); // Definir como um canvas 3D
    iniciarShaders();  // Obter e processar os Shaders
    iniciarBuffers();  // Enviar o triângulo e quadrado na GPU
    iniciarAmbiente(); // Definir background e cor do objeto
    /*---Adicione esta linha---*/
    iniciarTextura();
    tick();
  }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Agora vamos ver como é essa função. Vamos usar o próprio objeto `Image` do JavaScript para recuperar uma imagem do site.

**Tarefa:** Adicione a função `iniciarTextura` e uma variável global para guardar a textura.

~~~~ {#mycode .javascript .numberLines startFrom="1"}
  var uspTextura;
  function iniciarTextura()
  {
    uspTextura = gl.createTexture();
    uspTextura.image = new Image();
    uspTextura.image.onload = function()
    {
      tratarTextura(uspTextura);
    }
    uspTextura.image.src = "usp.jpg";
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

  }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Essa parte simplesmente cria uma textura, cria uma variável dentro dela para guardar um novo objeto `Image` que carregará uma imagem. JavaScript trabalha com eventos. Estamos programando o tratamento da imagem carregada apenas quando ela for efetivamente carregada (o início do carregamento se dá quando você altera a propriedade `src` do objeto `Image`).

Além disso, precisamos saber a referência para o _uniform_ para o shader referenciar a imagem e usá-lo para colorir os fragmentos. Lá no shader de fragmento, o nosso uniform contém o nome `uSampler`. Como é uma imagem só, não há problema um nome genérico para esse tutorial, mas para um projeto complexo, é mais interessante dar um nome mais útil e representativo.


Depois de carregada, precisamos lançá-la para a GPU. Além disso, precisamos responder as perguntas:
- e se o objeto 3D for muito grande, vamos ver os pixels individuais quadriculados? Eu posso borrá-los para evitar ficar tão feio?
- e se o objeto 3D estiver muito pequeno na tela (por exemplo, quando ele estiver longe), os pixels vizinhos da textura vão se degladiar para saber quem vai ser a cor daquele fragmento?
- e se o objeto 3D for um muro e eu só tiver a foto de um tijolo, eu posso repetir a foto para ter um aspecto de vários tijolos?
- eu soube que o formato Bitmap e Gif guardam a primeira linha da imagem por último. Como eu faço para que a textura não fique de cabeça para baixo?

Na verdade existem várias outras perguntas relacionadas à textura. A terceira pergunta vou deixar como um exercício. E lá vai o código.

**Tarefa:** Adicione a função `tratarTextura`.

~~~~ {#mycode .javascript .numberLines startFrom="1"}
function tratarTextura(textura) {
    gl.bindTexture(gl.TEXTURE_2D, textura);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textura.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Estamos utilizando uma textura bidimensional (TEXTURE_2D), mas poderíamos usar os _voxels_, uma variante dos pixels para 3 dimensões. Quem conhece o Minecraft pode imaginar como são os _voxels_, que também são bastante usados para imagens médicas, para transformar tomografias em objetos tridimensionais. Os _voxels_ são referenciados como TEXTURE_3D. O problema é que OpenGL ES (por onde o WebGL está baseado e que é uma versão mais enxuta do OpenGL) não especifica o tipo TEXTURE_3D do OpenGL. Uma modo de contornar isso é transformando seus voxels em fatias de pixels e guardá-los em uma matriz, como esta [solução](http://gamedev.stackexchange.com/questions/34110/how-can-i-implement-3d-textures-using-webgl).

Há uma opção o WebGL para determinar se a coordenada Y está invertida. No nosso caso ela não está. O comando que envia a textura para a GPU é o `texImage2D`. Precisamos dizer que tipo de textura estamos enviando, o nível de textura (usado na técnica Level-Of-Detail, vamos cobrir isso no próximo tutorial, apenas usaremos o nível 0), o espaço de cores do arquivo, o espaço de cores que queremos mandar para o shader, o tamanho em bytes de cada pixel e a referência para a matriz dos pixels (na verdade os pixels de textura são melhores chamados de _texels_ para diferenciar dos pixels dos fragmentos).

Depois podemos configurar várias propriedades da imagem. A primeira delas é referente à ampliação da textura na tela. Se o objeto 3D estiver muito perto da câmera, veremos uma parte muito pequena da textura. Para não ver os pixels quadriculados, podemos borrar a imagem, tornando mais suave ao vê-la de perto (TEXTURE_MAG_FILTER). Nesse caso estamos definindo a cor de um pixel a partir do texel vizinho mais próximo da coordenada especificada (NEAREST).

Ao ver o objeto de longe (TEXTURE_MIN_FILTER), ela se tornará pequena devido à perspectiva (ou uma escala). Então não há espaço nos polígonos para tantos texels. Precisamos escolher poucos deles. O problema é que essa escolha pode mudar drasticamente se movimentarmos o objeto3D no ambiente, criando um efeito não muito agradável. Esse é o efeito do NEAREST. Veremos como utilizar outros filtros que melhoram esse aspecto.

Finalizado o trabalho na imagem, desvinculamos a textura para as próximas operações (poderíamos vincular outras texturas).

Nós apenas enviamos a imagem para a GPU. Falta começar a aplicá-lo para o cubo. Precisamos adicionar as coordenadas de textura para cada vértice. Ele será o novo atributo do vértice. Mas então não precisamos mais definir as cores. E como estamos trabalhando apenas com o cubo, vamos também destruir tudo o que relaciona com a pirâmide.

**Tarefa:** Remova todo o código para a pirâmide e remova também o buffer de cores do cubo. Adicione o buffer de coordenadas de textura na função `iniciarBuffers`.

~~~~ {#mycode .javascript .numberLines startFrom="1"}
cuboVertexTextureCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexTextureCoordBuffer);
var coordTextura = [
  // Frente
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,

  // Trás
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  0.0, 0.0,

  // Topo
  0.0, 1.0,
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,

  // Base
  1.0, 1.0,
  0.0, 1.0,
  0.0, 0.0,
  1.0, 0.0,

  // Direita
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  0.0, 0.0,

  // Esquerda
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordTextura), gl.STATIC_DRAW);
cuboVertexTextureCoordBuffer.itemSize = 2;
cuboVertexTextureCoordBuffer.numItems = 24;

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Assim como as posições e cores são atributos do vértices, as coordenadas de textura também são. Assim como posições e cores são ARRAY_BUFFER, as coordenadas de textura também são. Tente tratar as cores, posições e coordenadas de textura de forma semelhante (obviamente mudando a quantidade de dados e seu tamanho).

**Por que só tem 0.0 e 1.0 neste buffer?** Os texels podem ser referenciados dentro da faixa de valores reais [0.0, 1.0], onde 0.0 é o lado esquerdo da textura, e 1.0 é o extremo direito. Queremos aplicar toda a imagem em cada face. Mas se você estiver modelando um rosto, você provavelmente vai referenciar texels intermediários para o nariz, boca, olhos,...

Ok, vamos agora trabalhar na função `desenharCena`. Vamos retirar tudo que é da pirâmide, deixar o cubo centralizado e vamos usar três ângulos para rotacionar o cubo de forma independente nos três eixos.

**Tarefa:** remova tudo que é pirâmide, remova a variável `rPiramide` e substitua `rCubo` por `xRot`, `yRot` e `zRot`.

~~~~ {#mycode .javascript .numberLines startFrom="1"}
var xRot = 0;
var yRot = 0;
var zRot = 0;

function desenharCena()
{
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
  mat4.identity(mMatrix);
  mat4.identity(vMatrix);
  
  /*---Retire as chamadas para mPushMatrix e mPopMatrix---*/
  
  /*---Altere a translação---*/
  mat4.translate(mMatrix, [0.0, 0.0, -5.0]);
  
  /*---Remova a antiga rotação do cubo---*/
  /*---Adicione estas 3 linhas---*/
  mat4.rotate(mMatrix, degToRad(xRot), [1, 0, 0]);
  mat4.rotate(mMatrix, degToRad(yRot), [0, 1, 0]);
  mat4.rotate(mMatrix, degToRad(zRot), [0, 0, 1]);

  gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cuboVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  /*---substitua cuboVertexColorBuffer por cuboVertexTextureCoordBuffer---*/
  /*---substitua vertexColorAttribute por vertexTextureCoordAttribute---*/
  gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexTextureCoordAttribute, cuboVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

E agora vamos dizer antes de desenhar o cubo qual é a textura que será usada.

**Tarefa:** Adicione o código para ativar a textura
  
~~~~ {#mycode .javascript .numberLines startFrom="1"}
  /*---Adicione estas 3 linhas antes de drawElements---*/
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, uspTextura);
  gl.uniform1i(shaderProgram.samplerUniform,0);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cuboVertexIndexBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, cuboVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT,0);
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

O WebGL pode referenciar 32 texturas (gl.TEXTURE0 A gl.TEXTURE31). estas referências são guardadas em registros. Os shaders não utilizam diretamente as texturas que enviamos, mas sim os registros. Então precisamos associar a textura enviada à GPU para um desses registros (as duas primeiras linhas fazem isso). A terceira linha associa o shader ao registro. O jargão certo ainda não é esse, pois o shader é todo o script, então na verdade ele associa o unit texture (que é a _uniform_ no shader) ao registro. Lembra ainda o que é _uniform_? É uma variável comum aos vértices e fragmentos. Então toda a imagem fica disponível para qualquer vértice e fragmento, não apenas um texel. Ou seja, ainda no _fragment shader_ você pode brincar com a imagem, aplicando algum filtro de processamento de imagens, por exemplo.

Se você tiver duas imagens, você precisa especificar dois registros para elas e duas associações entre textura-registro e registro-unit texture.

Vamos agora editar os shaders para remover as cores e adicionar as referências à textura.

**Tarefa:** Edite o shader de vértices

~~~~ {#mycode .c .numberLines startFrom="1"}
attribute vec3 aVertexPosition;
/*---Substitua a cor pela coord. 
de textura---*/
attribute vec2 aTextureCoord;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

/*---A saída não é mais a cor,
e sim a coordenada de textura---*/
varying vec2 vTextureCoord;

void main(void)
{
  gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
  /*---A saída vai ser a textura---*/
  vTextureCoord = aTextureCoord;
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Se a textura são para fragmentos, por que você adicionou referências no vertex shader?** Se eu tenho um triângulo com três vértices, os fragmentos intermediários precisam ter coordenadas de textura intermediárias, e isso é obtido com a interpolação. E é a saída do _vertex shader_ que é interpolada. Ex: no meio dos vértices com coordenadas de textura (0,0) e (1,1), o fragmento deve ter a coordenada de textura (0.5, 0.5), mesmo que não tenha sido especificado no buffer de coordenadas de textura.

E agora o shader de fragmentos.

**Tarefa:** Edite o shader de vértices

~~~~ {#mycode .c .numberLines startFrom="1"}
precision mediump float;
/*---A entrada agora é a textura
interpolada, não a cor---*/
varying vec2 vTextureCoord;

/*---Precisamos da imagem---*/
uniform sampler2D uSampler;

void main(void)
{
  /*---Queremos o texel do uSampler
  na posição (s,t)---*/
  gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Lá no `iniciarShaders`, precisamos capturar a referência ao atributo `aTextureCoord`.

**Tarefa:** Edite a função `iniciarShaders` removendo a referência do atributo da cor e adicionando a referência do atributo da coordenada de textura.

~~~~ {#mycode .javascript .numberLines startFrom="1"}
gl.useProgram(shaderProgram);

shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

/*---Edite estas linhas---*/
/*---aVertexColor => aTextureCoord---*/
/*---vertexColorAttribute => vertexTextureCoordAttribute---*/
shaderProgram.vertexTextureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
gl.enableVertexAttribArray(shaderProgram.vertexTextureCoordAttribute);

shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Para acabar, falta definir as rotações.

**Tarefa:** Atualize as rotações na função `animar`

~~~~ {#mycode .javascript .numberLines startFrom="1"}
function animar()
{
  var agora = new Date().getTime();
  if(ultimo != 0)
  {
    var diferenca = agora-ultimo;
    /*---remova rPiramide e rCubo---*/
    /*---adicione estas linhas---*/
    xRot  += ((90*diferenca)/1000.0) % 360.0;
    yRot  += ((75*diferenca)/1000.0) % 360.0;
    zRot  += ((50*diferenca)/1000.0) % 360.0;
  }
  ultimo = agora;
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Com isso você agora pode ver seu cubo texturizado. Uma nota importante: é necessário colocar o tamanho de sua textura como potências de 2, já que OpenGL ES e WebGL tem essa limitação. Se sua textura não tiver tamanho  como potência de 2, crie uma imagem maior que seja potência de 2, coloque a sua imagem dentro e preencha o resto de outra cor (ou outras texturas formando um [atlas](https://www.google.com.br/search?q=opengl+atlas&client=firefox-a&hs=Wd0&rls=org.mozilla:en-US:official&channel=sb&source=lnms&tbm=isch&sa=X&ei=aS4VU5XREYS4kQf7zIH4Cw&ved=0CAoQ_AUoAg&biw=784&bih=671#channel=sb&q=texture+atlas&rls=org.mozilla:en-US:official&tbm=isch), muito eficiente para carregar várias texturas de uma vez)

Existe uma infinidade de material a respeito de texturas. Vale a pena estudá-los um pouco, inclusive seu aspecto matemático, como o teorema da amostragem, todo o arsenal de filtros de processamento de imagens, sinais e sistemas, Fourier, Wavelets e tantos mais. Abraços.

**Exercícios**:

- E se quisermos ressucitar a pirâmide, e quiséssemos texturizar com a mesma imagem? E se fosse outra imagem, como você gerenciaria as duas imagens?

<div style="width:100%; height:30px">
<span style="float:left">[<< T04: Agora em 3D](2014-03-02-webgl-real-3d.html)</span>
<span style="float:right">[T06: Teclado e Filtro de Texturas >>](2014-03-05-webgl-keyboard-filter.html)</span>
</div>