from flask import Flask, render_template, request, jsonify
import os
import csv
import json
import requests
from flask_cors import CORS

app = Flask(__name__, template_folder='templates', static_folder='static')
cors = CORS(app, resources={
            r"/parse-document": {"origins": "http://localhost:5173"}})

# # Adding path to config
UPLOAD_FOLDER = 'static/uploads'
app.config['INITIAL_FILE_UPLOAD'] = 'static/uploads'

# Function to extract text from an image using EdenAI

url = "https://api.edenai.run/v2/ocr/ocr"

# Eden AI API key
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNmIxNTFkM2QtMWM1Mi00MjI2LWJlZjctZmQ5MDM4ZDhiYWFkIiwidHlwZSI6ImFwaV90b2tlbiJ9.opM4_wAVP84SYg_15CRksv0XMNNYGwogSRsHWKa2jsM"

# Function to extract text from an image using Eden AI OCR API


def extract_text_from_file(file, queries):

    headers = {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTY5OWM2ZTUtNGY5MC00NjAxLWExM2UtY2ZkYjUzZDVmNjU3IiwidHlwZSI6ImFwaV90b2tlbiJ9.SEhN8PRcYLzpv84uJtG0Oodw_QfX1CAV5np3s1LaClc"}

    url = "https://api.edenai.run/v2/ocr/custom_document_parsing_async"
    data = {
        "providers": "amazon",
        "queries": queries,
    }

    if file:
        # Ensure the upload folder exists
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

        # Save the file to the upload folder
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

    files = {"file": open(file_path, 'rb')}
    print(files)
    response = requests.post(url, data=data, files=files, headers=headers)

    result = json.loads(response.text)
    print('result', result)

    return result
# Function to save extracted text to a CSV file


def save_to_csv(data, filename='output.csv'):
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['Text'])
        csv_writer.writerows([[text] for text in data])


# Route to home page

@app.route("/parse-document", methods=["POST"])
def process_image():
    # Execute if request is get

    if request.method == "POST":
        queries = request.form.get('queries')
        file_upload = request.files['file_upload']
        # file_upload = body["file_upload"]
        file_name = file_upload.filename
        print('HERE', queries)
        file_extension = os.path.splitext(file_name)[1].lower()

        # queries = data["queries"]

        if file_extension in [".jpg", ".jpeg", ".png", ".gif", ".pdf"]:
            # Extract text from image
            extraction_response = extract_text_from_file(file_upload, queries)

            if extraction_response:
                return jsonify({'file_name': file_name, 'extraction_response': extraction_response})
            else:
                error = "Error extracting text from file"
                return jsonify({error})

        # # Save extracted text to CSV or JSON based on user's choice
        # save_option = request.form.get('save_option')

        # if save_option == 'csv':
        #     save_to_csv(extracted_text_list, filename='output.csv')
        # elif save_option == 'json':
        #     save_to_json(extracted_text_list, filename='output.json')

        # # Saving image to display in HTML
        # img = Image.fromarray(image_arr, 'RGB')
        # img.save(os.path.join(app.config['INITIAL_FILE_UPLOAD'], name))


if __name__ == '__main__':
    app.run(debug=False)
