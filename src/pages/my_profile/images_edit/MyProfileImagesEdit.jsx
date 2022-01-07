import React, { Component, createRef, useState } from "react";
import _ from "lodash";
import AuthContext from "../../../contexts/AuthContext";
import { postProfileImage } from "../../../api";
import "./my_profile_images_edit.css";
import EmptyUserImage from "../../../assets/empty_user_image.png";
import Loader from "../../../assets/loader.gif";
import Alert from "../../../components/popups/alert/Alert";
import moment from "moment";

const Image = ({ name, image }) => {
  const [profileImage, setProfileImage] = useState(image);
  const [uploading, setUploading] = useState(false);
  const [imageErrors, setImageErrors] = useState([]);

  const input = createRef();

  const updateImage = async (remove = false) => {
    setUploading(true);
    let form = new FormData();
    if (remove === false) {
      form.append("image", input.current.files[0]);
    }
    if (name === "profile_image") {
      form.append("type", 1);
    } else {
      form.append("type", 2);
    }
    if (profileImage) {
      form.append("old_image_id", profileImage.id);
    }
    await postProfileImage(form)
      .then((res) => {
        if (res.data.data.image) {
          setProfileImage({
            id: res.data.data.image.id,
            url: res.data.data.image.url,
          });
        } else {
          setProfileImage(null);
        }
      })
      .catch((err) => {
        if (err.response.status === 422) {
          if (err.response.data.data.errors.image) {
            setImageErrors(err.response.data.data.errors.image);
          }
        }
      });
    setUploading(false);
  };

  return (
    <>
      {imageErrors[0] && (
        <Alert message={imageErrors[0]} ok={() => setImageErrors([])} />
      )}
      <div
        className={
          name === "profile_image"
            ? "people__profile-image"
            : "people__images__image"
        }
      >
        <input
          type="file"
          accept="image/*"
          id={name}
          style={{ display: "none" }}
          ref={input}
          onChange={() => updateImage()}
        />
        <div className="people__profile-image-edit">
          {profileImage ? (
            <>
              <button
                onClick={() => document.querySelector(`#${name}`).click()}
                className="bg-white text-purple"
              >
                <i className="fas fa-pen"></i>
              </button>
              <button
                onClick={() => updateImage(true)}
                className="bg-red text-white"
              >
                <i className="fas fa-trash"></i>
              </button>
            </>
          ) : (
            <button
              onClick={() => document.querySelector(`#${name}`).click()}
              className="bg-white text-green"
            >
              <i className="fas fa-plus"></i>
            </button>
          )}
        </div>
        {uploading ? (
          <img src={Loader} alt="Add" />
        ) : profileImage ? (
          <img src={profileImage.url} />
        ) : (
          <img
            src={EmptyUserImage}
            alt="Add"
            onClick={() => document.querySelector(`#${name}`).click()}
          />
        )}
      </div>
    </>
  );
};

export class MyProfileImagesEdit extends Component {
  static contextType = AuthContext;

  // eslint-disable-next-line no-empty-pattern
  constructor({}, context) {
    super();

    let init_state = {
      profile_image: null,
      featured_image_1: null,
      featured_image_2: null,
      featured_image_3: null,
      featured_image_4: null,
      featured_image_5: null,
    };

    let i = 1;
    _.each(context.authInfo.user.profile_images, function (profile_image) {
      if (profile_image.type != 1) {
        init_state["featured_image_" + i] = {
          id: profile_image.id,
          url: profile_image.url,
        };
        i++;
      }
    });
    init_state.profile_image = context.authInfo.user.main_profile_image
      ? {
          id: context.authInfo.user.main_profile_image.id,
          url: context.authInfo.user.main_profile_image.url,
        }
      : null;

    this.state = init_state;
  }

  age = () => {
    return Math.floor(
      moment
        .duration(
          moment(new Date()).diff(moment(this.context.authInfo.user.birthday))
        )
        .asYears()
    );
  };

  render() {
    return (
      <section className="container py-4">
        <div className="card mb-3">
          <div className="card__header">
            <h2>Update Profile Images</h2>
          </div>
          <div className="card__body">
            <div className="people">
              <Image name="profile_image" image={this.state.profile_image} />
              <div className="people__info">
                <div className="people__info--name">
                  {this.context.authInfo.user.name}
                </div>
                <div className="people__info--age">{this.age()} years old</div>
                <div className="people__info--gender">
                  {this.context.authInfo.user.gender == 1 ? "Male" : "Female"}
                </div>
              </div>
              <div className="people__images">
                <Image
                  name="featured_image_1"
                  image={this.state.featured_image_1}
                />
                <Image
                  name="featured_image_2"
                  image={this.state.featured_image_2}
                />
                <Image
                  name="featured_image_3"
                  image={this.state.featured_image_3}
                />
                <Image
                  name="featured_image_4"
                  image={this.state.featured_image_4}
                />
                <Image
                  name="featured_image_5"
                  image={this.state.featured_image_5}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default MyProfileImagesEdit;
