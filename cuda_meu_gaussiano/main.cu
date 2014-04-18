#include <stdio.h>
#include <magick/MagickCore.h>
#include <andercamera.h>

__global__
void brilho(Quantum * pixels, int columns, int rows)
{

	int x = blockDim.x * blockIdx.x + threadIdx.x;
	int y = blockDim.y * blockIdx.y + threadIdx.y;
	if(x >= columns || y >= rows) return;
	int i = y * columns + x;

  int incremento = 100 * (QuantumRange+1)/256;
	if(i < rows*columns)
	{
	  int j = 4*i;
		pixels[j  ] = min(pixels[j  ]+incremento, QuantumRange);
		pixels[j+1] = min(pixels[j+1]+incremento, QuantumRange);
		pixels[j+2] = min(pixels[j+2]+incremento, QuantumRange);
		pixels[j+3] = min(pixels[j+3]+incremento, QuantumRange);
	}
}

__global__
void gaussiano(Quantum * pixels, int columns, int rows)
{
  /*Quantum * filtro[] = {0,2,0,2,2,2,0,2,0};
	int x = blockDim.x * blockIdx.x + threadIdx.x;
	int y = blockDim.y * blockIdx.y + threadIdx.y;
	if(x >= columns || y >= rows) return;
	int i = y * columns + x;
  int i = y * 
*/
}

__global__
void separar(const unsigned short* colormap, unsigned short* red, unsigned short* green, unsigned short* blue, int rows, int columns)
{
	int x = blockDim.x * blockIdx.x + threadIdx.x;
	int y = blockDim.y * blockIdx.y + threadIdx.y;
	int i = y*columns+x;
	int j = 4*i;
	if(i < rows*columns)
	red[i] = min(colormap[j] + 10,255);
	green[i] = min(colormap[j+1] + 10, 255);
	blue[i] = min(colormap[j+2] + 10, 255);
}

int main(int argc, char**argv)
{
	Camera camera;
	ANDERopen_device(&camera);
	ANDERinit_device(&camera);
	ANDERstart_capturing(&camera);
	
	ExceptionInfo *exception;
	Image *image;
	ImageInfo *image_info;

  // Lendo a imagem
	MagickCoreGenesis(*argv, MagickTrue);          // Inicializando Magick
	exception = AcquireExceptionInfo();            // Criando controle de exceção
	image_info = CloneImageInfo((ImageInfo*) NULL);// Criando objeto de info da imagem
	strcpy(image_info->filename, "imagem.jpg");
	image = ReadImage(image_info, exception);      // Lendo a imagem e preenchendo a info e a exceção

  // Tratando exceção
	if(exception->severity != UndefinedException)  // Se houver exceção
		CatchException(exception);                   // Mostre a exceção
	if(image == (Image*) NULL)                     // Se não conseguir carregar a imagem
	{
		exit(1);                                     // Feche
	}
	
	void* p;
	int size;
	
	ANDERread_frame(&camera,&p,&size);
	

	// Exibindo a imagem

	//DisplayImages(image_info, image);

	PixelPacket* pixels = GetAuthenticPixels(image, 0, 0, image->columns, image->rows, exception);
	
	printf("Comeco\n");
	
	Quantum* d_pixels;
	int tamanho = image->columns * image->rows * sizeof(Quantum);

	cudaMalloc(&d_pixels, tamanho*4);

	cudaMemcpy(d_pixels, pixels, tamanho*4, cudaMemcpyHostToDevice);
	
  dim3 blockSize(32,32,1);
	dim3 gridSize((image->columns + blockSize.x-1)/blockSize.x,(image->rows + blockSize.y-1)/blockSize.y,1);

	printf("Função\n");

	brilho<<<gridSize, blockSize>>>(d_pixels, image->columns, image->rows);

	cudaMemcpy(pixels, d_pixels, tamanho*4, cudaMemcpyDeviceToHost);

	/*Image* image2 = BlobToImage(image_info, blob, length, exception);

	if(exception->severity != UndefinedException)  // Se houver exceção
		CatchException(exception); 
	if(image2 == (Image*) NULL)
	{
		exit(1);
	}
	
	printf("Final\n");
	for(int i = 0; i < 10; i++)
	{
		printf("%d\n",blob[i]);
	}*/

	SyncAuthenticPixels(image,exception);

	DisplayImages(image_info,image);
	


	
	return 0;

}
