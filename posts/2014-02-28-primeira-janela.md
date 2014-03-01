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

~~~~ {#wgll1html1 .cpp .numberLines startFrom="1"}
// Incluindo bibliotecas padrões
#include <stdio.h>
#include <stdlib.h>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


~~~~ {#wgll1html1 .cpp .numberLines startFrom="4"}
// Incluindo GLEW
#include <GL/glew.h>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

~~~~ {#wgll1html1 .cpp .numberLines startFrom="6"}
// Incluindo GLFW
#include <GL/glfw3.h>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

~~~~ {#wgll1html1 .cpp .numberLines startFrom="8"}
// Incluindo GLM
#include <glm/glm.hpp>
using namespace glm;
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

~~~~ {#wgll1html1 .cpp .numberLines startFrom="11"}
int main(int argc, char**argv)
{
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

~~~~ {#wgll1html1 .cpp .numberLines startFrom="13"}
  // Inicializar GLFW
  if(!glfwInit())
  {
    fprintf(stderr,"Não pode inicializar GLFW\n");
    return -1;
  }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

~~~~ {#wgll1html1 .cpp .numberLines startFrom="13"}
  // Se possível, abra o OpenGL versão 3.3
  glfwWindowHint(GLFW_FSAA_SAMPLES_4);
  glfwWindowHint(GLFW_OPENGL_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_OPENGL_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
  
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

A constante GLFW_FSAA_SAMPLES_4 diz que o ambiente terá antialiasing com 4 amostras. Mas o que significa isso? Olhe a figura abaixo. Sem antialiasing, 


~~~~ {#wgll1html1 .cpp .numberLines startFrom="13"}
  glfwSetInputMode(window, GLFW_STICKY_KEYS, GL_TRUE);
  
  do
  {
    // Desenhe nada por enquanto (só no tutorial 2!)
    
    // Troque os buffers
    
  }
  glfwWindowHint(GLFW_FSAA_SAMPLES_4);
  glfwWindowHint(GLFW_OPENGL_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_OPENGL_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
  
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


Bem vindo ao primeiro tutorial!

Antes de ir direto ao OpenGL, vamos aprender a construir a parte do código que é bastante comum a todos os tutoriais. Veremos como executá-lo e como modificá-lo para atender às suas necessidades.

# Prerequisitos

Experiência com linguagem de programação e scripts (C, Java, Lisp, Javascript,...) ajuda no entendimento do código, todavia não é necessário. Alunos da disciplina de Introdução à Computação Gráfica absorverão melhor o conteúdo prático devido ao aprendizado do conteúdo teórico dado na sala.

Recursos avançados de C++ serão evitados para não dar dor de cabeça para quem não tem experiência nessa linguagem. Os tutoriais serão incrementais. Por causa disso, o primeiro tutorial é extenso, comparado com outros.

# Esqueça o antigo OpenGL

A maioria dos tutoriais e cursos universitários ensinam OpenGL 1 e 2. Porém eles não fazem uso do _pipeline_ moderno do OpenGL (versões 3 e 4).

# Compilando os tutoriais

Os tutoriais podem ser compilados para Windows, Linux e Mac. Para todas estas plataformas, o procedimento no geral é o mesmo:

1. Atualize os drivers
2. Baixe um compilador
3. Instale CMake (ele gera Makefiles para qualquer plataforma)
4. Baixe o código fonte dos tutoriais
5. Crie um projeto usando CMake
6. Compile o projeto
7. Brinque com os exemplos!

Procedimentos detalhados para cada plataforma estão dados abaixo. Adaptações podem ser requeridas.

## Compilando para Windows

## Compilando para Linux

## Compilando para Mac

