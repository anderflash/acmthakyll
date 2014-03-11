---
title: OpenGL - Primeira Janela
tags: OpenGL, Tutorial
author: Anderson Tavares
biblio: library.bib
csl: ieee-with-url.csl
thumbnail: assets/images/teapot-thumb.png
description: Exibindo sua primeira Janela
---
# Introdução

Primeiro, vamos trabalhar com as dependências: precisamos de bibliotecas padrões para exibir mensagens no terminal:

~~~~ {#wgll1html1 .cpp .numberLines startFrom="1"}
// Incluindo bibliotecas padrões
#include <stdio.h>
#include <stdlib.h>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Agora vamos colocar a biblioteca GLEW para usar as novas funções do pipeline modelo do OpenGL 3.3+

~~~~ {#wgll1html1 .cpp .numberLines startFrom="4"}
// Incluindo GLEW, sempre coloque antes do gl.h e
// glfw.h
#include <GL/glew.h>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Agora vamos colocar nosso gerenciador de janelas. O OpenGL apenas gera a imagem a partir dos dados dos vértices que enviamos para a GPU. Quem criará as janelas é o GLFW.

~~~~ {#wgll1html1 .cpp .numberLines startFrom="7"}
// Incluindo GLFW
#include <GL/glfw3.h>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Ao invés de construirmos as matrizes na mão, vamos utilizar uma biblioteca que trabalha muito bem com matrizes, inclusive já contém as transformações. Estamos colocando o `using namespace` para substituir as chamadas `glm::vec3` por `vec3`, por exemplo.

~~~~ {#wgll1html1 .cpp .numberLines startFrom="9"}
// Incluindo GLM
#include <glm/glm.hpp>
using namespace glm;
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Vamos agora criar a função inicial:

~~~~ {#wgll1html1 .cpp .numberLines startFrom="12"}
int main(int argc, char**argv)
{
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Para quem não tem muito background em C ou C++, todo programa em C/C++ deve ter uma função `main` que retorne um valor inteiro. Os parâmetros são opcionais, todavia é interessante ter o hábito de colocá-los. Quando você executa um certo comando no terminal, o comando pode exigir argumentos para definir a funcionalidade necessária dentre várias que o comando pode realizar. O número de argumentos é obtido pelo primeiro parâmetros, enquanto que os argumentos propriamente ditos são obtidos pelo segundo parâmetro. Mesmo que não tenhas inserido nenhum argumento, sempre haverá um argumento: o nome do comando.

Vamos agora inicializar nossa janela. Só depois devemos inicializar as funções do pipeline moderno, obtidas pelo GLEW.

~~~~ {#wgll1html1 .cpp .numberLines startFrom="14"}
  // Inicializar GLFW
  if(!glfwInit())
  {
    fprintf(stderr,"Não pode inicializar GLFW\n");
    return -1;
  }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Agora vamos inicializar o OpenGL e criar nossa janela. Quando trabalharmos com texturas, iremos explicar melhor o que o `GLFW_FSAA_SAMPLES_4` significa.

~~~~ {#wgll1html1 .cpp .numberLines startFrom="20"}
  // Se possível, abra o OpenGL versão 3.3
  // Antialiasing
  glfwWindowHint(GLFW_FSAA_SAMPLES_4); 
  // Queremos OpenGL 3.3
  glfwWindowHint(GLFW_OPENGL_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_OPENGL_VERSION_MAJOR, 3);
  // Não queremos o OpenGL antigo
  glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
  // Necessário para remover OpenGL antigo no MAC
  glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);


  // Abrir uma janela e criar um contexto.
  GLFWwindow* window;
  window = glfwCreateWindow(1024, 768, "Tutorial 01", NULL, NULL);
  if(window == NULL)
  {
    fprintf(stderr, "Falhou em abrir a janela GLFW.");
    glfwTerminate();
    return -1;
  }
  glfwMakeContextCurrent(window);
  
  glewExperimental = true;
  if(glewInit() != GLEW_OK)
  {
    fprintf(stderr, "Falhou em inicializar GLEW\n");
    return -1;
  }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

O GLFW trabalha com laços para realizar animações. Por enquanto não iremos desenhar nada, apenas esperar o usuário pressionar a tecla `ESC`.

~~~~ {#wgll1html1 .cpp .numberLines startFrom="49"}
  glfwSetInputMode(window, GLFW_STICKY_KEYS, GL_TRUE);
  
  do
  {
    // Desenhe nada por enquanto (só no tutorial 2!)
    
    // Troque os buffers
    
  }while(glfwGetKey(window, GLFW_KEY_ESCAPE) != GLFW_PRESS && glfwWindowShoulClose(window)==0);
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Precisamos agora fechar a janela e finalizar a biblioteca para liberar memória.

~~~~ {#wgll1html1 .cpp .numberLines startFrom="58"}
  // Fechar a janela e finalizar GLFW
  glfwTerminate();

  // Finalizar o programa
  return 0;
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Tente compilá-lo e executá-lo. A janela será aberta e esperará o usuário pressionar a tecla `ESC`.

No próximo tutorial, desenharemos um triânglo.