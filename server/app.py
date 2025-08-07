import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt

# Load environment variables (though not strictly needed for in-memory, good practice)
load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes, allowing frontend to communicate
CORS(app)

# In-memory storage for users (simulating a database)
# This will reset every time the server restarts
users_db = {} # Format: {email: {password: hashed_password}}

# --- API for User Registration (Sign Up) ---
@app.route('/api/signup', methods=['POST'])
def signup():
    """
    Handles user registration using in-memory storage.
    Expects JSON with 'email' and 'password'.
    Hashes the password and stores user in memory.
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Basic input validation
    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    # Check if email already exists in our in-memory DB
    if email in users_db:
        return jsonify({'error': 'Email already exists.'}), 409

    # Hash the password using bcrypt for security
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Store user in our in-memory database
    users_db[email] = {'password': hashed_password.decode('utf-8')}
    
    print(f"User registered: {email}") # For debugging
    print(f"Current users_db: {users_db}") # For debugging

    return jsonify({'message': 'User registered successfully!'}), 201

# --- API for User Login ---
@app.route('/api/login', methods=['POST'])
def login():
    """
    Handles user login using in-memory storage.
    Expects JSON with 'email' and 'password'.
    Verifies credentials against hashed password in memory.
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Basic input validation
    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400
        
    # Check if user exists in our in-memory DB
    user_data = users_db.get(email)
    
    if user_data and bcrypt.checkpw(password.encode('utf-8'), user_data['password'].encode('utf-8')):
        print(f"User logged in: {email}") # For debugging
        # In a real application, you would generate and return a JWT here
        return jsonify({'message': 'Login successful!', 'user': {'email': email}}), 200
    else:
        return jsonify({'error': 'Invalid email or password.'}), 401

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
