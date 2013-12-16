% Métodos para Detecção de Fixações, Sacadas e Outros Movimentos do Olhar
% Anderson C. M. Tavares
% Universidade de São Paulo

# Introdução


Rastreamento do olhar é uma área que estuda o comportamento do olhar, analisando o processamento visual e cognitivo da pessoa. Os movimentos do olhar são coletados por equipamentos denominados rastreadores de olhar (*eye trackers*) para análise, comparação e para desenvolver sistemas mais interativos.

Dependendo da taxa de amostragem do equipamento e da aplicação pretendida, a quantidade de dados coletados poder ser muito grande para sua análise. Nesse caso é necessária uma transformação destes dados em informações do processamento visual e cognitivo durante o experimento. Tal transformação é denominada identificação ou classificação dos movimentos do olhar.

Os rastreadores basicamente informam a coordenada bidimensional de cada ponto coletado e seu *timestamp*. Outras propriedades também podem ser informadas, como o diâmetro da pupila. As amostras configuram uma série temporal. Os dados de tempo e espaço podem ser usados para analisar os movimentos.

O objetivo deste trabalho é levantar uma lista de métodos de identificação de fixações e sacadas. Outros movimentos do olhar que sejam também classificados por esses métodos também serão citados.

A seção [Movimentos] define os movimentos do olhar. A seção [Filtros] mostra os filtros utilizados como pré-processamento da classificação dos movimentos. A seção [Métodos] descrevem os algoritmos estudados. A seção [Avaliação dos Métodos] mostra algumas métricas e técnicas de avaliação criados para comparar e validar resultados dos algoritmos de identificação. A seção [Conclusão] finaliza o texto e levanta tarefas e trabalhos futuros.

# Movimentos

Os movimentos do olhar podem ser:

- **Fixações**: Para Salvucci [@Salvucci2000] e Karrsgard[@Karrsgard2003], uma fixação é uma pausa sobre regiões de interesse.
- **Sacadas**: Um rápido movimento entre fixações [@Salvucci2000, @Karrsgard2003];
- **Movimentos fixacionais**: O olho não fica parado durante uma fixação, todavia ocorrem pequenos movimentos, como *drifts* (desvios do foco para fora do alvo durante a fixação), tremores (rápidos, de baixa amplitude e involuntários), microssacadas (correções dos *drifts* e renovação do estímulo na retina) e nystagmus (patologia periódica composta por movimentos suaves e rápidos alternadamente, que pode provocar tontura e sensação de movimento em objetos estáticos).
- **Perseguição Contínua**: O movimento do olho acompanhando um alvo em movimento é denominado *perseguição contínua*, *perseguição suave*, ou simplesmente *perseguição*.
- **Glissadas**: No fim da sacada, geralmente o olho não para no ponto desejado, e sim ele o passa. Dessa forma, ele faz um pequeno movimento senoidal para corrigir e fixar-se no ponto. Esse movimento é denominado *glissada*.

# Filtros

A análise de dados do olhar é dividida em duas partes: filtragem e classificação. Os ruídos também são divididos em duas categorias:

- Ruídos provenientes do equipamento;
- Movimentos do olhar que não estão sendo analisados.

Os filtros servem para remover, ou pelo menos reduzir, o primeiro tipo de ruído. A classificação elimina o segundo tipo. Essa separação em duas etapas faz com que os métodos de classificação sejam mais independentes dos equipamentos e suas características.

Alguns filtros utilizandos na literatura são:

- Filtro \gls{FIR} [@Olsson2007];
- Filtro de Média [@Olsen2012];
- Filtro de Mediana [@Olsen2012];
- Filtro Savitzky-Golay [@Nystrom2010];
- Filtro de Kalman [@Sauter1991].

Filtros de média e mediana permitem reduzir o nível de ruído. Eles são usados pelo sistema da Tobii [@Olsen2012]. O filtro da média aumenta a duração da sacada, reduzindo sua velocidade e reduzindo a duração das fixações podendo comprometer as identificações, além de criar falsos pontos que não foram detectados pelo equipamento. O filtro da mediana não cria falsos pontos, o resultado do filtro são pontos existentes das amostras coletadas, não interfere na amplitude da sacada e na sua duração (mantendo a mudança brusca de posições durante a sacada).

\renewcommand{\sectionbreak}{}

## Filtro de Resposta ao Impulso Finita

Os filtros \gls{FIR} principais são:

- Filtro Passa-Baixa;
- Filtro Passa-Banda (ou Passa-Faixa);
- Filtro Passa-Alta.

O filtro Passa-Baixa pode ser usado para atenuar as altas frequências do ruído em um sinal de dados do olhar, além de poder ser desenvolvido em *hardware* utilizando um circuito RC (Resistor-Capacitor)[@Olsson2007]. O sinal da sacada pode ficar comprometido devido a resposta não ideal do filtro. O resultado pode ser melhorado com um filtro FIR dinâmico [@Olsson2007].

## Savitzky-Golay

Nyström [@Nystrom2010] argumenta sobre o uso do filtro Savitzky-Golay que:

- O filtro não faz nenhuma forte premissa sobre as curvas das velocidades dos movimentos;
- Mantém boa qualidade de informação sobre dados em alta frequência;
- Mantém os máximos e mínimos locais (espacial e temporal);

A descrição em alto nível do processo de filtragem consiste em:

- Achara a função polinomial que melhor descreve os dados;
- Derivar analiticamente a função (para não adicionar ruído);
- Fazer uma amostragem das funções usando a frequência original.

## Filtro de Kalman

O filtro de Kalman permite modelar sistemas cujos sinais sejam ruidosos, mas que tenham um comportamento dinâmico observado e conhecido. Sauter et al. [@Sauter1991] utiliza o filtro de Kalman para detectar perseguições, mesmo que o sinal tenha ruído e sacadas corretivas que mantém o algo novamente ao foco durante a perseguição. Ele realiza testes Chi-Quadrado para verificar se a hipótese nula (perseguição) se mantém devido aos valores estatísticos (média e desvio padrão) do sinal, ou se os novos dados são de uma distribuição diferente (hipótese da sacada).

# Taxonomia de Métodos de Classificação

Salvucci [@Salvucci2000] introduz uma taxonomia de algoritmos de identificação de fixações e sacadas. Esta taxonomia é baseada em como são usadas as informações de tempo e espaço. Os algoritmos citados no artigo representam classes de técnicas que compartilham algum critério de identificação. Ele também apresenta uma forma de analisar os algoritmos de maneira qualitativa: facilidade de uso, velocidade de interpretação, acurácia, robustez, e parametrização.

## Critérios espaciais

- Baseados em velocidade: Estes algoritmos utilizam o fato dos pontos que compõem uma fixação terem uma velocidade baixa, enquanto que numa sacada, as velocidades dos pontos são altas. Geralmente são utilizadas para classificar sacadas;
- Baseados em dispersão: Em uma fixação, os pontos são próximos entre si. Medidas de dispersão podem ser utilizadas para classificar fixações;
- Baseados em área de interesse (AOI): Os pontos são agrupados de acordo com regiões pré-determinadas pela aplicação. Servem geralmente para uma análise de alto nível. Podem ser usados algoritmos baseados em velocidade e/ou dispersão antes de realizar a análise baseado em AOI.

## Critérios temporaais

- Sensível à duração: Utiliza uma duração mínima para descartar fixações com uma duração curta demais para os limites fisiológicos do olho.
- Localmente adaptativo: pontos vizinhos influenciam a classificação de um ponto específico. Robusto contra ruídos.

\renewcommand{\sectionbreak}{\clearpage}

# Métodos

Os métodos a seguir classificam os dados do olhar coletados pelo equipamento durante o experimento em sacadas, fixações, perseguições e outros movimentos. Nem todos os algoritmos são desenvolvidos para detectar todos os movimentos.

Nome               Fixação                 Sacada       Perseguição Glissadas
------------------ ----------------------- ------------ ----------- ----------
I-VT               X                       X
I-HMM              X                       X
I-DT               X                       O que não 
                                           for fixação
I-MST              X                       X
I-AOI              Pontos dentro           Pontos fora 
                   das áreas               das áreas
I-VDT-Komogortsev  X
I-VT-Nyström       X                       X                            X
I-HMM-Karrsgard    X                       X
I-VVT              X                       X                 X 
I-VMP              X                       X                 X
I-VDT              X                       X                 X
I-AAT              X                       X                            X
Kalman                                     X                 X
Clusterização      X                       X
------------------ ----------------------- ------------ ----------- ----------


Os algoritmos proposto por Salvucci representam as características mais básicas e distintas dos algoritmos criados e publicados antes do seu artigo de revisão: \gls{I-VT}, \gls{I-DT}, \gls{I-HMM}, \gls{I-MST}, \gls{I-AOI}.

