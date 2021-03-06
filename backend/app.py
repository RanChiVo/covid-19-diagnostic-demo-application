import os
from flask import Flask, request, jsonify, session
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import urllib.request
import joblib
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import roc_curve,auc,classification_report,confusion_matrix,accuracy_score
from sklearn.svm import SVC
from keras.preprocessing.image import load_img, img_to_array
from keras.applications.inception_resnet_v2 import InceptionResNetV2
from keras.applications.inception_resnet_v2 import preprocess_input
from keras.preprocessing import image
from keras.layers import Flatten
from keras import Sequential
from sklearn.preprocessing import LabelEncoder
# from tensorflow.keras.utils import to_categorical
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
from numpy import asarray, save, load
from flask_mysqldb import MySQL
from datetime import timedelta
import pydicom
from pydicom.data import get_testdata_file
import scipy.misc
import pandas as pd
import imageio
from flask_cors import CORS, cross_origin
from random import seed
from random import randint

app = Flask(__name__)
CORS(app, support_credentials=True)
app.secret_key = "secret key"
app.config['PERMANENT_SESSION_LIFETIME'] =  timedelta(minutes=10)
app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'test'

mysql = MySQL(app)

app.config['MODEL_COVID'] = "model/svm_feature_resnet_v2.sav"
app.config['IMAGE_SIZE'] = (224, 224)
app.config['LOCAL_FOLDER'] = '/home/mot/Documents/version_control/demo_covid/frontend/public/assets'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['ALLOWED_EXTENSIONS'] = set(['png', 'jpg', 'jpeg', 'dcm'])

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

@app.route('/get_patients', methods =['GET']) 
def get_all_patients(): 
    cursor = None
    print("GET DATA")
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM Patient, Image WHERE Image.patient_id = Patient.id')
        patients = cursor.fetchall()#
        print("patients",patients)
        output = [] 
        for patient in patients:
            print(patient[1])
            output.append({ 
                'id': patient[0], 
                'fullname' : patient[1],
                'created_date' : patient[2],
                'gender' : patient[3],
                'date_of_birth' : patient[4],
                'address' : patient[5],
                'phone' : patient[6],
                'email' : patient[7],
                'quarantine_status' : patient[8],
                'id_image':patient[9],
                'url':patient[10],
                'uploaded_date':patient[11],
                'diagnostis_result': patient[12],
                'size_image': patient[13],
            }) 
        resp = jsonify({'patients': output}) 
        return resp
    except Exception as e:
        print(e)
    finally:
        if cursor:
            cursor.close()

@app.route('/get_images', methods =['GET']) 
def get_all_images(): 
    cursor = None
    print("GET DATA")
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM Image")
        images = cursor.fetchall()
        print("images",images)
        output = [] 
        for image in images:
            print(image[1])
            output.append({ 
                'id_image': image[0], 
                'url' : image[1],
                'uploaded_date' : image[2],
                'diagnostis_result' : image[3],
                'size_image' : image[4],
                'patient_id' : image[5],
            }) 
        print("output", output)
        resp = jsonify({'images': output}) 
        return resp
    except Exception as e:
        print(e)
    finally:
        if cursor:
            cursor.close()

@app.route('/get_patient_by_id', methods =['POST']) 
def get_patient_id(): 
    cursor = None
    print("GET DATA")
    id_patient = request.form['id'] 
    print("id_patient",id_patient)
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM Patient, Image WHERE Patient.id=%s and Image.patient_id = Patient.id', [id_patient])
        patients = cursor.fetchall()
        print("patients",patients)
        output = [] 
        if patients:
            for patient in patients:
                print(patient[1])
                output.append({ 
                    'id': patient[0], 
                    'fullname' : patient[1],
                    'created_date' : patient[2],
                    'gender' : patient[3],
                    'date_of_birth' : patient[4],
                    'address' : patient[5],
                    'phone' : patient[6],
                    'email' : patient[7],
                    'quarantine_status' : patient[8],
                    'id_image':patient[9],
                    'url':patient[10],
                    'uploaded_date':patient[11],
                    'diagnostis_result': patient[12],
                    'size_image': patient[13],
                })      
            
        print("output", output)
        resp = jsonify({'patients': output}) 
        return resp
    except Exception as e:
        print(e)
    finally:
        if cursor:
            cursor.close()

@app.route('/get_test_id_patient', methods =['POST']) 
def get_test_id_patient(): 
    cursor = None
    print("GET DATA")
    id_patient = request.form['id_patient'] 
    print("id_patient",id_patient)
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM Test WHERE patient_id=%s', [id_patient])
        test_info = cursor.fetchone()
        print("test info",test_info)
        output = {}
        if test_info:
            output['id'] = test_info[0]
            output['test_time'] = test_info[1]
            output['result_time'] = test_info[2]
            output['result'] = test_info[3]
            output['patient_id'] = test_info[4]
            output['comments'] = test_info[5]
            print("output", output)
        else:
            output="empty"
        resp = jsonify({'test': output}) 
        return resp
    except Exception as e:
        print(e)
    finally:
        if cursor:
            cursor.close()

