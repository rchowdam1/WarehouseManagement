import { useState, useEffect } from "react";
import classes from "./Warehouses.module.css";

function Warehouses({ loadedWarehouses }) {
  // resume here 2/9, the container to display the user's warehouses
  console.log(
    "type of user warehouses from Warehouses.jsx " + typeof loadedWarehouses
  );

  const placeHolderElement = (
    <div
      className={classes.placeholder}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>You currently do not have any warehouses</h1>
      <p
        className="supplementary-placholder"
        style={{ fontWeight: "500", fontSize: "20px" }}
      >
        Add Some
      </p>
    </div>
  );
  return (
    <div className={classes.warehousesContainer}>
      {loadedWarehouses ? (
        <div>You have some warehouses</div>
      ) : (
        placeHolderElement
      )}
    </div>
  );
}

export default Warehouses;
