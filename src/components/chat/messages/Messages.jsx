import React, { Component, createRef, useState } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { getMessages, postMessages } from "../../../api";
import ChatContext from "../../../contexts/ChatContext";
import AuthContext from "../../../contexts/AuthContext";
import "./messages.css";
import Message from "../message/Message";
import Loading from "../../../pages/loadings/loading/Loading";
import Alert from "../../popups/alert/Alert";

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

const MessageSender = React.memo(({ current_user_id }) => {
  const [imageErrors, setImageErrors] = useState([]);

  const textInput = createRef();
  const imageInput = createRef();

  const sendMessage = (type) => {
    setImageErrors([]);
    if (type === "image") {
      let form = new FormData();
      form.append("image", imageInput.current.files[0]);
      form.append("type", type);
      postMessages(
        form,
        { user_id: current_user_id },
        {
          "Content-Type": "multipart/form-data",
        }
      ).catch((err) => {
        if (err.response.status === 422) {
          if (err.response.data.data.errors.image) {
            setImageErrors(err.response.data.data.errors.image);
          }
        }
      });
    } else {
      if (textInput.current.value) {
        let form = {
          text: textInput.current.value,
          type,
        };
        textInput.current.value = "";
        textInput.current.focus();
        postMessages(form, { user_id: current_user_id });
      }
    }
  };

  return (
    <>
      {imageErrors[0] && (
        <Alert message={imageErrors[0]} ok={() => setImageErrors([])} />
      )}
      <div className="message-sender">
        <div className="message-sender__attachment">
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="file-input"
            ref={imageInput}
            onChange={() => sendMessage("image")}
          />
          <button onClick={() => document.querySelector("#file-input").click()}>
            <i className="fas fa-image"></i>
          </button>
        </div>
        <div className="message-sender__text">
          <div className="text-input">
            <input
              type="text"
              placeholder="Say something ..."
              ref={textInput}
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  sendMessage("text");
                }
              }}
            />
          </div>
        </div>
        <div className="message-sender__send">
          <button
            className="btn btn--light-purple"
            onClick={() => sendMessage("text")}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </>
  );
});

class Messages extends Component {
  constructor() {
    super();

    this.state = {
      messages: [],
      current_user: {},
      ui_once_no_more_messages: false,
      ui_loadings_get_messages: false,
      ui_loadings_get_more_messages: false,
    };

    this.ref = {
      inputs: {
        text_message: createRef(),
        image_message: createRef(),
      },
    };
  }

  async componentDidUpdate(prevProps) {
    this.messages_block = document.querySelector("#messages-block");

    if (prevProps.current_conver.id !== this.props.current_conver.id) {
      if (this.props.current_conver.id) {
        this.setState({ ...this.state, ui_loadings_get_messages: true });
        await getMessages({ user_id: this.props.current_user_id }).then(
          (res) => {
            this.setState({
              ...this.state,
              messages: _.reverse(res.data.data.conversation.messages),
            });
          }
        );
        this.setState({
          ...this.state,
          ui_once_no_more_messages: false,
          ui_loadings_get_messages: false,
        });
        this.setCurrentUser();
        this.leaveSocket(prevProps.current_conver.id);
        this.listenSocket();
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
        message.messageable.type = message.type;
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
        message.messageable.type = message.type;
        new_message.messages.push(message.messageable);
      }
      if (index + 1 === messages.length) {
        new_messages.push(new_message);
      }
    });
    return new_messages;
  };

  onlineStatusBlock = () => {
    if (this.state.current_user.online) {
      return <span className="online-badge">Online</span>;
    }
    return <span className="offline-badge">Offline</span>;
  };

  listenSocket = () => {
    this.props.socket
      .private(`api.v1.message-sent.${this.props.current_conver.id}`)
      .listen(".message-sent", (res) => {
        if (
          res.message &&
          res.message.conversation_id == this.props.current_conver.id
        ) {
          this.setState(
            {
              ...this.state,
              messages: [...this.state.messages, res.message],
            },
            () => {
              this.messages_block.scrollTop = this.messages_block.scrollHeight;
            }
          );
        }
      });
  };

  leaveSocket = (conversation_id = null) => {
    conversation_id = conversation_id
      ? conversation_id
      : this.props.current_conver.id;
    this.props.socket.leave(`api.v1.message-sent.${conversation_id}`);
  };

  getMoreMessages = () => {
    if (
      !this.state.ui_once_no_more_messages &&
      !this.state.ui_loadings_get_more_messages &&
      this.messages_block.scrollTop === 0
    ) {
      this.setState({ ...this.state, ui_loadings_get_more_messages: true });

      getMessages({
        user_id: this.props.current_user_id,
        last_message_id: this.state.messages[0].id,
      }).then((res) => {
        if (res.data.data.conversation.messages.length) {
          this.setState({
            ...this.state,
            messages: [
              ..._.reverse(res.data.data.conversation.messages),
              ...this.state.messages,
            ],
            ui_loadings_get_more_messages: false,
          });
        } else {
          this.setState({
            ...this.state,
            ui_once_no_more_messages: true,
            ui_loadings_get_more_messages: false,
          });
        }
      });
    }
  };

  calcStyle = () => {
    if (window.screen.width <= 768) {
      if (this.props.current_user_id) {
        return {
          display: "block",
          width: "100%",
        };
      } else {
        return {
          display: "none",
        };
      }
    }
  };

  render() {
    if (this.state.ui_loadings_get_messages) {
      return (
        <div className="chat__section chat__section--no-messages" style={this.calcStyle()}>
          <Loading />
        </div>
      );
    }

    if (!this.state.messages.length && !this.props.current_user_id) {
      return (
        <div className="chat__section chat__section--no-messages" style={this.calcStyle()}>
          <div className="chat__section__greeting">
            <h2>HI!</h2>
          </div>
        </div>
      );
    }

    return (
      <div className="chat__section chat__section--messages" style={this.calcStyle()}>
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
          <div
            className="messages"
            id="messages-block"
            onScroll={this.getMoreMessages}
          >
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
          <MessageSender current_user_id={this.props.current_user_id} />
        </div>
      </div>
    );
  }
}

export default hoc(Messages);
