import React from "react";
import "./image.css";

function Image({ url, close }) {
  return (
    <div className="popup-container">
      <div className="popup">
        <div className="popup__image-container">
          <img src={url} style={{ maxHeight: "600px" }} />
        </div>
        <div className="popup-action">
          <button
            className="btn btn--light-purple"
            onClick={() => close()}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Image;
