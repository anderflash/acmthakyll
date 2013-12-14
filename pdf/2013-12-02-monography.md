% Métodos para Detecção de Fixações, Sacadas e Outros Movimentos do Olhar
% Anderson C. M. Tavares
% Universidade de São Paulo

# Introdução

Rastreamento do olhar é uma área que estuda o comportamento do olhar, analisando o processamento visual e cognitivo da pessoa. Os movimentos do olhar são coletados por equipamentos denominados rastreadores de olhar (_eye trackers_) para análise, comparação e para desenvolver sistemas mais interativos.

Dependendo da taxa de amostragem do equipamento e da aplicação pretendida, a quantidade de dados coletados poder ser muito grande para sua análise. Nesse caso é necessária uma transformação destes dados em eventos que informem melhor o processamento visual e cognitivo durante o experimento.

Os rastreadores basicamente informam a coordenada bidimensional de cada ponto coletado e seu _timestamp_. Outras propriedades também podem ser informadas, como o diâmetro da pupila. As amostras configuram uma série temporal. Os dados de tempo e espaço podem ser usados para analisar os eventos.

# Eventos

Os eventos do movimento do olhar podem ser:

- **Fixações**: Para Salvucci [@Salvucci2000] e Karrsgard[@Karrsgard2003], uma fixação é uma pausa sobre regiões de interesse.
- **Sacadas**: Um rápido movimento entre fixações [@Salvucci2000, @Karrsgard2003];
- **Movimentos fixacionais**: O olho não fica parado durante uma fixação, todavia ocorrem pequenos movimentos, como _drifts_ (desvios do foco para fora do alvo durante a fixação), tremores (rápidos, de baixa amplitude e involuntários), microssacadas (correções dos _drifts_ e renovação do estímulo na retina) e nystagmus (patologia periódica composta por movimentos suaves e rápidos alternadamente, que pode provocar tontura e sensação de movimento em objetos estáticos).
- **Perseguição Contínua**: O movimento do olho acompanhando um alvo em movimento é denominado _perseguição contínua_, _perseguição suave_, ou simplesmente _perseguição_.
- **Glissadas**: No fim da sacada, geralmente o olho não para no ponto desejado, e sim ele o passa. Dessa forma, ele faz um pequeno movimento senoidal para corrigir e fixar-se no ponto. Esse movimento é denominado _glissada_.

# Filtros

A análise de dados do olhar é dividida em duas partes: filtragem e classificação. Os ruídos também são divididos em duas categorias:

- Ruídos provenientes do equipamento;
- Movimentos do olhar que não estão sendo analisados.

Os filtros servem para remover, ou pelo menos reduzir, o primeiro tipo de ruído. A classificação elimina o segundo tipo. Essa separação em duas etapas faz com que os métodos de classificação sejam mais independentes dos equipamentos e suas características.

Alguns filtros utilizandos na literatura são:

- Filtro de Resposta ao Impulso Finita (FIR) [@Olsson2007];
- Filtro de Média [@Olsen2012];
- Filtro de Mediana [@Olsen2012];
- Filtro Savitzky-Golay [@Nystrom2010];
- Filtro de Kalman [@Sauter1991].

# Categorias de Métodos de Classificação

Salvucci [@Salvucci2000] introduz uma taxonomia de algoritmos de identificação de fixações e sacadas. Esta taxonomia é baseada em como são usadas as informações de tempo e espaço. Os algoritmos citados no artigo representam classes de técnicas que compartilham algum critério de identificação. Ele também apresenta uma forma de analisar os algoritmos de maneira qualitativa: facilidade de uso, velocidade de interpretação, acurácia, robustez, e parametrização.

### Critérios espaciais

- Baseados em velocidade: Estes algoritmos utilizam o fato dos pontos que compõem uma fixação terem uma velocidade baixa, enquanto que numa sacada, as velocidades dos pontos são altas. Geralmente são utilizadas para classificar sacadas;
- Baseados em dispersão: Em uma fixação, os pontos são próximos entre si. Medidas de dispersão podem ser utilizadas para classificar fixações;
- Baseados em área de interesse (AOI): Os pontos são agrupados de acordo com regiões pré-determinadas pela aplicação. Servem geralmente para uma análise de alto nível. Podem ser usados algoritmos baseados em velocidade e/ou dispersão antes de realizar a análise baseado em AOI.