Partindo destes métodos, melhorias e outros métodos foram propostos por outros pesquisadores, como Komogortsev[Komogortsev2013], Behrens[@Behrens2010, @Behrens1992], Nyström[@Nystrom2010], Karrsgard[@Karrsgard2003] e Urruty[@Urruty2007a].

## \gls{I-VT}

Este algoritmo representativo proposto por Salvucci é um dos mais básicos. Contém um parâmetro, o limiar de velocidade. Recebendo as amostras dos pontos, calculam-se suas velocidades. Se a velocidade for menor que o limiar, o respectivo ponto é classificado como fixação, senão é classificado como sacada.

### Vantagens

- fácil de implementar;
- eficiente;
- pode ser executado em tempo real.

### Desvantagens

- instável em pontos com velocidade próxima do threshold (precisa lidar com o ruído do equipamento e movimentos do olhar  irrelevantes para a pesquisa);
- Pode provocar alternâncias entre classificações, implicando em fixações e sacadas com poucos pontos, aumentando o número de fixações excluídas pelo critério de duração mínima;
- Não é robusto;
- Perseguições podem ser classificados como fixações ou sacadas dependendo de sua velocidade.

## \gls{I-HMM}

Este algoritmo utiliza uma máquina de 2 estados para classificar fixação e sacada, recebendo parâmetros de distribuição das velocidades (média e desvio padrão para cada estado), além das probabilidades de transição entre estados. O modelo pode ser treinado para reestimar os parâmetros.

O modelo recebe 8 parâmetros:

- A média e desvio padrão das velocidades de cada estado, totalizando 4;
- As probabilidades de transição (de fixação/sacada para fixação/sacada), totalizando 4;

Os parâmetros podem ser reestimados em um treinamento inicial.

### Vantagens:

- Modelo probabilístico ao invés de um threshold. Utiliza informação sequencial (os vizinhos influenciam o ponto);
- É mais robusto na presença do ruído;
- Pode expandir o diagrama de estados (incorporando mais movimentos do olhar);
- É executado em tempo linear e pode ser executado em tempo real;
- Larsson [@Larsson2010] não encontrou melhora significativa entre o \gls{I-HMM} e o \gls{I-VT}.

### Desvantagens: 

- Mais complexo que \gls{I-VT};
- Procedimento de reestimar os parâmetros também é complexo.

## \gls{I-DT}

Este algoritmo utiliza o critério de dispersão para agrupar os pontos em uma fixação. Ele inicia uma janela com tamanho de acordo com a duração mínima de uma fixação (fixações curtas são descartadas), geralmente 100 ms. Caso a medida de dispersão dos pontos dentro da janela for menor que um limiar, então a janela é expandida até que a dispersão seja maior, agrupando todos os pontos na janela como uma fixação. 

Salvucci utilizou como critério de dispersão $(Max_x - Min_x) + (Max_y - Min_y)$. Outras medidas de dispersão podem ser usadas:

- Distância entre qualquer um dos pontos;
- Distância entre os pontos e o centro da fixação;
- Desvio padrão das coordenadas.

### Vantagens:

- Algoritmo simples
- Tempo linear;
- Pode ser feito em tempo real;
- Resultado parecido com a saída do \gls{I-HMM} (sendo mais robusto do que o \gls{I-VT}).

### Desvantagens:

- Parâmetros interdependentes (ex: duração mínima alta e limiar de dispersão baixa pode não classificar nenhuma fixação);
- Sensível a ruído no critério espacial (pode ultrapassar o limiar);
- Possíveis fixações dispersas podem não ser classificadas.

## \gls{I-MST}

Este algoritmo cria uma estrutura de árvore que interliga os pontos de tal forma que a soma dos comprimentos das arestas da árvore seja o menor possível. Para construir a árvore, utiliza-se o algoritmo de Prim [@Prim1988]. É localmente adaptativo por interligar os pontos aos seus vizinhos, direta ou indiretamente.

- Arestas maiores do que um limiar são consideradas sacadas.
- Calcula-se a média e o desvio padrão para arestas locais;
- Se o comprimento da aresta for maior do que a média + desvio, então a aresta é considerada sacada.
- Identificam-se fixações pelos *clusters* não divididos pelas sacadas.

### Vantagens:

