import React from "react";
import "./messages.css";
import Message from "../message/Message";

function Messages() {
  return (
    <div className="chat__section chat__section--messages">
      <div className="chat__section__header">
        <div className="list__item">
          <div className="list__item__image">
            <img src="https://source.unsplash.com/500x500/?selfie" alt="Tom" />
          </div>
          <div className="list__item__content">
            <div className="list__item__content__title mr-1">Your Name</div>
            <div className="list__item__content__text">
              <span className="online-badge">Online</span>
            </div>
          </div>
        </div>
      </div>
      <div className="chat__section__content">
        <div className="messages">
          <Message/>
          <Message self={true} />
        </div>
        <div className="message-sender">
          <div className="message-sender__attachment">
            <button>
              <i className="fas fa-paperclip"></i>
            </button>
          </div>
          <div className="message-sender__text">
            <div className="text-input">
              <input type="text" placeholder="Search in messages" />
            </div>
          </div>
          <div className="message-sender__send">
            <button className="btn btn--light-purple">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
