// Parte MVR
var TORADIANS = Math.PI/180;
document.addEventListener('DOMContentLoaded', function(event)
{
  function atualizarCanvas()
  {
    mvr.init();
    ddr.init();
    var id = Reveal.getCurrentSlide().id;
    if(id == "mundo-vetorial-x-mundo-raster-pixels")
    {
      document.getElementById('mvmr').appendChild(wglVars.canvas);
      mvr.parado = false;
      mvr.tick();
    }
    else mvr.parado = true;
    
    if(id == "desenho-de-retas")
    {
      document.getElementById('desenhoretasdiv').appendChild(wglVars.canvas);
      ddr.parado = false;
      ddr.tick();
    }
    else ddr.parado = true;
  }
  
  Reveal.addEventListener('slidechanged', function(event)
  {
    atualizarCanvas();
  }, false);

  // SLIDE: MUNDO VETORIAL X MUNDO RASTER
  var mvr = 
  {
    grade:null,
    triangulo:null,
    zRot:45,
    yRot:10,
    mRotacao:mat4.create(),
    yRotationRad:0,
    yRotationMatrix:mat4.create(),		  
    gradePixelada:null,
    gradePixeladaBranca:null,
    criado:false,
    parado:false,
    mLookAt:mat4.create(),
    v1:[-0.5, -0.5, 0.0],v2:[0.5, -0.5, 0.0],v3:[0.0, 0.5, 0.0],
    init:function()
    {
      if(!this.criado)
      {
	this.yRotationRad = this.yRot * TORADIANS;
	this.grade = new Grade(false, [0,0,0.3,1]);
	this.gradePixelada = new Grade(true);
	this.gradePixeladaBranca = new Grade (true);
	this.triangulo = new Triangulo([-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.0, 0.5, 0.0],[1,0,0,1,0,1,0,1,0,0,1,1]);
	this.criado = true;
      }
      mat4.lookAt(this.mLookAt, [0,0,5],[0,0,0],[0,1,0]);
    },
    tick:function()
    {
      if(!mvr.parado) requestAnimFrame(mvr.tick);
      mvr.desenharCena();
      mvr.animar();
      wglVars.old = wglVars.current;
    },
    animar:function()
    {
      var cor = [Math.random(),Math.random(),Math.random(),Math.random()];
      wglVars.current = new Date().getTime();
      var deltaT = (wglVars.current - wglVars.old) / 1000;
      mat4.rotateZ(this.mRotacao, this.mRotacao, deltaT * this.zRot * TORADIANS);
      mat4.rotateY(this.yRotationMatrix, this.yRotationMatrix, deltaT * this.yRotationRad);
      
      // Criar um triângulo pixelado colorido
      var cor1 = [1,0,0,1];
      var cor2 = [0,1,0,1];
      var cor3 = [0,0,1,1];
      this.pixelarTriangulo(this.gradePixelada, this.v1, this.v2, this.v3, cor1, cor2, cor3);
      
      var aleatorio = Math.random();
      
      // Criar um triângulo pixelado cinza
      var cor = [0.5,0.5,0.5,1];
      this.pixelarTriangulo(this.gradePixeladaBranca, this.v1, this.v2, this.v3, cor, cor, cor);
//       setPixel(this.gradePixeladaBranca, parseInt(Math.random()*this.gradePixelada.colunas),
// 	      parseInt(Math.random()*this.gradePixelada.linhas),[0.5, 0.5, 0.5, aleatorio]);
      
    },
    pixelarTriangulo: function(grade, v1, v2, v3, cor1, cor2, cor3)
    {
      grade.limpar();
      
      var p1t = [0,0,0];
      var p2t = [0,0,0];
      var p3t = [0,0,0];
      vec3.transformMat4(p1t, v1, this.mRotacao);//this.reta2Matrix);
      vec3.transformMat4(p2t, v2, this.mRotacao);//this.reta2Matrix);
      vec3.transformMat4(p3t, v3, this.mRotacao);//this.reta2Matrix);
      vec3.scaleAndAdd(p1t, [5,5,0], p1t, 5);
      vec3.scaleAndAdd(p2t, [5,5,0], p2t, 5);
      vec3.scaleAndAdd(p3t, [5,5,0], p3t, 5);
      
      setReta(grade, p1t, p2t, cor1, cor2, false);
      setReta(grade, p2t, p3t, cor2, cor3, false);
      setReta(grade, p1t, p3t, cor1, cor3, true);
      //setReta(grade, v2, v3, cor, false);
      //setReta(grade, v1, v3, cor, true);
    },
    desenharGrade:function(grade, obj, posicao, tipo=null)
    {
      // Grade com pontos
      var translacaoInv = mat4.create();
      var translacao = mat4.create();
      mat4.translate(translacao, translacao, posicao);
      mat4.invert(translacaoInv, translacao);
      
      mat4.mul(grade.mMatrix, translacao, grade.mMatrix);
      mat4.mul(obj.mMatrix, translacao, obj.mMatrix);
      
      DesenharObj(grade, wglVars.LINES);
      if(tipo) DesenharObj(obj, tipo);
      else     DesenharObj(obj, wglVars.TRIANGLES);
      
      mat4.mul(grade.mMatrix, grade.mMatrix, translacaoInv);
      mat4.mul(obj.mMatrix, obj.mMatrix, translacaoInv);
    },
    desenharCena:function()
    {
      mat4.mul(wglVars.vMatrix, this.mLookAt, this.yRotationMatrix);
      desenharCenaInicial();
      
      mat4.identity(this.grade.mMatrix);
      
      // Grade com pixels
      //this.desenharGrade(this.grade, this.triangulo, [-8,0,0], wglVars.POINTS);
      mat4.copy(this.triangulo.mMatrix, this.mRotacao);
      this.desenharGrade(this.grade, this.triangulo, [-4,0,0]);
      this.desenharGrade(this.grade, this.gradePixeladaBranca, [0,0,0]);
      this.desenharGrade(this.grade, this.gradePixelada, [4,0,0]);
    }
  };
  
  // SLIDE: DESENHO DE RETAS
  var ddr=
  {
    grade:null,
    reta:null,
    p1: [-0.45,-0.45,0],
    p2: [0.45,0.45,0],
    yRotation:10,
    zRotation:45,
    cor:[1,0,0,1],
    cor1:[1,0,0,1],
    cor2:[0,1,0,1],
    corApagada: [1,0,0,0],
    zRotationRad: 0,
    yRotationRad: 0,
    zRotationMatrix:mat4.create(),
    yRotationMatrix:mat4.create(),
    reta1Matrix:mat4.create(),
    reta2Matrix:mat4.create(),
    gradePixelada:null,
    gradeRetaPixelada:null,
    criado:false,
    parado:false,
    p1Antes:null,
    p1Depois:null,
    mLookAt:mat4.create(),
    init:function()
    {
      if(!this.criado)
      {
	this.grade = mvr.grade;
	this.reta = new Reta(this.p1,this.p2,this.cor1, this.cor2);
	this.gradePixelada = new Grade(true);
	this.p1Antes = [parseInt(this.p1[0]*5 + 5), parseInt(this.p1[1]*5 + 5)];
	this.p2Antes = [parseInt(this.p2[0]*5 + 5), parseInt(this.p2[1]*5 + 5)];
	setPixel(this.gradePixelada, this.p1Antes[0], this.p1Antes[1],this.cor1);
	setPixel(this.gradePixelada, this.p2Antes[0], this.p2Antes[1],this.cor2);
	this.gradeRetaPixelada = new Grade(true);
	this.zRotationRad = this.zRotation * TORADIANS;
	this.yRotationRad = this.yRotation * TORADIANS;
	mat4.translate(this.reta1Matrix, this.reta1Matrix, [-4,0,0]);
	mat4.lookAt(this.mLookAt, [0,0,5],[0,0,0],[0,1,0]);
	this.criado = true;
      }
      wglVars.vMatrix = mat4.create();
    },
    tick:function()
    {
      if(!ddr.parado) requestAnimFrame(ddr.tick);
      ddr.desenharCena();
      ddr.animar();
      wglVars.old = wglVars.current;
    },
    animar:function()
    {
      wglVars.current = new Date().getTime();
      var deltaT = (wglVars.current - wglVars.old) / 1000;
      mat4.rotateZ(this.reta1Matrix, this.reta1Matrix, deltaT * this.zRotationRad);
      mat4.rotateZ(this.reta2Matrix, this.reta2Matrix, deltaT * this.zRotationRad);
      mat4.rotateY(this.yRotationMatrix, this.yRotationMatrix, deltaT * this.yRotationRad);
    },
    desenharGrade:function(grade, obj, posicao, tipo=null)
    {
      DesenharObj(grade, wglVars.LINES);
      if(tipo) DesenharObj(obj, tipo);
      else     DesenharObj(obj, wglVars.TRIANGLES);
    },
    desenharCena:function()
    {
      mat4.mul(wglVars.vMatrix, this.mLookAt, this.yRotationMatrix);
      desenharCenaInicial();
      
      // Só a reta
      mat4.copy(this.reta.mMatrix, this.reta1Matrix);
      DesenharObj(this.reta, wglVars.LINES);
      
      // Reta com extremos pixelados
      mat4.copy(this.reta.mMatrix, this.reta2Matrix);
      mat4.translate(this.grade.mMatrix, mat4.create(), [0,0,0]);
      
      var p1t = [0,0,0];
      var p2t = [0,0,0];
      vec3.transformMat4(p1t, this.p1, this.reta2Matrix);
      vec3.transformMat4(p2t, this.p2, this.reta2Matrix);
      vec3.scaleAndAdd(p1t, [5,5,0], p1t, 5);
      vec3.scaleAndAdd(p2t, [5,5,0], p2t, 5);
      setPixel(this.gradePixelada, Math.floor(this.p1Antes[0]), Math.floor(this.p1Antes[1]),this.corApagada);
      setPixel(this.gradePixelada, Math.floor(this.p2Antes[0]), Math.floor(this.p2Antes[1]),this.corApagada);      
//       p1t[0] = Math.floor(p1t[0]);
//       p1t[1] = Math.floor(p1t[1]);
//       p2t[0] = Math.floor(p2t[0]);
//       p2t[1] = Math.floor(p2t[1]);
      setPixel(this.gradePixelada, Math.floor(p1t[0]),Math.floor(p1t[1]),this.cor1);
      setPixel(this.gradePixelada, Math.floor(p2t[0]),Math.floor(p2t[1]),this.cor2);
      
      // Reta pixelada
      setReta(this.gradeRetaPixelada, this.p1Antes, this.p2Antes, this.corApagada, this.corApagada, false); // Apagar reta anterior
      setReta(this.gradeRetaPixelada, p1t, p2t, this.cor1, this.cor2);
      
      mat4.copy(this.gradeRetaPixelada.mMatrix, this.grade.mMatrix);
      DesenharObj(this.reta, wglVars.LINES);
      this.desenharGrade(this.grade, this.gradePixelada, [0,0,0]);
      
      mat4.translate(this.grade.mMatrix, mat4.create(), [4,0,0]);
      mat4.copy(this.gradeRetaPixelada.mMatrix, this.grade.mMatrix);
      this.desenharGrade(this.grade, this.gradeRetaPixelada, [4,0,0]);
      
      this.p1Antes = p1t;
      this.p2Antes = p2t;
    }
  };
  
  
  var exemplo1 = createSVGGrid(10, 32, document.getElementById("exemplo1"));
  var snape1 = exemplo1.snapContainer;
  exemplo1.passoAtual = 0;
  exemplo1.mAtual = 0;
  exemplo1.bAtual = 0;
  var p1 = [-6,-3];
  var p2 = [10,3];
  var p1svg = exemplo1.fromGridToSVG(p1);
  var p2svg = exemplo1.fromGridToSVG(p2);
  var linha = snape1.line(p1svg[0], p1svg[1], p2svg[0], p2svg[1]);
  var circulo = snape1.circle(p1svg[0],p1svg[1],10).attr({fill:"red"});
  var circulo2 = snape1.circle(p2svg[0],p2svg[1],10).attr({fill:"red"});
  
  function movimentar(dx,dy,objeto,psvg,xattr,yattr,p)
  {
    dx *= exemplo1.escala;
    dy *= exemplo1.escala;
    var obj={};
    obj[xattr]=+x+dx;
    obj[yattr]=+y+dy;
    objeto.attr({cx:+x+dx,cy:+y+dy});
    //linha.attr({x1:+x+dx,y1:+y+dy});
    linha.attr(obj);
    psvg[0] = linha.attr(xattr);
    psvg[1] = linha.attr(yattr);
    if(p === p1)
      p1 = exemplo1.fromSVGToGrid(psvg);
    else
      p2 = exemplo1.fromSVGToGrid(psvg);
    calcularMeB(p1, p2);
    atualizarInterface();
    redesenharPassos();
  }
  
  
  circulo.drag(function(dx,dy){
    movimentar(dx,dy,circulo,p1svg,"x1","y1",p1);
  },function(){
    x = linha.attr("x1");
    y = linha.attr("y1");
    exemplo1.atualizarEscala();
  },function(){});
  
  circulo2.drag(function(dx,dy){
    movimentar(dx,dy,circulo2,p2svg,"x2","y2",p2);
  },function(){
    x = linha.attr("x2");
    y = linha.attr("y2");
    exemplo1.atualizarEscala();
  },function(){});
  
  function calcularMeB(p1, p2)
  {
    exemplo1.mAtual = (p2[1]-p1[1])/(p2[0]-p1[0]);
    exemplo1.bAtual = p1[1] - exemplo1.mAtual * p1[0];
  }
  function atualizarInterface()
  {
    mTexto.node.innerHTML = "m = "+Math.round10(exemplo1.mAtual,-2);
    bTexto.node.innerHTML = "b = "+Math.round10(exemplo1.bAtual,-2);
  }
  calcularMeB(p1,p2);
  var mTexto = snape1.text(0,40,"m = "+exemplo1.mAtual);
  var bTexto = snape1.text(0,80,"b = "+exemplo1.bAtual);
  var pTexto = snape1.text(0,120,"Interação #"+exemplo1.passoAtual);
  
  document.getElementById("e1previous").addEventListener("click", function(event)
  {
    if(exemplo1.passoAtual > 0)
    {
      exemplo1.passoAtual--;
      redesenharPassos();
    }
  });
  document.getElementById("e1next").addEventListener("click", function(event)
  {
    if(exemplo1.passoAtual < p2[0] - p1[0])
    {
      var xnovo = Math.floor(p1[0])+exemplo1.passoAtual;
      var ynovo = xnovo * exemplo1.mAtual + exemplo1.bAtual;
      exemplo1.setPixel(xnovo+exemplo1.colunas/2, exemplo1.linhas/2-ynovo, "#00F", 1.0);
      exemplo1.passoAtual++;
      pTexto.node.innerHTML = "Iteração #"+exemplo1.passoAtual;
    }
  });
  
  function redesenharPassos()
  {
    exemplo1.limparGradePixelada();
    if(exemplo1.passoAtual >= p2[0] - p1[0])
    {
      exemplo1.passoAtual = Math.floor(p2[0] - p1[0])+1;
    }
    for(var i = 1 ; i <= exemplo1.passoAtual; i++)
    {
      var xnovo = Math.floor(p1[0])+(i-1);
      var ynovo = xnovo * exemplo1.mAtual + exemplo1.bAtual;
      exemplo1.setPixel(xnovo+exemplo1.colunas/2, exemplo1.linhas/2-ynovo, "#00F", 1.0);
    }
    pTexto.node.innerHTML = "Iteração #"+exemplo1.passoAtual;
  }
  
  
  linha.attr({stroke:"#f00", strokeWidth:2});
//   {
//     exemplo1div: document.getElementById("exemplo1"),
//     snapExemplo:Snap("#exemplo1"),
//     linhasGrade:[[], []],
//     numLinhas:null,
//     numColunas:null,
//     espacoX:null,
//     espacoY:null,
//     linha:null,
//     init:function()
//     {
//       this.largura = this.exemplo1div.width.baseVal.value;
//       this.altura = this.exemplo1div.height.baseVal.value;
//       this.exemplo1div.viewBox = "0 0 "+this.largura+" "+this.altura;
//       //var bigCircle = s.circle(150, 150, 100);
//       var lineX = this.snapExemplo.line(0,this.altura/2,this.largura,this.altura/2);
//       var lineY = this.snapExemplo.line(this.largura/2,0,this.largura/2,this.altura);
//       //bigCircle.attr({fill:"#bada55",stroke: "#000",strokeWidth:5});
//       lineX.attr({stroke:"#000", strokeWidth:2});
//       lineY.attr({stroke:"#000", strokeWidth:2});
//       this.fazerGrade(10, 32);
//       this.fazerLinha([-16,-5], [5,5],"#F00");
//       this.exemplo1div.addEventListener("click", function(event){console.log(event);});
//     },
//     fazerGrade:function(linhas, colunas)
//     {
//       this.numLinhas = linhas;
//       this.numColunas = colunas;
//       this.espacoX = this.largura/colunas;
//       this.espacoY = this.altura/linhas;
//       // Fazer as linhas verticais
//       var posX = 0, posY = 0;
//       var atributos = {stroke:"#000", strokeWidth:1, "stroke-dasharray":"1, 3"};
//       for(var i = 0; i <= colunas; i++, posX+=this.espacoX)
//       {
// 	this.linhasGrade[0].push(this.snapExemplo.line(posX, 0, posX, this.altura));
// 	this.linhasGrade[0][i].attr(atributos);
//       }
//       for(var i = 0; i <= linhas; i++, posY+=this.espacoY)
//       {
// 	this.linhasGrade[1].push(this.snapExemplo.line(0, posY, this.largura, posY));
// 	this.linhasGrade[1][i].attr(atributos);
//       }
//     },
//     fazerLinha:function(p1, p2, cor)
//     {
//       var p1svg = this.fromGridToSVG(p1);
//       var p2svg = this.fromGridToSVG(p2);
//       linha = this.snapExemplo.line(p1svg[0],p1svg[1],p2svg[0],p2svg[1]);
//       linha.attr({stroke:cor, strokeWidth:2});
//     },
//     fromGridToSVG:function(pin)
//     {
//       return [pin[0]*this.espacoX+this.largura/2,this.altura/2 - pin[1]*this.espacoY];
//     }
//   };
  //exemplo1.init();
  initCanvas("mundovetorraster");
  atualizarCanvas();
}, false);