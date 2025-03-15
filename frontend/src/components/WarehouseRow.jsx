import classes from "./WarehouseRow.module.css";

function WarehouseRow({ children }) {
  // resume here 2/21
  // how to use loadedWarehouse.map to only put 3 warehouses per row
  return (
    <div
      className="rowContainer"
      style={{ display: "flex", paddingTop: "40px" }}
    >
      {children}
    </div>
  );
}

export default WarehouseRow;
