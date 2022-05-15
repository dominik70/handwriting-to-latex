import numpy as np
from .symbols import symbols
import tflite_runtime.interpreter as tflite


model_lite = tflite.Interpreter("model.tflite")
model_lite.allocate_tensors()
input_details = model_lite.get_input_details()[0]
output_details = model_lite.get_output_details()[0]


def get_predictions(target_images):
    images = np.array(target_images)
    images = images.astype("float32")

    predictions = []

    for img in images:
        model_lite.set_tensor(
            input_details['index'], np.expand_dims(img, (0, 3)))
        model_lite.invoke()

        prediction_index = np.argmax(
            model_lite.get_tensor(output_details['index']))
        predictions.append(symbols[prediction_index])

    return predictions
