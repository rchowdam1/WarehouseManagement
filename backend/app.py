from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from db import db

# db = SQLAlchemy()


from models import User

def create_app():
    app = Flask(__name__)
    CORS(app)

    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///./storage.db"
    app.secret_key = "gdhsafhddhfasjdfhjasdh"

    db.init_app(app)

    bcrypt = Bcrypt(app)

    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)
    


    from routes import register_routes
    register_routes(app, db, bcrypt)

    migrate = Migrate(app, db)

    return app



