import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import _ from "lodash";
import AuthContext from "../../../contexts/AuthContext.js";
import EmptyUserImage from "../../../assets/empty_user_image.png";

function Conversation({ conversation }) {
  const navigate = useNavigate();
  const { authInfo } = useContext(AuthContext);
  const { user_id: current_user_id } = useParams();

  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(
      _.find(conversation.users, (user) => {
        return user.id != authInfo.user.id;
      })
    );
  }, []);

  if (!user) {
    return <></>;
  }

  return (
    <div
      className={
        current_user_id == user.id
          ? "conversation-container active"
          : "conversation-container"
      }
      onClick={() => navigate(`/chat/user/${user.id}`)}
    >
      <div className="flex items-start">
        <div className="w-10 flex-shrink-0 rounded-md overflow-hidden">
          <img
            src={
              user.main_profile_image
                ? user.main_profile_image.url
                : EmptyUserImage
            }
            className="object-cover w-10 h-10 cursor-pointer"
          />
        </div>
        <div className="px-2 overflow-hidden">
          <div className="font-semibold">{user.name}</div>
          <div className="flex">
            <LatestMessage latest_message={conversation.latest_message} />
          </div>
        </div>
      </div>
    </div>
  );
}

const LatestMessage = ({ latest_message }) => {
  const { authInfo } = useContext(AuthContext);

  if (latest_message.type === "text") {
    if (latest_message.user_id == authInfo.user.id) {
      return (
        <div className="flex">
          <span className="font-semibold mr-1">You:</span>
          <span className="text-truncate">
            {latest_message.messageable.text}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex">
          <span className="text-truncate">
            {latest_message.messageable.text}
          </span>
        </div>
      );
    }
  }
  if (latest_message.user_id == authInfo.user.id) {
    return (
      <div className="flex">
        <span className="font-semibold mr-1">You:</span>
        <span className="text-truncate">
          Sent an image<i className="fas fa-image ml-2"></i>
        </span>
      </div>
    );
  } else {
    return (
      <div className="flex">
        <span className="text-truncate">
          Sent an image<i className="fas fa-image ml-2"></i>
        </span>
      </div>
    );
  }
};

export default Conversation;
