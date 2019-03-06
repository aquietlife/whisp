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

Create a new conda environment:

`conda create -n whisp python=3.6`

Activate your environment:

`conda activate whisp`

Clone this repo, move into the `whisp` directory and install required libraries:

`git clone https://github.com/aquietlife/whisp`

`cd whisp`

`pip install -r requirements.txt`

Finally, make sure to get the ESC-50 dataset: 

`curl -LO https://github.com/karoldvl/ESC-50/archive/master.zip`

`unzip master.zip`

Then you should be good to go!

Start up Jupyter to play in the notebooks:

`jupyter notebook`

## Spectrogram Generator

### Cats

![Cat Spectrogram](https://raw.githubusercontent.com/aquietlife/whisp/master/cat.gif "Cat Spectrogram")

### Fireworks

![Fireworks Spectrogram](https://raw.githubusercontent.com/aquietlife/whisp/master/fireworks.gif "Fireworks Spectrogram")

### Sea Waves

![Sea Waves Spectrogram](https://raw.githubusercontent.com/aquietlife/whisp/master/sea_waves.gif "Sea Waves Spectrogram")

### Sirens

![Siren Spectrogram](https://raw.githubusercontent.com/aquietlife/whisp/master/siren.gif "Siren Spectrogram")

All of our pretraining data munging can be found here:

[Spectrogram Generator notebook](https://github.com/aquietlife/whisp/blob/master/spectrogram-generator.ipynb)

Walk through the notebook, which guides you through creating all the spectrogram data needed for the learner notebook, as well as some bonus code for generating gifs like the ones above.

Whisp is trained on the [ESC-50 dataset](https://github.com/karoldvl/ESC-50) (and its the most accurate based on this table :D!)

The [paper](http://karol.piczak.com/papers/Piczak2015-ESC-Dataset.pdf) on this dataset is short and fun to read :)

## Learner Model

[insert confusion matrix?]

You can train our environmental sound classifier with this notebook:

[Learner notebook](https://github.com/aquietlife/whisp/blob/master/learner.ipynb)

Before running this notebook, please make sure you have generated the spectrograms from the [Spectrogram Generator notebook](https://github.com/aquietlife/whisp/blob/master/spectrogram-generator.ipynb).

You will also need to be running this notebook on a GPU machine. I've been using [Paperspace](https://www.paperspace.com/). More instructions on setting up your Paperspace machine can be found [here](https://github.com/reshamas/fastai_deeplearn_part1/blob/master/tools/paperspace.md).

Ssh into your paperspace machine, clone this repo, and then go through the Spectrogram Generator notebook above to generate your spectrograms for learning.

`ssh paperspace@xxx.xxx.xxx.xxx`

Follow the Installation instructions above, but when you get to starting Jupypter notebook, use this command instead:

`jupyter notebook --no-browser --port=8889 --NotebookApp.allow_remote_access=True`

Open up another tab and ssh into your machine again, like so:

`ssh -N -L localhost:8888:localhost:8889 paperspace@xxx.xxx.xxx.xxx`

It appears to hang after enter on password, but its all good.

Back in the first tab, copy and paste the Jupyter notebook url, but change 8889 to 8888 like so:

`http://localhost:8888/?token=UNIQUE_TOKEN`

From there you should be able to run all the notebooks, so start with the Spectrogram Generator notebook to create your spectrograms for training :)

After creating your spectrograms, you can run through the [learner](https://github.com/aquietlife/whisp/blob/master/learner.ipynb) notebook.

At the end of our second set of training, we get the following results:

epoch 	train_loss 	valid_loss 	error_rate
1 	1.004599 	0.955555 	0.280000
2 	0.983463 	2.396468 	0.585000
3 	1.084720 	1.993167 	0.520000
4 	1.055390 	1.323817 	0.380000
5 	0.937236 	1.047446 	0.280000
6 	0.806796 	0.809364 	0.262500
7 	0.653438 	0.741908 	0.217500
8 	0.490650 	0.489861 	0.135000
9 	0.359554 	0.470506 	0.130000
10 	0.277465 	0.460627 	0.122500

0.122500 or 87.75% accuracy! 

At the end of the notebook, we export our model `export.pkl` in the `app/model` directory to be used in our web app ^_^

## Web Server

_If you have errors running the app with errors about 'installing Python as a framework', try runnning `conda install matplotlib`_

To run the web server, run:

`python app/server.py serve`
