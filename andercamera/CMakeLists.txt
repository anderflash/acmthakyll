cmake_minimum_required(VERSION 2.8)

project(andercamera)

add_library(andercamera SHARED andercamera.c)

install(TARGETS andercamera DESTINATION lib)
install(FILES andercamera.h DESTINATION include)