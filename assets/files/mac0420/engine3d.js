// Closure
(function(){

	/**
	 * Decimal adjustment of a number.
	 *
	 * @param	{String}	type	The type of adjustment.
	 * @param	{Number}	value	The number.
	 * @param	{Integer}	exp		The exponent (the 10 logarithm of the adjustment base).
	 * @returns	{Number}			The adjusted value.
	 */
	function decimalAdjust(type, value, exp) {
		// If the exp is undefined or zero...
		if (typeof exp === 'undefined' || +exp === 0) {
			return Math[type](value);
		}
		value = +value;
		exp = +exp;
		// If the value is not a number or the exp is not an integer...
		if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
			return NaN;
		}
		// Shift
		value = value.toString().split('e');
		value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
		// Shift back
		value = value.toString().split('e');
		return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	}

	// Decimal round
	if (!Math.round10) {
		Math.round10 = function(value, exp) {
			return decimalAdjust('round', value, exp);
		};
	}
	// Decimal floor
	if (!Math.floor10) {
		Math.floor10 = function(value, exp) {
			return decimalAdjust('floor', value, exp);
		};
	}
	// Decimal ceil
	if (!Math.ceil10) {
		Math.ceil10 = function(value, exp) {
			return decimalAdjust('ceil', value, exp);
		};
	}

})();

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

