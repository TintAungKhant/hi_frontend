import React from "react";
import LoadingImage from "../../assets/loading.gif";

function AppStarts() {
  return (
    <div className="w-full h-[calc(100vh-54px)] flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <div className="w-20">
          <img src={LoadingImage} />
        </div>
        <span className="font-semibold text-white">Initiating the app...</span>
      </div>
    </div>
  );
}

export default AppStarts;
