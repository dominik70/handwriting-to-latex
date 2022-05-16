import os
import cv2
import numpy as np
from fastapi import FastAPI, File,  UploadFile
from fastapi.staticfiles import StaticFiles
from model import Model

app = FastAPI()


@app.post("/api/translate")
async def translate(file: UploadFile = File(...)):
    content = await file.read()
    nparr = np.fromstring(content, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    height, width = img.shape
    ratio = width / height
    width = int(512 * ratio)
    img = cv2.resize(img, (width, 512), cv2.INTER_CUBIC)
    model = Model(img)

    prediction = model.predict()

    return prediction

app.mount("/", StaticFiles(directory="build/static/", html=True), name="static")
