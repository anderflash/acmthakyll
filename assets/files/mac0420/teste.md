~~~~ {#mycode .javascript .numberLines startFrom="5"}
for(var i = 0; i < numZ; i++)
{
  for(var j = 0; j < numX; j++)
  {
      vertices.push(i/numX,0.0,-j/numZ);
      if(i%2) indices.push((i+1)*numX-(j+1),(i+2)*numX-(j+1));
      else    indices.push(i*numX+j,(i+1)*numX+j);
  }
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~