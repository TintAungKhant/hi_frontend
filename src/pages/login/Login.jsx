import React, { Component, createRef } from "react";
import _ from "lodash";
import AuthContext from "../../contexts/AuthContext";
import { postLogin } from "../../api";
import ValidationError from "../../components/validation_error/ValidationError";
import FormAlert from "../../components/form_alert/FormAlert";
import FormTextInput from "../../components/form/text_input/FormTextInput";
import { disableRefs, enableRefs } from "../../helpers";

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
    disableRefs([..._.values(this.ref.inputs), ..._.values(this.ref.buttons)]);

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
        localStorage.setItem("BEARER_TOKEN", res.data.data.token);
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
        enableRefs([ ..._.values(this.ref.inputs), ..._.values(this.ref.buttons)]);
      });
  };

  render() {
    return (
      <div className="pt-[54px]">
        <div className="container mx-auto py-4">
          <div className="card max-w-2xl mx-auto">
            <div className="card-header">
              <h1 className="text-lg font-semibold">Login</h1>
            </div>
            <div className="card-body">
              {this.state.ui_errors_login && (
                <div className="bg-red-500 p-3 rounded-md mb-4">
                  Your login credentials are wrong!
                </div>
              )}
              <FormTextInput
                label="Email"
                type="email"
                ref={this.ref.inputs.email}
                errors={this.state.ui_errors_validations.email}
              />
              <FormTextInput
                label="Password"
                type="password"
                ref={this.ref.inputs.password}
                errors={this.state.ui_errors_validations.password}
              />
            </div>
            <div className="card-footer">
              <button
                className="btn btn-indigo"
                ref={this.ref.buttons.login}
                onClick={this.login}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
