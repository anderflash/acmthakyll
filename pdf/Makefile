all: monografia.pdf

clean:
	rm monografia.pdf

monografia.pdf: 2013-12-02-monography.md
	pandoc -s 2013-12-02-monography.md -o monografia.pdf --latex-engine=xelatex --bibliography=${HOME}/Dropbox/bibtex/library.bib --csl=ieee-with-url.csl -V documentclass=report -V lang=brazil
