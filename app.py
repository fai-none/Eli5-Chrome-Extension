from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)  # This will allow all domains to access your API

from dotenv import load_dotenv
load_dotenv()
openai.api_key = os.environ.get("OPENAI_API_KEY")


def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0.5,
    )
    return response.choices[0].message["content"]

@app.route('/process_text', methods=['POST'])
def process_text():
    data = request.json
    selected_text = data.get('selectedText', '')

    # Create a prompt for GPT-3.5
    prompt = f"""
    Explain the {selected_text} to me as if I were a five-year-old.
    Make it simple, succinct, and easy to understand.
    Your response is a definition of the term. Don't make it conversational.
    Use lots of emojis.
    """
    
    # Get a response from GPT-3.5
    explanation = get_completion(prompt)

    return jsonify({'result': explanation})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
