import { useState, useEffect } from "react";
import WarehouseRow from "./WarehouseRow";
import WarehouseEntry from "./WarehouseEntry";
import classes from "./Warehouses.module.css";

function Warehouses({ loadedWarehouses }) {
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

  const warehouses = [
    ...loadedWarehouses,
    { name: "second" },
    { name: "third" },
    { name: "fourth" },
  ];

  function intoRows(array, rowSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += 3) {
      chunks.push(array.slice(i, i + 3));
    }
    console.log(chunks);
    return chunks;
  }

  return (
    <div className={classes.warehousesContainer}>
      {loadedWarehouses ? (
        <>
          {intoRows(warehouses, 3).map((row, index) => {
            return (
              <WarehouseRow key={index}>
                {row.map((warehouse, key) => {
                  return <WarehouseEntry key={key} name={warehouse.name} />;
                })}
              </WarehouseRow>
            );
          })}
        </>
      ) : (
        placeHolderElement
      )}
    </div>
  );
}

export default Warehouses;
