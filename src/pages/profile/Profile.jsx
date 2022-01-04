import React, { useEffect, useState, createRef } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import {
  getProfile as apiGetProfile,
  postAcceptContact,
  postAddContact,
  postDeleteContact,
} from "../../api";
import EmptyUserImage from "../../assets/empty_user_image.png";
import AuthContext from "../../contexts/AuthContext";
import "./profile.css";
import Loading from "../loadings/loading/Loading";
import YesNo from "../../components/popups/yes_no/YesNo";

function Profile() {
  let { user_id } = useParams();

  const [user, setUser] = useState();
  const [userImages, setUserImages] = useState({
    profile_image_url: null,
    featured_image_1_url: null,
    featured_image_2_url: null,
    featured_image_3_url: null,
    featured_image_4_url: null,
    featured_image_5_url: null,
  });
  const [loading, setLoading] = useState(true);
  const [removePopup, setRemovePopup] = useState(false);

  const buttons = {
    add: createRef(),
    accept: createRef(),
    remove_1: createRef(),
    remove_2: createRef(),
    message: createRef(),
  };

  useEffect(() => {
    if (user_id) {
      getProfile();
    }
  }, []);

  const getProfile = () => {
    setLoading(true);
    apiGetProfile(user_id).then((res) => {
      if (res.data.data.profile.id) {
        setUser(res.data.data.profile);

        let user_images = { ...userImages };
        let i = 1;
        _.each(res.data.data.profile.profile_images, function (profile_image) {
          if (profile_image.type != 1) {
            user_images["featured_image_" + i + "_url"] = profile_image.url;
            i++;
          }
        });
        user_images.profile_image_url = res.data.data.profile.main_profile_image
          ? res.data.data.profile.main_profile_image.url
          : null;

        setUserImages(user_images);
      }
      setLoading(false);
    });
  };

  const add = () => {
    disableButtons();
    postAddContact(user_id).then(() => {
      setUser({ ...user, contact_type: "waiting" });
      disableButtons(false);
    });
  };

  const accept = () => {
    disableButtons();
    postAcceptContact(user_id).then(() => {
      setUser({ ...user, contact_type: "friend" });
      disableButtons(false);
    });
  };

  const remove = () => {
    disableButtons();
    postDeleteContact(user_id).then(() => {
      setUser({ ...user, contact_type: null });
      disableButtons(false);
    });
    setRemovePopup(false);
  };

  const disableButtons = (disable = true) => {
    _.map(buttons, (button) => {
      if (button.current) {
        button.current.disabled = disable;
      }
    });
  };

  const age = () => {
    return Math.floor(
      moment.duration(moment(new Date()).diff(moment(user.birthday))).asYears()
    );
  };

  if (loading) {
    return (
      <section className="container py-4">
        <div className="card mb-3">
          <div className="card__body">
            <Loading />
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {removePopup && (
        <YesNo
          title="Remove as friend"
          message="Are you sure that you want to remove this person from your friend list?"
          yes={remove}
          no={() => {
            setRemovePopup(false);
          }}
        />
      )}
      <section className="container py-4">
        <div className="card mb-3">
          <div className="card__header">
            <div className="list__item p-0">
              <div className="list__item__image">
                <img
                  alt={user.name}
                  src={
                    userImages.profile_image_url
                      ? userImages.profile_image_url
                      : EmptyUserImage
                  }
                />
              </div>
              <div className="list__item__content">
                <div className="list__item__content__title">{user.name}</div>
                {user.contact_type === "friend" &&
                  (user.online ? (
                    <div className="list__item__content__text">
                      <span className="online-badge">Online</span>
                    </div>
                  ) : (
                    <div className="list__item__content__text">
                      <span className="offline-badge">Offline</span>
                    </div>
                  ))}
              </div>
              <AuthContext.Consumer>
                {({ authInfo }) => {
                  if (authInfo.user.id != user_id) {
                    return (
                      <div className="list__item_action">
                        {user.contact_type === "friend" && (
                          <>
                            <Link
                              to={`/chat/user/${user.id}`}
                              className="btn btn--light-purple"
                            >
                              Message
                            </Link>
                            <button
                              className="btn btn--light-red"
                              ref={buttons.remove_1}
                              onClick={() => {
                                setRemovePopup(true);
                              }}
                            >
                              Unfriend
                            </button>
                          </>
                        )}
                        {user.contact_type === "deciding" && (
                          <>
                            <button
                              className="btn btn--light-purple"
                              ref={buttons.accept}
                              onClick={accept}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn--light-red"
                              ref={buttons.remove_2}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {user.contact_type === "waiting" && (
                          <button className="btn btn--light-purple" disabled>
                            Add
                          </button>
                        )}
                        {user.contact_type === null && (
                          <button
                            className="btn btn--light-purple"
                            ref={buttons.add}
                            onClick={add}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    );
                  }
                }}
              </AuthContext.Consumer>
            </div>
          </div>
          <div className="card__body">
            <div className="people">
              <div className="people__profile-image">
                <img
                  alt={user.name}
                  src={
                    userImages.profile_image_url
                      ? userImages.profile_image_url
                      : EmptyUserImage
                  }
                />
              </div>
              <div className="people__info">
                <div className="people__info--name">{user.name}</div>
                <div className="people__info--age">{age()} years old</div>
                <div className="people__info--gender">
                  {user.gender == 1 ? "Male" : "Female"}
                </div>
              </div>
              <div className="people__images">
                {userImages.featured_image_1_url && (
                  <div className="people__images__image">
                    <img
                      alt={user.name}
                      src={userImages.featured_image_1_url}
                    />
                  </div>
                )}
                {userImages.featured_image_2_url && (
                  <div className="people__images__image">
                    <img
                      alt={user.name}
                      src={userImages.featured_image_2_url}
                    />
                  </div>
                )}
                {userImages.featured_image_3_url && (
                  <div className="people__images__image">
                    <img
                      alt={user.name}
                      src={userImages.featured_image_3_url}
                    />
                  </div>
                )}
                {userImages.featured_image_4_url && (
                  <div className="people__images__image">
                    <img
                      alt={user.name}
                      src={userImages.featured_image_4_url}
                    />
                  </div>
                )}
                {userImages.featured_image_5_url && (
                  <div className="people__images__image">
                    <img
                      alt={user.name}
                      src={userImages.featured_image_5_url}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
