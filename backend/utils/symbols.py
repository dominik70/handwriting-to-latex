from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.utils import to_categorical

symbols = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '(',
    ')',
    '+',
    '-',
    'sqrt',
    'alpha',
    'beta',
    'a',
    'b',
    'x',
    'y',
    'z',
]
special_symbols = ['sqrt', 'alpha', 'beta']

label_encoder = LabelEncoder()
labels = to_categorical(label_encoder.fit_transform(symbols))
