import React, { Component, createRef } from "react";
import _ from "lodash";
import moment from "moment";
import { Link } from "react-router-dom";
import AuthContext from "../../../contexts/AuthContext";
import { postProfile } from "../../../api";
import FormTextInput from "../../../components/form/text_input/FormTextInput";
import { disableRefs, enableRefs } from "../../../helpers";

export class MeEdit extends Component {
  // eslint-disable-next-line no-empty-pattern
  static contextType = AuthContext;

  // eslint-disable-next-line no-empty-pattern
  constructor({}, context) {
    super();

    this.state = {
      ui_success_profile_updated: false,
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
    this.setState({ ...this.state, ui_success_profile_updated: false });

    disableRefs([..._.values(this.ref.inputs), ..._.values(this.ref.buttons)]);

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

        this.setState({ ...this.state, ui_success_profile_updated: true });

        enableRefs([
          ..._.values(this.ref.inputs),
          ..._.values(this.ref.buttons),
        ]);
      })
      .catch((err) => {
        if (err.response.status === 422) {
          this.setState({
            ui_errors_validations: err.response.data.data.errors,
          });
        }

        enableRefs([
          ..._.values(this.ref.inputs),
          ..._.values(this.ref.buttons),
        ]);
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
      <div className="pt-[54px]">
        <div className="container mx-auto py-4">
          <div className="card max-w-2xl mx-auto">
            <div className="card-header">
              <h1 className="text-lg font-semibold">Update Profile</h1>
            </div>
            <div className="card-body">
              {this.state.ui_success_profile_updated && (
                <div className="bg-green-500 p-3 rounded-md mb-4">
                  Your profile is updated!
                </div>
              )}
              <FormTextInput
                label="Name"
                type="name"
                value={this.context.authInfo.user.name}
                ref={this.ref.inputs.name}
                errors={this.state.ui_errors_validations.name}
              />
              <FormTextInput
                label="Birthday"
                type="date"
                max={moment().subtract(18, "years").format("YYYY-DD-MM")}
                value={this.context.authInfo.user.birthday}
                ref={this.ref.inputs.birthday}
                errors={this.state.ui_errors_validations.birthday}
              />
              <div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Gender</label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="1"
                        ref={this.ref.inputs.gender_male}
                        defaultChecked={
                          this.context.authInfo.user.gender == 1 ? true : false
                        }
                      />
                      Male
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="2"
                        ref={this.ref.inputs.gender_female}
                        defaultChecked={
                          this.context.authInfo.user.gender == 2 ? true : false
                        }
                      />
                      Female
                    </label>
                  </div>
                </div>
                {!_.isEmpty(this.state.ui_errors_validations.gender) && (
                  <div>
                    {this.state.ui_errors_validations.gender.map(
                      (error, index) => {
                        return (
                          <div className="text-red-400 text-sm" key={index}>
                            {error}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
              <FormTextInput
                label="Email"
                type="email"
                value={this.context.authInfo.user.email}
                ref={this.ref.inputs.email}
                errors={this.state.ui_errors_validations.email}
                disabled
              />
              <FormTextInput
                label="Password"
                type="password"
                ref={this.ref.inputs.password}
                errors={this.state.ui_errors_validations.password}
                autocomplete="new-password"
              />
              <FormTextInput
                label="Confirm Password"
                type="password"
                ref={this.ref.inputs.password_confirmation}
                errors={this.state.ui_errors_validations.password_confirmation}
                autocomplete="new-password"
              />
            </div>
            <div className="card-footer">
              <button
                className="btn btn-indigo"
                ref={this.ref.buttons.update}
                onClick={this.update}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MeEdit;
