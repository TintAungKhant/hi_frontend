import React, { Component, createRef, useState } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import AuthContext from "../../../contexts/AuthContext";
import MeImage from "../../../components/me_image/MeImage";
import moment from "moment";

export class MeView extends Component {
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
      <div className="mt-[54px]">
        <div className="container mx-auto p-4 md:px-0">
          <div className="leading-8 mb-4 text-indigo-500 md:leading-none">
            If you want to change your profile information,{" "}
            <Link to="/profile/me/edit" className="btn btn-indigo">
              Click Here!
            </Link>
          </div>
          <div className="card mx-auto">
            <div className="card-header">
              <h1 className="text-lg font-semibold">Your Profile</h1>
            </div>
            <div className="card-body">
              <div>
                <MeImage name="profile_image" image={this.state.profile_image} />
                <div className="mx-auto text-center my-3">
                  <div className="text-lg">{this.context.authInfo.user.name}</div>
                  <div className="font-base">{this.age()} years old</div>
                  <div className="font-base">{this.context.authInfo.user.gender == 1 ? "Male" : "Female"}</div>
                </div>
                <div className="flex flex-wrap gap-4 justify-center max-w-[44rem] mx-auto">
                  <MeImage
                    name="featured_image_1"
                    image={this.state.featured_image_1}
                  />
                  <MeImage
                    name="featured_image_2"
                    image={this.state.featured_image_2}
                  />
                  <MeImage
                    name="featured_image_3"
                    image={this.state.featured_image_3}
                  />
                  <MeImage
                    name="featured_image_4"
                    image={this.state.featured_image_4}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MeView;
