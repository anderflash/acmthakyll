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
	document.addEventListener("click",fuction(e)
	{
	  
	});
      });
    }
  };
  
  var objanimacao=
  {
    svg:Snap("#animacaoobj");
    seta:null,
    objPosicoes:null,
    objTexturas:null,
    objNormais:null,
    
    init:function()
    {
      var
    }
  };
  
  mouseslide.init();
  objanimacao.init();
});