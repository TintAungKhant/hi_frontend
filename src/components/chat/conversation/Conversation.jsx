import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import _ from "lodash";

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

  return (
    <li
      className={`list__item ${current_user_id == user.id ? "active" : ""}`}
      onClick={() => navigate(`/chat/user/${user.id}`)}
    >
      <div className="list__item__image">
        <img
          src="https://source.unsplash.com/500x500/?selfie"
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
          {conversation.latest_message.messageable.text}
        </div>
      </div>
    </li>
  );
}

export default Conversation;
