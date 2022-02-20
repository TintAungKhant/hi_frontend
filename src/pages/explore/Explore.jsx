import React, { Component, createRef } from "react";
import _ from "lodash";
import { getFriendsExplore, postAddContact } from "../../api";
import LoadingImage from "../../assets/loading.gif";
import Contact from "../../components/contact/Contact";
import { disableRefs, enableRefs } from "../../helpers";

class Explore extends Component {
  constructor() {
    super();

    this.state = {
      contacts: [],
      ui_queue_adding_contact_ids: [],
      ui_loadings_get_contacts: true,
    };

    this.ref = {
      inputs: {
        gender_male: createRef(),
        gender_female: createRef(),
        gender_all: createRef(),
      },
      buttons: {
        refresh: createRef(),
      },
    };
  }

  componentDidMount() {
    this.getContacts();
  }

  getContacts = async () => {
    this.setState({ ...this.state, ui_loadings_get_contacts: true });

    let gender = null;
    if (this.ref.inputs.gender_male.current.checked) {
      gender = 1;
    } else if (this.ref.inputs.gender_female.current.checked) {
      gender = 2;
    }

    disableRefs([..._.values(this.ref.inputs), ..._.values(this.ref.buttons)]);

    await getFriendsExplore({ gender }).then((res) => {
      this.setState({ ...this.state, contacts: res.data.data.contacts });
    });

    enableRefs([..._.values(this.ref.inputs), ..._.values(this.ref.buttons)]);

    this.setState({ ...this.state, ui_loadings_get_contacts: false });
  };

  addContact = (id) => {
    if (!_.includes(this.state.ui_queue_adding_contact_ids, id)) {
      this.setState({
        ...this.state,
        ui_queue_adding_contact_ids: [
          ...this.state.ui_queue_adding_contact_ids,
          id,
        ],
      });
      postAddContact(id).then(() => {
        this.setState({
          ...this.state,
          contacts: this.state.contacts.filter((contact) => contact.id != id),
          ui_queue_adding_contact_ids:
            this.state.ui_queue_adding_contact_ids.filter(
              (queue_id) => queue_id != id
            ),
        });
      });
    }
  };

  render() {
    return (
      <div className="pt-[54px]">
        <div className="container mx-auto p-4 md:px-0">
          <div className="card mx-auto">
            <div className="card-header">
              <h1 className="text-lg font-semibold">Explore other users</h1>
            </div>
            <div className="card-body">
              <div>
                <span className="font-semibold">Looking for -</span>
                <div>
                  <label className="mr-2">
                    <span>Male</span>
                    <input
                      type="radio"
                      name="gender"
                      value="1"
                      ref={this.ref.inputs.gender_male}
                    />
                  </label>
                  <label className="mr-2">
                    <span>Female</span>
                    <input
                      type="radio"
                      name="gender"
                      value="2"
                      ref={this.ref.inputs.gender_female}
                    />
                  </label>
                  <label className="mr-2">
                    <span>Any</span>
                    <input
                      type="radio"
                      name="gender"
                      value="3"
                      defaultChecked
                      ref={this.ref.inputs.gender_all}
                    />
                  </label>
                </div>
              </div>

              {this.state.ui_loadings_get_contacts && (
                <div className="mt-4">
                  <div className="p-3 rounded-md flex flex-col justify-center items-center">
                    <div className="w-16">
                      <img src={LoadingImage} />
                    </div>
                  </div>
                </div>
              )}
              {!this.state.ui_loadings_get_contacts && (
                <div className="mt-4">
                  {_.isEmpty(this.state.contacts) ? (
                    <div className="p-3 rounded-md bg-indigo-100/40">
                      <div className="p-5 text-center">There is no data.</div>
                    </div>
                  ) : (
                    this.state.contacts.map((contact, index) => {
                      return (
                        <Contact
                          key={index}
                          contact={contact}
                          actions={
                            <>
                              <button
                                className={`btn btn-indigo`}
                                disabled={_.includes(this.state.ui_queue_adding_contact_ids, contact.id)}
                                onClick={() => this.addContact(contact.id)}
                              >
                                Add
                              </button>
                            </>
                          }
                        />
                      );
                    })
                  )}
                </div>
              )}
            </div>
            <div className="card-footer">
              <button
                className="btn btn-indigo"
                onClick={this.getContacts}
                ref={this.ref.buttons.refresh}
              >
                Explore
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Explore;
