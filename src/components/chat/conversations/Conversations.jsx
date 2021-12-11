import React from "react";
import "./conversations.css";
import Conversation from "../conversation/Conversation";

function Conversations() {
  return (
    <div className="chat__section chat__section--conversations">
      <div className="chat__section__header">
        <div className="text-input">
          <input type="text" placeholder="Search in messages" />
        </div>
      </div>
      <div className="chat__section__content">
        <ul className="list list--action">
          <Conversation/>
          <Conversation/>
          <Conversation/>
        </ul>
      </div>
    </div>
  );
}

export default Conversations;
