// Parte Comum
var wglVars = 
{
  LINES:null,
  TRIANGLES:null,
  TRIANGLE_STRIP:null,
  POINTS:null,
  canvas:null,
  gl:null,
  shaderProgram:null,
  fShader:null,
  vShader:null,
  aPosition:null,
  aColor:null,
  uM:null,
  uV:null,
  uP:null,
  vMatrix:null,
  pMatrix:null,
  old:null,
  current:null
}
function initCanvas(nome)
{
  wglVars.canvas = document.getElementById(nome);
  wglVars.gl = wglVars.canvas.getContext("webgl") || wglVars.canvas.getContext("experimental-webgl"); 
  wglVars.gl.clearColor(1.0,1.0,1.0,1.0);
  wglVars.gl.enable(wglVars.gl.DEPTH_TEST);
  wglVars.gl.enable(wglVars.gl.BLEND);
  wglVars.gl.blendFunc(wglVars.gl.SRC_ALPHA, wglVars.gl.ONE_MINUS_SRC_ALPHA);
  wglVars.LINES = wglVars.gl.LINES;
  wglVars.TRIANGLES = wglVars.gl.TRIANGLES;
  wglVars.TRIANGLE_STRIP = wglVars.gl.TRIANGLE_STRIP;
  wglVars.POINTS = wglVars.gl.POINTS;

  // Shaders
  wglVars.shaderProgram = wglVars.gl.createProgram();
  wglVars.vShader = wglVars.gl.createShader(wglVars.gl.VERTEX_SHADER);
  wglVars.fShader = wglVars.gl.createShader(wglVars.gl.FRAGMENT_SHADER);
  wglVars.gl.shaderSource(wglVars.vShader, " \
    attribute vec3 aPosition; \
    attribute vec4 aColor; \
    varying vec4 vColor; \
    uniform mat4 M, V, P; \
    void main(){ \
      vColor = aColor; \
      gl_Position = P * V * M * vec4(aPosition,1.0); \
    }");wglVars.gl.compileShader(wglVars.vShader);
  wglVars.gl.shaderSource(wglVars.fShader, "\
    precision mediump float;\
    varying vec4 vColor;\
    void main(){\
      gl_FragColor = vColor;\
    }");wglVars.gl.compileShader(wglVars.fShader);
  wglVars.gl.attachShader(wglVars.shaderProgram, wglVars.vShader);
  wglVars.gl.attachShader(wglVars.shaderProgram, wglVars.fShader);
  wglVars.gl.linkProgram(wglVars.shaderProgram);
  wglVars.aPosition = wglVars.gl.getAttribLocation(wglVars.shaderProgram,"aPosition");
  wglVars.aColor    = wglVars.gl.getAttribLocation(wglVars.shaderProgram,"aColor");
  wglVars.uM        = wglVars.gl.getUniformLocation(wglVars.shaderProgram, "M");
  wglVars.uV        = wglVars.gl.getUniformLocation(wglVars.shaderProgram, "V");
  wglVars.uP        = wglVars.gl.getUniformLocation(wglVars.shaderProgram, "P");
  wglVars.gl.enableVertexAttribArray(wglVars.aPosition);
  wglVars.gl.enableVertexAttribArray(wglVars.aColor);

  wglVars.gl.useProgram(wglVars.shaderProgram);

  wglVars.vMatrix = mat4.create();
  wglVars.pMatrix = mat4.create();

  mat4.perspective(wglVars.pMatrix,45,wglVars.canvas.width/wglVars.canvas.height,0.1,100);
  mat4.lookAt(wglVars.vMatrix, [0,0,5],[0,0,0],[0,1,0]);

  wglVars.old = new Date().getTime();
}

function UploadBuffer(grade)
{
  grade.bVertices = wglVars.gl.createBuffer();
  grade.bCores = wglVars.gl.createBuffer();
  grade.bIndices = wglVars.gl.createBuffer();
  wglVars.gl.bindBuffer(wglVars.gl.ARRAY_BUFFER, grade.bVertices);
  wglVars.gl.bufferData(wglVars.gl.ARRAY_BUFFER, new Float32Array(grade.vertices), wglVars.gl.STATIC_DRAW);
  wglVars.gl.bindBuffer(wglVars.gl.ARRAY_BUFFER, grade.bCores);
  wglVars.gl.bufferData(wglVars.gl.ARRAY_BUFFER, new Float32Array(grade.cores), wglVars.gl.STATIC_DRAW);
  wglVars.gl.bindBuffer(wglVars.gl.ELEMENT_ARRAY_BUFFER, grade.bIndices);
  wglVars.gl.bufferData(wglVars.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(grade.indices), wglVars.gl.STATIC_DRAW);
}

