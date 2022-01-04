import React from "react";
import { Link } from "react-router-dom";
import EmptyUserImage from "../../assets/empty_user_image.png";

const Content = ({ contact, type, accept, remove }) => {
  if (type === "request") {
    return (
      <>
        <div className="list__item__content">
          <div className="list__item__content__title">
            <Link to={`/profile/${contact.id}`}>{contact.name}</Link>
          </div>
        </div>
        <div className="list__item_action">
          <button
            className="btn btn--light-purple"
            onClick={() => accept(contact.id)}
          >
            Accept
          </button>
          <button
            className="btn btn--light-red"
            onClick={() => remove(contact.id, type)}
          >
            Reject
          </button>
        </div>
      </>
    );
  } else if (type === "online") {
    return (
      <>
        <div className="list__item__content">
          <div className="list__item__content__title">
            <Link to={`/profile/${contact.id}`}>{contact.name}</Link>
          </div>
          <div className="list__item__content__text">
            <span className="online-badge">Online</span>
          </div>
        </div>
        <div className="list__item_action">
          <Link
            to={`/chat/user/${contact.id}`}
            className="btn btn--light-purple"
          >
            Message
          </Link>
          <button
            className="btn btn--light-red"
            onClick={() => remove(contact.id, type)}
          >
            Unfriend
          </button>
        </div>
      </>
    );
  } else if (type === "offline") {
    return (
      <>
        <div className="list__item__content">
          <div className="list__item__content__title">
            <Link to={`/profile/${contact.id}`}>{contact.name}</Link>
          </div>
          <div className="list__item__content__text">
            <span className="offline-badge">Offline</span>
          </div>
        </div>
        <div className="list__item_action">
          <Link
            to={`/chat/user/${contact.id}`}
            className="btn btn--light-purple"
          >
            Message
          </Link>
          <button
            className="btn btn--light-red"
            onClick={() => remove(contact.id, type)}
          >
            Unfriend
          </button>
        </div>
      </>
    );
  }
  return <></>;
};

function Contact({ contact, type, accept, remove }) {
  return (
    <li className="list__item">
      <div className="list__item__image">
        <Link to={`/profile/${contact.id}`}>
          <img
            src={
              contact.main_profile_image
                ? contact.main_profile_image.url
                : EmptyUserImage
            }
            alt={contact.name}
          />
        </Link>
      </div>
      <Content contact={contact} type={type} accept={accept} remove={remove} />
    </li>
  );
}

export default Contact;
