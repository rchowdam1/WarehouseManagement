import { useState } from "react";

function AddModal({ open, children, onClose }) {
  if (!open) return null;

  const MODAL_STYLES = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#ffffff",
    padding: "10px",
    zIndex: 1000,
  };

  const OVERLAY_STYLES = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1000,
  };

  return (
    <>
      <div style={OVERLAY_STYLES} onClick={onClose}></div>
      <div style={MODAL_STYLES}>{children}</div>
    </>
  );
}

export default AddModal;
