from flask import Flask, render_template, request, jsonify
import time

app = Flask(__name__)

def get_bot_response(user_message):
    """
    Handles the core chatbot logic.
    """
    msg = user_message.lower().strip()

    # --- Keyword-based responses ---
    if 'hello' in msg or 'hi' in msg or 'hey' in msg:
        return "Hi there! How can I help you today?"
    
    if 'how are you' in msg:
        return "I'm just a set of instructions, but I'm functioning perfectly! What can I do for you?"

    if 'help' in msg or 'support' in msg:
        return "Sure, I'd be happy to help. What do you need assistance with?"
    
    if 'time' in msg:
        # Get the current time in a user-friendly format
        current_time = time.strftime("%I:%M %p", time.localtime())
        return f"The current time is {current_time}."

    if 'thanks' in msg or 'thank you' in msg:
        return "You're welcome! Is there anything else I can help with?"

    if 'bye' in msg or 'goodbye' in msg:
        return "Goodbye! Have a great day. 👋"

    # --- Default fallback response ---
    return "I'm a simple chatbot here to greet you! I'm still learning and can only respond to basic phrases like 'hi', 'help', or 'time'."

@app.route('/')
def home():
    """
    Renders the main HTML page.
    """
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    """
    The main chat API endpoint.
    Receives a user message and returns the bot's response.
    """
    try:
        user_message = request.json.get('message')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        # Simulate a realistic "thinking" delay
        time.sleep(0.5 + (len(user_message) % 3) * 0.2) 

        bot_response = get_bot_response(user_message)
        
        return jsonify({'response': bot_response})

    except Exception as e:
        print(f"Error in /chat: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)