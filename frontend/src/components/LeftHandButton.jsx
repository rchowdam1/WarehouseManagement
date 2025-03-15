import AddWarehouses from "./AddWarehouses";
import ClearAll from "./ClearAll";

function LeftHandButton({
  styling,
  addWarehouseModalStatus,
  clearWarehouseModalStatus,
  onAddWarehouseClick,
  onClearWarehouseClick,
  closeAddWarehouseModal,
  closeClearWarehouseModal,
  userID,
}) {
  return (
    <div style={styling}>
      <AddWarehouses
        status={addWarehouseModalStatus}
        onClick={onAddWarehouseClick}
        onClose={closeAddWarehouseModal}
        userID={userID}
      />
      <ClearAll
        status={clearWarehouseModalStatus}
        onClick={onClearWarehouseClick}
        onClose={closeClearWarehouseModal}
        userID={userID}
      />
    </div>
  );
}

export default LeftHandButton;
