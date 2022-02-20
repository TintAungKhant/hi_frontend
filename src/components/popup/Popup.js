import React from "react";

function Popup({children}) {
  return (
    <div className="fixed w-full h-full top-0 left-0 flex justify-center items-center bg-zinc-900/90 z-50">
      {children}
    </div>
  );
}

export default Popup;
