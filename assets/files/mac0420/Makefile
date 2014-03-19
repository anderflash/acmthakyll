all: local

revisao:
	./fazer revisao_algebra_linear && ./copiarSlides && cd ../../../ && ./buildeploylocal && cd assets/files/mac0420

local: fazer2
	./copiarSlides && cd ../../../ && ./buildeploylocal && cd assets/files/mac0420

net: fazer2
	cd ../../../ && ./buildeploy && cd assets/files/mac0420

fazer2:
	./fazer revisao_algebra_linear

