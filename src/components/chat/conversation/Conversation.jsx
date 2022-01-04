import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import _ from "lodash";
import EmptyUserImage from "../../../assets/empty_user_image.png";

function Conversation({ conversation, auth_user_id, current_user_id }) {
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(
      _.filter(conversation.users, (user) => {
        return user.id != auth_user_id;
      })[0]
    );
  }, []);

  const messageContent = (conversation) => {
    if (conversation.latest_message.type === "text") {
      if (conversation.latest_message.user_id == auth_user_id) {
        return <div>You: {conversation.latest_message.messageable.text}</div>;
      }
      return <div>{conversation.latest_message.messageable.text}</div>;
    }
    if (conversation.latest_message.user_id == auth_user_id) {
      return (
        <div>
          You: Sent an image&nbsp;<i className="fas fa-image"></i>
        </div>
      );
    }
    return (
      <div>
        Sent an image&nbsp;<i className="fas fa-image"></i>
      </div>
    );
  };

  return (
    <li
      className={`list__item ${current_user_id == user.id ? "active" : ""}`}
      onClick={() => navigate(`/chat/user/${user.id}`)}
    >
      <div className="list__item__image">
        <img
          src={user.main_profile_image ? user.main_profile_image.url : EmptyUserImage}
          alt={user.name}
        />
      </div>
      <div className="list__item__content">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="list__item__content__title mr-1">{user.name}</div>
            {/* <span className="badge">12</span> */}
          </div>
          <div>
            {/* <span className="text--light-dark text--bold">12h</span> */}
          </div>
        </div>
        <div className="list__item__content__text text-truncate">
          {messageContent(conversation)}
        </div>
      </div>
    </li>
  );
}

export default Conversation;
