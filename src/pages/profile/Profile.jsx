import React from "react";
import "./profile.css";

function Profile() {
  return (
    <section className="container py-4">
      <div className="card mb-3">
        <div className="card__header">
          <div className="list__item p-0">
            <div className="list__item__image">
              <img
                src="https://source.unsplash.com/500x500/?selfie"
                alt="Tom"
              />
            </div>
            <div className="list__item__content">
              <div className="list__item__content__title">Your Name</div>
              <div className="list__item__content__text">
                <span className="online-badge">Online</span>
              </div>
            </div>
            <div className="list__item_action">
              <button className="btn btn--light-purple">Message</button>
              <button className="btn btn--light-red">Unfriend</button>
            </div>
          </div>
        </div>
        <div className="card__body">
          <div className="people">
            <div className="people__profile-image">
              <img
                src="https://source.unsplash.com/500x500/?selfie"
                alt="Tom"
              />
            </div>
            <div className="people__info">
              <div className="people__info--name">Your Name</div>
              <div className="people__info--age">23</div>
              <div className="people__info--gender">Female</div>
            </div>
            <div className="people__images">
              <div className="people__images__image">
                <img
                  src="https://source.unsplash.com/500x500/?selfie"
                  alt="Tom"
                />
              </div>
              <div className="people__images__image">
                <img
                  src="https://source.unsplash.com/500x500/?selfie"
                  alt="Tom"
                />
              </div>
              <div className="people__images__image">
                <img
                  src="https://source.unsplash.com/500x500/?selfie"
                  alt="Tom"
                />
              </div>
              <div className="people__images__image">
                <img
                  src="https://source.unsplash.com/500x500/?selfie"
                  alt="Tom"
                />
              </div>
              <div className="people__images__image">
                <img
                  src="https://source.unsplash.com/500x500/?selfie"
                  alt="Tom"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
