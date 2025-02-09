from app import db

class User(db.Model):
    __tablename__ = "app_users"

    pid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(30), unique=True, nullable=False)
    warehouses = db.relationship("Warehouse", backref="user")

    def to_json(self):
        return {
            "pid": self.pid,
            "username": self.username,
            "password": self.password,
        }
    

# resume here 2/1, running flask db upgrade does not work (executed flask db migrate, need to execute upgrade)
# the reason is, a new column was created in the user model, and there is an issue with sqlite

# make a new model to keep track of inventory
class Warehouse(db.Model):
    __tablename__ = "warehouses"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("app_users.pid"), name="warehouse_user")
    items = db.relationship("Item", backref="warehouse")

class Item(db.Model):
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    quantity = db.Column(db.Integer)
    price = db.Column(db.Float, nullable=False)
    warehouse_id = db.Column(db.Integer, db.ForeignKey("warehouses.id"))


