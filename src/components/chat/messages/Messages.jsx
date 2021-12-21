import React, { Component, createRef } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { getMessages, postMessages } from "../../../api";
import ChatContext from "../../../contexts/ChatContext";
import AuthContext from "../../../contexts/AuthContext";
import "./messages.css";
import Message from "../message/Message";

const hoc = (Child) => {
  return (props) => {
    const { user_id } = useParams();
    return (
      <AuthContext.Consumer>
        {({ authInfo }) => {
          return (
            <ChatContext.Consumer>
              {({ current_conver }) => {
                return (
                  <Child
                    {...props}
                    authInfo={authInfo}
                    current_conver={current_conver}
                    current_user_id={user_id}
                  />
                );
              }}
            </ChatContext.Consumer>
          );
        }}
      </AuthContext.Consumer>
    );
  };
};

class Messages extends Component {
  constructor(props, context) {
    super();

    this.state = {
      messages: [],
      current_user: {},
    };

    this.text_input = createRef();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.current_conver.id !== this.props.current_conver.id) {
      if (this.props.current_conver.id) {
        getMessages({ user_id: this.props.current_user_id }).then((res) => {
          this.setState({
            ...this.state,
            messages: _.reverse(res.data.data.conversation.messages),
          });
        });

        this.setCurrentUser();
      }
    }
  }

  setCurrentUser = () => {
    if (this.props.current_conver.id) {
      let user = _.filter(this.props.current_conver.users, (user) => {
        return user.id == this.props.current_user_id;
      })[0];
      if (user) {
        this.setState({ ...this.state, current_user: user });
      } else {
        this.setState({ ...this.state, current_user: {} });
      }
    }
  };

  arrangeMessages = (messages) => {
    let user = null;
    let new_messages = [];
    let new_message = {};
    _.each(messages, (message, index) => {
      if (new_message.user_id === message.user_id) {
        if (!new_message.messages.length) {
          user =
            message.user_id === this.state.current_user.id
              ? this.state.current_user
              : this.props.authInfo.user;
          new_message = {
            user_id: user.id,
            name: user.name,
            messages: [],
          };
        }
        new_message.messages.push(message.messageable);
      } else {
        if (new_message.user_id) {
          new_messages.push(new_message);
        }
        user =
          message.user_id === this.state.current_user.id
            ? this.state.current_user
            : this.props.authInfo.user;
        new_message = {
          user_id: user.id,
          name: user.name,
          messages: [],
        };
        new_message.messages.push(message.messageable);
      }
      if (index + 1 === messages.length) {
        new_messages.push(new_message);
      }
    });
    return new_messages;
  };

  sendMessage = () => {
    postMessages(
      { user_id: this.props.current_user_id },
      { text: this.text_input.current.value, type: "text" }
    ).then((res) => {
      console.log(res.data);
    });
  };

  onlineStatusBlock = () => {
    if (this.state.current_user.online) {
      return <span className="online-badge">Online</span>;
    }
    return <span className="offline-badge">Offline</span>;
  };

  render() {
    if(!this.state.messages.length){
      return <div>No Messages!</div>
    }

    return (
      <div className="chat__section chat__section--messages">
        <div className="chat__section__header">
          <div className="list__item">
            <div className="list__item__image">
              <img
                src="https://source.unsplash.com/500x500/?selfie"
                alt={this.state.current_user.name}
              />
            </div>
            <div className="list__item__content">
              <div className="list__item__content__title mr-1">
                {this.state.current_user.name}
              </div>
              <div className="list__item__content__text">
                {this.onlineStatusBlock()}
              </div>
            </div>
          </div>
        </div>
        <div className="chat__section__content">
          <div className="messages">
            {this.arrangeMessages(this.state.messages).map(
              (message_item, index) => {
                return (
                  <Message
                    self={message_item.user_id === this.props.authInfo.user.id}
                    messages={message_item.messages}
                    key={index}
                  />
                );
              }
            )}
          </div>
          <div className="message-sender">
            <div className="message-sender__attachment">
              <button>
                <i className="fas fa-paperclip"></i>
              </button>
            </div>
            <div className="message-sender__text">
              <div className="text-input">
                <input
                  type="text"
                  placeholder="Say something ..."
                  ref={this.text_input}
                />
              </div>
            </div>
            <div className="message-sender__send">
              <button
                className="btn btn--light-purple"
                onClick={this.sendMessage}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default hoc(Messages);
