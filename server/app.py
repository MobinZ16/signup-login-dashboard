# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Configure SQLAlchemy for MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # Disable tracking modifications

db = SQLAlchemy(app)

# --- SQLAlchemy Models ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False) # Increased length to 256

    # Relationships to other tables
    watchlist_items = db.relationship('WatchlistItem', backref='user', lazy=True)
    continue_watching_items = db.relationship('ContinueWatchingItem', backref='user', lazy=True)
    favorite_items = db.relationship('FavoriteItem', backref='user', lazy=True)


    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

class WatchlistItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content_id = db.Column(db.String(50), nullable=False) # TMDB content ID (can be string)
    content_type = db.Column(db.String(10), nullable=False) # 'movie' or 'tv'
    title = db.Column(db.String(255), nullable=False) # Store title for display
    thumbnail_url = db.Column(db.String(255), nullable=True) # Store thumbnail for display

    # Ensure uniqueness for a user's watchlist item
    __table_args__ = (db.UniqueConstraint('user_id', 'content_id', 'content_type', name='_user_content_uc'),)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'content_id': self.content_id,
            'content_type': self.content_type,
            'title': self.title,
            'thumbnail_url': self.thumbnail_url
        }

class ContinueWatchingItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content_id = db.Column(db.String(50), nullable=False) # TMDB content ID
    content_type = db.Column(db.String(10), nullable=False) # 'movie' or 'tv'
    title = db.Column(db.String(255), nullable=False)
    thumbnail_url = db.Column(db.String(255), nullable=True)
    progress = db.Column(db.Float, default=0.0) # Percentage from 0.0 to 100.0

    # Ensure uniqueness for a user's continue watching item
    __table_args__ = (db.UniqueConstraint('user_id', 'content_id', 'content_type', name='_user_cw_uc'),)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'content_id': self.content_id,
            'content_type': self.content_type,
            'title': self.title,
            'thumbnail_url': self.thumbnail_url,
            'progress': self.progress
        }

class FavoriteItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content_id = db.Column(db.String(50), nullable=False) # TMDB content ID
    content_type = db.Column(db.String(10), nullable=False) # 'movie' or 'tv'
    title = db.Column(db.String(255), nullable=False)
    thumbnail_url = db.Column(db.String(255), nullable=True)

    # Ensure uniqueness for a user's favorite item
    __table_args__ = (db.UniqueConstraint('user_id', 'content_id', 'content_type', name='_user_favorite_uc'),)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'content_id': self.content_id,
            'content_type': self.content_type,
            'title': self.title,
            'thumbnail_url': self.thumbnail_url
        }


# Create database tables (run this once)
with app.app_context():
    db.create_all()


# --- User Authentication Endpoints ---

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('userName')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "Missing username, email, or password"}), 400

    existing_user_email = User.query.filter_by(email=email).first()
    existing_user_username = User.query.filter_by(username=username).first()

    if existing_user_email:
        return jsonify({"error": "Email already registered"}), 409
    if existing_user_username:
        return jsonify({"error": "Username already taken"}), 409

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        return jsonify({"message": "Login successful!", "user": user.to_dict()}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


# --- TMDB API Proxy Endpoints ---
TMDB_API_KEY = os.getenv('TMDB_API_KEY')
TMDB_BASE_URL = "https://api.themoviedb.org/3"

@app.route('/api/tmdb/search', methods=['GET'])
def tmdb_search():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    params = {
        'api_key': TMDB_API_KEY,
        'query': query,
        'language': 'fa-IR' 
    }
    
    movie_search_url = f"{TMDB_BASE_URL}/search/movie"
    tv_search_url = f"{TMDB_BASE_URL}/search/tv"

    all_results = []

    try:
        movie_response = requests.get(movie_search_url, params=params)
        movie_response.raise_for_status() 
        all_results.extend(movie_response.json().get('results', []))

        tv_response = requests.get(tv_search_url, params=params)
        tv_response.raise_for_status()
        all_results.extend(tv_response.json().get('results', []))

        unique_results = {item['id']: item for item in all_results}.values()

        return jsonify(list(unique_results)), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching from TMDB: {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500


@app.route('/api/tmdb/details/<int:content_id>', methods=['GET'])
def tmdb_details(content_id):
    content_type = request.args.get('type', 'movie') 

    if content_type not in ['movie', 'tv']:
        return jsonify({"error": "Invalid content type. Must be 'movie' or 'tv'."}), 400

    details_url = f"{TMDB_BASE_URL}/{content_type}/{content_id}"
    params = {
        'api_key': TMDB_API_KEY,
        'language': 'fa-IR', 
        'append_to_response': 'credits,videos'
    }

    try:
        response = requests.get(details_url, params=params)
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching details from TMDB: {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500


@app.route('/api/tmdb/popular_movies', methods=['GET'])
def tmdb_popular_movies():
    url = f"{TMDB_BASE_URL}/movie/popular"
    params = {
        'api_key': TMDB_API_KEY,
        'language': 'fa-IR'
    }
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return jsonify(response.json().get('results', [])), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching popular movies from TMDB: {e}"}), 500


@app.route('/api/tmdb/trending_all', methods=['GET'])
def tmdb_trending_all():
    url = f"{TMDB_BASE_URL}/trending/all/week" 
    params = {
        'api_key': TMDB_API_KEY,
        'language': 'fa-IR'
    }
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return jsonify(response.json().get('results', [])), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching trending content from TMDB: {e}"}), 500

# --- Watchlist Endpoints ---
@app.route('/api/watchlist/add', methods=['POST'])
def add_to_watchlist():
    data = request.get_json()
    user_id = data.get('userId')
    content_id = data.get('content_id')
    content_type = data.get('content_type')
    title = data.get('title')
    thumbnail_url = data.get('thumbnail_url')

    if not all([user_id, content_id, content_type, title]):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid user ID"}), 400

    existing_item = WatchlistItem.query.filter_by(
        user_id=user_id,
        content_id=content_id,
        content_type=content_type
    ).first()

    if existing_item:
        return jsonify({"message": "Content already in watchlist"}), 200 

    new_item = WatchlistItem(
        user_id=user_id,
        content_id=content_id,
        content_type=content_type,
        title=title,
        thumbnail_url=thumbnail_url
    )
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"message": "Content added to watchlist successfully!"}), 201

@app.route('/api/watchlist/remove', methods=['POST'])
def remove_from_watchlist():
    data = request.get_json()
    user_id = data.get('userId')
    content_id = data.get('content_id')
    content_type = data.get('content_type')

    if not all([user_id, content_id, content_type]):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid user ID"}), 400

    item_to_remove = WatchlistItem.query.filter_by(
        user_id=user_id,
        content_id=content_id,
        content_type=content_type
    ).first()

    if item_to_remove:
        db.session.delete(item_to_remove)
        db.session.commit()
        return jsonify({"message": "Content removed from watchlist successfully!"}), 200
    else:
        return jsonify({"error": "Content not found in watchlist"}), 404

@app.route('/api/watchlist/<int:user_id>', methods=['GET'])
def get_watchlist(user_id):
    watchlist_items = WatchlistItem.query.filter_by(user_id=user_id).all()
    return jsonify([item.to_dict() for item in watchlist_items]), 200

# --- Continue Watching Endpoints ---

@app.route('/api/continue_watching/update', methods=['POST'])
def update_continue_watching():
    data = request.get_json()
    user_id = data.get('userId')
    content_id = data.get('content_id')
    content_type = data.get('content_type')
    title = data.get('title')
    thumbnail_url = data.get('thumbnail_url')
    progress = data.get('progress', 0.0) # Default to 0 if not provided

    if not all([user_id, content_id, content_type, title]):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        user_id = int(user_id)
        progress = float(progress)
    except ValueError:
        return jsonify({"error": "Invalid user ID or progress format"}), 400

    # Find existing item or create new one
    item = ContinueWatchingItem.query.filter_by(
        user_id=user_id,
        content_id=content_id,
        content_type=content_type
    ).first()

    if item:
        item.progress = progress
        item.title = title # Update title/thumbnail in case it changed on TMDB
        item.thumbnail_url = thumbnail_url
        db.session.commit()
        return jsonify({"message": "Continue watching item updated!", "item": item.to_dict()}), 200
    else:
        new_item = ContinueWatchingItem(
            user_id=user_id,
            content_id=content_id,
            content_type=content_type,
            title=title,
            thumbnail_url=thumbnail_url,
            progress=progress
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"message": "Continue watching item added!", "item": new_item.to_dict()}), 201

