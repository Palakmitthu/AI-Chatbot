from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Get OpenAI API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OPENAI_API_KEY is missing from .env")

# Create OpenAI client
client = OpenAI(api_key=api_key)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():

    try:
        data = request.get_json()

        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({
                "reply": "Please type something."
            })

        # Send message to AI
        response = client.responses.create(
            model="gpt-5.6-luna",
            input=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful and friendly AI chatbot. "
                        "Explain things clearly and simply."
                    )
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )

        # Get AI response
        ai_reply = response.output_text

        return jsonify({
            "reply": ai_reply
        })

    except Exception as e:

        print("Error:", e)

        return jsonify({
            "reply": "Sorry, something went wrong."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)