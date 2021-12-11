import React from "react";

function Conversation() {
  return (
    <li className="list__item">
      <div className="list__item__image">
        <img src="https://source.unsplash.com/500x500/?selfie" alt="Tom" />
      </div>
      <div className="list__item__content">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="list__item__content__title mr-1">Your Name</div>
            <span className="badge">12</span>
          </div>
          <div>
            <span className="text--light-dark text--bold">12h</span>
          </div>
        </div>
        <div className="list__item__content__text text-truncate">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. In officia,
          qui impedit ab ipsum, doloribus vero libero atque ut corporis quisquam
          delectus eum earum ea error consectetur rerum quod enim?
        </div>
      </div>
    </li>
  );
}

export default Conversation;
