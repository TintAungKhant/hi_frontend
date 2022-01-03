import React, { useState } from "react";
import "./message.css";
import Image from "../../popups/image/Image";

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

const MessageLeft = function ({ messages }) {
  return (
    <>
      <div className="message message--left">
        <div className="message__avatar">
          <img src="https://source.unsplash.com/500x800/?selfie" alt="Tom" />
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
          <img src="https://source.unsplash.com/500x700/?selfie" alt="Tom" />
        </div>
      </div>
    </>
  );
};

function Message({ self, messages }) {
  return (
    <>
      {self ? (
        <MessageRight messages={messages} />
      ) : (
        <MessageLeft messages={messages} />
      )}
    </>
  );
}

export default Message;
