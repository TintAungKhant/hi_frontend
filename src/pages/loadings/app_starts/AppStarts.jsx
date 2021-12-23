import React from "react";
import "./app_starts.css";
import Loader from "../../../assets/loader.gif";

function AppStarts() {
  return (
    <div className="full-screen-loading">
      <div className="full-screen-loading__message">
        <div className="full-screen-loading__loader">
          <img src={Loader} alt="loader" />
        </div>
        <div className="full-screen-loading__text">Initiating the app...</div>
      </div>
    </div>
  );
}

export default AppStarts;
