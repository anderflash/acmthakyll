cmake_minimum_required(VERSION 2.8)

project(cuda_meu_gaussiano)

find_package(CUDA)
find_package(ImageMagick COMPONENTS display MagickCore)

include_directories(${ImageMagick_INCLUDE_DIRS})

include_directories(${PROJECTS_SOURCE_DIR}/andercamera)
link_directories(${PROJECTS_BINARY_DIR}/andercamera)

set(CMAKE_CXX_FLAGS "${CMAKE_C_FLAGS} -DMAGICKCORE_HDRI_ENABLE=0 -DMAGICKCORE_QUANTUM_DEPTH=16")
set(CUDA_NVCC_FLAGS ${CUDA_NVCC_FLAGS};-gencode;arch=compute_30,code=sm_30;-gencode;arch=compute_20,code=sm_20;)

cuda_compile(MAIN_O main.cu)

cuda_add_executable(cuda_meu_gaussiano ${MAIN_O})

target_link_libraries(cuda_meu_gaussiano ${ImageMagick_LIBRARIES})
target_link_libraries(cuda_meu_gaussiano andercamera)

install(TARGETS cuda_meu_gaussiano RUNTIME DESTINATION bin)
