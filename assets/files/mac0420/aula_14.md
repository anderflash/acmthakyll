% Introdução à Computação Gráfica
% Marcel Jackowski<br><span class="email">mjack@ime.usp.br</span>
% Aula #14

# Objetivos

- Rasterização
    - Segmentos de reta
         - Algoritmo DDA
         - Algoritmo de Bresenham
    - Polígonos
- Representação de curvas e superfícies
    - Forma explícita
    - Forma implícita
    - Forma paramétrica
    - (Des)vantagens

# Mundo Vetorial X Mundo Raster (Pixels)

<div id="mvmr"></div>
<canvas id="mundovetorraster" width="960" height="400"></canvas>
<script type="text/javascript" src="engine3d.js"></script>
<script type="text/javascript" src="aula_14.js"></script>

# Rasterização

- Conversão de imagens vetoriais para pixels
- Produz um conjunto de fragmentos (pixels candidatos)
- Fragmentos possem atributos (posição, normal, coord. de textura...)
- Enviados para o _Fragment Shader_
- _Fragment Shader_ efetivamente colore os pixels e escolhe o pixel final.

# Desenho de Retas

- Converter os pontos extremos em pixels

<div id="desenhoretasdiv"></div>

# Algoritmo Básico

- Dado pontos extremos da linha da tela $Pt_{1}$ e $Pt_{2}$
- Calcula os coeficientes da equação

    $y = \color{blue}{m}x + \color{red}{b}$, onde $\color{blue}{m} = \frac{y_2 - y_1}{x_2-x_1}$ e $\color{red}{b} = y_1 - \color{blue}{m}x_1$