@app.route('/')
def home():
	if 'username' in session:
		username = session['username']
		return jsonify({'message' : 'You are already logged in', 'username' : username})
	else:
		resp = jsonify({'message' : 'Unauthorized'})
		return resp

@app.route('/login', methods=['POST'])
def login():
    cursor = None
    print("LOGIN")
    try:
        _username = request.form['username'] 
        _password = request.form['password'] 
        print("user:",_username)
        print("password",_password)	
        # validate the received values
        if _username and _password:
            #check user exists			
            cursor = mysql.connection.cursor()
            cursor.execute("SELECT * FROM User WHERE username=%s",(_username,))
            row = cursor.fetchone()
            print("row",row)
            if row:
                print("row[2]:", row[2])
                print("password:", _password)
                if check_password_hash(row[2], _password):
                    session['username'] = row[1]
                    return jsonify({'message' : 'You are logged in successfully'})
                else:
                    resp = jsonify({'message' : 'Bad Request - invalid password'})
                    resp.status_code = 400
                    return resp
        else:
            resp = jsonify({'message' : 'Bad Request - invalid credendtials'})
            return resp

    except Exception as e:
        print(e)
    finally:
        if cursor:
            cursor.close()

@app.route('/logout')
def logout():
	if 'username' in session:
		session.pop('username', None)
	return jsonify({'message' : 'You successfully logged out'})


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

def dcm2jpg(picture_path, head):
    print("picture_path", picture_path)
    ds=pydicom.read_file(picture_path)
    print("ds", ds)
    img=ds.pixel_array #extract image information
    image_path = os.path.join(app.config['LOCAL_FOLDER'], head + '.jpg')
    imageio.imwrite(image_path,img)
    return image_path

@app.route('/detect_result/<image_id>/<patient_id>', methods =['GET']) 
def show_result(image_id, patient_id):
    cursor = None
    print("GET DATA")
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM Patient, Test WHERE Patient.id=Test.patient_id and Patient.id=%s', [patient_id])
        data_list = cursor.fetchall()
        print("patients",data_list)
        output = [] 
        print(data_list)
        for data in data_list:    
            print(data[1])
            output.append({ 
                'id': data[0], 
                'fullname' : data[1],
                'created_date' : data[2],
                'gender' : data[3],
                'date_of_birth' : data[4],
                'address' : data[5],
                'phone' : data[6],
                'email' : data[7],
                'quarantine_status' : data[8],
                'test_time': data[11],
                'result_time': data[10],
                'result' : data[11],
                'patient_id' : data[12]
            }) 
        print("output", output)
        resp = jsonify({'patients': output}) 
        return resp
    except Exception as e:
        print(e)
    finally:
        if cursor:
            cursor.close()

@app.route('/file-upload', methods=['POST'])
def upload_file():
    image_input_paths.clear()
    if 'file' not in request.files:
        print("info request file:",request.files)
        resp = jsonify({'message' : 'No file part in the request'})
        resp.status_code = 400
        return resp
    file_upload = request.files['file']
    print("file_upload:", file_upload)
    if file_upload.filename == '':
        resp = jsonify({'message' : 'No file selected for uploading'})
        resp.status_code = 400  
        return resp
    if file_upload and allowed_file(file_upload.filename):
        filename = secure_filename(file_upload.filename)
        image_path_local = os.path.join(app.config['LOCAL_FOLDER'], filename)
        file_upload.save(image_path_local)
        filename_array = filename.split(".")
        tail = filename_array[1]
        head = filename_array[0]
        print("tail", tail)
        print("head", head)
        if tail == 'dcm':
            print("This is dcm file")
            image_path_local = dcm2jpg(image_path_local, head)
        resp = jsonify({'message' :  image_path_local   })
        resp.status_code = 201
        return resp
        print("head:", head)
    else:
        resp = jsonify({'message' : 'Allowed file types are txt, pdf, png, jpg, jpeg, gif'})
        resp.status_code = 400
        return resp

@app.route('/predict', methods=['POST'])
def predict():
    image_input_paths.clear()
    cursor = None
    print("PREDICT")
    try:
        url = request.form['url'] 
        print(":", url)
        file_name = url.split("/")[1] 
        print("file_name", file_name)
        if request.method == 'POST':
            filename_array = file_name.split(".")
            tail = filename_array[1]
            head = filename_array[0]
            print("tail", tail)
            print("head", head)
            if tail == 'dcm':
                print("This is dcm file")
                image_path_local = os.path.join(app.config['LOCAL_FOLDER'], head+".jpg")
            else:
                image_path_local = os.path.join(app.config['LOCAL_FOLDER'], file_name)
            image_input_paths.append(image_path_local)
            print(image_path_local )
            features_test = processing_data(image_input_paths)
            sc_x = StandardScaler()
            testX = sc_x.fit_transform(features_test)
            y_pred = svm_covid_model.predict(testX)
            labelDict = {0:"NORMAL", 1:"COVID-19", 2:"PNEUMONIA"}
            print("type y_pred:", type(y_pred))
            result = labelDict[y_pred[0]]
            print("type result:", type(result))
            print("type result:", type(result))
            print("result:",result)
            resp = jsonify({'message' : result})
            resp.status_code = 201
            return resp
        else:
            resp = jsonify({'message' : 'Bad Request - invalid credendtials'})
            resp.status_code = 400
            return resp
    except Exception as e:
        print(e)
    finally:
        if cursor:
            cursor.close()



