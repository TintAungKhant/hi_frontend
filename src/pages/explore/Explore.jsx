import React, { Component, createRef } from "react";
import _ from "lodash";
import Loading from "../loadings/loading/Loading";
import { getFriendsExplore, postAddContact } from "../../api";

class Explore extends Component {
  constructor() {
    super();

    this.state = {
      contacts: [],
      ui_added_contact_ids: [],
      ui_loadings_update_contacts: true,
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
    this.updateContacts();
  }

  updateContacts = async () => {
    let gender = null;
    if (this.ref.inputs.gender_male.current.checked) {
      gender = 1;
    } else if (this.ref.inputs.gender_female.current.checked) {
      gender = 2;
    }
    this.updateContactsLoading(true);
    await getFriendsExplore({ gender }).then((res) => {
      this.setState({ ...this.state, ui_added_contact_ids: [] });
      this.setState({ ...this.state, contacts: res.data.data.contacts });
    });
    this.updateContactsLoading(false);
  };

  updateContactsLoading = (loading = false) => {
    if (loading) {
      this.setState({ ...this.state, ui_loadings_update_contacts: true });
      this.ref.buttons.refresh.current.disabled = true;
      return;
    }
    this.setState({ ...this.state, ui_loadings_update_contacts: false });
    this.ref.buttons.refresh.current.disabled = false;
    return;
  };

  addContact = (id) => {
    postAddContact(id).then(() => {
      this.setState({
        ...this.state,
        ui_added_contact_ids: [...this.state.ui_added_contact_ids, id],
      });
    });
    // TODO:: handle error
  };

  render() {
    return (
      <section className="container py-4">
        <div className="card mb-3">
          <div className="card__header">
            <h2>Explore</h2>
          </div>
          <div className="card__body">
            <div className="d-flex mb-3">
              <strong className="mr-2">Target</strong>
              <span className="mr-2">-</span>
              <div className="d-flex">
                <div className="mr-2">
                  <label htmlFor="gender_male">Male</label>
                  <input
                    type="radio"
                    id="gender_male"
                    name="gender"
                    value={1}
                    ref={this.ref.inputs.gender_male}
                  />
                </div>
                <div className="mr-2">
                  <label htmlFor="gender_female">Female</label>
                  <input
                    type="radio"
                    id="gender_female"
                    name="gender"
                    value={2}
                    ref={this.ref.inputs.gender_female}
                  />
                </div>
                <div>
                  <label htmlFor="gender_all">All</label>
                  <input
                    type="radio"
                    id="gender_all"
                    name="gender"
                    value={3}
                    defaultChecked
                    ref={this.ref.inputs.gender_all}
                  />
                </div>
              </div>
            </div>
            {this.state.ui_loadings_update_contacts && (
              <div className="card__body">
                <Loading />
              </div>
            )}
            {!this.state.ui_loadings_update_contacts && (
              <ul className="list">
                {this.state.contacts.map((contact) => {
                  return (
                    <li className="list__item" key={contact.id}>
                      <div className="list__item__image">
                        <img
                          src="https://source.unsplash.com/500x500/?selfie"
                          alt={contact.name}
                        />
                      </div>
                      <div className="list__item__content">
                        <div className="list__item__content__title">
                          {contact.name}
                        </div>
                      </div>
                      <div className="list__item_action">
                        <button
                          className="btn btn--light-purple"
                          disabled={_.includes(
                            this.state.ui_added_contact_ids,
                            contact.id
                          )}
                          onClick={() => this.addContact(contact.id)}
                        >
                          Add
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="card__footer">
            <button
              className="btn btn--light-purple"
              onClick={this.updateContacts}
              ref={this.ref.buttons.refresh}
            >
              Refresh
            </button>
          </div>
        </div>
      </section>
    );
  }
}

export default Explore;
