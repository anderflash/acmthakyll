// Parte MVR
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
    yRot:45,
    mRotacao:mat4.create(),
    gradePixelada:null,
    gradePixeladaBranca:null,
    criado:false,
    parado:false,
    init:function()
    {
      if(!this.criado)
      {
	this.grade = new Grade(false, [0,0,0.3,1]);
	this.gradePixelada = new Grade(true);
	this.gradePixeladaBranca = new Grade (true);
	this.triangulo = new Triangulo([-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.0, 0.5, 0.0],[1,0,0,1,1,0,0,1,1,0,0,1]);
	this.criado = true;
      }
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
      mat4.rotateZ(this.mRotacao, this.mRotacao, deltaT * this.zRot * Math.PI/180);
      setPixel(this.gradePixelada, parseInt(Math.random()*this.gradePixelada.colunas),
	      parseInt(Math.random()*this.gradePixelada.linhas),cor);
      
      var aleatorio = Math.random();
      setPixel(this.gradePixeladaBranca, parseInt(Math.random()*this.gradePixelada.colunas),
	      parseInt(Math.random()*this.gradePixelada.linhas),[1, 1, 1, aleatorio]);
      
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
      desenharCenaInicial();
      
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
    zRotation:45,
    zRotationMatrix:mat4.create(),
    gradePixelada:null,
    criado:false,
    parado:false,
    init:function()
    {
      if(!this.criado)
      {
	var p1 = [-0.45,-0.45,0];
	var p2 = [0.45,0.45,0];
	var cor = [1,0,0,1];
	this.grade = mvr.grade;
	this.reta = new Reta(p1,p2,cor);
	this.gradePixelada = new Grade(true);
	setPixel(this.gradePixelada, parseInt(p1[0]*5 + 5),parseInt(p1[1]*5 + 5),cor);
	setPixel(this.gradePixelada, parseInt(p2[0]*5 + 5),parseInt(p2[1]*5 + 5),cor);
	//setPixel(this.gradePixelada, parseInt(p2[0]*10 + 5),parseInt(p2[1]*10 + 5),cor);
	this.gradeRetaPixelada = new Grade(true);
	
	this.criado = true;
      }
    },
    tick:function()
    {
      if(!ddr.parado) requestAnimFrame(ddr.tick);
      ddr.desenharCena();
      ddr.animar();
    },
    animar:function()
    {
      wglVars.current = new Date().getTime();
      var deltaT = (wglVars.current - wglVars.old) / 1000;
      mat4.rotateZ(this.zRotationMatrix, zRotation/);
    },
    desenharGrade:function(grade, obj, posicao, tipo=null)
    {
      DesenharObj(grade, wglVars.LINES);
      if(tipo) DesenharObj(obj, tipo);
      else     DesenharObj(obj, wglVars.TRIANGLES);
    },
    desenharCena:function()
    {
      // Só a reta
      desenharCenaInicial();
      mat4.translate(this.reta.mMatrix, mat4.create(), [-4,0,0]);
      DesenharObj(this.reta, wglVars.LINES);
      
      // Reta com extremos pixelados
      mat4.translate(this.grade.mMatrix, mat4.create(), [0,0,0]);
      mat4.copy(this.gradeRetaPixelada.mMatrix, this.grade.mMatrix);
      mat4.copy(this.reta.mMatrix, this.grade.mMatrix);
      DesenharObj(this.reta, wglVars.LINES);
      this.desenharGrade(this.grade, this.gradePixelada, [0,0,0]);
      
      // Reta pixelada
      mat4.translate(this.grade.mMatrix, mat4.create(), [4,0,0]);
      mat4.copy(this.gradeRetaPixelada.mMatrix, this.grade.mMatrix);
      this.desenharGrade(this.grade, this.gradeRetaPixelada, [4,0,0]);
    }
  };
  
  initCanvas("mundovetorraster");
  atualizarCanvas();
}, false);