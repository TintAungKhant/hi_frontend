import React from "react";
import Loader from "../../../assets/loader.gif";
import "./loading.css";

function Loading() {
  return (
    <div className="loading">
      <div className="loading__loader">
        <img src={Loader} alt="loader" />
      </div>
    </div>
  );
}

export default Loading;