~~~~ {#mycode .ruby .numberLines startFrom="1"}
for x in x1..x2
    y = m * x + b
    desenhaPonto(x,y)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

# Exemplo

~~~~ {#mycode .javascript .numberLines startFrom="1"}
function DesenharLinha(p1, p2, cor){
  var m = (p2.y - p1.y)/(p2.x - p1.x);
  var b = p1.y - m * p1.x;
  var y, x;
  
  for(x = p1.x, y = p1.y; x <= p2.x; x++){
    desenharPixel(x, ROUND(y), cor);
    y = m*x+b;
  }
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

<svg id="exemplo1" height="300px" width="960px" viewBox="0 0 960 300"></svg>


# Desvantagens

- Multiplicação, soma e arredondamento.
- Como melhorar.

<div style="text-align:center;">
<img src="../../images/lines.jpg" style="width:300px"/>
</div>

# Usando Equação Paramétrica

- Da equação paramétrica da reta 
    - $P = Pt_1 + t (Pt_2 - Pt_1)$ 
    - t variando de 0 a 1
- $x = x_1 + t(x_2-x_1)$
- $y = y_1 + t(y_2-y_1)$

~~~~ {#mycode .matlab .numberLines startFrom="1"}
y = y1;
x = x1;
for t = 0 to 1
    desenhaPonto(x,y)
    y = y1 + t * (y2 - y1)
    x = x1 + t * (x2 - x1)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- 2 somas e 2 multiplicações
- Como melhorar?

# Usando Algoritmo DDA

- _Digital Differential Analyzer_
- DDA foi uma máquina para resolver equações diferenciais de forma numérica

    $$ \frac{dy}{dx} = m = \frac{\Delta y}{\Delta x} = \frac{y_2-y_1}{x_2-x_1}$$

- Podemos desenhá-la para cada passo $\Delta x$:

~~~~ {#mycode .javascript .numberLines startFrom="1"}
y = y1
m = (y2-y1)/(x2-x1)
for(x = x1; x <= x2; x++, y+=m)
  desenharPixel(x, ROUND(y), cor);
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

# Excluir

- Sistema de Partículas
    - Física Clássica (Newtoniana)
    - Colisões Inelásticas
- Animação (quadro a quadro)
- Transformações Geométricas
    - Movimentação da Bola
    - Movimentação das Paletas (flippers)
- Uso de composição e texturas
- Iluminação

# Elementos

- Mesa
    - Ângulo de Inclinação
    - Obstáculos
    - Textura(s)
    - Lançador de bolinhas
    - Paletas (Flippers)
- Bolinha
    - Rolando perpendicularmente ao sentido do movimento
    - Texturizado ou colorido.
    
# Exemplo de Mesa

<div style="text-align:center;"><img src="../../images/layoutmesapinball.jpg" style="width:300px"/></div>

# Física

- Força da gravidade
- Força inicial do lançamento da bola
- Força resultante da colisão com obstáculos
    - Paredes: Somente restituição (ex: perde 20%)
    - Obstáculos: X% de perda em cada tipo.
    - Paletas
        - Velocidade Angular => Vetor Força

# Interface Gráfica

<table><tr><td style="width:50%">
- Canvas do Jogo
    - Redimensionável
    - Atualize a Perspectiva
    - Mesa centralizada
- Escolher a personalização de mesa
- Número de Chances
    - 3 chances
    - Perder uma bolinha: -1 Chance
    - Perder todas: Jogo acaba

</td> <td style="width:50%; vertical-align:top">

- Pausar/Continuar o jogo
- Reiniciar o jogo
- Pontuação Atual
- Iluminação
    - Uma fonte de luz
    - Posição livre
    - Mudar a cor difusa, especular e ambiente
    - Mudar a potência da especular
- Modo Cheat
</td></tr></table>


# Modo Cheat

- Quanto ativado, permitir rotação como trackball
- Rotação influencia a inclinação
- Quando desativado, voltar à orientação original
- Botão esquerdo do mouse pressionado: iniciar rotação
- Movimento do mouse: rotacionar
- Botão esquerdo do mouse solto: finalizar rotação

# Personalização da mesa

- Quantidade, tipo, posição e rotação dos obstáculos
- Carregado de um link
    - <span class="link"><span class="linkpart">http://vision.ime.usp.br/~acmt/cg/ep2.php?token=</span>NNNNNNNN<span class="linkpart">&comando=</span>ler</span>
    - token distinto a cada dupla (recebido pelo monitor da disciplina)

<pre>
n Caverna do Dragão
a 10
b imagem.jpg
o 01140220000020701150900211718527005025231045
</pre>

<table class="tabela">
<tr><td>01</td>
    <td>140</td>
    <td>220</td>
    <td>000</td>
</tr>
<tr><td>Tipo de Objeto</td>
    <td>Posição X</td>
    <td>Posição Y</td>
    <td>Ângulo de Rotação</td>
</tr>
</table>

# Especificações

- Câmera em posição e orientação adequadas
- Skybox (céu ou sala ou ...)
- Modo Cheat: Rotacionar também o skybox
- Entregar compactado via Paca (com seus nomes)
- Entrega: 08 de Junho de 2014
- Demonstração: 11 de Junho de 2014

# Bônus - Editor de Mesa

- Permite criar uma personalização de uma mesa
- Adicionar, Remover, Mover e Girar elementos
- Salvar mesa usando o seguinte link
    - <span class="link"><span class="linkpart">http://vision.ime.usp.br/~acmt/cg/ep2.php&token=</span>NNNNNNNNN<span class="linkpart">&comando=</span>adicionar<span class="linkpart">&n=</span>NOME<span class="linkpart">&a=</span>ANGULO<span class="linkpart">&b=</span>IMAGEM<span class="linkpart">&o=</span>LISTADEOBJETOS</span>
- Remover mesa usando o seguinte link:
    - <span class="link"><span class="linkpart">http://vision.ime.usp.br/~acmt/cg/ep2.php&token=</span>NNNNNNNNN<span class="linkpart">&comando=</span>remover<span class="linkpart">&n=</span>NOME</span>
    
# Bônus - Áudio

- Sons em eventos
    - Colisões com obstáculos
    - Lançadores
    - Perder a bolinha
    - Outros (Pontos alcançados, música de fundo...)

# Avaliação

-- -------------------------------------------------------------------------------------------------------- ---------
#  Descrição                                                                                                Pontuação
01 Elementos Básicos da máquina exibidos corretamente (palhetas, esferas e lançador)                               03
02 Personalização da máquina (textura, inclinação, nome e objetos) carregado do site e exibido corretamente        05
03 Palhetas se movimentam corretamente                                                                             03
04 Palhetas impulsionam a esfera corretamente                                                                      04
-- -------------------------------------------------------------------------------------------------------- ---------

# Avaliação

-- --------------------------------------------------------------------------------- ---------
#  Descrição                                                                         Pontuação
05 Obstáculos funcionando corretamente                                                      08
06 Ao perder a esfera, uma chance é gasta e o jogo é recomeçado                             03
07 Ao perder 3 chances, o jogo termina.                                                     03
08 Pontuação funcionando corretamente                                                       05
09 Interface correta                                                                        08
10 Iluminação correta (alterando tons de textura e cores)                                   05
11 Iluminação atualizada pelos controles da interface                                       05
-- --------------------------------------------------------------------------------- ---------

# Avaliação

-- --------------------------------------------------------------------------------- ---------
#  Descrição                                                                         Pontuação
12 Skybox feito corretamente                                                                05
13 Lançador funcionando corretamente                                                        05
14 Esfera se movimenta na velocidade e aceleração corretas                                  05
15 Esfera se rola corretamente                                                              04
-- --------------------------------------------------------------------------------- ---------

# Avaliação

-- --------------------------------------------------------------------------------- ---------
#  Descrição                                                                         Pontuação
16 Dinâmica do jogo funcionando efetivamente                                                05
17 Modo Cheat feito corretamente (rotação da mesa e interface)                              05
18 Modo Cheat influencia a esfera corretamente                                              05
19 Botões pausar/continuar e reiniciar funcionando corretamente                             04
20 Demonstração feita satisfatoriamente                                                     10
-- --------------------------------------------------------------------------------- ---------

# Avaliação

-- --------------------------------------------------------------------------------- ---------
#  Descrição                                                                         Pontuação
21 Bônus – editor de mapas feito corretamente                                               50
22 Bônus – áudio funcionando corretamente                                                   50
-- --------------------------------------------------------------------------------- ---------
