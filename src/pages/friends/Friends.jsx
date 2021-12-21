import React, { Component } from "react";
import _ from "lodash";
import {
  getContacts as apiGetContacts,
  postAcceptContact,
  postDeleteContact,
} from "../../api";
import Contact from "../../components/contact/Contact";

class Friends extends Component {
  constructor() {
    super();

    this.state = {
      contacts_request: [],
      contacts_online: [],
      contacts_offline: [],
    };
  }

  componentDidMount() {
    this.getContacts("request");
    this.getContacts("online");
    this.getContacts("offline");
  }

  getContacts = (type) => {
    apiGetContacts({ type }).then((res) => {
      switch (type) {
        case "request":
          this.setState({
            ...this.state,
            contacts_request: res.data.data.contacts,
          });
          break;

        case "online":
          this.setState({
            ...this.state,
            contacts_online: res.data.data.contacts,
          });
          break;

        case "offline":
          this.setState({
            ...this.state,
            contacts_offline: res.data.data.contacts,
          });
          break;

        default:
          break;
      }
    });
    // TODO:: handle error
  };

  accept = (id) => {
    postAcceptContact(id).then(() => {
      let contacts_request = _.filter(
        this.state.contacts_request,
        (contact) => {
          return contact.id !== id;
        }
      );
      this.setState({ ...this.state, contacts_request });
      this.getContacts("online");
      this.getContacts("offline");
    });
    // TODO:: handle error
  };

  remove = (id, type) => {
    postDeleteContact(id).then(() => {
      let new_contacts;
      switch (type) {
        case "request":
          new_contacts = _.filter(this.state.contacts_request, (contact) => {
            return contact.id !== id;
          });
          this.setState({ ...this.state, contacts_request: new_contacts });
          break;

        case "online":
          new_contacts = _.filter(this.state.contacts_online, (contact) => {
            return contact.id !== id;
          });
          this.setState({ ...this.state, contacts_online: new_contacts });
          break;

        case "offline":
          new_contacts = _.filter(this.state.contacts_offline, (contact) => {
            return contact.id !== id;
          });
          this.setState({ ...this.state, contacts_offline: new_contacts });
          break;

        default:
          break;
      }
    });
    // TODO:: handle error
  };

  render() {
    return (
      <section className="container py-4">
        {this.state.contacts_request.length ? (
          <div className="card mb-3">
            <div className="card__header">
              <h2>Pending</h2>
            </div>
            <div className="card__body">
              <ul className="list">
                {this.state.contacts_request.map((contact) => {
                  return (
                    <Contact
                      type={"request"}
                      key={contact.id}
                      id={contact.id}
                      accept={this.accept}
                      remove={this.remove}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          <></>
        )}
        {this.state.contacts_online.length ? (
          <div className="card mb-3">
            <div className="card__header">
              <h2>Online</h2>
            </div>
            <div className="card__body">
              <ul className="list">
                {this.state.contacts_online.map((contact) => {
                  return (
                    <Contact
                      type={"online"}
                      key={contact.id}
                      id={contact.id}
                      remove={this.remove}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          <></>
        )}
        {this.state.contacts_offline.length ? (
          <div className="card mb-3">
            <div className="card__header">
              <h2>Offline</h2>
            </div>
            <div className="card__body">
              <ul className="list">
                {this.state.contacts_offline.map((contact) => {
                  return (
                    <Contact
                      type={"offline"}
                      key={contact.id}
                      id={contact.id}
                      remove={this.remove}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          <></>
        )}
      </section>
    );
  }
}

export default Friends;
