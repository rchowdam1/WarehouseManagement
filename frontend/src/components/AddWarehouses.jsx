import { useState } from "react";
import classes from "./AddWarehouses.module.css";
import AddModal from "./Modals/AddModal";

function AddWarehouses({ status, onClick, onClose, userID }) {
  const [warehouseName, setWarehouseName] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        warehouseName,
        userID: userID,
      };

      console.log(JSON.stringify(data));

      const url = "http://localhost:5000/create_warehouse";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        console.log(response);
      } else {
        const received = await response.json();
        console.log(received);
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <div
        style={{
          height: "150px",
          width: "120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "20px",
        }}
      >
        <div className={classes.addButtonContainer} onClick={onClick}>
          <img
            src="/plus.png"
            width="55px"
            height="55px"
            style={{
              paddingTop: "21px",
              paddingLeft: "21px",
            }}
          />
        </div>

        <p>Add Warehouse</p>

        <AddModal open={status} onClose={onClose}>
          <div
            className="exitModal"
            onClick={onClose}
            style={{ cursor: "pointer", float: "right" }}
          >
            <img src="/reject.png" height="20px" width="20px" />
          </div>
          <form
            onSubmit={onSubmit}
            className="warehouse-form"
            style={{
              padding: "75px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <label
              htmlFor="warehouseName"
              style={{ fontWeight: "500", fontSize: "1.3rem" }}
            >
              Enter Warehouse Name: <br /> <br />
            </label>

            <input
              type="text"
              id="warehouse-name"
              placeholder="Warehouse Name"
              required="required"
              onChange={(e) => setWarehouseName(e.target.value)}
              style={{ width: "200px", height: "25px", fontSize: "18px" }}
            />

            <br />
            <br />
            <button type="submit" className={classes.submitButton}>
              Create
            </button>
          </form>
        </AddModal>
      </div>
    </div>
  );
}

export default AddWarehouses;
