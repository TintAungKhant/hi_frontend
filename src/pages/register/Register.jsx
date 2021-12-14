import React, { Component } from "react";
import _ from "lodash";
import AuthContext from "../../contexts/AuthContext";
import ValidationError from "../../components/validation_error/ValidationError";
import { postRegister } from "../../api";

export class Register extends Component {
  // eslint-disable-next-line no-empty-pattern
  static contextType = AuthContext;

  // eslint-disable-next-line no-empty-pattern
  constructor({}, context) {
    super();

    this.state = {
      form: {
        name: null,
        gender: 1,
        birthday: null,
        email: null,
        password: null,
        password_confirmation: null,
      },
      ui: {
        errors: {
          validations: {},
        },
      },
    };

    this.setAuthInfo = context.setAuthInfo;
  }

  updateInput = (key, value) => {
    let newSate = _.set(this.state, ["form", key], value);
    this.setState(newSate);
  };

  register = () => {
    postRegister(this.state.form)
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
      });
  };

  render() {
    return (
      <section className="container py-4">
        <div className="card">
          <div className="card__header">
            <h2>Register Profile</h2>
          </div>
          <div className="card__body">
            <form className="form">
              <div className="form__input text-input">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  id="name"
                  onChange={(e) => this.updateInput("name", e.target.value)}
                />
                <ValidationError
                  errors={this.state.ui.errors.validations.name}
                />
              </div>
              <div className="form__input text-input">
                <label htmlFor="birthday">Birthday</label>
                <input
                  type="date"
                  placeholder="Birthday"
                  id="birthday"
                  onChange={(e) => this.updateInput("birthday", e.target.value)}
                />
                <ValidationError
                  errors={this.state.ui.errors.validations.birthday}
                />
              </div>
              <div className="form__input text-input">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  onChange={(e) => this.updateInput("email", e.target.value)}
                />
                <ValidationError
                  errors={this.state.ui.errors.validations.email}
                />
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
                        defaultChecked
                        onChange={(e) =>
                          this.updateInput("gender", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="gender_female">Female</label>
                      <input
                        type="radio"
                        id="gender_female"
                        name="gender"
                        value="2"
                        onChange={(e) =>
                          this.updateInput("gender", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <ValidationError
                  errors={this.state.ui.errors.validations.gender}
                />
              </div>
              <div className="form__input text-input">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  onChange={(e) => this.updateInput("password", e.target.value)}
                />
                <ValidationError
                  errors={this.state.ui.errors.validations.password}
                />
              </div>
              <div className="form__input text-input">
                <label htmlFor="password_confirmation">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  id="password_confirmation"
                  onChange={(e) =>
                    this.updateInput("password_confirmation", e.target.value)
                  }
                />
              </div>
            </form>
          </div>
          <div className="card__footer">
            <button className="btn btn--light-purple" onClick={this.register}>
              Register
            </button>
          </div>
        </div>
      </section>
    );
  }
}

export default Register;
