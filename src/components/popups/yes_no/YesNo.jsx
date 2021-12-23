import React from "react";
import "./yes_no.css";

function YesNo({ title, message, yes, yes_params, no, no_params }) {
  return (
    <div className="popup-container">
      <div className="popup popup--yes-no">
        {title && (
          <div className="popup__title">
            <h2>{title}</h2>
          </div>
        )}
        {message && <div className="popup__body">{message}</div>}

        <div className="popup_action">
          <button
            className="btn btn--purple"
            onClick={() => {
              if (yes_params) {
                yes(...yes_params);
              } else {
                yes();
              }
            }}
          >
            Yes
          </button>
          <button
            className="btn btn--light-purple"
            onClick={() => {
              if (no_params) {
                no(...no_params);
              } else {
                no();
              }
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default YesNo;
