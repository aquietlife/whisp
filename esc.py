from starlette.applications import Starlette
from starlette.responses import JSONResponse, HTMLResponse, RedirectResponse
from fastai.vision import *
import torch
from pathlib import Path
from io import BytesIO
import sys
import uvicorn
import aiohttp
import asyncio


async def get_bytes(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.read()


app = Starlette()

spectrograms_path = Path('spectrographs')

spectrograms_data = np.random.seed(42) 
data = ImageDataBunch.from_folder(spectrograms_path, train=".", valid_pct=0.2, ds_tfms=get_transforms(), size=360, num_workers=4).normalize(imagenet_stats) #changed size from 224 to 360
print(data.classes)
cat_fnames = [
    "/{}_1.jpg".format(c)
    for c in [
        "Bobcat",
        "Mountain-Lion",
        "Domestic-Cat",
        "Western-Bobcat",
        "Canada-Lynx",
        "North-American-Mountain-Lion",
        "Eastern-Bobcat",
        "Central-American-Ocelot",
        "Ocelot",
        "Jaguar",
    ]
]

'''
cat_data = ImageDataBunch.from_name_re(
    cat_images_path,
    cat_fnames,
    r"/([^/]+)_\d+.jpg$",
    ds_tfms=get_transforms(),
    size=224,
)
cat_learner = ConvLearner(cat_data, models.resnet34)
cat_learner.model.load_state_dict(
    torch.load("usa-inaturalist-cats.pth", map_location="cpu")
)
'''

learn = load_learner('model')


@app.route("/upload", methods=["POST"])
async def upload(request):
    data = await request.form()
    bytes = await (data["file"].read())
    return predict_image_from_bytes(bytes)


@app.route("/classify-url", methods=["GET"])
async def classify_url(request):
    bytes = await get_bytes(request.query_params["url"])
    return predict_image_from_bytes(bytes)


def predict_image_from_bytes(bytes):
    img = open_image(BytesIO(bytes))
    _,_,losses = learn.predict(img)
    return JSONResponse({
        "predictions": sorted(
            zip(data.classes, map(float, losses)),
            key=lambda p: p[1],
            reverse=True
        )
    })


@app.route("/")
def form(request):
    return HTMLResponse(
        """
        <form action="/upload" method="post" enctype="multipart/form-data">
            Select image to upload:
            <input type="file" name="file">
            <input type="submit" value="Upload Image">
        </form>
        Or submit a URL:
        <form action="/classify-url" method="get">
            <input type="url" name="url">
            <input type="submit" value="Fetch and analyze image">
        </form>
    """)


@app.route("/form")
def redirect_to_homepage(request):
    return RedirectResponse("/")


if __name__ == "__main__":
    if "serve" in sys.argv:
        uvicorn.run(app, host="0.0.0.0", port=8008)
