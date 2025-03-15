import classes from "./WarehouseEntry.module.css";

function WarehouseEntry({ name, wid }) {
  return (
    <div className={classes.entry} key={wid ? wid : ""}>
      <img src="/warehouse.png" alt="warehouse" width="117px" height="117px" />
      <span style={{ fontWeight: "600", fontSize: "23px" }}>{name}</span>
    </div>
  );
}

export default WarehouseEntry;
