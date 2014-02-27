------------------------------
author: Anderson Tavares
title: Tutorial WebGL: Introdução
description: Instalação e Configuração
tags: WebGL, OpenGL
thumbnail: assets/images/webgl-introducao-thumb.png
biblio: library.bib
csl: ieee-with-url.csl
math: True
------------------------------

O que é?

O que posso fazer com WebGL?

Você pode transformar sua página Web em um verdadeiro ambiente virtual tridimensional. Utilizando outras tecnologias, você pode criar ambientes colaborativos, cidades, simulações, jogos, entre outras coisas.

Aqui vamos mostrar como configurar os navegadores para poder executar conteúdo WebGL. Antes de seguir os passos seguintes, tente acessar [http://get.webgl.org/](http://get.webgl.org/) com as configurações padrões. Você deverá ver um cubo girando. Caso não consiga, veja como mudar a configuração para poder vê-lo.

# Chrome

Existem várias aplicações do navegador Chrome ou Chromium. O primeiro é desenvolvido pela Google; o segundo, pela comunidade. 

Se você usa *nix ou Mac OS, você pode usar o seguinte comando:

~~~~ {#mycode .shell .numberLines startFrom="1"}
chromium-browser --enable-webgl --allow-file-access-from-files --ignore-gpu-blacklist
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Subsitua `chromium-browser` por `google-chrome` na falta do primeiro.

Para visualizar se o navegador está acessando a GPU, vá para o endereço `about:gpu`.

Se você utiliza Windows, vá para as propriedades do atalho do programa para adicionar os argumentos supracitados.

# Firefox

No Firefox, você pode acessar o endereço `about:config`, clicar em `Serei cuidadoso, prometo`, pesquisar pelo parâmetro `webgl.force-enabled` e clicar duas vezes nele. Seu valor passa a ser true e assim as animações serão executadas.

# Observações Adicionais

Se você tem um notebook optimus (2 GPUs, 1 Intel de baixa potência e 1 AMD ou Nvidia), você pode instalar o bumblebee e executar `optirun chromium-browser`(google-chrome se não houver o outro) ou `optirun firefox`. Ubuntu, ArchLinux e derivados contém comandos para instalar automaticamente os drivers das placas de vídeo, e consequentemente eles instalarão o bumblebee.
