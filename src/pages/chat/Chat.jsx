import React, { useState, useEffect, useMemo} from "react";
import { useParams } from "react-router-dom";
import "./chat.css";
import ChatContext from "../../contexts/ChatContext";
import { getConversation } from "../../api";
import Conversations from "../../components/chat/conversations/Conversations";
import Messages from "../../components/chat/messages/Messages";
import socket from "../../socket";

const MemoConversations = React.memo(() => {
  return <Conversations socket={socket}/>;
});

const MemoMessages = React.memo(() => {
  return <Messages socket={socket}/>;
});

function Chat() {
  const [currentConver, setCurrentConver] = useState({});

  const { user_id } = useParams();

  useEffect(() => {
    if (user_id) {
      getConversation({ user_id }).then((res) => {
        setCurrentConver(res.data.data.conversation);
      });
    }
  }, [user_id]);

  return (
    <section className="chat">
      <ChatContext.Provider
        value={useMemo(
          () => ({ current_conver: currentConver }),
          [currentConver]
        )}
      >
        <MemoConversations />
        <MemoMessages />
      </ChatContext.Provider>
    </section>
  );
}

export default Chat;