@app.route('/add_patient',  methods=['POST', 'GET', 'OPTIONS'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def add_patient():
    cursor = None
    print("CREATE NEW PATIENT")
    try:
        fullname = request.form['fullname'] 
        print("full_name:", fullname)
        created_date = request.form['created_date']
        print("created_date:", created_date)
        gender = request.form["gender"]
        print("gender:", gender)
        date_of_birth = request.form["date_of_birth"]
        print("date_of_birth:", date_of_birth)
        address = request.form["address"]
        print("address:", address)
        phone = request.form["phone"]
        print("phone:", phone)
        email = request.form["email"]
        print("email:", email)
        quarantine_status = request.form["quarantine_status"]
        print("quarantine_status:", quarantine_status)
        url = request.form['url'] 
        print("url:", url)
        diagnostis_result = ""
        size_image = ""
        # validate the received values
        if request.method == 'POST':
            cursor = mysql.connection.cursor()
            cursor.execute("SELECT COUNT(Patient.id) from Patient")
            total_patient =  cursor.fetchone()[0]
            id_patient = total_patient + 1
            value = randint(0, 10)
            id_patient = str(id_patient)+ str(value) + fullname
            print("total patient:", total_patient)
            sql = "INSERT INTO Patient(id, fullname, created_date, gender, date_of_birth, address, phone, email, quarantine_status) VALUES(%s,  %s, %s, %s, %s, %s, %s, %s, %s)"
            fields = ( id_patient, fullname, created_date, gender, date_of_birth, address, phone, email, quarantine_status)
            cursor.execute(sql, fields)
            sql = "INSERT INTO Image(url, uploaded_date, diagnostis_result,size_image, patient_id) VALUES(%s,  %s, %s, %s,%s)"
            fields = (url, created_date, diagnostis_result, size_image, id_patient) 
            cursor.execute(sql, fields)
            mysql.connection.commit()
            resp = jsonify({'message' : 'Patientz added successfully!'})
            resp.status_code = 200
            return resp
        else:
            resp = jsonify({'message' : 'Bad Request - invalid credendtials'})
            resp.status_code = 400
            return resp

    except Exception as e:
        print(e)
    finally:
        if cursor:
            cursor.close()

@app.route('/add_test',  methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def add_test():
    cursor = None
    print("CREATE NEW TEST")
    try:
        test_time = request.form['test_time'] 
        print("test time:", test_time)
        result_time = request.form['result_time']
        print("result_time:", result_time)
        result = request.form["result"]
        print("result:", result)
        patient_id = request.form["patient_id"]
        print("patient_id:", patient_id)
        comments = request.form["comments"]
        print("comments:", comments)
        # validate the received values
        if request.method == 'POST':
            cursor = mysql.connection.cursor()
            sql = "INSERT INTO Test(test_time, result_time, result, patient_id, comments) VALUES(%s,  %s, %s, %s, %s)"
            fields = ( test_time, result_time, result, patient_id, comments)
            cursor.execute(sql, fields)
            mysql.connection.commit()
            resp = jsonify({'message' : 'Test added successfully!'})
            resp.status_code = 200
            return resp
        else:
            resp = jsonify({'message' : 'Bad Request - invalid credendtials'})
            resp.status_code = 400
            return resp

    except Exception as e:
        print(e)
    finally:
        if cursor:
            cursor.close()

@app.route('/update_test',  methods=['POST'])
def update_test():
    cursor = None
    print("UPDATE TEST")
    try:
        id = request.form['id'] 
        print("id:", id)
        test_time = request.form['test_time'] 
        print("test time:", test_time)
        result_time = request.form['result_time']
        print("result_time:", result_time)
        result = request.form["result"]
        print("result:", result)
        patient_id = request.form["patient_id"]
        print("patient_id:", patient_id)
        comments = request.form["comments"]
        print("comments:", comments)
        # validate the received values
        if request.method == 'POST':
            cursor = mysql.connection.cursor()
            sql = "UPDATE Test SET test_time=%s, result_time=%s, result=%s, patient_id=%s, comments=%s WHERE id=%s"
            fields = ( test_time, result_time, result, patient_id, comments,id)
            cursor.execute(sql, fields)
            mysql.connection.commit()
            resp = jsonify({'message' : 'Test updated successfully!'})
            resp.status_code = 200
            return resp
        else:
            resp = jsonify({'message' : 'Bad Request - invalid credendtials'})
            resp.status_code = 400
            return resp

    except Exception as e:
        print(e)
    finally:
        if cursor:
            cursor.close()

app.config["DEBUG"] = True
app.run()