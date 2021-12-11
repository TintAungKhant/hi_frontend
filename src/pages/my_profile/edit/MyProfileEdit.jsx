import React from "react";

function MyProfileEdit() {
  return (
    <section className="container py-4">
      <div className="card">
        <div className="card__header">
          <h2>Update Profile</h2>
        </div>
        <div className="card__body">
          <form className="form">
            <div className="form__input text-input">
              <label htmlFor="name">Name</label>
              <input type="text" placeholder="Name" id="name" />
              <span className="form__input--error">This is error.</span>
              <span className="form__input--tip">This is tip.</span>
            </div>
            <div className="form__input text-input">
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="Email" id="email" />
              <span className="form__input--error">This is error.</span>
              <span className="form__input--tip">This is tip.</span>
            </div>
            <div className="form__input text-input">
              <label htmlFor="phone">Phone</label>
              <input type="text" placeholder="Phone" id="phone" />
              <span className="form__input--error">This is error.</span>
              <span className="form__input--tip">This is tip.</span>
            </div>
            <div className="form__input--group">
              <div className="form__input">
                <label>Gender</label>
                <div className="d-flex">
                  <div className="mr-2">
                    <label htmlFor="gender_male">Male</label>
                    <input
                      type="radio"
                      id="gender_male"
                      name="gender"
                      value="1"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender_female">Female</label>
                    <input
                      type="radio"
                      id="gender_female"
                      name="gender"
                      value="2"
                    />
                  </div>
                </div>
              </div>
              <span className="form__input--error">This is error.</span>
              <span className="form__input--tip">This is tip.</span>
            </div>
            <div className="form__input text-input">
              <label htmlFor="password">Password</label>
              <input type="password" placeholder="Password" id="password" />
              <span className="form__input--error">This is error.</span>
              <span className="form__input--tip">This is tip.</span>
            </div>
            <div className="form__input text-input">
              <label htmlFor="password_confirmation">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                id="password_confirmation"
              />
              <span className="form__input--error">This is error.</span>
              <span className="form__input--tip">This is tip.</span>
            </div>
          </form>
        </div>
        <div className="card__footer">
          <button className="btn btn--light-purple">Update</button>
        </div>
      </div>
    </section>
  );
}

export default MyProfileEdit;
