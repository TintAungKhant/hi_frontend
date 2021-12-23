import React, { Component } from "react";
import _ from "lodash";
import {
  getContacts as apiGetContacts,
  postAcceptContact,
  postDeleteContact,
} from "../../api";
import Contact from "../../components/contact/Contact";
import Loading from "../loadings/loading/Loading";
import YesNo from "../../components/popups/yes_no/YesNo";

// TODO: need to optimize speed

const ContactSection = React.memo(
  ({ loading, contacts, title, type, accept, remove }) => {
    return (
      <div className="card mb-3">
        <div className="card__header">
          <h2>{title}</h2>
        </div>
        <div className="card__body">
          {loading ? (
            <Loading />
          ) : (
            <ul className="list">
              {!contacts.length ? (
                <li className="list__item">
                  <div className="list__item__content">
                    <div className="list__item__content__title">No data.</div>
                  </div>
                </li>
              ) : (
                contacts.map((contact) => {
                  return (
                    <Contact
                      type={type}
                      key={contact.id}
                      id={contact.id}
                      accept={accept}
                      remove={remove}
                    />
                  );
                })
              )}
            </ul>
          )}
        </div>
      </div>
    );
  }
);

class Friends extends Component {
  constructor() {
    super();

    this.state = {
      contacts_request: [],
      contacts_online: [],
      contacts_offline: [],
      ui_popups_remove: false,
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

  showRemoveYesNoPopup = (id, type) => {
    this.setState({
      ...this.state,
      ui_popups_remove: true,
      ui_temp_remove_id: id,
      ui_temp_remove_type: type,
    });
  };

  hideRemoveYesNoPopup = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        ui_popups_remove: false,
        ui_temp_remove_id: null,
        ui_temp_remove_type: null,
      };
    });
  };

  remove = async (id, type) => {
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
    // TODO:: handle error
    this.hideRemoveYesNoPopup();
  };

  render() {
    return (
      <section className="container py-4">
        {this.state.ui_popups_remove && (
          <YesNo
            title="Remove as friend"
            message="Are you sure that you want to remove this person from your friend list?"
            yes={this.remove}
            yes_params={[
              this.state.ui_temp_remove_id,
              this.state.ui_temp_remove_type,
            ]}
            no={this.hideRemoveYesNoPopup}
          />
        )}
        <ContactSection
          contacts={this.state.contacts_request}
          title="Pending"
          type="request"
          loading={this.state.ui_loadings_get_contacts_request}
          accept={this.accept}
          remove={this.remove}
        />
        <ContactSection
          contacts={this.state.contacts_online}
          title="Online"
          type="online"
          loading={this.state.ui_loadings_get_contacts_online}
          accept={this.accept}
          remove={this.showRemoveYesNoPopup}
        />
        <ContactSection
          contacts={this.state.contacts_offline}
          title="Offline"
          type="offline"
          loading={this.state.ui_loadings_get_contacts_offline}
          accept={this.accept}
          remove={this.showRemoveYesNoPopup}
        />
      </section>
    );
  }
}

export default Friends;