function Reta(p1, p2, cor1, cor2)
{
  Reta.super_.call(this);
  this.vertices=[p1[0],p1[1],p1[2],p2[0],p2[1],p2[2]];
  this.cores = [cor1[0],cor1[1],cor1[2],cor1[3],cor2[0],cor2[1],cor2[2],cor2[3]];
  this.indices = [0,1];
  this.p1 = p1;
  this.p2 = p2;
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
    var ind = 0;
    var numero = this.linhas * this.colunas * 4 * 4;
    for(var i = 0; i < numero; i++)
      this.cores[i] = 0;
    wglVars.gl.bindBuffer(wglVars.gl.ARRAY_BUFFER, this.bCores);
    wglVars.gl.bufferData(wglVars.gl.ARRAY_BUFFER, new Float32Array(this.cores), wglVars.gl.STATIC_DRAW);
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

function setReta(gradePixelada, p1, p2, cor1, cor2, upload = true)
{
  var delta = [0,0,0];
  vec3.subtract(delta, p2,p1);
  if((Math.abs(delta[1]) > Math.abs(delta[0]) && delta[1] < 0) ||
       (Math.abs(delta[0]) > Math.abs(delta[1]) && delta[0] < 0)  )
  {
    var tmp = p1;
    p1 = p2;
    p2 = tmp;
    tmp = cor1;
    cor1 = cor2;
    cor2 = tmp;
  }
  var m = null, mi = null;
  
  if(delta[1] == 0) m = 0;
  else if(delta[0] != 0) m = (p2[1] - p1[1])/(p2[0] - p1[0]);
  else 
  {
    mi = 0;
    m = 2;
  }
  
  var y = p1[1];
  var x = p1[0];
  var indice;
  if(Math.abs(m) <= 1)
  {
    var corinc = [(cor2[0]-cor1[0])/Math.abs(delta[0]),
                  (cor2[1]-cor1[1])/Math.abs(delta[0]),
                  (cor2[2]-cor1[2])/Math.abs(delta[0]),
                  (cor2[3]-cor1[3])/Math.abs(delta[0])];
    var corint = [cor1[0],cor1[1],cor1[2],cor1[3]];
    
    for(var i = Math.floor(p1[0]); i <= Math.floor(p2[0]); i++, y += m)
    {
      indice = (Math.floor(y)*gradePixelada.linhas + i) << 4;
      for(var j = 0; j < 4; j++)
	for(var k = 0; k < 4; k++, indice++)
	  gradePixelada.cores[indice] = corint[k];
      
      for(var k = 0; k < 4; k++)
	corint[k] += corinc[k];
    }
  }
  else
  {
    var corinc = [(cor2[0]-cor1[0])/Math.abs(delta[1]),
                  (cor2[1]-cor1[1])/Math.abs(delta[1]),
                  (cor2[2]-cor1[2])/Math.abs(delta[1]),
                  (cor2[3]-cor1[3])/Math.abs(delta[1])];
    var corint = [cor1[0],cor1[1],cor1[2],cor1[3]];
    
    if(mi === null) mi = 1/m;
    for(var i = Math.floor(p1[1]); i <= Math.floor(p2[1]); i++, x += mi)
    {
      indice = (i*gradePixelada.linhas + Math.floor(x)) << 4;
      for(var j = 0; j < 4; j++)
	for(var k = 0; k < 4; k++, indice++)
	  gradePixelada.cores[indice] = corint[k];

      for(var k = 0; k < 4; k++)
	corint[k] += corinc[k];
    }
  }
  if(upload)
  {
    wglVars.gl.bindBuffer(wglVars.gl.ARRAY_BUFFER, gradePixelada.bCores);
    wglVars.gl.bufferData(wglVars.gl.ARRAY_BUFFER, new Float32Array(gradePixelada.cores), wglVars.gl.STATIC_DRAW);
  }
}

function collectionHas(a, b) { //helper function (see below)
    for(var i = 0, len = a.length; i < len; i ++) {
        if(a[i] == b) return true;
    }
    return false;
}
function findParentBySelector(elm, selector) {
    var all = document.querySelectorAll(selector);
    var cur = elm.parentNode;
    while(cur && !collectionHas(all, cur)) { //keep going up until you find a match
        cur = cur.parentNode; //go up
    }
    return cur; //will return null if not found
}

function transformEventCoordsToNodeCoords(evt,node, svgelement)
{
  var point = svgelement.createSVGPoint();
  point.x = evt.clientX;
  point.y = evt.clientY;

  var ctm = node.getScreenCTM();
  return point.matrixTransform(ctm.inverse());
}



function alert_coords(pt, evt, svg) {
    pt.x = evt.screenX;
    pt.y = evt.screenY;
    console.log("$" + evt.screenX + ", " + evt.screenY + "$");
    console.log("|" + evt.clientX + ", " + evt.clientY + "|");
    console.log("%" + evt.pageX + ", " + evt.pageY + "%");
    // The cursor point, translated into svg coordinates
    var cursorpt =  pt.matrixTransform(svg.getScreenCTM().inverse());
    console.log("(" + cursorpt.x + ", " + cursorpt.y + ")");
}

function toViewboxCoordinate(evento, largura, altura)
{
  var rect = evento.target.getBoundingClientRect();
  return [(evento.pageX - rect.left)/rect.width * largura,
          (evento.pageY - rect.top)/rect.height * altura];
}
function createSVGGrid(linhas, colunas, svg)
{
  var grid = {
    container: svg,        // SVG no formato original
    snapContainer:null,    // SVG no formato Snap
    linhas:linhas,         // Número de linhas na grade
    colunas:colunas,       // Número de colunas na grade
    largura:null,          // Largura do svg
    altura:null,           // Altura do svg
    celula:[],           // Células da grade
    eixoX:null,            // Linha horizontal do eixo X
    eixoY:null,            // Linha vertical do eixo Y
    linhasGrade:[[] , []], // [eixos verticais, eixos horizontais]
    gradePixelada:[],
    init:function()
    {
      this.largura = svg.width.baseVal.value;
      this.altura = svg.height.baseVal.value;
      this.celula[0] = this.largura/colunas;
      this.celula[1] = this.altura/linhas;
      
      
      this.snapContainer = Snap(svg);
      
      this.fazerGradePixelada("#00F");
      this.fazerGrade(linhas, colunas, "#000");
      this.eixoX = this.snapContainer.line(0, this.altura/2, this.largura-10, this.altura/2);
      this.eixoY = this.snapContainer.line(this.largura/2, this.altura, this.largura/2, 10);
      this.path = this.snapContainer.path("M 0 0 L 0 10 L 10 5 z");
      this.markerX = this.path.marker(0,0,10,10,5,5);
      this.markerX.attr({orient:"auto"});
      //this.markerY = this.path.marker(0,0,5,5,1,5);
      var atributoX = {stroke:"#000", strokeWidth:2, "marker-end":this.markerX};
      var atributoY = {stroke:"#000", strokeWidth:2, "marker-end":this.markerX};
      this.eixoX.attr(atributoX);
      this.eixoY.attr(atributoY);
      this.escala = this.largura/this.container.getBoundingClientRect().width;
    },
    atualizarEscala:function()
    {
      this.escala = this.largura/this.container.getBoundingClientRect().width;
    },
    fazerGrade:function(linhas, colunas, cor)
    {
      // Fazer as linhas verticais
      var posX = 0, posY = 0;
      var atributos = {stroke:cor, strokeWidth:1, "stroke-dasharray":"1, 3"};
      for(var i = 0; i <= colunas; i++, posX+=this.celula[0])
      {
	this.linhasGrade[0].push(this.snapContainer.line(posX, 0, posX, this.altura));
	this.linhasGrade[0][i].attr(atributos);
      }
      for(var i = 0; i <= linhas; i++, posY+=this.celula[1])
      {
	this.linhasGrade[1].push(this.snapContainer.line(0, posY, this.largura, posY));
	this.linhasGrade[1][i].attr(atributos);
      }
    },
    fromGridToSVG:function(pin)
    {
      return [pin[0]*this.celula[0]+this.largura/2,this.altura/2 - pin[1]*this.celula[1]];
    },
    fromSVGToGrid:function(pin)
    {
      return [(pin[0]-this.largura/2)/this.celula[0],(this.altura/2 - pin[1])/this.celula[1]];
    },
    fazerGradePixelada:function(cor)
    {
      for(var i = 0; i < this.linhas; i++)
      {
	for(var j = 0; j < this.colunas; j++)
	{
	  var rect = this.snapContainer.rect(j * this.celula[0], i * this.celula[1], this.celula[0],this.celula[1]);
	  rect.attr({fill:cor, opacity:0.0});
	  this.gradePixelada.push(rect);
	}
      }
    },
    limparGradePixelada:function()
    {
      var numero = this.linhas * this.colunas;
      for(var i = 0; i < numero; i++)
	this.gradePixelada[i].attr({opacity:0.0});
    },
    setPixel:function(x,y,cor,opacidade)
    {
      this.gradePixelada[Math.floor(y)*this.colunas + x].attr({fill:cor, opacity:opacidade});
    }
  };
  grid.init();
  return grid;
}
