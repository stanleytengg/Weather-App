from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS

mongodb = PyMongo()

def create_app():
    app = Flask(__name__)

    app.config['MONGO_URI'] = 'mongodb://localhost:27017/weatherdb'
    app.secret_key = 'secretkey123'

    mongodb.init_app(app)
    CORS(app)

    from routes import routes
    routes(app, mongodb)

    return app
