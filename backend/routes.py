from flask import request, render_template, jsonify
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
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
            
            if bcrypt.check_password_hash(user.password, password): # successful login
                login_user(user) # login
                # print(f"User {user.username} logged in", flush=True)
                return jsonify({"message": f"User with username {username} was retrieved", "user_id": user.pid}), 200
        except Exception as e:
            print("An error occurred", flush=True)
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
    
    # Logout
    @app.route("/logout")
    def logout():
        if current_user.is_authenticated:
            print(f"User {current_user.username} logging out")
            logout_user()
            return jsonify({"message": "User logged out"}), 200
        else:
            return jsonify({"message": "User not logged in"}), 401
        
    # get the current user
    @app.route("/current_user", methods=["GET"])
    def get_current_user():
        if current_user.is_authenticated:
            return jsonify({"message":"User is logged in", "user_id": current_user.pid}), 200
        else:
            return jsonify({"message": "User is not logged in"}), 401

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

            return jsonify({"message": "Warehouse Creation Successful"}), 200
        
        except Exception as e:
            return jsonify({"message": "An error occurred"}), 400


    
    
    # items
    # Create
    @app.route("/add_item/<wid>", methods=["POST"])
    def create_item(wid):
        if current_user.is_authenticated:
            warehouse = Warehouse.query.get(wid)
            if not warehouse:
                return jsonify({"message": "Warehouse not found"}), 404
            print(f"Warehouse: {warehouse.name} owned by {warehouse.user.username}")

            # create the item
            # get the item name, quantity and price from the request
            item_name = request.json.get("itemName")
            item_quantity = request.json.get("quantity")
            item_price = request.json.get("price")


            if item_quantity == 0: # if the quantity is 0, then we don't need to add the item
                return jsonify({"message": "Item quantity is 0, not adding item"}), 200
            
            # check if the item already exists in the warehouse
            item_exists = Item.query.filter(Item.warehouse_id == warehouse.id, Item.name == item_name).first()

            if item_exists: # then only add to the quantity
                item_exists.quantity += item_quantity
                db.session.commit()
                return jsonify({"message": "Item already exists, quantity updated"}), 200
            

            # if the item does not exist, then create a new item
            item = Item(name=item_name, quantity=item_quantity, price=item_price, warehouse=warehouse)
            print(item.to_json())
            db.session.add(item)
            db.session.commit()
            return jsonify({"message": "Item added successfully"}), 200
        else:
            return jsonify({"message": "User not logged in"}), 401
        

    # Get the warehouse items to view
    @app.route("/get_details/<wid>", methods=["GET"])
    def get_details(wid):
        if current_user.is_authenticated:
            warehouse = Warehouse.query.get(wid)
            if not warehouse:
                return jsonify({"message": "Warehouse not found"}), 404
            
            items = Item.query.filter(Item.warehouse_id == warehouse.id).all()
            if not items: # if there are no items, return an empty list
                return jsonify({"message": "No items found in warehouse", "items": [], "name": warehouse.name}), 200
            
            return jsonify({"message": "Items found", "items": [item.to_json() for item in items], "name": warehouse.name}), 200
        else:
            return jsonify({"message": "User not logged in"}), 401
        

    # Get the warehouses of the user for the orders page
    @app.route("/get_warehouses/<user_id>", methods=["GET"])
    def get_warehouses(user_id):
        if current_user.is_authenticated:
            user = User.query.get(user_id)
            if not user:
                return jsonify({"message": "User not found"}), 404
            
            warehouses = Warehouse.query.filter(Warehouse.user_id == user_id).all()
            if not warehouses: # if the user doesn't have any warehouses, return an empty list
                return jsonify({"message": "No warehouses for the user", "warehouses": []}), 200
            
            # Now that we found the user's warehouses, return them
            return jsonify({"message": "Warehouses found", "warehouses": [warehouse.to_json() for warehouse in warehouses]})
        else:   
            return jsonify({"message": "User not logged in"}), 401
        

    # a route for getting the warehouse ID based on the warehouse name
    @app.route("/get_warehouse_id/<warehouse_name>", methods=["GET"])
    def get_warehouse_id(warehouse_name):
        if current_user.is_authenticated:
            warehouse = Warehouse.query.filter(Warehouse.user_id == current_user.pid, Warehouse.name == warehouse_name).first()
            if not warehouse:
                return jsonify({"message": "Warehouse not found"}), 404
            
            # found the warehouse, return the id
            return jsonify({"message": "Warehouse found", "warehouse_id": warehouse.id}), 200
        else:
            return jsonify({"message": "User not logged in"}), 401
        
    # a route to get the warehouse's name based on the id to display on the Order component
    @app.route("/get_warehouse_name/<wid>", methods=["GET"])
    def get_warehouse_name(wid):
        if current_user.is_authenticated:
            
            warehouse = Warehouse.query.get(wid)
            if not warehouse:
                return jsonify({"message": f"Warehouse with id {wid} does not exist"}), 404
            
            # else the warehouse exists
            return jsonify({"message": "Found warehouse", "name": warehouse.name}), 200
        else:
            return jsonify({"message": "User not logged in"}), 401



