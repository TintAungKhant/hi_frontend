import React, { useState } from "react";
import Popup from "../../popup/Popup";

function Message({ profile_image_url, self, messages }) {
  const [viewImage, setViewImage] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  return (
    <div className="flex items-start mb-2">
      {viewImage && (
        <Popup>
          <div className="card min-w-[20rem] max-w-[90%] bg-gray-900">
            <div className="card-body">
              <img src={imageUrl} className={"max-h-[70vh]"} />
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

      {!self && (
        <div className="w-9 flex-shrink-0 rounded-md overflow-hidden">
          <img src={profile_image_url} className="object-cover w-10 h-10"/>
        </div>
      )}

      <div
        className={
          self
            ? "flex flex-col gap-2 items-end w-full"
            : "ml-3 flex flex-col gap-2 items-start w-full"
        }
      >
        {messages.map((message, index) => {
          if (message.type === "text") {
            return (
              <div
                className="bg-indigo-400 p-2 rounded-md max-w-lg"
                key={index}
              >
                {message.text}
              </div>
            );
          } else {
            return (
              <div
                className="cursor-pointer bg-indigo-400 p-2 rounded-md"
                key={index}
                onClick={() => setImageUrl(message.url) + setViewImage(true)}
              >
                <div className="overflow-hidden">
                  <img src={message.url} className="object-cover w-44 h-44" />
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Message;
