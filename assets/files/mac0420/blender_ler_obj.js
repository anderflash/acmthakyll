document.addEventListener('DOMContentLoaded', function(event)
{
  var mouseslide=
  {
    svg:Snap("#mouse"),
    init:function()
    {
      Snap.load("../../images/mouse.svg", function(f)
      {
	mouseslide.svg.append(f);
	document.addEventListener("click",function(e)
	{
	  
	});
      });
    }
  };
  
  var objanimacao=
  {
    dados:null,
    oldAttrPosicoes:null,
    oldAttrNormais:null,
    
    
    
    
    svg:Snap("#animacaoobj"),
    seta:null,
    qdrObjeto:null,
    txtObjeto:null,
    qdrPosicoes:null,
    txtPosicoes:[],
    qdrTexturas:null,
    txtTexturas:[],
    qdrNormais:null,
    txtNormais:[],
    qdrFaces:null,
    txtFaces:[],
    qdrVerticesFaces:[],
    txtVerticesFaces:[],
    objFaces:null,
    init:function()
    {
      this.rectAttr = {fill:"none", strokeWidth:2, stroke:"#000"};
      this.svg.attr({"font-size":"28px"});
      this.construirEstruturaObj("\
o Objeto1\n\
v  -0.5 -0.5  0.5\n\
v   0.5 -0.5  0.5\n\
v   0.5 -0.5 -0.5\n\
v  -0.5 -0.5 -0.5\n\
v  -0.5  0.5  0.5\n\
v   0.5  0.5  0.5\n\
v   0.5  0.5 -0.5\n\
v  -0.5  0.5 -0.5\n\
vt  0.0  0.0\n\
vt  1.0  0.0\n\
vt  1.0  1.0\n\
vt  0.0  1.0\n\
vn  1.0  0.0  0.0\n\
vn  0.0  1.0  0.0\n\
vn  0.0  0.0  1.0\n\
vn -1.0  0.0  0.0\n\
vn  0.0 -1.0  0.0\n\
vn  0.0  0.0 -1.0\n\
f  1/1/3 2/2/3 6/3/3\n\
f  1/1/3 6/3/3 5/4/3\n\
f  2/1/1 3/2/1 7/3/1\n\
f  2/1/1 7/3/1 6/4/1\n\
f  4/1/4 1/2/4 5/3/4\n\
f  4/1/4 5/3/4 8/4/4\n\
f  3/1/6 4/2/6 8/3/6\n\
f  3/1/6 8/3/6 7/4/6\n\
f  5/1/2 6/2/2 7/3/2\n\
f  5/1/2 7/3/2 8/4/2\n\
f  4/1/5 3/2/5 2/3/5\n\
f  4/1/5 2/3/5 1/4/5");
      
      
      
      
      
      
      
      
      
      
//       var criarTexto = function(x, y, texto){
// 	objeto = objanimacao.svg.text(x,y, texto);
// 	colorirComando(objeto);
// 	return objeto;
//       };
//       var colorirComando = function(objeto){objeto.selectAll("tspan:nth-child(1)").attr({fill:"#900"});};
//       this.svg.attr({"font-size":"28px"});
//       
//       // Todos os quadrados
//       var espacamento = 5;
//       var tamanhos = [570,110];
//       
//       
//       var ps=[5,45,160,275];
//       var p1 = 5, p2=45, p3=160, p4=275;
//       this.qdrObjeto = this.svg.rect(5,p1,590, 500).attr({fill:"none", strokeWidth:2, stroke:"#000"});
//       //this.qdrPosicoes = this.svg.rect(10,p2,570, 110).attr({fill:"none", strokeWidth:2, stroke:"#000"});
//       //this.qdrTexturas = this.svg.rect(10,p3,570, 110).attr({fill:"none", strokeWidth:2, stroke:"#000"});
//       //this.qdrNormais =  this.svg.rect(10,p4,570, 110).attr({fill:"none", strokeWidth:2, stroke:"#000"});
//       
//       this.txtObjeto = criarTexto(10, 35, ["o", " objeto1"]);
//       
//       var sub = {"baseline-shift":"sub", "dy":"8px", "font-size":"20px"};
//       var voltando = {"dy":"-8px"};
// 
//       var textos = ["v","vt","vn"];//["v", " v"+i,"x"," v"+i,"y"," v"+i,"z"], ["vt", " vt"+i,"s"," vt"+i,"t"], ["vn", " vn"+i,"x"," vn"+i,"y"," vn"+i,"z"]];
//       var indices = [["x","y","z"],["s","t"],["x","y","z"]];
//       
//       
//       
//       posicaoAtual = espacamento + 40;
//       for(var j = 0; j < 3; j++)
//       {
// 	this.svg.rect(10, posicaoAtual, tamanhos[0], tamanhos[1]).attr({fill:"none", strokeWidth:2, stroke:"#000"});
// 	posicaoAtual += 30;
// 	for(var i = 1; i <= 2; i++)
// 	{
// 	  var texto = [textos[j]];
// 	  for(var k = 0; k < indices[j].length; k++)
// 	  {
// 	    texto.push(" "+textos[j]+i, indices[j][k]);
// 	  }
// 	  var posicao = criarTexto(15, posicaoAtual, texto);
// 	  posicao.selectAll("tspan:nth-child(3)").attr(sub);
// 	  posicao.selectAll("tspan:nth-child(4)").attr(voltando);
// 	  posicao.selectAll("tspan:nth-child(5)").attr(sub);
//  	  if(texto.length > 3)
//  	  {
//  	    posicao.selectAll("tspan:nth-child(6)").attr(voltando);
//  	    posicao.selectAll("tspan:nth-child(7)").attr(sub);
//  	  }
// 	  posicaoAtual += 25;
// 	}
// 	for(var i = 0; i < 3; i++)
// 	{
// 	  this.svg.circle(tamanhos[0]/2, posicaoAtual + i * 10, 3).attr({fill:"#000"});
// 	}
// 	posicaoAtual += espacamento + 30;
//       }
      
      
//       for(var i = 1; i <= 2; i++)
//       {
// 	var posicao = criarTexto(15, p2 + 5 + i*25, ["v", " v"+i,"x"," v"+i,"y"," v"+i,"z"]);
// 	posicao.selectAll("tspan:nth-child(3)").attr(sub);
// 	posicao.selectAll("tspan:nth-child(4)").attr(voltando);
// 	posicao.selectAll("tspan:nth-child(5)").attr(sub);
// 	posicao.selectAll("tspan:nth-child(6)").attr(voltando);
// 	posicao.selectAll("tspan:nth-child(7)").attr(sub);
//       }
//       
//       for(var i = 1; i <= 2; i++)
//       {
// 	var textura = criarTexto(15, p3 + 5 + i*25, ["vt", " vt"+i,"s"," vt"+i,"t"]);
// 	textura.selectAll("tspan:nth-child(3)").attr(sub);
// 	textura.selectAll("tspan:nth-child(4)").attr(voltando);
// 	textura.selectAll("tspan:nth-child(5)").attr(sub);
//       }
//       
//       for(var i = 1; i <= 2; i++)
//       {
// 	var normal = criarTexto(15, p4 + 5 + i*25, ["vn", " vn"+i,"x"," vn"+i,"y"," vn"+i,"z"]);
// 	normal.selectAll("tspan:nth-child(3)").attr(sub);
// 	normal.selectAll("tspan:nth-child(4)").attr(voltando);
// 	normal.selectAll("tspan:nth-child(5)").attr(sub);
// 	normal.selectAll("tspan:nth-child(6)").attr(voltando);
// 	normal.selectAll("tspan:nth-child(7)").attr(sub);
//       }
      
      
      
      //this.objTexturas = Snap.text(100, 100, [])
      //this.
      //this.
      //this.
      //this.
      this.construirVetores();
    },
    construirEstruturaObj:function(data)
    {
      console.log(data);
      this.dados = data;
      this.oldAttrPosicoes = [];
      this.oldAttrNormais = [];
      this.oldAttrTexCoords = [];
      var faces = [];
      
      // Índice do próximo vértice
      var proximoI = 0;
      var bitsNormais = 4;
      var bitsPosicoes = 4;
      var bitsTexturas = 4;
      var vertices = Array(((1 << bitsNormais) << bitsPosicoes) << bitsTexturas);
      
      var linhas = this.dados.split('\n');
      var maximo = 0;
      var numLinhas = linhas.length;
      var posicaoX = 5;
      var posicaoY = 5;
      var rs = [];
      var primeiros = [true, true , true];
      
      for(var key = 0; key < numLinhas; key++)
      {
        var linha = linhas[key] + '';
        var partes = linha.split(/\s+/ig);
        switch(partes[0])
        {
	  case "o":
	    this.svg.rect(posicaoX, posicaoY, 500, 500).attr(this.rectAttr);
	    posicaoX += 5; posicaoY += 30; 
	    this.svg.text(posicaoX, posicaoY, partes[1]);
	    
	    for(var i = 0; i < 3; i++)
	    {
	      rs[i] = this.svg.rect(posicaoX, posicaoY, 400, 200).attr(this.rectAttr);
	    }
	    posicaoY += 35;
	    posicaoX += 5;
	  break;
          case "v":
	    if(primeiros[0])
	    {
	      rs[0].attr({y:posicaoY-30});
	      primeiros[0] = false;
	    }
            this.oldAttrPosicoes.push(parseFloat(partes[1]),parseFloat(partes[2]),parseFloat(partes[3]));
	    var texto = [partes[0], " " + partes[1], " " + partes[2]," " + partes[3]];
	    this.svg.text(posicaoX, posicaoY, texto);
	    posicaoY += 30;
          break;
          case "vn":
	    if(primeiros[2])
	    {
	      posicaoY += 5;
	      var tamanho = posicaoY-30-parseInt(rs[1].attr("y"));
	      rs[1].attr({height:tamanho});
	      rs[2].attr({y:posicaoY-30});
	      primeiros[2] = false;
	    }
	    this.oldAttrNormais.push(parseFloat(partes[1]),parseFloat(partes[2]),parseFloat(partes[3]));
	    var texto = [partes[0], " " + partes[1], " " + partes[2]," " + partes[3]];
	    this.svg.text(posicaoX, posicaoY, texto);
	    posicaoY += 30;
          break;
          case "vt":
	    if(primeiros[1])
	    {
	      posicaoY += 5;
	      var tamanho = posicaoY-30-parseInt(rs[0].attr("y"));
	      rs[0].attr({height:tamanho});
	      rs[1].attr({y:posicaoY-30});
	      primeiros[1] = false;
	    }
	    this.oldAttrTexCoords.push(parseFloat(partes[1]),parseFloat(partes[2]));
	    var texto = [partes[0], " " + partes[1], " " + partes[2]];
	    this.svg.text(posicaoX, posicaoY, texto);
	    posicaoY += 30;
          break;
          case "f":
//             var comp = partes.length;
// 	    for(var facei = 1; facei < comp; facei++)
//             {
// 	      var face = partes[facei];
// 	      var indicesAttr = face.split('/');
// 	      var iposicao = parseInt(indicesAttr[0])-1;
// 	      var inormal = parseInt(indicesAttr[2])-1;
// 	      
// 	      if(vertices[(iposicao << bitsNormais) + inormal] !== undefined)
// 	      {
// 		this.attrIndices.push(vertices[(iposicao << bitsNormais) + inormal]);
// 	      }
// 	      else
// 	      {
// 		this.attrPosicoes.pushArray(this.oldAttrPosicoes.slice(3*iposicao, 3*(iposicao+1)));
// 		this.attrNormais.pushArray(this.oldAttrNormais.slice(3*inormal, 3*(inormal+1)));
// 		this.attrIndices.push(proximoI);
// 		vertices[(iposicao << bitsNormais) + inormal] = proximoI;
// 		proximoI++;
// 	      }
// 	    }
          break;
        }
      }
    },
    construirVetores:function()
    {
      var labelFormat = {"font-size":"20px"};
      // Construir a lista de posições
      var posicaoX = 605;
      var posicaoY;
      var textos = [["pos.","posNova"],["tex.","texNova"],["nor.","norNova."]];
      for(var i = 0; i < 3; i++)
      {
	posicaoY = 30;
	for(var j = 0; j < 2; j++)
	{
	  this.svg.text(posicaoX,posicaoY,textos[i][j]).attr(labelFormat);
	  this.svg.rect(posicaoX,posicaoY+5,75,250).attr(this.rectAttr);
	  posicaoY += 285;
	}
	posicaoX += 90;
      }
      
      posicaoY = 175;
      this.svg.text(posicaoX,posicaoY,"indice").attr(labelFormat);
      this.svg.rect(posicaoX,posicaoY+5,75,250).attr(this.rectAttr);
    }
  };
  
  mouseslide.init();
  objanimacao.init();
});