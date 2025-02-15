import AddWarehouses from "./AddWarehouses";
import ClearAll from "./ClearAll";

function LeftHandButton({ styling }) {
  return (
    <div style={styling}>
      <AddWarehouses />
      <ClearAll />
    </div>
  );
}

export default LeftHandButton;
