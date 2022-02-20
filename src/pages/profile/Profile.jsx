import React, { createRef } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import {
  getProfile as apiGetProfile,
  postAcceptContact,
  postAddContact,
  postDeleteContact,
} from "../../api";
import ProfileImage from "../../components/profile_image/ProfileImage";
import LoadingImage from "../../assets/loading.gif";
import Contact from "../../components/contact/Contact";
import Popup from "../../components/popup/Popup";
import { disableRefs, enableRefs } from "../../helpers";
import AuthContext from "../../contexts/AuthContext";

class Profile extends React.Component {
  static contextType = AuthContext;

  // eslint-disable-next-line no-empty-pattern
  constructor() {
    super();

    this.state = {
      user: null,
      profile_image: null,
      featured_image_1: null,
      featured_image_2: null,
      featured_image_3: null,
      featured_image_4: null,
      featured_image_5: null,
      ui_loadings_get_profile: true,
      ui_popups_remove_contact: false,
    };

    this.ref = {
      buttons: {
        add: createRef(),
        accept: createRef(),
        remove_1: createRef(),
        remove_2: createRef(),
      },
    };
  }

  async componentDidMount() {
    await apiGetProfile(this.props.user_id).then((res) => {
      if (res.data.data.profile.id) {
        this.setState({ ...this.state, user: res.data.data.profile });

        const {
          ["user"]: remove1,
          ["ui_loadings_get_profile"]: remove2,
          ["ui_popups_remove_contact"]: remove3,
          ...user_images
        } = this.state;
        
        let i = 1;
        _.each(res.data.data.profile.profile_images, function (profile_image) {
          if (profile_image.type != 1) {
            user_images["featured_image_" + i] = {
              id: profile_image.id,
              url: profile_image.url,
            };
            i++;
          }
        });
        user_images.profile_image = res.data.data.profile.main_profile_image
          ? {
              id: res.data.data.profile.main_profile_image.id,
              url: res.data.data.profile.main_profile_image.url,
            }
          : null;

        this.setState({ ...this.state, ...user_images });
      }
    });

    this.setState({ ...this.state, ui_loadings_get_profile: false });
  }

  add = () => {
    disableRefs([..._.values(this.ref.buttons)]);
    postAddContact(this.props.user_id).then(() => {
      this.setState({
        ...this.state,
        user: { ...this.state.user, contact_type: "waiting" },
      });
      enableRefs([..._.values(this.ref.buttons)]);
    });
  };

  accept = () => {
    disableRefs([..._.values(this.ref.buttons)]);
    postAcceptContact(this.props.user_id).then(() => {
      this.setState({
        ...this.state,
        user: { ...this.state.user, contact_type: "friend" },
      });
      enableRefs([..._.values(this.ref.buttons)]);
    });
  };

  remove = () => {
    disableRefs([..._.values(this.ref.buttons)]);
    postDeleteContact(this.props.user_id).then(() => {
      this.setState({
        ...this.state,
        user: { ...this.state.user, contact_type: null },
        ui_popups_remove_contact: false,
      });
      enableRefs([..._.values(this.ref.buttons)]);
    });
  };

  age = () => {
    return Math.floor(
      moment
        .duration(moment(new Date()).diff(moment(this.state.user.birthday)))
        .asYears()
    );
  };

  render() {
    if (this.context.authInfo.user.id == this.props.user_id) {
      return <Navigate to="/profile/me" />;
    }

    return (
      <div className="mt-[54px]">
        <div className="container mx-auto p-4 md:px-0">
          {this.state.ui_popups_remove_contact && (
            <Popup>
              <div className="card min-w-[20rem] max-w-[90%] bg-gray-900">
                <div className="card-header">
                  <h1 className="text-lg">Remove a contact?</h1>
                </div>
                <div className="card-body">Are you sure?</div>
                <div className="card-footer">
                  <button className="btn btn-red mr-1" onClick={this.remove}>
                    Yes
                  </button>
                  <button
                    className="btn btn-indigo"
                    onClick={() => {
                      this.setState({
                        ...this.state,
                        ui_popups_remove_contact: false,
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Popup>
          )}

          <div className="card mx-auto">
            {this.state.user && (
              <div className="card-header">
                <Contact
                  contact={this.state.user}
                  no_border={true}
                  actions={
                    <>
                      {this.state.user.contact_type === "friend" && (
                        <>
                          <Link
                            to={`/chat/user/${this.state.user.id}`}
                            className="btn btn-indigo mr-1"
                          >
                            Message
                          </Link>
                          <button
                            className="btn btn-red"
                            ref={this.ref.buttons.remove_1}
                            onClick={() => {
                              this.setState({
                                ...this.state,
                                ui_popups_remove_contact: true,
                              });
                            }}
                          >
                            Unfriend
                          </button>
                        </>
                      )}
                      {this.state.user.contact_type === "deciding" && (
                        <>
                          <button
                            className="btn btn-indigo mr-1"
                            ref={this.ref.buttons.accept}
                            onClick={this.accept}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-red"
                            ref={this.ref.buttons.remove_2}
                            onClick={() => {
                              this.setState({
                                ...this.state,
                                ui_popups_remove_contact: true,
                              });
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {this.state.user.contact_type === "waiting" && (
                        <button className="btn btn-indigo" disabled>
                          Add
                        </button>
                      )}
                      {this.state.user.contact_type === null && (
                        <button
                          className="btn btn-indigo"
                          ref={this.ref.buttons.add}
                          onClick={this.add}
                        >
                          Add
                        </button>
                      )}
                    </>
                  }
                />
              </div>
            )}
            <div className="card-body">
              {this.state.ui_loadings_get_profile && (
                <div className="p-3 rounded-md flex flex-col justify-center items-center">
                  <div className="w-16">
                    <img src={LoadingImage} />
                  </div>
                </div>
              )}
              {!this.state.ui_loadings_get_profile && (
                <div>
                  <ProfileImage
                    name="profile_image"
                    image={this.state.profile_image}
                  />
                  <div className="mx-auto text-center my-3">
                    <div className="text-lg">{this.state.user.name}</div>
                    <div className="font-base">{this.age()} years old</div>
                    <div className="font-base">
                      {this.state.user.gender == 1 ? "Male" : "Female"}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center max-w-[44rem] mx-auto">
                    <ProfileImage
                      name="featured_image_1"
                      image={this.state.featured_image_1}
                    />
                    <ProfileImage
                      name="featured_image_2"
                      image={this.state.featured_image_2}
                    />
                    <ProfileImage
                      name="featured_image_3"
                      image={this.state.featured_image_3}
                    />
                    <ProfileImage
                      name="featured_image_4"
                      image={this.state.featured_image_4}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const hoc = (Child) => {
  return (props) => {
    const { user_id } = useParams();
    const navigate = useNavigate();
    return <Child {...props} user_id={user_id} navigate={navigate} />;
  };
};

export default hoc(Profile);
