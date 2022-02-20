import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import {
  getContacts as apiGetContacts,
  postAcceptContact,
  postDeleteContact,
} from "../../api";
import LoadingImage from "../../assets/loading.gif";
import Contact from "../../components/contact/Contact";
import Popup from "../../components/popup/Popup";

// TODO:: control loading and update state

class Friends extends Component {
  constructor() {
    super();

    this.state = {
      contacts_request: [],
      contacts_online: [],
      contacts_offline: [],
      ui_queue_accepting_contact_id: null,
      ui_queue_removing_contact_id: null,
      ui_popups_remove_contact: false,
      ui_temp_remove_id: null,
      ui_temp_remove_type: null,
      ui_loadings_get_contacts_request: true,
      ui_loadings_get_contacts_online: true,
      ui_loadings_get_contacts_offline: true,
    };
  }

  componentDidMount() {
    this.getContacts("request");
    this.getContacts("online");
    this.getContacts("offline");
  }

  getContacts = async (type) => {
    switch (type) {
      case "request":
        this.setState({
          ...this.state,
          ui_loadings_get_contacts_request: true,
        });
        await apiGetContacts({ type }).then((res) => {
          this.setState({
            ...this.state,
            contacts_request: res.data.data.contacts,
          });
        });
        this.setState({
          ...this.state,
          ui_loadings_get_contacts_request: false,
        });
        break;

      case "online":
        this.setState({
          ...this.state,
          ui_loadings_get_contacts_online: true,
        });
        await apiGetContacts({ type }).then((res) => {
          this.setState({
            ...this.state,
            contacts_online: res.data.data.contacts,
          });
        });
        this.setState({
          ...this.state,
          ui_loadings_get_contacts_online: false,
        });
        break;

      case "offline":
        this.setState({
          ...this.state,
          ui_loadings_get_contacts_offline: true,
        });
        await apiGetContacts({ type }).then((res) => {
          this.setState({
            ...this.state,
            contacts_offline: res.data.data.contacts,
          });
        });
        this.setState({
          ...this.state,
          ui_loadings_get_contacts_offline: false,
        });
        break;

      default:
        break;
    }
  };