var inherits = function(ctor, superCtor) { // took this right from requrie('util').inherits
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

function Cena()
{
  vMatrix;
  pMatrix;
  this.objetos;
  this.slides;
}

function Objeto3D()
{
  this.vertices= [];
  this.cores= [];
  this.indices= [];
  this.bVertices=null;
  this.bCores=null;
  this.bIndices=null;
  this.mMatrix = mat4.create();
}

function Triangulo(vertices, cores)
{
  Triangulo.super_.call(this);
  this.vertices = vertices;
  this.indices = [0,1,2];
  this.cores = cores;
  UploadBuffer(this);
}
inherits(Triangulo, Objeto3D);

function Piramide(vertices, cores)
{
  Piramide.super_.call(this);
}
inherits(Piramide, Objeto3D);

function Reta(p1, p2, cor)
{
  Reta.super_.call(this);
  this.vertices=[p1[0],p1[1],p1[2],p2[0],p2[1],p2[2]];
  this.cores = [cor[0],cor[1],cor[2],cor[3],cor[0],cor[1],cor[2],cor[3]];
  this.indices = [0,1];
  UploadBuffer(this);
}
inherits(Reta, Objeto3D);


function Grade(pixelado = false, cor=null, linhas = 10, colunas = 10)
{
  Grade.super_.call(this);
  this.linhas= linhas;
  this.colunas=colunas;
  
  if(pixelado)
  {
    if(cor === null)	cores = [];
    else 		cores = cor;
    
    var numX = this.colunas;
    var numZ = this.linhas;
    var espacoX = 2/this.linhas;    var espacoY = 2/this.colunas;
    
    var posY = -1;
    for(var i = 0; i < numZ; i++)
    {
      var posX = -1;
      for(var j = 0; j < numX; j++)
      {
	this.vertices.push(posX        , posY,0.0,
			    posX+espacoX, posY,0.0,
			    posX+espacoX, posY+espacoY,0.0,
			    posX        , posY+espacoY,0.0);
	var indice = i*this.linhas+j;
	for(var k = 0; k < 4; k++)
	{
	  if(cores[indice]) this.cores.push(cores[indice][0], cores[indice][1],cores[indice][2],cores[indice][3]);
	  else 	  	  this.cores.push(1,1,1,0);
	}
	var indice4 = indice << 2;
	this.indices.push(indice4+0,indice4+1,indice4+2,indice4+0,indice4+2,indice4+3);
	posX += espacoX;
      }
      posY += espacoY;
    }
  }
  else
  {
    if(cor === null)	cor = [1,1,1,1];
    
    var espacoX = 2/this.linhas;    var espacoY = 2/this.colunas;
    for(var i = 0, numero = this.linhas+this.colunas+2; i < numero; i++)
    {
      if(i <= this.linhas){ var ynovo = -1 + espacoY * i;
		      this.vertices.push(-1, ynovo, 0, 1, ynovo, 0);}
      else          { var xnovo = -1 + espacoX * (i-this.linhas-1);
		      this.vertices.push(xnovo, -1, 0, xnovo, 1, 0);}
      this.cores.push(cor[0],cor[1],cor[2],cor[3], cor[0],cor[1],cor[2],cor[3]);
      this.indices.push(i<<1,(i<<1)+1);
    }
    
  }
  UploadBuffer(this);
  this.limpar = function()
  {
    for(var i = 0; i < this.linhas; i++)
    {
      for(var j = 0; j < this.colunas; j++)
      {
	var indice = i* this.colunas + j;
	for(var k = 0; k < 4; k++)
	{
	  this.cores[(indice<<2)+k+0] = 1;
	  this.cores[(indice<<2)+k+1] = 1;
	  this.cores[(indice<<2)+k+2] = 1;
	  this.cores[(indice<<2)+k+3] = 0;
	}
      }
    }
    wglVars.gl.bindBuffer(wglVars.gl.ARRAY_BUFFER, grade.bCores);
    wglVars.gl.bufferData(wglVars.gl.ARRAY_BUFFER, new Float32Array(grade.cores), wglVars.gl.STATIC_DRAW);
  }
}
inherits(Grade, Objeto3D);

function DesenharObj(obj, tipo)
{
  wglVars.gl.uniformMatrix4fv(wglVars.uM, false, obj.mMatrix);
  wglVars.gl.bindBuffer(wglVars.gl.ARRAY_BUFFER, obj.bVertices);
  wglVars.gl.vertexAttribPointer(wglVars.aPosition, 3, wglVars.gl.FLOAT, false, 0, 0);
  wglVars.gl.bindBuffer(wglVars.gl.ARRAY_BUFFER, obj.bCores);
  wglVars.gl.vertexAttribPointer(wglVars.aColor, 4, wglVars.gl.FLOAT, false, 0, 0);
  wglVars.gl.bindBuffer(wglVars.gl.ELEMENT_ARRAY_BUFFER, obj.bIndices);
  wglVars.gl.drawElements(tipo, obj.indices.length, wglVars.gl.UNSIGNED_SHORT, 0);
}

function setPixel(grade,x,y,cor)
{
  // tamV * qtdV * indice
  var indice = 4 * 4 * (y*grade.linhas + x);
  for(var j = 0; j < 4; j++)
  {
    for(var i =0; i < 4; i++)
      grade.cores[indice+i+j*4] = cor[i];
  }
  wglVars.gl.bindBuffer(wglVars.gl.ARRAY_BUFFER, grade.bCores);
  wglVars.gl.bufferData(wglVars.gl.ARRAY_BUFFER, new Float32Array(grade.cores), wglVars.gl.STATIC_DRAW);
}

function desenharCenaInicial()
{
  wglVars.gl.clear(wglVars.gl.COLOR_BUFFER_BIT| wglVars.gl.DEPTH_BUFFER_BIT);
  wglVars.gl.uniformMatrix4fv(wglVars.uV, false, wglVars.vMatrix);
  wglVars.gl.uniformMatrix4fv(wglVars.uP, false, wglVars.pMatrix);
}

function pixelarReta(gradePixelada, reta)
{
  
}