ABSTRACT=$(shell cat abstracts.txt | perl -ne "print if /^abstract/" | sed 's/abstract=//g')
RESUMO=$(shell cat abstracts.txt | perl -ne "print if /^resumo/" | sed 's/resumo=//g')

all: monografia

clean:
	rm monografia.pdf

monografia: 
	echo ${ABSTRACT}
	echo ${RESUMO}
	pandoc -s 2013-12-02-monography.md -o monografia.tex --latex-engine=xelatex --bibliography=library.bib --csl=ieee-with-url.csl -V documentclass=report -V lang=brazil --template=default.tex -V abstract=${ABSTRACT} -V resumo=${RESUMO} --toc -N
	xelatex monografia.tex
	makeglossaries monografia
	xelatex monografia.tex