### Critérios temporaais

- Sensível à duração: Utiliza uma duração mínima para descartar fixações com uma duração curta demais para os limites fisiológicos do olho.
- Localmente adaptativo: pontos vizinhos influenciam a classificação de um ponto específico. Robusto contra ruídos.


# Métodos

Nome               Fixação        Sacada           Perseguição Lenta
------------------ -------------- ---------------- ------------------
I-VT
I-HMM
I-DT
I-MST
I-AOI

I-VDT Komogortsev
------------------ -------------- ---------------- ------------------


Os algoritmos proposto por Salvucci representam as características mais básicas e distintas dos algoritmos criados e publicados antes do seu artigo de revisão: I-VT, I-DT, I-HMM, I-MST, I-AOI.

## I-VT

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

## I-HMM

Este algoritmo utiliza uma máquina de 2 estados para classificar fixação e sacada, recebendo parâmetros de distribuição das velocidades (média e desvio padrão para cada estado), além das probabilidades de transição entre estados. O modelo pode ser treinado para reestimar os parâmetros.

### Vantagens:

- Modelo probabilístico ao invés de um threshold. Utiliza informação sequencial (os vizinhos influenciam o ponto);
- É mais robusto na presença do ruído;
- Pode expandir o diagrama de estados (incorporando mais movimentos do olhar);
- É executado em tempo linear e pode ser executado em tempo real.

### Desvantagens: 

- Mais complexo que I-VT;
- Procedimento de reestimar os parâmetros também é complexo.

## I-DT

Este algoritmo utiliza o critério de dispersão para agrupar os pontos em uma fixação. Ele inicia uma janela com tamanho de acordo com a duração mínima de uma fixação (fixações curtas são descartadas), geralmente 100 ms. Caso a medida de dispersão dos pontos dentro da janela for menor que um limiar, então a janela é expandida até que a dispersão seja maior, agrupando todos os pontos na janela como uma fixação. Salvucci utilizou como critério de dispersão $(Max_x - Min_x) + (Max_y - Min_y)$. Outras medidas de dispersão podem ser usadas:

- Distância entre qualquer um dos pontos;
- Distância entre os pontos e o centro da fixação;
- Desvio padrão das coordenadas.

### Vantagens:

- Algoritmo simples
- Tempo linear;
- Pode ser feito em tempo real;
- Resultado parecido com a saída do I-HMM (sendo mais robusto do que o I-VT).

### Desvantagens:

- Parâmetros interdependentes (ex: duração mínima alta e limiar de dispersão baixa pode não classificar nenhuma fixação);
- Sensível a ruído no critério espacial (pode ultrapassar o limiar);
- Possíveis fixações dispersas podem não ser classificadas.

## I-MST

Este algoritmo cria uma estrutura de árvore que interliga os pontos de tal forma que a soma dos comprimentos das arestas da árvore seja o menor possível. Para construir a árvore, utiliza-se o algoritmo de Prim [@Prim1988]. É localmente adaptativo por interligar os pontos aos seus vizinhos, direta ou indiretamente.

### Vantagens:

- Robusto (pode usar variância e média para lidar com ruído);
- Cria clusters de fixações
- Podem-se usar outras caracterizações que não sejam meramente espaciais para classificar as fixações.

### Desvantagens: 

- Lento (tempo de execução exponencial);
- Para cada ponto adicionado, é necessário achar o ponto mais próximo dentre vários para restruturar o cluster e separar os clusters.

## I-AOI

Este método de classificação de alto nível converte as amostras em regiões de acordo com divisões da região do estímulo. Cada região é identificada com um símbolo. O resultado do método transforma as amostras em uma sequência de símbolos, cujas sequências podem ser comparadas entre si usando o algoritmo de Levenshtein[@Cristino2010].

### Vantagens:   

- Tempo real;
- Simples;
- Análise de alto nível.
                  
### Desvantagens: 

