all: qm_bibliography.pdf pedagogical_support.pdf

pedagogical_support.pdf: pedagogical_support.tex
	pdflatex pedagogical_support.tex

qm_bibliography.pdf: qm_bibliography.tex
	pdflatex qm_bibliography.tex
clean:
	rm -f *.aux
	rm -f *.log
	rm -f *.out
	rm -f qm_bibliography.pdf
	rm -f pedagogical_support.pdf
	rm -f *.toc
distclean: clean
	rm -f *~
