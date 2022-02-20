import React, { useState } from "react";
import EmptyUserImage from "../../assets/empty_user_image.png";
import Popup from "../popup/Popup";

function ProfileImage({ name, image }) {
  const [viewImage, setViewImage] = useState(false);

  return (
    <div
      className={
        name === "profile_image"
          ? "relative w-44 rounded-md overflow-hidden mx-auto"
          : "relative w-36 rounded-md overflow-hidden mx-auto"
      }
    >
      {viewImage && (
        <Popup>
          <div className="card min-w-[20rem] max-w-[90%] bg-gray-900">
            <div className="card-body">
              <img src={image.url} className={"max-h-[70vh]"} />
            </div>
            <div className="card-footer flex justify-center">
              <button
                className="btn btn-indigo mr-1"
                onClick={() => setViewImage(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Popup>
      )}

      {image ? (
        <img
          src={image.url}
          className={
            name === "profile_image"
              ? "object-cover w-44 h-44 cursor-pointer"
              : "object-cover w-36 h-36 cursor-pointer"
          }
          onClick={() => setViewImage(true)}
        />
      ) : (
        <img
          src={EmptyUserImage}
        />
      )}
    </div>
  );
}

export default ProfileImage;
