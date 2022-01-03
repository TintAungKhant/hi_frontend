import React, { useState } from "react";
import { useNavigate } from "react-router";

const Content = ({ contact, type, accept, remove }) => {
  const navigate = useNavigate();

  if (type === "request") {
    return (
      <>
        <div className="list__item__content">
          <div className="list__item__content__title">{contact.name}</div>
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
          <div className="list__item__content__title">{contact.name}</div>
          <div className="list__item__content__text">
            <span className="online-badge">Online</span>
          </div>
        </div>
        <div className="list__item_action">
          <button
            className="btn btn--light-purple"
            onClick={() => navigate(`/chat/user/${contact.id}`)}
          >
            Message
          </button>
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
          <div className="list__item__content__title">{contact.name}</div>
          <div className="list__item__content__text">
            <span className="offline-badge">Offline</span>
          </div>
        </div>
        <div className="list__item_action">
          <button
            className="btn btn--light-purple"
            onClick={() => navigate(`/chat/user/${contact.id}`)}
          >
            Message
          </button>
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
        <img
          src="https://source.unsplash.com/500x500/?selfie"
          alt={contact.name}
        />
      </div>
      <Content contact={contact} type={type} accept={accept} remove={remove} />
    </li>
  );
}

export default Contact;
