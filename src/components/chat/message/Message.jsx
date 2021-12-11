import React from "react";
import "./message.css";

const MessageLeft = function () {
  return (
    <>
      <div className="message message--left">
        <div className="message__avatar">
          <img src="https://source.unsplash.com/500x800/?selfie" alt="Tom" />
        </div>
        <div className="message__contents">
          <div className="message__content">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Consequatur officia possimus, dolorem, quod suscipit ipsam expedita
            similique modi dolorum sed ducimus vitae inventore unde beatae nobis
            culpa. Mollitia, inventore non.
          </div>
          <div className="message__content">perfect</div>
          <div className="message__content">wow, this is really epic</div>
        </div>
      </div>
    </>
  );
};

const MessageRight = function () {
  return (
    <>
      <div className="message message--right">
        <div className="message__contents">
          <div className="message__content">omg, this is amazing</div>
          <div className="message__content">perfect</div>
          <div className="message__content">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
            cumque ullam laudantium necessitatibus nostrum ipsa consectetur sed
            a nisi sint, dolor quo, voluptates vero quis ex unde amet nemo
            provident.
          </div>
        </div>
        <div className="message__avatar">
          <img src="https://source.unsplash.com/500x700/?selfie" alt="Tom" />
        </div>
      </div>
    </>
  );
};

function Message({ self }) {
  return <>{self ? <MessageLeft /> : <MessageRight />}</>;
}

export default Message;
