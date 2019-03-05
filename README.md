# Whisp 

_An Environmental Sound Classifier_

[insert gif/screengrab of webapp]

This project comprises of three main parts:

- Spectrogram generation notebook, which shows you how to make spectrograms from the ESC-50 dataset. It also shows you how to make gifs as well, for fun ;)

- Learner notebook, which shows how to build our classification model with fastai

- Web app, which allows you to predict sound classfication with our model!

## Installation

Install conda:

`brew install conda`

Creae a new conda environment:

`conda create -n whisp python=3.6`

Activate your environment:

`conda activate whisp`

Move into the `whisp` repo and install required libraries:

`cd whisp`

`pip install -r requirements.txt`

Then you should be good to go!

Before doing anything else, make sure to get the dataset: 

`curl -LO https://github.com/karoldvl/ESC-50/archive/master.zip`

`unzip master.zip`

Start up Jupyter to play in the notebooks:

`jupyter notebook`

## Spectrogram Generator

### Cat

![Cat Spectrogram](https://raw.githubusercontent.com/aquietlife/whisp/master/cat.gif "Cat Spectrogram")

### Fireworks

![Fireworks Spectrogram](https://raw.githubusercontent.com/aquietlife/whisp/master/fireworks.gif "Fireworks Spectrogram")

### Sea Waves

![Sea Waves Spectrogram](https://raw.githubusercontent.com/aquietlife/whisp/master/sea_waves.gif "Sea Waves Spectrogram")

### Siren

![Siren Spectrogram](https://raw.githubusercontent.com/aquietlife/whisp/master/siren.gif "Siren Spectrogram")

All of our pretraining data munging can be found here:

[Spectrogram Generator notebook](https://github.com/aquietlife/whisp/blob/master/spectrogram-generator.ipynb)

Whisp is trained on the [ESC-50 dataset](https://github.com/karoldvl/ESC-50) (and its the most accurate based on this table :D!)

The [paper](http://karol.piczak.com/papers/Piczak2015-ESC-Dataset.pdf) on this dataset is short and fun to read :)

## Learner Model

[insert confusion matrix?]

Before running this notebook, please make sure you have generated the spectrograms from the [Spectrogram Generator notebook](https://github.com/aquietlife/whisp/blob/master/spectrogram-generator.ipynb).

You will also need to be running this notebook on a GPU machine. I've been using [Paperspace](https://www.paperspace.com/).

## Web Server

_If you have errors running the app with errors about 'installing Python as a framework', try runnning `conda install matplotlib`_

To run the web server, run:

`python app/server.py serve`
