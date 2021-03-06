% Introdução à Computação Gráfica
% Anderson Tavares<br><span class="email">acmt@ime.usp.br</span>
% EP #2: It's pinball time!

<div style="text-align:center;"><img src="../../images/pinball.jpg" style="width:800px"/></div>

# Objetivos

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

-- --------------------------------------------------------------------------------- ---------
#  Descrição                                                                         Pontuação
01 Elementos Básicos da máquina exibidos corretamente (palhetas, esferas e lançador)        05
02 Personalização da máquina carregado do site e exibido corretamente                       05
   (selecionando a personalização)                                                          05
03 Personalização da máquina carregado em arquivo e exibido corretamente.                   05
   (textura, inclinação, nome e objetos posicionados e rotacionados)                        05
04 Palhetas se movimentam corretamente                                                      05
-- --------------------------------------------------------------------------------- ---------

# Avaliação

-- --------------------------------------------------------------------------------- ---------
#  Descrição                                                                         Pontuação
05 Palhetas impulsionam a esfera corretamente                                               05
06 Obstáculos funcionando corretamente                                                      05
07 Ao perder a esfera, uma chance é gasta e o jogo é recomeçado                             05
08 Ao perder 3 chances, o jogo termina.                                                     05
09 Pontuação funcionando corretamente                                                       05
10 Interface correta                                                                        05
-- --------------------------------------------------------------------------------- ---------

# Avaliação

-- --------------------------------------------------------------------------------- ---------
#  Descrição                                                                         Pontuação
11 Iluminação correta (alterando tons de textura e cores)                                   05
12 Iluminação atualizada pelos controles da interface                                       05
13 Lançador funcionando corretamente                                                        05
14 Esfera se movimenta na velocidade e aceleração corretas                                  05
15 Esfera se rola corretamente                                                              05
-- --------------------------------------------------------------------------------- ---------

# Avaliação

-- --------------------------------------------------------------------------------- ---------
#  Descrição                                                                         Pontuação
16 Dinâmica do jogo funcionando efetivamente                                                05
17 Modo Cheat feito corretamente (rotação da mesa e interface)                              05
18 Modo Cheat influencia a esfera corretamente                                              05
19 Botões pausar/continuar e reiniciar funcionando corretamente                             05
20 Demonstração feita satisfatoriamente                                                     05
-- --------------------------------------------------------------------------------- ---------

# Avaliação

-- --------------------------------------------------------------------------------- ---------
#  Descrição                                                                         Pontuação
21 Bônus – editor de mapas feito corretamente                                               05
22 Bônus – áudio funcionando corretamente                                                   05
-- --------------------------------------------------------------------------------- ---------
