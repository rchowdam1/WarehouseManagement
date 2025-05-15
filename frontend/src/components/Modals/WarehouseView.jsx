import { useState } from "react";
import { Link } from "react-router-dom";

function WarehouseView({ open, warehouseName, onClose, warehouseID }) {
  const [quantity, setQuantity] = useState(0);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState(""); // needs to be converted to a number
  if (!open) return null;
  console.log(warehouseID);
  const addItem = async (e) => {
    e.preventDefault();

    const data = {
      itemName,
      quantity,
      price: Number(price),
    };

    console.log(JSON.stringify(data));

    const url = `http://localhost:5000/add_item/${warehouseID}`;

    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        alert("Error adding item - line 33");
      } else {
        const received = await response.json();
        if (received.message === "Item added successfully") {
          console.log("Item added successfully");
        } else {
          alert(received.message);
        }
      }
    } catch (error) {
      alert("Error adding item - line 42");
    }

    setItemName("");
    setPrice("");
    setQuantity(0);
    onClose();
  };

  const MODAL_STYLES = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#ffffff",
    padding: "10px",
    zIndex: 1000,
  };

  const OVERLAY_STYLES = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1000,
  };

  return (
    <>
      <div style={OVERLAY_STYLES} onClick={onClose}></div>
      <div style={MODAL_STYLES}>
        <div
          className="exitModal"
          onClick={onClose}
          style={{ cursor: "pointer", float: "right" }}
        >
          <img src="/reject.png" height="20px" width="20px" />
        </div>
        <span style={{ textAlign: "center" }}>{warehouseName}</span>
        <form
          style={{
            padding: "175px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onSubmit={addItem}
        >
          <label>Item name: </label>
          <input
            type="text"
            placeholder="name"
            onChange={(e) => setItemName(e.target.value)}
            style={{ height: "30px", width: "200px", fontSize: "18px" }}
            required
          />
          <br />
          <label>Price</label>
          <input
            type="text"
            placeholder="$0.00"
            style={{ height: "30px", width: "200px", fontSize: "18px" }}
            value={price}
            onChange={(e) => {
              let val = e.target.value.replace(/[^0-9.]/g, "");
              const parts = val.split(".");
              if (parts.length > 2) return;

              // Max 2 decimal places
              if (parts[1]?.length > 2) {
                parts[1] = parts[1].slice(0, 2);
                val = parts.join(".");
              }
              setPrice(val);
              console.log(typeof val);
            }}
          />
          <label>Quantity</label>
          <div
            className="quantity"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              paddingTop: "10px",
            }}
          >
            <button
              type="button"
              style={{ border: "2px", borderRadius: "5px" }}
              onClick={() => {
                if (quantity > 0) {
                  setQuantity(quantity - 1);
                }
              }}
            >
              <img src="/minus-sign.png" height="18px" width="18px"></img>
            </button>

            <span>{quantity}</span>
            <button
              type="button"
              style={{ border: "2px", borderRadius: "5px" }}
              onClick={() => {
                setQuantity(quantity + 1);
              }}
            >
              <img src="/plus.png" height="18px" width="18px"></img>
            </button>
          </div>

          <br />
          <button
            type="submit"
            style={{
              height: "40px",
              width: "125px",
              borderRadius: "5px",
              border: "2px",
              fontSize: "18px",
            }}
          >
            Add Item
          </button>

          <Link to={`/warehouse/${warehouseID}`}>
            <button
              style={{
                height: "50px",
                width: "158px",
                marginTop: "20px",
                borderRadius: "5px",
                border: "1px solid",
                fontSize: "18px",
                backgroundColor: "#ffb500",
                color: "white",
              }}
            >
              View Details
            </button>
          </Link>
        </form>
      </div>
    </>
  );
}

export default WarehouseView;
