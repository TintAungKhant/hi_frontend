import React, { Component, createRef } from "react";
import _ from "lodash";
import AuthContext from "../../../contexts/AuthContext";
import ValidationError from "../../../components/validation_error/ValidationError";
import { postProfile } from "../../../api";
import FormAlert from "../../../components/form_alert/FormAlert";

export class MyProfileEdit extends Component {
  // eslint-disable-next-line no-empty-pattern
  static contextType = AuthContext;

  // eslint-disable-next-line no-empty-pattern
  constructor({}, context) {
    super();

    this.state = {
      ui_form_alerts_updated: false,
      ui_errors_validations: {},
    };

    this.ref = {
      inputs: {
        name: createRef(),
        gender_male: createRef(),
        gender_female: createRef(),
        birthday: createRef(),
        password: createRef(),
        password_confirmation: createRef(),
      },
      buttons: {
        update: createRef(),
      },
    };

    this.setAuthInfo = context.setAuthInfo;
  }

  update = () => {
    this.setState({ ...this.state, ui_form_alerts_updated: false });
    this.updateLoading(true);

    this.setState({ ui_errors_validations: {} });

    let form = {
      name: this.ref.inputs.name.current.value,
      gender: this.ref.inputs.gender_male.current.checked ? 1 : 2,
      birthday: this.ref.inputs.birthday.current.value,
      password: this.ref.inputs.password.current.value,
      password_confirmation:
        this.ref.inputs.password_confirmation.current.value,
    };
    postProfile(form)
      .then((res) => {
        this.setAuthInfo({
          auth: true,
          user: res.data.data.profile,
        });
        this.setState({ ...this.state, ui_form_alerts_updated: true });
        this.updateLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 422) {
          this.setState({
            ui_errors_validations: err.response.data.data.errors,
          });
        }
        this.updateLoading(false);
      });
  };

  updateLoading = (loading = false) => {
    if (loading) {
      _.each(this.ref.inputs, function (input) {
        input.current.disabled = true;
      });
      this.ref.buttons.update.current.disabled = true;

      return;
    }

    _.each(this.ref.inputs, function (input) {
      input.current.disabled = false;
    });
    this.ref.buttons.update.current.disabled = false;

    return;
  };

  render() {
    return (
      <section className="container py-4">
        <div className="card">
          <div className="card__header">
            <h2>Update Profile</h2>
          </div>
          <div className="card__body">
            <form className="form">
              {this.state.ui_form_alerts_updated && (
                <FormAlert
                  msg={"Your profile updated successfully!"}
                  type={"green"}
                />
              )}
              <div className="form__input text-input">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  id="name"
                  ref={this.ref.inputs.name}
                  defaultValue={this.context.authInfo.user.name}
                />
                <ValidationError
                  errors={this.state.ui_errors_validations.name}
                />
              </div>
              <div className="form__input text-input">
                <label htmlFor="birthday">Birthday</label>
                <input
                  type="date"
                  placeholder="Birthday"
                  id="birthday"
                  ref={this.ref.inputs.birthday}
                  defaultValue={this.context.authInfo.user.birthday}
                />
                <ValidationError
                  errors={this.state.ui_errors_validations.birthday}
                />
              </div>
              <div className="form__input text-input">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  defaultValue={this.context.authInfo.user.email}
                  disabled
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
                        ref={this.ref.inputs.gender_male}
                        defaultChecked={
                          this.context.authInfo.user.gender == 1 ? true : false
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
                        ref={this.ref.inputs.gender_female}
                        defaultChecked={
                          this.context.authInfo.user.gender == 2 ? true : false
                        }
                      />
                    </div>
                  </div>
                </div>
                <ValidationError
                  errors={this.state.ui_errors_validations.gender}
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
              <div className="form__input text-input">
                <label htmlFor="password_confirmation">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  id="password_confirmation"
                  ref={this.ref.inputs.password_confirmation}
                />
              </div>
            </form>
          </div>
          <div className="card__footer">
            <button
              className="btn btn--light-purple"
              onClick={this.update}
              ref={this.ref.buttons.update}
            >
              Update
            </button>
          </div>
        </div>
      </section>
    );
  }
}

export default MyProfileEdit;
