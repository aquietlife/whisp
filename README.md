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

`conda create -n whisp python=3.6`

Activate your environment:

`conda activate whisp`

Install required libraries:

`pip install -r requirements.txt`

Then you should be good to go!

Before doing anything else, make sure to get the dataset: 

`curl -LO https://github.com/karoldvl/ESC-50/archive/master.zip`

`unzip master.zip`

Start up Jupyter to play in the notebooks:

`jupyter notebook`

## Spectrogram Generator

[insert gif]

All of our pretraining data munging can be found here:

spectrogram-generator.ipynb

Whisp is trained on the ESC-50 dataset (and its the most accurate based on this table :D!)

https://github.com/karoldvl/ESC-50

The paper on this dataset is short and fun to read:

http://karol.piczak.com/papers/Piczak2015-ESC-Dataset.pdf


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
