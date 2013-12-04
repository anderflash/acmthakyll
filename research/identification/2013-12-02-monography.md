---
title: Identificação de Eventos do Olhar: Métodos
tags: Olhar, Identificação
author: Anderson Tavares
biblio: library.bib
csl: ieee-with-url.csl
thumbnail: assets/images/eye-tracking-thumb.jpg
description: O objetivo do trabalho é explorar técnicas de detecção de eventos do olhar.
---

% Identificação de Eventos do Olhar: Métodos
% Universidade de São Paulo

# Introdução

Rastreamento do olhar é uma área em desenvolvimento

Dependendo da taxa de amostragem do equipamento e da aplicação pretendida, a quantidade de dados coletados poder ser muito grande para sua análise. Nesse caso é necessária uma transformação destes dados em elementos que informem eventos oculomotores que ocorreram durante o experimento.

Os rastreadores basicamente informam a coordenada bidimensional de cada ponto coletado e seu _timestamp_. Outras propriedades também podem ser informadas, como o diâmetro da pupila. As amostras configuram uma série temporal. Os dados de tempo e espaço podem ser usados para analisar os eventos. Algoritmos de identificação de eventos. Na seção [Eventos], são descritos 

# Eventos

## Fixações

## Sacadas

## Microssacadas

## Tremores

## Drifts

## Perseguição Contínua

## Nystagmus 

# Categorias 

Salvucci [@Salvucci2000] apresentou alguns algoritmos de identificação de eventos oculomotores de acordo com critérios, como velocidade e aceleração. Antes de mostrar os métodos, esta seção conceitua estes critérios de forma a estruturar a relação entre os métodos e que características das amostras eles utilizam.

## Velocidade

### I-VT

### I-HMM

## Dispersão

Outra categoria de algoritmos que também utiliza o espaço e o tempo são baseados em dispersão. 

- Distância entre os pontos da fixação mais distantes entre si;
- Distância entre qualquer um dos pontos
- Distância entre os pontos e o centro da fixação
- Desvio padrão das coordenadas
- Árvore de Extensão Mínima - _Minimum Spanning Tree_ (MST)

### I-DT

Blignaut [@Blignaut2009] analisa os dados do olhar de jogadores de xadrez utilizando diversos valores em diferentes métricas supracitadas, implementando o algoritmo I-DT de Salvucci[@Salvucci2000]. Ele mostra que nesse exemplo, definindo o raio de fixação como 1°, consegue-se utilizar cerca de 90% dos dados do olhar e torna o resultado (fixações e sacadas) replicáveis.

### I-MST

## Área de Interesse

# Métodos

## Hidden Markov Models

[@Karrsgard2003]

## Projection Clustering

[@Urruty2007a]

## Variance and Covariance

[@Veneri2011]

## Mean Shift Procedure

[@Santella2004]

## 

# Avaliação dos Métodos



[@Salvucci2000]

[@Larsson2010]

# Bibliografia
