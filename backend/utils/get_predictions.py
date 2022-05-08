import numpy as np
from keras.models import load_model
from keras.preprocessing.image import img_to_array
from .symbols import label_encoder

model = load_model('./model')


def get_predictions(target_images):
    img = img_to_array(target_images) / 255
    img = np.expand_dims(img, axis=3)

    encoded_vectors = np.argmax(model.predict(img), axis=1)
    predictions = label_encoder.inverse_transform(encoded_vectors)

    return predictions
