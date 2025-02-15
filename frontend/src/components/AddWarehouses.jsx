import classes from "./AddWarehouses.module.css";

function AddWarehouses() {
  return (
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
      <div className={classes.addButtonContainer}>
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
    </div>
  );
}

export default AddWarehouses;
