import React from "react";
import "./chat.css";
import Conversations from "../../components/chat/conversations/Conversations";
import Messages from "../../components/chat/messages/Messages";

function Chat() {
  return (
    <section className="chat">
      <Conversations/>
      <Messages/>
    </section>
  );
}

export default Chat;
