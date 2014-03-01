

~~~~ {#mycode .javascript .numberLines hl_lines="1 3" startFrom="1"}
    function iniciarShaders()
    {
      var vertexShader = getShader(gl, "#shader-vs");
      var fragmentShader = getShader(gl, "#shader-fs");
      
      shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);
      
      if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
      {
	alert("Não pode inicializar shaders");
      }
      
      gl.useProgram(shaderProgram);
      
      shaderProgram.vertexPositionAttribute = gl.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
      gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
      
      shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
      gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
      
      shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 
		    "uPMatrix");
      shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, 
		    "uVMatrix");
      shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, 
		    "uMMatrix");
      
      
    }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~