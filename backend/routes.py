from flask import request, render_template, jsonify
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from models import User


def register_routes(app, db, bcrypt):

    @app.route("/")
    def index():
        return "Hello World"
    
    # CREATE
    @app.route("/create_user", methods=["POST", "GET"])
    def create_user():
        try:
            username = request.json.get("username")
            password = request.json.get("password")

            user_exists = User.query.filter(User.username == username).first()

            if user_exists:
                return jsonify({"message": "User with the supplied username already exists"})
            hashed_password = bcrypt.generate_password_hash(password)

            user = User(username=username, password=hashed_password)
            db.session.add(user)
            db.session.commit()

            return jsonify({"message": f"Successfully created account with username {username}"}), 200

        except Exception as e:
            return jsonify({"msg": str(e)}), 400
        
        
        
        
    
    # READ
    # Login
    @app.route("/retrieve_user", methods=["POST"])
    def retrieve_user():
        username = request.json.get("username")
        password = request.json.get("password")
        
        try:
            user = User.query.filter(User.username == username).first()

            if not user:
                return jsonify({"message": "Incorrect username supplied"}), 401
            
            if bcrypt.check_password_hash(user.password, password):
                return jsonify({"message": f"User with username {username} was retrieved", "user_id": user.pid}), 200
        except Exception as e:
            return jsonify({"message": f"{e}"})

        
        return jsonify({"message": f"Incorrect password supplied"}), 403 # for now


    # api route to retrieve the user based on an id when the user logs in
    # once the user is retrieved, we can display the user's collections
    @app.route("/select_user/<int:user_id>", methods=["GET"])
    def select_user(user_id):
        try:
            user = User.query.filter(User.pid == user_id).first()

            if not user:
                return jsonify({"message": "user was not found with the supplied id"}), 404
            
            return jsonify({"message": "Found user", "username": user.username}), 200
        except Exception as e:
            return jsonify({"message": "user was not found with the supplied id"}), 404
            

            


    # DELETE
    # delete account
    @app.route("/delete_user/<int:user_id>", methods=["DELETE"])
    def delete_user(user_id):
        user = User.query.get(user_id)

        # user will always exist since to delete an account, you will need to be logged in to delete one

        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "Successfully deleted user"}), 200
    

    # UPDATE
    @app.route("/change_password/<int:user_id>", methods=["PATCH"])
    def change_password(user_id):
        current_password = request.form["current-password"]

        user = User.query.get(user_id)

        if not user.password == current_password:
            return jsonify({"msg": "Incorrect Password Supplied"})
        
        new_password = request.form["new-password"]

        user.password = new_password
        
        db.session.commit()

        return jsonify({"message":"Successfully changed password"}), 200
    

    # Warehouse routes
    ##############################################################
    # Create the CRUD Routes for warehouses & items
    

    # items
    # Create



