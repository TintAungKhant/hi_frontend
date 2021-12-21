import React from "react";
import "./message.css";

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
                {message.text}
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
                {message.text}
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
