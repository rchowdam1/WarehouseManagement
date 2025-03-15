import classes from "./ClearAll.module.css";
import ClearModal from "./Modals/ClearModal";
function ClearAll({ status, onClick, onClose, userID }) {
  return (
    <div>
      <div className={classes.buttonContainer} onClick={onClick}>
        <p className={classes.text}>Clear All</p>
      </div>

      <ClearModal open={status} onClose={onClose}>
        <div className="content">Content</div>
      </ClearModal>
    </div>
  );
}

export default ClearAll;
