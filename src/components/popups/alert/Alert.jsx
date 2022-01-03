import React from "react";
import "./alert.css";

function Alert({ message, ok }) {
  return (
    <div className="popup-container">
      <div className="popup popup--alert">
        {message && <div className="popup__body">{message}</div>}

        <div className="popup-action">
          <button
            className="btn btn--purple"
            onClick={() => {
              ok();
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

export default Alert;
