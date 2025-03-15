from flask import request, render_template, jsonify
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from models import User, Warehouse, Item


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

        # temp
        """user = User.query.all()[0]
        print(user.pid, " - user's id which DOES EXIST")"""

        try:
            user = User.query.filter(User.pid == user_id).first()
            
            if not user:
                return jsonify({"message": "user was not found with the supplied id"}), 404
            
            # print(f"warehouses: {user.warehouses}")
            return jsonify({"message": "Found user", "username": user.username, "warehouses": [warehouse.to_json() for warehouse in user.warehouses]}), 200
        except Exception as e:
            print(f"The exception is {e}")
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

    # CREATE
    # When making a request to this endpoint, the warehouse name and user id of the owner of the warehouse must be provided
    # as json arguments
    @app.route("/create_warehouse", methods=["POST", "GET"])
    def create_warehouse():
        try:
            warehouse_name = request.json.get("warehouseName")
            user_id = request.json.get("userID")
            warehouse_exists = Warehouse.query.filter(Warehouse.name == warehouse_name).first()

            if warehouse_exists:
                return jsonify({"message": "Warehouse with supplied name exists already"}), 406
            
            user = User.query.filter(User.pid == user_id).first()

            if not user:
                return jsonify({"message": "The User does not exist"}), 404
            

            
            warehouse = Warehouse(name=warehouse_name, user=user)
            db.session.add(warehouse)
            db.session.commit()

            return jsonify({"message", "Warehouse Creation Successful"}), 200
        
        except Exception as e:
            return jsonify({"message", "An error occurred"}), 400


    
    # resume here 2/15, resolve CORS when sending a request to the above endpoint
    # items
    # Create



