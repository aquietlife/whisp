# Whisp 

_An Environmental Sound Classifier_

This project comprises of three main parts:

- Dataset notebook, which shows you how to make spectrograms from the ESC-50 dataset. It also shows you how to make gifs as well, for fun ;)

- Learner notebook, which shows how to build our classification model with fastai

- Web app, which allows you to predict sound classfication with our model!

## Installation

Install conda:

`brew install conda`

Creae a new conda environment:

`conda create -n esc python=3.6`

Activate your environment:

`conda activate esc`

Install required libraries:

`pip install -r requirements.txt`

Then you should be good to go!

## Spectrogram Generator

Based on this dataset:

https://github.com/karoldvl/ESC-50

Paper:

http://karol.piczak.com/papers/Piczak2015-ESC-Dataset.pdf

To get dataset:

`curl -LO https://github.com/karoldvl/ESC-50/archive/master.zip`

`unzip masters`

Install:

conda install jupyter

conda install -c conda-forge librosa

conda install pandas

## Learner Model


## Web Server

_If you have errors running the app with errors about 'installing Python as a framework', try runnning `conda install matplotlib`_

To run the web server, run:

`python esc.py serve`
`