- Não lida bem com sacadas (incluídas nas fixações se estiverem dentro das regiões), aumentando a duração da fixação;
- Longas sacadas são consideradas fixações nas regiões intermediárias;
- Depende da aplicação (distribuição das regiões).

# I-VDT de Komogortsev

O algoritmo de Komogortsev[@Komogortsev2013] classifica fixações, sacadas e perseguições contínuas. Argumenta-se que não há algoritmos robustos que classifiquem esses movimentos ternários.

## Vantagens



## Desvantagens


# I-VT Adaptativo de Nyström


## Vantagens


## Desvantagens

# I-HMM de Karrsgard


## Vantagens


## Desvantagens


# Clusterização de Projeção de Urruty


## Vantagens


## Desvantagens


# Avaliação dos Métodos

Shic[@Shic2008] explora diferentes algoritmos de identificação de fixações mostrando que suas interpretações podem ser diferentes, mesmo trabalhando com os mesmos dados coletados.
Ele analisa os seguintes algoritmos baseados em dispersão:

- Dispersão de Distância: a distância entre dois pontos quaisquer na fixação não pode superar um limiar. É executado em $O(n^2)$;
- Centróide: os pontos de uma fixação não podem ser mais distantes do que um limiar para sua centróide. Pode construir uma versão em tempo real, computando apenas os novos pontos;
- Posição-Variância: modela o grupo de pontos como uma distribuição gaussiana, e não podem ultrapassar um desvio padrão de distância;
- I-DT de Salvucci: a soma da máxima distância horizontal com a máxima distância vertical deve ser menor que um limiar.

Ele viu que o tempo de fixação médio segue um comportamento linear para valores que correspondem aos limites fisiológicos da visão foveal (desvio padrão da dispersão até $1̣^\circ$ e tempo mínimo de fixação até 200ms), mesmo que o número de fixações e o total de tempo gasto nas fixações forem não lineares.


Salvucci [@Salvucci2000] avalia os algoritmos de acordo com critérios subjetivos:

- Facilidade de implementação;
- Acurácia;
- Velocidade;
- Robustez;
- Número de parâmetros.

O único critério quantitativo é o número de parâmetros, visto que ele definiu os outros critérios qualitativamente, embora possam ser criadas métricas para torná-los objetivos. Também não há um valor final devido à subjetividade, todavia também pode ser criado um cálculo usando e agregando os critérios de forma quantitativa.

Larsson [@Larsson2010] em sua tese apresenta um método de avaliação denominado _Precision and Recall_. O método classifica a saída dos algoritmos em 4 tipos baseados na _predição_ (a saída do algoritmo) e no _padrão de outro_ (a correta classificação):

- Padrão de ouro como _Sim_ e Predição como _Sim_: Verdadeiro Positivo (VP);
- Padrão de ouro como _Sim_ e Predição como _Não_: Falso Positivo (FP);
- Padrão de ouro como _Não_ e Predição como _Sim_: Falso Negativo (FN);
- Padrão de ouro como _Não_ e Predição como _Não_: Verdadeiro Negativo (VP).

O objetivo da etapa _Precision_ é saber a razão entre os verdadeiros positivos -- o algoritmo classificou corretamente como _Sim_ -- e todos os classificados como _Sim_ pelo algoritmo, mesmo os falso positivos.
O objetivo da etapa _Recall_ é saber a razão entre os verdadeiros positivos e todos que deveriam ser classificados como _Sim_, de acordo com o padrão de ouro.

Precision = $$\frac{VP}{VP+FP}$$

Recall = $$\frac{VP}{VP+FN}$$

# Conclusão

Esta revisão serve para conhecer os métodos de classificação de dados do olhar e métodos de avaliação dos algoritmos de análise.
Como trabalho futuro, as etapas de filtragem, bem como outros métodos de classificação, serão descritas e analisadas. 
Classificações de outros eventos do olhar também serão levadas em conta, como piscadas, perseguições contínuas e nystagmus.
Alguns dos métodos que estão sendo avaliados são:

- HMM de Karrsgard [@Karrsgard2003];
- Clusterização de Projeção de Urruty [@Urruty2007a];
- Variância e Covariância de Veneri [@Veneri2011];
- _Mean Shift Procedure_ de Santella [@Santella2004].

# Bibliografia
