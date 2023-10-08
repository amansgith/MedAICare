from flask import Flask, request, jsonify
from flask_cors import cross_origin, CORS
import tensorflow as tf
from flask_sqlalchemy import SQLAlchemy
from keras.models import load_model
import numpy as np
from PIL import Image
import io
import openai
# import string
# import os


app = Flask(__name__)
CORS(app)

# Load the brain tumor detection model
tumor_model = load_model('keras_model.h5')

pneumonia_model = load_model('keras_model2.h5')

# Function to preprocess and predict tumor
def detect_tumor(img):
    # Preprocess the image (you will need to implement this)
    # Example:
    # image = preprocess_image(image)
    img = Image.open(io.BytesIO(img))
    img = img.resize((224, 224))
    img = np.array(img)
    img = np.expand_dims(img, 0)
    return img

    # Make predictions
def prediction(img):

    # Interpret the predictions and return a result
    if tumor_model.predict(img)[0][0] > 0.5:
        return True
    else:
        return False
    

# Function to preprocess and predict pneumonia
def detect_pneumonia(img):
    img = Image.open(io.BytesIO(img))
    img = img.resize((224, 224))
    img = np.array(img)
    img = np.expand_dims(img, 0)
    return img

def predict_pneumonia(img):
    if pneumonia_model.predict(img)[0][0] > 0.5:
        return True
    else:
        return False

# @app.route('/', methods=['GET'])
# def home():
#     return render_template('home.html')

@app.route('/predict', methods=['GET','POST'])
@cross_origin()
def predict():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({"error": "Please try again. The Image doesn't exist"})
        file = request.files.get('file')

        if not file:
            return

        try:
            img_bytes = file.read()
            model = request.args.get('model') or request.form.get('model')
            # Validate the model parameter
            if model not in ['tumor', 'pneumonia']:
                return jsonify({"error": "Invalid model parameter"})
            # Call the appropriate function based on the model parameter
            result=''
            if model == 'tumor':
                img = detect_tumor(img_bytes)
                predictor=prediction(img)
                result = 'Tumor Detected' if predictor else 'Tumor not detected'
            elif model == 'pneumonia':
                img = detect_pneumonia(img_bytes)
                predictor = predict_pneumonia(img)
                result = 'Pneumonia Detected' if predictor else 'Pneumonia not detected'
            # img = detect_tumor(img_bytes)
            # # print(img)
            # predictor=prediction(img)
            # print(predictor)
            # result = ''
            # if predictor == True:
            #     result = 'Tumor Detected'
            # else:
            #     result = "Tumor not detected"
            # # print("Result:", result) 
            # print(result)
            return jsonify({"result": result})
        except Exception as e:
            print(e)
            print("Error processing the image:", str(e))
            return jsonify({"error": "Error processing the image: " + str(e)})
    return jsonify({"result": "Please upload an image for prediction"})



# @app.route('/predict', methods=['GET','POST'])
# @cross_origin()
# def predict_pneumonia_route():
#     if request.method == 'POST':
#         if 'file' not in request.files:
#             return jsonify({"error": "Please try again. The Image doesn't exist"})
#         file = request.files.get('file')

#         if not file:
#             return

#         try:
#             img_bytes = file.read()
#             img = detect_pneumonia(img_bytes)
#             predictor = predict_pneumonia(img)
#             result = 'Pneumonia Detected' if predictor else 'Pneumonia not detected'
#             return jsonify({"result": result})
#         except Exception as e:
#             return jsonify({"error": "Error processing the image: " + str(e)})


# # Set your OpenAI API key here
# openai.api_key = "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"

# @app.route('/chatbot', methods=['GET','POST'])
# @cross_origin() # add cross_origin decorator
# def chatbot():
#     if request.method == 'POST':
#         if not request.is_json:
#             return jsonify({"error": "Please send JSON data"}) # use jsonify instead of render_template
#         data = request.get_json()
#         query = data.get('query')
#         if not query:
#             return jsonify({"error": "Please send a query"}) # use jsonify instead of render_template

#         try:
#             # Make a request to the OpenAI API with the query as prompt
#             response = openai.Completion.create(
#                 engine="davinci", # use davinci engine for best results
#                 prompt=query, # use query as prompt
#                 max_tokens=150, # limit the number of tokens in response
#                 temperature=0.8, # adjust this parameter to control the randomness of the chatbot
#                 frequency_penalty=0.2, # adjust this parameter to control the repetition of the chatbot
#                 presence_penalty=0.2, # adjust this parameter to control the consistency of the chatbot
#                 stop=["\n"] # stop the response at a newline character
#             )
#             response = response.choices[0].text # get the chatbot's reply from the response
#             print(response)
#             return jsonify({"response": response}) # use jsonify instead of render_template and return the reply
#         except Exception as e:
#             print(e)
#             print("Error using the OpenAI API:", str(e))
#             return jsonify({"error": "Error using the OpenAI API: " + str(e)}) # use jsonify instead of render_template
#     return jsonify({"response": "Please send a POST request with a query"}) # use jsonify instead of render_template



# with app.app_context():
#     db.create_all()

if __name__ == '__main__':
    app.run(debug=True)

           
