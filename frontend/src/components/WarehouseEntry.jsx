import classes from "./WarehouseEntry.module.css";
import WarehouseView from "./Modals/WarehouseView";

function WarehouseEntry({ name, wid, open, onClose, onClick }) {
  return (
    <>
      <div className={classes.entry} key={wid ? wid : ""} onClick={onClick}>
        <img
          src="/warehouse.png"
          alt="warehouse"
          width="117px"
          height="117px"
        />
        <span style={{ fontWeight: "600", fontSize: "23px" }}>{name}</span>
      </div>
      <WarehouseView open={open} warehouseName={name} onClose={onClose} />
    </>
  );
}

export default WarehouseEntry;
