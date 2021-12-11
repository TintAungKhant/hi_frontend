import React from "react";

function Login() {
  return (
    <section className="container py-4">
      <div className="card">
        <div className="card__header">
          <h2>Login</h2>
        </div>
        <div className="card__body">
          <form className="form">
            <div className="form__input text-input">
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="Email" id="email" />
              <span className="form__input--error">This is error.</span>
              <span className="form__input--tip">This is tip.</span>
            </div>
            <div className="form__input text-input">
              <label htmlFor="password">Password</label>
              <input type="password" placeholder="Password" id="password" />
              <span className="form__input--error">This is error.</span>
              <span className="form__input--tip">This is tip.</span>
            </div>
          </form>
        </div>
        <div className="card__footer">
          <button className="btn btn--light-purple">Login</button>
        </div>
      </div>
    </section>
  );
}

export default Login;