- Robusto (pode usar variância e média para lidar com ruído);
- Cria clusters de fixações
- Podem-se usar outras caracterizações que não sejam meramente espaciais para classificar as fixações.

### Desvantagens: 

- Lento (tempo de execução exponencial);
- Para cada ponto adicionado, é necessário achar o ponto mais próximo dentre vários para restruturar o cluster e separar os clusters.

## I-AOI

Este método de classificação de alto nível converte as amostras em regiões de acordo com divisões da região do estímulo. São fixações os pontos que estiverem dentro das regiões. Pontos fora das regiões são considerados como sacadas. 

Cada região é identificada com um símbolo. O resultado do método transforma as amostras em uma sequência de símbolos, cujas sequências podem ser comparadas entre si usando o algoritmo de Levenshtein[@Cristino2010].

### Vantagens:   

- Tempo real (execução online);
- Simples de implementar;
- Análise de alto nível.
                  
### Desvantagens: 

- Não lida bem com sacadas (incluídas nas fixações se estiverem dentro das regiões), aumentando a duração da fixação;
- Longas sacadas são consideradas fixações nas regiões intermediárias;
- Depende da aplicação (distribuição das regiões).

## I-VDT de Komogortsev

O algoritmo \gls{I-VDT} de Komogortsev[@Komogortsev2013] classifica fixações, sacadas e perseguições contínuas. Argumenta-se que não há algoritmos robustos que classifiquem esses movimentos ternários.

Ele apresenta e compara, além de seu artigo, outros dois algoritmos de identificação de fixações, sacadas e perseguições contínuas: \gls{I-VVT} (semelhante ao \gls{I-VT} de Salvucci [@Salvucci2000] com dois limiares de velocidade para as três classes), e \gls{I-VMP} de Agustin [@Agustin2010] e Larsson[@Larsson2010a].

No I-VMP, dentro de uma janela temporal, calculam-se ângulos dos pontos com o eixo horizontal, plotam-se esses ângulos em uma circunferência unitária, calcula-se a centróide e sua distância com a coordenada (0,0) da circunferência. Se essa distância for maior que um limiar, seus pontos são considerados parte de uma perseguição contínua.

O algoritmo \gls{I-VDT} usa o limiar de velocidade (recebido como parâmetro) para classificar as sacadas, e uma medida de dispersão para classificar perseguições e fixações. A implementação dos algoritmos estão disponíveis em [@Komogortsev2013a].

### Vantagens

- O \gls{I-VDT} é basicamente uma combinação do \gls{I-VT} com o \gls{I-DT} do Salvucci [@Salvucci2000], dessa forma sendo facilmente absorvido e rapidamente implementado;
- Realiza uma classificação ternária. Primeira separa as sacadas pelo critério de velocidade, depois separa fixações das perseguições pelo critério da dispersão;
- Pode ser executado em tempo real;
- Pode-se alterar o cálculo de dispersão que melhor classifique os dados do experimento. Komogortsev utilizou a medida de dispersão de Salvucci.

### Desvantagens

- Tem as mesmas desvantagens do \gls{I-VT} no que diz respeito a movimentos cujas velocidades estejam próximas ao limiar, podendo alternar entre sacadas e outros movimentos.
- Tem as mesmas desvantagens do \gls{I-DT} no que diz respeito ao ruído.
- Não é adaptativo, o limiar precisa ser calculado externamente e passado como um parâmetro.


## \gls{I-VT} Adaptativo de Nyström

O algoritmo \gls{I-VT} de Nyström realiza um método de classificação de sacadas, fixações e glissadas. Ele verificou que a duração das glissadas são longas o suficiente para influenciar as interpretações das fixações e sacadas, sendo importante preparar o algoritmo para tal movimento. Os passos para a classificação que o método executa são:

- Aplica-se o filtro Savitzky-Golay nos pontos;
- Calculam-se as velocidades e acelerações ponto-a-ponto;
- Captura-se uma janela de velocidades;
- Obtém-se os picos de velocidade maiores que um limiar $PT_n$;
- Para cada pico, calcula-se o início (*onset*) e o fim (*offset*) da sacada.
- Obtém-se as glissadas cujo onset seja igual ao offset da sacada predecessora e seu offset seja o primeiro vale da primeira curva após a sacada.
- As fixações são os pontos não classificados como sacadas ou glissadas.

Os limiares não são fixos, e sim calculados iterativamente utilizando os níveis de ruído:

- Um limiar inicial é escolhido, $PT_1$;
- Para todas as velocidades abaixo de $PT_1$, calcula-se a média $\mu_1$ e desvio padrão $\sigma_1$;
- Atualiza-se o limiar $PT_n = \mu_{n-1} + 6\sigma_{n-1}$
- Quando $|PT_n-PT_{n-1}| < 1^\circ/s$, então o limiar final é obtido.


### Vantagens

- Classificação ternária: glissadas, fixações e sacadas.
- Os histogramas da duração de fixação, duração da sacada, velocidade de pico da sacada e aceleração de pico da sacada tem um formato mais comportado, semelhante a uma distribuição normal;
- O cálculo dos limiares são baseados nos dados, e por isso, mais robustos ao ruído;
- Os limiares podem ser calculados separadamente para cada usuário ou experimento;
- O pesquisador tem um maior controle sobre as glissadas, podendo adicioná-las às fixações ou às sacadas.


### Desvantagens

- Embora ele argumenta que a aceleração amplia o nível do ruído, obrigando o pesquisador utilizar uma filtragem mais robusta, podem haver métodos que melhorem o resultado do algoritmo que use apenas a velocidade.
- Usando apenas a velocidade, detecção de outros movimentos pode não ser possível.
- Não se usa medidas de dispersão para tornar o algoritmo mais robusto. Ex: o que foi classificado como fixação, pode ter sido na verdade uma perseguição contínua.

## \gls{I-DT} e HMM de Kärrsgård

Kärrsgård utiliza o algoritmo de identificação baseado em dispersão para classificar os dados do olhar, e posteriormente um Modelo de Markov Oculto na aplicação de digitação pelo olhar. Ele utiliza as fixações para realizar a seleção dos caracteres, convertendo-os em sequências de símbolos (palavras) para posterior interpretação do sistema.

O método pode ser considerado um híbrido usando dispersão (para transformar os dados em fixações) e AOI para transformar fixações em alvos (as teclas) para formar as palavras.

### Vantagens

- As vantagens do I-DT também se aplicam;
- As vantagens do I-AOI de Salvucci se aplicam ao modelo apresentado por Kärrsgård;

### Desvantagens

- Como a aplicação do algoritmo utilizou fixações, então o sistema de digitação é baseado em _dwell time_. Alguns trabalhos utilizam sacadas (onset e offset[@Komogortsev2009]) para retirar a necessidade de fixação nas teclas.
- Larsson [@Larsson2010] analisou alguns algoritmos e concluiu que \gls{I-HMM} não resulta em uma melhora significativa em relação ao simples \gls{I-VT}. Ele argumentou que talvez mais testes podem ser necessários, por causa da importância do modelo frente à adição de novos estados para detecção robusta de outros movimentos.
- As desvantagens do método I-DT e I-AOI de Salvucci, também se aplicam.

## Clusterização de Projeção de Urruty

O algoritmo de Urruty et al.[@Urruty2007a] encontra *clusters* de pontos em um espaço de dimensionalidade menor e seleciona a projeção que melhor ajuda na identificação destes *clusters*. O sistema de coordenadas para os dados pode ser aleatoriamente escolhido. Com isso, reduz-se a chance de obter clusters se sobrepondo. O método utiliza técnicas de projeção e técnicas baseadas em densidade.

- Projetam-se os pontos nos eixos $X$ e $Y$;
- Criam-se dois histogramas, um para cada eixo;
- Divide-se o espaço bidimensional em regiões de acordo com os histogramas;
- As regiões de alta densidade são analisadas em um processo de expansão, a fim de capturar pontos externos e próximos que mantenham a densidade da região.
- Análise da duração das fixações são realizadas para validar as regiões.
- Pontos de um mesmo *cluster* separados por mais de um período mínimo (recebido como parâmetro) são considerados de diferentes fixações, dividindo o *cluster* em dois ou mais;
- Os clusters divididos devem ter duração maior do que o período mínimo;
- Pontos que não estiverem nas regiões (ou *clusters* inválidos) são considerados como ruídos (ou movimento sacádicos).


### Vantagens

- Urruty et al. verificam, usando o método de avaliação *Precision and Recall*, explanado na seção [Avaliação dos Métodos], que seu método detecta melhor as informações das fixações do que os algoritmos de \gls{I-MST}, \gls{I-DT} e \gls{I-VT};
- O método também foi analisado usando vídeos como estímulos. Foi reforçado a possibilidade de seu uso na aplicação de sumarização de vídeos, combinando áreas de interesses, imagens chaves do vídeo, ou na aplicação de indexação dos vídeos.

