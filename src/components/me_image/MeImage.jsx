import React, { createRef, useState } from "react";
import { postProfileImage } from "../../api";
import EmptyUserImage from "../../assets/empty_user_image.png";
import LoadingImage from "../../assets/loading.gif";
import Popup from "../popup/Popup";

function MeImage({ name, image }) {
  const [profileImage, setProfileImage] = useState(image);
  const [uploading, setUploading] = useState(false);
  const [viewImage, setViewImage] = useState(false);
  const [imageErrors, setImageErrors] = useState([]);

  const input = createRef();

  const updateImage = async (remove = false) => {
    setUploading(true);
    let form = new FormData();
    if (remove === false) {
      form.append("image", input.current.files[0]);
    }
    if (name === "profile_image") {
      form.append("type", 1);
    } else {
      form.append("type", 2);
    }
    if (profileImage) {
      form.append("old_image_id", profileImage.id);
    }
    await postProfileImage(form)
      .then((res) => {
        if (res.data.data.image) {
          setProfileImage({
            id: res.data.data.image.id,
            url: res.data.data.image.url,
          });
        } else {
          setProfileImage(null);
        }
      })
      .catch((err) => {
        if (err.response.status === 422) {
          if (err.response.data.data.errors.image) {
            setImageErrors(err.response.data.data.errors.image);
          }
        }
      });
    setUploading(false);
  };

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
              <img src={profileImage.url} className={"max-h-[70vh]"} />
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

      {imageErrors[0] && (
        <Popup>
          <div className="card min-w-[20rem] max-w-[90%] bg-gray-900">
            <div className="card-header">
              <h1 className="text-lg">Image error</h1>
            </div>
            <div className="card-body">{imageErrors[0]}</div>
            <div className="card-footer flex justify-center">
              <button
                className="btn btn-indigo mr-1"
                onClick={() => setImageErrors([])}
              >
                Ok
              </button>
            </div>
          </div>
        </Popup>
      )}

      <input
        type="file"
        accept="image/*"
        id={name}
        style={{ display: "none" }}
        ref={input}
        onChange={() => updateImage()}
      />
      <div className="absolute right-0 p-1.5 bg-gray-700">
        {profileImage ? (
          <>
            <button
              className="px-2 py-1.5 btn-indigo"
              onClick={() => document.querySelector(`#${name}`).click()}
            >
              <i className="fas fa-pen"></i>
            </button>
            <button
              className="px-2 py-1.5 btn-red"
              onClick={() => updateImage(true)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </>
        ) : (
          <button
            className="px-2 py-1.5 btn-indigo"
            onClick={() => document.querySelector(`#${name}`).click()}
          >
            <i className="fas fa-plus"></i>
          </button>
        )}
      </div>
      {uploading ? (
        <img src={LoadingImage} />
      ) : profileImage ? (
        <img
          src={profileImage.url}
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
          onClick={() => document.querySelector(`#${name}`).click()}
        />
      )}
    </div>
  );
}

export default MeImage;
