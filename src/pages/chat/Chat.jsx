import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash";
import ChatContext from "../../contexts/ChatContext";
import { getConversation, getConversations, getMessages } from "../../api";
import ConversationSection from "../../components/chat/conversation_section/ConversationSection";
import MessageSection from "../../components/chat/message_section/MessageSection";
import LoadingImage from "../../assets/loading.gif";

function Chat() {
  const [currentConversation, setCurrentConversation] = useState({});
  const [loading, setLoading] = useState(true);

  const { user_id: current_user_id } = useParams();

  useEffect(() => {
    if (current_user_id) {
      getConversation({ user_id: current_user_id }).then((res) => {
        setCurrentConversation(res.data.data.conversation);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [current_user_id]);

  return (
    <ChatContext.Provider
      value={useMemo(
        () => ({ current_conversation: currentConversation }),
        [currentConversation]
      )}
    >
      {loading && (
        <div className="w-full h-[calc(100vh-54px)] flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <div className="w-20">
              <img src={LoadingImage} />
            </div>
            <span className="font-semibold text-white">Loading Chat...</span>
          </div>
        </div>
      )}

      {!loading && (
        <section className="flex text-white pt-[54px]">
          <ConversationSection current_user_id={current_user_id}/>
          {current_user_id && (
            <MessageSection current_user_id={current_user_id} />
          )}
        </section>
      )}
    </ChatContext.Provider>
  );
}

export default Chat;
