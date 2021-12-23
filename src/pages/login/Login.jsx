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
      ui_errors_login: false,
      ui_errors_validations: {},
    };

    this.ref = {
      inputs: {
        email: createRef(),
        password: createRef(),
      },
      buttons: {
        login: createRef(),
      },
    };

    this.setAuthInfo = context.setAuthInfo;
  }

  login = () => {
    this.loginLoading(true);

    this.setState({
      ui_errors_login: false,
      ui_errors_validations: {},
    });

    postLogin({
      email: this.ref.inputs.email.current.value,
      password: this.ref.inputs.password.current.value,
    })
      .then((res) => {
        this.setAuthInfo({
          auth: true,
          user: res.data.data.user,
        });
      })
      .catch((err) => {
        if (err.response.status === 422) {
          this.setState({
            ...this.state,
            ui_errors_validations: err.response.data.data.errors,
          });
        }
        if (err.response.status === 401) {
          this.setState({ ...this.state, ui_errors_login: true });
        }
        this.loginLoading(false);
      });
  };

  loginLoading = (loading = false) => {
    if (loading) {
      _.each(this.ref.inputs, function (input) {
        input.current.disabled = true;
      });
      this.ref.buttons.login.current.disabled = true;

      return;
    }

    _.each(this.ref.inputs, function (input) {
      if (input.current) {
        input.current.disabled = false;
      }
    });
    this.ref.buttons.login.current.disabled = false;

    return;
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
              {this.state.ui_errors_login && (
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
                  ref={this.ref.inputs.email}
                />
                <ValidationError
                  errors={this.state.ui_errors_validations.email}
                />
              </div>
              <div className="form__input text-input">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  ref={this.ref.inputs.password}
                />
                <ValidationError
                  errors={this.state.ui_errors_validations.password}
                />
              </div>
            </form>
          </div>
          <div className="card__footer">
            <button
              className="btn btn--light-purple"
              onClick={this.login}
              ref={this.ref.buttons.login}
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
