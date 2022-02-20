import React from "react";
import { Link } from "react-router-dom";
import EmptyUserImage from "../../assets/empty_user_image.png";

const Contact = ({ contact, actions, no_border }) => {
  return (
    <div className={no_border ? "p-3 md:rounded-md" : "p-3 border-b border-indigo-800 md:border-b-0 md:rounded-md"}>
      <div className="flex items-center">
        <div className="w-10 rounded-md overflow-hidden">
          <Link to={`/profile/${contact.id}`}>
            <img
              src={
                contact.main_profile_image
                  ? contact.main_profile_image.url
                  : EmptyUserImage
              }
              alt={contact.name}
              className="object-cover w-10 h-10"
            />
          </Link>
        </div>
        <div className="px-2 ">
          <div className="font-semibold">
            <Link to={`/profile/${contact.id}`}>{contact.name}</Link>
          </div>
          <div className="d-flex">
            {contact.online ? (
              <>
                <span className="w-2 h-2 mr-1 rounded-full bg-green-400 inline-block"></span>
                <span className="text-sm">Online</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 mr-1 rounded-full bg-gray-600 inline-block"></span>
                <span className="text-sm">Offline</span>
              </>
            )}
          </div>
        </div>
      </div>
      {actions}
    </div>
  );
};

export default Contact;