### Desvantagens

- O método perde mais sacadas do que os outros métodos comparados;
- O método ainda não foi comparado com métodos com limiares adaptativos;
- A qualidade do resultado do método também não é conhecida na presença de estímulos em movimento que gerariam perseguições contínuas.

## I-AAT de de Behrens

O algoritmo \gls{I-AAT} de Behrens [@Behrens2010] usa as acelerações das amostras para classificar movimentos sacádicos e não sacádicos. A diferença desse para seu trabalho anterior [@Behrens1992] se dá no cálculo do limiar não ser fixo, e sim adaptativo.

O cálculo utiliza o desvio padrão de uma janela de acelerações. O limiar de aceleração $AT = N\times\sigma$, onde $N$ é um valor passado como parâmetro, é atualizado ao mover a janela. No momento em que o valor da aceleração de um ponto é maior do que o limiar, é constatado o início de um movimento sacádico. Outras intersecções são detectadas (em uma sacada, o sinal da aceleração resulta em duas curvas, uma positiva e uma negativa). O limiar durante a sacada é mantido constante por um período passado como parâmetro. Após o período, o limiar é modificado linearmente até atingir $N\times\sigma$, onde volta a ser recalculado iterativamente.

Para separar movimentos sacádicos principais das não principais (como glissadas), o método utiliza também a posição, monotonicamente crescente ou decrescente. Caso haja menos de 3 intersecções durante a análise da aceleração e o sinal da posição das amostras da possível sacada tenha terminado, então o movimento sacádico é considerado não principal. O método utiliza uma função para controlar os estados destas variáveis.

O método utiliza um filtro de convolução para obter a segunda derivada do sinal (aceleração) junto com um Filtro de Resposta Finito (FIR) Passa-Baixa para atenuar as altas frequências, embora o autor admite o aumento da magnitude do sinal do ruído remanescente.

### Vantagens

- O método utiliza um limiar adaptativo para se adequar ao ruído de diferentes equipamentos e de dados de diferentes usuários;
- Utiliza aceleração para detectar sacadas;
- Pode identificar artefatos no sinal de aceleração próximos ao limiar;
- Sacadas curtas podem conter sinais de velocidade irregulares. A utilização de aceleração pode ser utilizada para a devida detecção.

### Desvantagens

- Não utiliza velocidade para tornar a detecção das sacadas e fixações mais robusta;
- Utiliza a posição, confiando no processo de atenuação do ruído pelo filtro;

## Filtro de Kalman

Os filtros de Kalman podem ser usados para detectar perseguições. As sacadas corretivas dentro da perseguição podem ser considerados, junto com o problemas na coleta, parte de um ruído branco gaussiano. O filtro de Kalman trabalha com inovações dentro da previsão do modelo (em um processo recursivo) e o compara com os dados coletados para decidir se é uma perseguição ou uma sacada [@Sauter1991]. O filtro minimiza o erro entre o estado do sistema previsto e o estado do sistema observado, mesmo na presença de ruído, sendo interessante no uso de identificação de movimentos do olhar [@Koh2009].

### Vantagens

- Permite detectar perseguições;
- Não é necessária informação a priori da dinâmica da sacada;
- Robusto a ruídos;
- Koh et al.[@Koh2009] verificaram que dados dos usuário que usam óculos ou lentes foram melhor identificados pelo filtro de Kalman do que pelo \gls{I-VT}.

### Desvantagens

- É necessária informação a priori da dinâmica da perseguição;
- O modelo pode não representar fielmente a realidade dos dados, podendo comprometer a identificação.
- Os parâmetros para a identificação dependem da frequência do equipamento e da acurácia na calibração do usuário, tornando o algoritmo mais complexo de ser implementado.

# Avaliação dos Métodos

Shic[@Shic2008] explora diferentes algoritmos de identificação de fixações mostrando que suas interpretações podem ser diferentes, mesmo trabalhando com os mesmos dados coletados.
Ele analisa os seguintes algoritmos baseados em dispersão:

