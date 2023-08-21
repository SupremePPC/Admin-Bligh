import React from "react";
import "./style.css";

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    onPositiveAction,
    isLoading,
    positiveLabel,
    negativeLabel,
    loadingLabel = "Loading..."
  }) {
    if (!isOpen) {
      return null;
    }
  
    return (
      <div className="modal_overlay">
        <div
          className="modal">
          <div className="section_header">
            <h2 className="title">{title}</h2>
          </div>
          <p
            className="modal_text"
            style={{
              textAlign: "center",
            }}
          >
            {description}
          </p>
          <div className="buttons_wrap">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPositiveAction();
                  onClose();
                }}
                className="submit_btn"
              >
                {positiveLabel}
              </button>
  
            {isLoading ? (
              <button className="cancel_btn">{loadingLabel}</button>
            ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="cancel_btn"
            >
              {negativeLabel}
            </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  