@app.route('/api/continue_watching/remove', methods=['POST'])
def remove_continue_watching():
    data = request.get_json()
    user_id = data.get('userId')
    content_id = data.get('content_id')
    content_type = data.get('content_type')

    if not all([user_id, content_id, content_type]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid user ID"}), 400

    item_to_remove = ContinueWatchingItem.query.filter_by(
        user_id=user_id,
        content_id=content_id,
        content_type=content_type
    ).first()

    if item_to_remove:
        db.session.delete(item_to_remove)
        db.session.commit()
        return jsonify({"message": "Continue watching item removed successfully!"}), 200
    else:
        return jsonify({"error": "Item not found in continue watching list"}), 404

@app.route('/api/continue_watching/<int:user_id>', methods=['GET'])
def get_user_continue_watching(user_id):
    continue_watching_items = ContinueWatchingItem.query.filter_by(user_id=user_id).order_by(ContinueWatchingItem.id.desc()).all() 
    return jsonify([item.to_dict() for item in continue_watching_items]), 200

# --- Favorite Endpoints ---
@app.route('/api/favorites/add', methods=['POST'])
def add_to_favorites():
    data = request.get_json()
    user_id = data.get('userId')
    content_id = data.get('content_id')
    content_type = data.get('content_type')
    title = data.get('title')
    thumbnail_url = data.get('thumbnail_url')

    if not all([user_id, content_id, content_type, title]):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid user ID"}), 400

    existing_item = FavoriteItem.query.filter_by(
        user_id=user_id,
        content_id=content_id,
        content_type=content_type
    ).first()

    if existing_item:
        return jsonify({"message": "Content already in favorites"}), 200 

    new_item = FavoriteItem(
        user_id=user_id,
        content_id=content_id,
        content_type=content_type,
        title=title,
        thumbnail_url=thumbnail_url
    )
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"message": "Content added to favorites successfully!"}), 201

@app.route('/api/favorites/remove', methods=['POST'])
def remove_from_favorites():
    data = request.get_json()
    user_id = data.get('userId')
    content_id = data.get('content_id')
    content_type = data.get('content_type')

    if not all([user_id, content_id, content_type]):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid user ID"}), 400

    item_to_remove = FavoriteItem.query.filter_by(
        user_id=user_id,
        content_id=content_id,
        content_type=content_type
    ).first()

    if item_to_remove:
        db.session.delete(item_to_remove)
        db.session.commit()
        return jsonify({"message": "Content removed from favorites successfully!"}), 200
    else:
        return jsonify({"error": "Content not found in favorites"}), 404

@app.route('/api/favorites/<int:user_id>', methods=['GET'])
def get_user_favorites(user_id):
    favorite_items = FavoriteItem.query.filter_by(user_id=user_id).all()
    return jsonify([item.to_dict() for item in favorite_items]), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    app.run(debug=True)

