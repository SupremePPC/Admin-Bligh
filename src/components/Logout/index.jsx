import React from "react";
import "./style.css";

export default function Logout({ isOpen, onClose, onLogout, isLoading }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal_overlay">
      <div
        className="modal"
        style={{
          width: "400px",
          height: "230px",
        }}
      >
        <div className="section_header">
          <h2 className="title">Logout</h2>
        </div>
        <p
          className="modal_text"
          style={{
            textAlign: "center",
          }}
        >
          Are you sure you want to logout?
        </p>
        <div className="buttons_wrap">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="submit_btn"
          >
            Cancel
          </button>

          {isLoading ? (
            <button className="cancel_btn">Logging out</button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLogout();
                onClose();
              }}
              className="cancel_btn"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
