import React, { Component, createRef } from "react";
import _ from "lodash";
import AuthContext from "../../contexts/AuthContext";
import { postLogin } from "../../api";
import ValidationError from "../../components/validation_error/ValidationError";
import FormAlert from "../../components/form_alert/FormAlert";

export class Login extends Component {
  static contextType = AuthContext;

  // eslint-disable-next-line no-empty-pattern
  constructor({}, context) {
    super();

    this.state = {
      ui: {
        errors: {
          login: false,
          validations: {},
        },
      },
    };

    this.emailInput = createRef(null);
    this.passwordInput = createRef(null);

    this.default_errors = { ...this.state.ui.errors };

    this.setAuthInfo = context.setAuthInfo;
  }

  login = () => {
    let newSate = _.set(this.state, ["ui", "errors"], {
      ...this.default_errors,
    });
    this.setState(newSate);

    postLogin({
      email: this.emailInput.current.value,
      password: this.passwordInput.current.value,
    })
      .then((res) => {
        this.setAuthInfo({
          auth: true,
          user: res.data.data.user,
        });
      })
      .catch((err) => {
        if (err.response.status === 422) {
          let newSate = _.set(
            this.state,
            ["ui", "errors", "validations"],
            err.response.data.data.errors
          );
          this.setState(newSate);
        }
        if (err.response.status === 401) {
          let newSate = _.set(this.state, ["ui", "errors", "login"], true);
          this.setState(newSate);
        }
      });
  };

  render() {
    return (
      <section className="container py-4">
        <div className="card">
          <div className="card__header">
            <h2>Login</h2>
          </div>
          <div className="card__body">
            <form className="form">
              {this.state.ui.errors.login && (
                <FormAlert
                  msg={"Your login credentials are wrong!"}
                  type={"red"}
                />
              )}
              <div className="form__input text-input">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  ref={this.emailInput}
                />
                <ValidationError
                  errors={this.state.ui.errors.validations.email}
                />
              </div>
              <div className="form__input text-input">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  ref={this.passwordInput}
                />
                <ValidationError
                  errors={this.state.ui.errors.validations.password}
                />
              </div>
            </form>
          </div>
          <div className="card__footer">
            <button
              className="btn btn--light-purple"
              onClick={this.login}
            >
              Login
            </button>
          </div>
        </div>
      </section>
    );
  }
}

export default Login;