  accept = async (id) => {
    this.setState({ ...this.state, ui_queue_accepting_contact_id: id });

    await postAcceptContact(id).then(() => {
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

    this.setState({ ...this.state, ui_queue_accepting_contact_id: null });
  };

  remove = async () => {
    if (!this.state.ui_queue_removing_contact_id) {
      let id = this.state.ui_temp_remove_id;
      let type = this.state.ui_temp_remove_type;

      this.setState({ ...this.state, ui_queue_removing_contact_id: id });

      await postDeleteContact(id).then(() => {
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

      this.setState({ ...this.state, ui_queue_removing_contact_id: null });

      this.cancelRemove();
    }
  };

  initRemove = (id, type) => {
    this.setState({
      ...this.state,
      ui_popups_remove_contact: true,
      ui_temp_remove_id: id,
      ui_temp_remove_type: type,
    });
  };

  cancelRemove = () => {
    this.setState({
      ...this.state,
      ui_popups_remove_contact: false,
      ui_temp_remove_id: null,
      ui_temp_remove_type: null,
    });
  };

  render() {
    return (
      <div className="pt-[54px]">
        {this.state.ui_popups_remove_contact && (
          <Popup>
            <div className="card min-w-[20rem] max-w-[90%] bg-gray-900">
              <div className="card-header">
                <h1 className="text-lg">Remove a contact?</h1>
              </div>
              <div className="card-body">Are you sure?</div>
              <div className="card-footer">
                <button
                  className="btn btn-red mr-1"
                  onClick={this.remove}
                  disabled={this.state.ui_queue_removing_contact_id}
                >
                  Yes
                </button>
                <button
                  className="btn btn-indigo"
                  onClick={this.cancelRemove}
                  disabled={this.state.ui_queue_removing_contact_id}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Popup>
        )}

        <div className="container mx-auto p-4 md:px-0">
          <div className="card mx-auto">
            <div className="card-header">
              <h1 className="text-lg font-semibold">Friend Requests</h1>
            </div>
            <div className="card-body">
              {this.state.ui_loadings_get_contacts_request && (
                <div className="mt-4">
                  <div className="p-3 rounded-md flex flex-col justify-center items-center">
                    <div className="w-16">
                      <img src={LoadingImage} />
                    </div>
                  </div>
                </div>
              )}
              {!this.state.ui_loadings_get_contacts_request && (
                <div className="mt-4">
                  {_.isEmpty(this.state.contacts_request) ? (
                    <div className="p-3 rounded-md bg-indigo-100/40">
                      <div className="p-5 text-center">There is no data.</div>
                    </div>
                  ) : (
                    this.state.contacts_request.map((contact, index) => {
                      return (
                        <Contact
                          key={index}
                          contact={contact}
                          actions={
                            <>
                              <button
                                className="btn btn-indigo mr-1"
                                onClick={() => this.accept(contact.id)}
                                disabled={
                                  this.state.ui_queue_accepting_contact_id ==
                                  contact.id
                                }
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-red"
                                onClick={() =>
                                  this.initRemove(contact.id, "request")
                                }
                                disabled={
                                  this.state.ui_queue_accepting_contact_id ==
                                  contact.id
                                }
                              >
                                Reject
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
          </div>
          <div className="card mx-auto">
            <div className="card-header">
              <h1 className="text-lg font-semibold">Online</h1>
            </div>
            <div className="card-body">
              {this.state.ui_loadings_get_contacts_online && (
                <div className="mt-4">
                  <div className="p-3 rounded-md flex flex-col justify-center items-center">
                    <div className="w-16">
                      <img src={LoadingImage} />
                    </div>
                  </div>
                </div>
              )}
              {!this.state.ui_loadings_get_contacts_online && (
                <div className="mt-4">
                  {_.isEmpty(this.state.contacts_online) ? (
                    <div className="p-3 rounded-md bg-indigo-100/40">
                      <div className="p-5 text-center">There is no data.</div>
                    </div>
                  ) : (
                    this.state.contacts_online.map((contact, index) => {
                      return (
                        <Contact
                          key={index}
                          contact={contact}
                          actions={
                            <>
                              <Link
                                to={`/chat/user/${contact.id}`}
                                className="btn btn-indigo mr-1"
                              >
                                Message
                              </Link>
                              <button
                                className="btn btn-red"
                                onClick={() =>
                                  this.initRemove(contact.id, "request")
                                }
                              >
                                Unfriend
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
          </div>
          <div className="card mx-auto">
            <div className="card-header">
              <h1 className="text-lg font-semibold">Offline</h1>
            </div>
            <div className="card-body">
              {this.state.ui_loadings_get_contacts_offline && (
                <div className="mt-4">
                  <div className="p-3 rounded-md flex flex-col justify-center items-center">
                    <div className="w-16">
                      <img src={LoadingImage} />
                    </div>
                  </div>
                </div>
              )}
              {!this.state.ui_loadings_get_contacts_offline && (
                <div className="mt-4">
                  {_.isEmpty(this.state.contacts_offline) ? (
                    <div className="p-3 rounded-md bg-indigo-100/40">
                      <div className="p-5 text-center">There is no data.</div>
                    </div>
                  ) : (
                    this.state.contacts_offline.map((contact, index) => {
                      return (
                        <Contact
                          key={index}
                          contact={contact}
                          actions={
                            <>
                              <Link
                                to={`/chat/user/${contact.id}`}
                                className="btn btn-indigo mr-1"
                              >
                                Message
                              </Link>
                              <button
                                className="btn btn-red"
                                onClick={() =>
                                  this.initRemove(contact.id, "request")
                                }
                              >
                                Unfriend
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
          </div>
        </div>
      </div>
    );
  }
}

export default Friends;
