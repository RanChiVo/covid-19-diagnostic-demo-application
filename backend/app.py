from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import urllib.request
import joblib
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import roc_curve,auc,classification_report,confusion_matrix,accuracy_score
from sklearn.svm import SVC
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
from keras.applications.inception_resnet_v2 import InceptionResNetV2
from keras.applications.inception_resnet_v2 import preprocess_input
from keras.preprocessing import image
from keras.layers import Flatten
from keras import Sequential
import numpy as np
import os
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.utils import to_categorical
from keras.models import Model
from pickle import dump
from imutils import paths
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import glob
import argparse
import imutils
import time
import cv2
import os
from numpy import asarray
from numpy import save
from numpy import load	
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 
app.config['MODEL_COVID'] = "model/svm_feature_resnet_v2.sav"
app.config['IMAGE_SIZE'] = (224, 224)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['ALLOWED_EXTENSIONS'] = set(['png', 'jpg', 'jpeg'])

# Load model to extract feature
model = InceptionResNetV2(weights='imagenet', include_top=False)
extract_feature_model = Sequential()
extract_feature_model.add(model)
extract_feature_model.add(Flatten())
extract_feature_model.summary()

# Load model to predict
svm_covid_file = open(app.config['MODEL_COVID'], 'rb')
svm_covid_model = pickle.load(svm_covid_file)
svm_covid_file.close()

# Image input path
image_input_paths = []

@app.route('/')
def hello():
    return "Hello world"

# this route sends back list of users users 
@app.route('/test', methods =['GET']) 
#Sample GET function 
def test():
    return '''<h1> Manny B in the house! Fraud Detection API : IOO</h1>
<p> A POC for the use of Machiasdfne learning to detect Credit Cards Frauds.</p>'''


@app.route('/info', methods=['GET'])
def info():
    result = [
        {
            "Player":"MannyB!",
            "Decription":"Testing and APi",
        }
    ]
    return jsonify(result)

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def processing_data(imagePaths):
    images = []
    for (i, imagePath) in enumerate(imagePaths):
        img = image.load_img(imagePath, target_size=(299, 299))
        img_data = image.img_to_array(img)
        img_data = np.expand_dims(img_data,axis=0)
        img_data = preprocess_input(img_data)
        images.append(img_data)
    images = np.vstack(images)
    features = extract_feature_model.predict(images)
    save('feature_dense_net.npy', features)
    return features

@app.route('/file-upload', methods=['POST'])
def upload_file():
    global image_input_paths
    if 'file' not in request.files:
       #print("info request file:",request.files)
        resp = jsonify({'message' : 'No file part in the request'})
        resp.status_code = 400
        return resp
    file_upload = request.files['file']
    if file_upload.filename == '':
        resp = jsonify({'message' : 'No file selected for uploading'})
        resp.status_code = 400
        return resp
    if file_upload and allowed_file(file_upload.filename):
        filename = secure_filename(file_upload.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file_upload.save(image_path)
        image_input_paths.append(image_path)
        if len(image_input_paths) > 0:
            print(image_input_paths )
            features_test = processing_data(image_input_paths)
            sc_x = StandardScaler()
            testX = sc_x.fit_transform(features_test)
            y_pred = svm_covid_model.predict(testX)
            labelDict = {0:"NORMAL", 1:"COVID-19", 2:"PNEUMONIA"}
            print("type y_pred:", type(y_pred))
            result = labelDict[y_pred[0]]
            print("type result:", type(result))
            resp = jsonify({'message' : result})
            resp.status_code = 201
            return resp
    else:
        resp = jsonify({'message' : 'Allowed file types are txt, pdf, png, jpg, jpeg, gif'})
        resp.status_code = 400
        return resp

app.config["DEBUG"] = True
app.run()