- Dispersão de Distância: a distância entre dois pontos quaisquer na fixação não pode superar um limiar. É executado em $O(n^2)$;
- Centróide: os pontos de uma fixação não podem ser mais distantes do que um limiar para sua centróide. Pode construir uma versão em tempo real, computando apenas os novos pontos;
- Posição-Variância: modela o grupo de pontos como uma distribuição gaussiana, e não podem ultrapassar um desvio padrão de distância;
- \gls{I-DT} de Salvucci: a soma da máxima distância horizontal com a máxima distância vertical deve ser menor que um limiar.

Ele viu que o tempo de fixação médio segue um comportamento linear para valores que correspondem aos limites fisiológicos da visão foveal (desvio padrão da dispersão até $1̣^\circ$ e tempo mínimo de fixação até 200ms), mesmo que o número de fixações e o total de tempo gasto nas fixações forem não lineares.

Salvucci [@Salvucci2000] avalia os algoritmos de acordo com critérios subjetivos:

- Facilidade de implementação;
- Acurácia;
- Velocidade;
- Robustez;
- Número de parâmetros.

O único critério quantitativo é o número de parâmetros, visto que ele definiu os outros critérios qualitativamente, embora possam ser criadas métricas para torná-los objetivos. Também não há um valor final devido à subjetividade, todavia também pode ser criado um cálculo usando e agregando os critérios de forma quantitativa.

Larsson [@Larsson2010] em sua tese apresenta um método de avaliação denominado *Precision and Recall*. O método classifica a saída dos algoritmos em 4 tipos baseados na *predição* (a saída do algoritmo) e no *padrão de outro* (a correta classificação):

- Padrão de ouro como *Sim* e Predição como *Sim*: Verdadeiro Positivo (VP);
- Padrão de ouro como *Sim* e Predição como *Não*: Falso Positivo (FP);
- Padrão de ouro como *Não* e Predição como *Sim*: Falso Negativo (FN);
- Padrão de ouro como *Não* e Predição como *Não*: Verdadeiro Negativo (VP).

O objetivo da etapa *Precision* é saber a razão entre os verdadeiros positivos -- o algoritmo classificou corretamente como *Sim* -- e todos os classificados como *Sim* pelo algoritmo, mesmo os falso positivos.
O objetivo da etapa *Recall* é saber a razão entre os verdadeiros positivos e todos que deveriam ser classificados como *Sim*, de acordo com o padrão de ouro.

Precision = $$\frac{VP}{VP+FP}$$

Recall = $$\frac{VP}{VP+FN}$$

Komogortsev criou métricas quantitativas e qualitativas para avaliação dos algoritmos de identificação de fixações, sacadas [@Komogortsev2010] e perseguições [@Komogortsev2013]. São relações entre dados pertencentes a uma classe de movimento e estímulos considerados dessa classe. 

A métrica quantitativa da fixação considera a relação entre as fixações detectadas e as fixações do estímulo. O valor não chega a 100% se o estímulo do experimento levar em conta fixações e sacadas.

A métrica quantitativa da sacada compara o total das amplitudes das sacadas detectadas com o total das amplitudes das sacadas do estímulo. O valor pode estar acima de 100% se fixações forem classificadadas como sacadas ou se houver problemas na coleta de dados. 

Há também a métrica qualitativa da fixação, usando o cálculo da soma das distâncias entre as fixações detectadas e o centro do estímulo. A métrica pode não dar um bom valor se o usuário não olhar exatamente para o centro do estímulo.

# Conclusão

Esta revisão serve para conhecer os métodos de classificação de dados do olhar e métodos de avaliação dos algoritmos de análise. 
Com o estudo, percebe-se que não existe um melhor método de classificação, pois os resultados das análises dependem das definições adotadas dos movimentos, qualidade na coleta de dados, frequência da coleta, nível de ruído, características fisiológicas dos olhos de diferentes usuários, filtragem adotada, critérios usados na identificação, movimentos escolhidos para detecção, entre outras características.

Mesmo assim, o resultado dessas análises podem contribuir com a interação dos usuários com os sistemas, a fim de aumentar a eficiência, eficácia, reduzir a fadiga, melhorar a resposta do sistema e aumentar a produtividade.

Como trabalho futuro, as etapas de filtragem, bem como outros métodos de classificação, serão descritas e analisadas.
Classificações de outros movimentos do olhar também serão levadas em conta, como piscadas, perseguições contínuas, microssacadas, tremores e nystagmus.

Alguns dos métodos que estão sendo estudados para complementar este texto são:

- Variância e Covariância de Veneri [@Veneri2011];
- *Mean Shift Procedure* de Santella [@Santella2004].

# Bibliografia
