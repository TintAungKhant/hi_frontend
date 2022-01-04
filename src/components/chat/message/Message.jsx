import React, { useState } from "react";
import "./message.css";
import AuthContext from "../../../contexts/AuthContext";
import Image from "../../popups/image/Image";
import EmptyUserImage from "../../../assets/empty_user_image.png";

const MessageContent = ({ message }) => {
  const [showImagePopup, setShowImagePopup] = useState(false);

  if (message.type === "text") {
    return <div>{message.text}</div>;
  }

  const calcStyle = () => {
    let style = {
      width: "300px",
      height: "300px",
      objectFit: "cover",
      cursor: "pointer",
    };
    if (window.screen.width <= 768) {
      return { ...style, width: "200px", height: "200px" };
    }
    return style;
  };

  return (
    <div>
      {showImagePopup && (
        <Image url={message.url} close={() => setShowImagePopup(false)} />
      )}
      <img
        src={message.url}
        style={calcStyle()}
        onClick={() => setShowImagePopup(true)}
      />
    </div>
  );
};

const MessageLeft = function ({ messages, profile_image_url }) {
  return (
    <>
      <div className="message message--left">
        <div className="message__avatar">
          <img src={profile_image_url} />
        </div>
        <div className="message__contents">
          {messages.map((message, index) => {
            return (
              <div className="message__content" key={index}>
                <MessageContent message={message} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const MessageRight = function ({ messages }) {
  return (
    <>
      <div className="message message--right">
        <div className="message__contents">
          {messages.map((message, index) => {
            return (
              <div className="message__content" key={index}>
                <MessageContent message={message} />
              </div>
            );
          })}
        </div>
        <div className="message__avatar">
          <AuthContext.Consumer>
            {({ authInfo }) => {
              return (
                <img
                  src={
                    authInfo.user.main_profile_image
                      ? authInfo.user.main_profile_image.url
                      : EmptyUserImage
                  }
                  alt="Tom"
                />
              );
            }}
          </AuthContext.Consumer>
        </div>
      </div>
    </>
  );
};

function Message({ profile_image_url, self, messages }) {
  return (
    <>
      {self ? (
        <MessageRight messages={messages} />
      ) : (
        <MessageLeft
          messages={messages}
          profile_image_url={profile_image_url}
        />
      )}
    </>
  );
}

export default Message;
