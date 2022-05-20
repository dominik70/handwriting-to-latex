# Handwriting to LaTeX

## Overview

This app allows you to handwrite mathematical expressions on the canvas and translate it to LaTeX language. It uses convolutional neural network (CNN) model created with Keras to recognize single symbols. React is used on the frontend and simple REST API is created in FastAPI framework.

## Demo

http://handwritten-math.herokuapp.com/

## Technologies

- Frontend
  - React
  - Typescript
  - SCSS modules
- Backend
  - FastAPI
- ML
  - Keras
  - cv2
  - numpy

## Dataset for training

https://www.kaggle.com/datasets/xainano/handwrittenmathsymbols

## TODO

- add more symbols to recognize
- add symbol recognition from photos
