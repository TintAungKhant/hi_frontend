import React from "react";

function Explore() {
  return (
    <section className="container py-4">
      <div className="card mb-3">
        <div className="card__header">
          <h2>Explore</h2>
        </div>
        <div className="card__body">
          <div className="d-flex mb-3">
            <strong className="mr-2">Target</strong>
            <span className="mr-2">-</span>
            <div className="d-flex">
              <div className="mr-2">
                <label htmlFor="gender_male">Male</label>
                <input type="radio" id="gender_male" name="gender" value="1" />
              </div>
              <div className="mr-2">
                <label htmlFor="gender_female">Female</label>
                <input
                  type="radio"
                  id="gender_female"
                  name="gender"
                  value="2"
                />
              </div>
              <div>
                <label htmlFor="gender_all">All</label>
                <input type="radio" id="gender_all" name="gender" value="3" />
              </div>
            </div>
          </div>
          <ul className="list">
            <li className="list__item">
              <div className="list__item__image">
                <img
                  src="https://source.unsplash.com/500x500/?selfie"
                  alt="Tom"
                />
              </div>
              <div className="list__item__content">
                <div className="list__item__content__title">Your Name</div>
              </div>
              <div className="list__item_action">
                <button className="btn btn--light-purple">Add</button>
              </div>
            </li>
            <li className="list__item">
              <div className="list__item__image">
                <img
                  src="https://source.unsplash.com/500x500/?selfie"
                  alt="Tom"
                />
              </div>
              <div className="list__item__content">
                <div className="list__item__content__title">Your Name</div>
              </div>
              <div className="list__item_action">
                <button className="btn btn--light-purple">Add</button>
              </div>
            </li>
          </ul>
        </div>
        <div className="card__footer">
          <button className="btn btn--light-purple">Refresh</button>
        </div>
      </div>
    </section>
  );
}

export default Explore;
