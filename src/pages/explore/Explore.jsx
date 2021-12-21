import React, { Component } from "react";
import _ from "lodash";
import { getFriendsExplore, postAddContact } from "../../api";

class Explore extends Component {
  constructor() {
    super();

    this.state = {
      contacts: [],
      form_gender: 1,
      ui_added_contact_ids: [],
    };
  }

  componentDidMount() {
    this.updateContacts();
  }

  shouldComponentUpdate(nextProp, nextState) {
    if (this.state.contacts !== nextState.contacts) {
      return true;
    }
    if (this.state.form_gender !== nextState.form_gender) {
      return true;
    }
    if (this.state.ui_added_contact_ids !== nextState.ui_added_contact_ids) {
      return true;
    }
    return false;
  }

  updateContacts = () => {
    getFriendsExplore({ ...this.state.form }).then((res) => {
      this.setState({ ...this.state, ui_added_contact_ids: [] });
      this.setState({ ...this.state, contacts: res.data.data.contacts });
    });
  };

  updateGender = (value = null) => {
    this.setState({ ...this.state, form_gender: value });
  };

  addContact = (id) => {
    postAddContact(id).then(() => {
      this.setState({
        ...this.state,
        ui_added_contact_ids: _.concat(this.state.ui_added_contact_ids, id),
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
                    defaultChecked
                    onChange={(e) => this.updateGender(e.target.value)}
                  />
                </div>
                <div className="mr-2">
                  <label htmlFor="gender_female">Female</label>
                  <input
                    type="radio"
                    id="gender_female"
                    name="gender"
                    value={2}
                    onChange={(e) => this.updateGender(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="gender_all">All</label>
                  <input
                    type="radio"
                    id="gender_all"
                    name="gender"
                    value={3}
                    onChange={(e) => this.updateGender()}
                  />
                </div>
              </div>
            </div>
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
          </div>
          <div className="card__footer">
            <button
              className="btn btn--light-purple"
              onClick={this.updateContacts}
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
