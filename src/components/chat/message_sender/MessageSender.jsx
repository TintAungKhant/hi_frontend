import React, { useState, createRef } from "react";
import { postMessages } from "../../../api";
import Popup from "../../popup/Popup";

function MessageSender({ current_user_id }) {
  const [imageErrors, setImageErrors] = useState([]);

  const textInput = createRef();
  const imageInput = createRef();

  const sendMessage = (type) => {
    setImageErrors([]);
    if (type === "image") {
      let form = new FormData();
      form.append("image", imageInput.current.files[0]);
      form.append("type", type);
      postMessages(
        form,
        { user_id: current_user_id },
        {
          "Content-Type": "multipart/form-data",
        }
      ).catch((err) => {
        if (err.response.status === 422) {
          if (err.response.data.data.errors.image) {
            setImageErrors(err.response.data.data.errors.image);
          }
        }
      });
    } else {
      if (textInput.current.value) {
        let form = {
          text: textInput.current.value,
          type,
        };
        textInput.current.value = "";
        textInput.current.focus();
        postMessages(form, { user_id: current_user_id });
      }
    }
  };

  return (
    <div className="p-2 flex items-center bg-gray-800">
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
        style={{ display: "none" }}
        id="file-input"
        ref={imageInput}
        onChange={() => sendMessage("image")}
      />
      <button
        className="flex-shrink-0 w-12 h-12 text-2xl rounded-md btn-indigo"
        onClick={() => document.querySelector("#file-input").click()}
      >
        <i className="fas fa-image"></i>
      </button>
      <input
        className="w-full mx-2 h-12 p-2 rounded-md border border-gray-900/40 bg-gray-900"
        type="text"
        placeholder="What's in your mind?"
        ref={textInput}
        onKeyUp={(e) => {
          if (e.keyCode === 13) {
            sendMessage("text");
          }
        }}
      />
      <button
        className="flex-shrink-0 w-12 h-12 text-2xl rounded-md btn-indigo"
        onClick={() => sendMessage("text")}
      >
        <i className="fas fa-paper-plane"></i>
      </button>
    </div>
  );
}

export default MessageSender;
