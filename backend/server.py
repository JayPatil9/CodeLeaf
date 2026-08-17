import os
import time
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[os.getenv("FRONTEND_URL")])

client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_database("code-snippets")
snippets_collection = db.snippets

# Rate Limiter Setup
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day"],
    storage_uri="memory://"
)

@app.route('/', methods=['GET'])
def home():
    return "Backend is running"

def serialize_doc(doc):
    if doc:
        doc['_id'] = str(doc['_id'])
    return doc



@app.route('/api/snippets/<id>', methods=['GET'])
def get_snippet(id):
    try:
        snippet = snippets_collection.find_one({"code_id": id})
        if not snippet:
            return jsonify({"error": "Snippet not found"}), 404
        return jsonify(serialize_doc(snippet))
    except Exception:
        return jsonify({"error": "Database error"}), 500


@app.route('/api/execute', methods=['POST'])
@limiter.limit("10 per minute")
def execute_code():
    data = request.json
    print('Execution request received:', data)
    
    code = data.get('code', '')
    language = data.get('language', 'cpp')
    user_input = data.get('input', '')
    API_KEY = 'guest'

    try:
        # Step A: Create runner session
        create_payload = {
            "source_code": code,
            "language": "python3" if language == "python" else language,
            "input": user_input,
            "api_key": API_KEY
        }
        
        create_response = requests.post('https://api.paiza.io/runners/create.json', json=create_payload)
        create_response.raise_for_status()
        runner_id = create_response.json().get('id')
        
        print(f'Runner created with ID: {runner_id}. Polling for execution status...')
        
        run_details = None
        is_completed = False

        # Step B: Poll Paiza every 1 second
        for _ in range(15):
            time.sleep(1)
            
            details_response = requests.get(
                f'https://api.paiza.io/runners/get_details.json?id={runner_id}&api_key={API_KEY}'
            )
            details_response.raise_for_status()
            run_details = details_response.json()
            
            if run_details.get('status') == 'completed':
                is_completed = True
                break

        if not is_completed:
            return jsonify({"error": "Execution timed out on Paiza servers"}), 504

        return jsonify(run_details)

    except Exception as e:
        print('Execution Error:', str(e))
        return jsonify({"error": "Code execution failed"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)