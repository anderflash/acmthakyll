all: local

revisao:
	./fazer revisao_algebra_linear && cd ../../../ && ./buildeploylocal && cd assets/files/mac0420
	./fazer triangle_strip_para_grade && cd ../../../ && ./buildeploylocal && cd assets/files/mac0420

local: fazer2
	cd ../../../ && ./buildeploylocal && cd assets/files/mac0420

net: fazer2
	cd ../../../ && ./buildeploy && cd assets/files/mac0420

fazer2:
	./fazer revisao_algebra_linear
	./fazer triangle_strip_para_grade

