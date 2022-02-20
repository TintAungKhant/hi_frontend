import React, { Component, createRef } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { getMessages } from "../../../api";
import socket from "../../../socket";
import EmptyUserImage from "../../../assets/empty_user_image.png";
import AuthContext from "../../../contexts/AuthContext";
import ChatContext from "../../../contexts/ChatContext";
import LoadingImage from "../../../assets/loading.gif";
import MessageSender from "../message_sender/MessageSender";
import Message from "../message/Message";

class MessageSection extends Component {
  constructor() {
    super();

    this.state = {
      messages: [],
      current_user: {},
      ui_once_no_more_messages: false,
      ui_loadings_get_messages: true,
      ui_loadings_get_more_messages: false,
    };

    this.ref = {
      inputs: {
        text_message: createRef(),
        image_message: createRef(),
      },
    };
  }

  componentDidMount() {
    this.listenSocket();

    getMessages({ user_id: this.props.current_user_id }).then((res) => {
      this.setState(
        {
          ...this.state,
          current_user: this.extractCurrentUser(),
          messages: _.reverse(res.data.data.conversation.messages),
          ui_loadings_get_messages: false,
        },
        () => {
          let messages_block = document.querySelector("#messages-block");
          messages_block.scrollTop = messages_block.scrollHeight;
        }
      );
    });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.current_user_id &&
      this.props.current_user_id != prevProps.current_user_id
    ) {
      this.setState({
        messages: [],
        current_user: {},
        ui_once_no_more_messages: false,
        ui_loadings_get_messages: true,
        ui_loadings_get_more_messages: false,
      });
    }

    if (
      this.props.current_conversation.id &&
      this.props.current_conversation.id != prevProps.current_conversation.id
    ) {
      this.leaveSocket(prevProps.current_conversation.id);
      this.listenSocket();

      this.setState({
        ...this.state,
        current_user: this.extractCurrentUser(),
        ui_once_no_more_messages: false,
        ui_loadings_get_messages: false,
      });

      getMessages({ user_id: this.props.current_user_id }).then((res) => {
        this.setState(
          {
            ...this.state,
            messages: _.reverse(res.data.data.conversation.messages),
            ui_loadings_get_messages: false,
          },
          () => {
            let messages_block = document.querySelector("#messages-block");
            messages_block.scrollTop = messages_block.scrollHeight;
          }
        );
      });
    }
  }

  componentWillUnmount() {
    this.leaveSocket(this.props.current_conversation.id);
  }

  listenSocket = () => {
    socket
      .private(`api.v1.message-sent.${this.props.current_conversation.id}`)
      .listen(".message-sent", (res) => {
        if (
          res.message &&
          res.message.conversation_id == this.props.current_conversation.id
        ) {
          this.setState(
            {
              ...this.state,
              messages: [...this.state.messages, res.message],
            },
            () => {
              let messages_block = document.querySelector("#messages-block");
              messages_block.scrollTop = messages_block.scrollHeight;
            }
          );
        }
      });
  };

  leaveSocket = (conversation_id = null) => {
    conversation_id = conversation_id
      ? conversation_id
      : this.props.current_conversation.id;
    socket.leave(`api.v1.message-sent.${conversation_id}`);
  };

  extractCurrentUser = () => {
    return _.find(this.props.current_conversation.users, (user) => {
      return user.id != this.props.authInfo.user.id;
    });
  };

  arrangeMessages = (messages) => {
    let user = null;
    let new_messages = [];
    let new_message = {};
    _.each(messages, (message, index) => {
      if (message) {
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
      }
    });
    return new_messages;
  };

  shouldLoadMore = () => {
    let messages_block = document.querySelector("#messages-block");
    return (
      !this.state.ui_once_no_more_messages &&
      !this.state.ui_loadings_get_more_messages &&
      messages_block.scrollTop === 0
    );
  };

  getMoreMessages = () => {
    if (this.shouldLoadMore()) {
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

  calcCSSClassName = () => {
    if (window.screen.width <= 768) {
      if (this.props.current_user_id) {
        return "w-full min-h-[calc(100vh-54px)]";
      } else {
        return "hidden w-full min-h-[calc(100vh-54px)]";
      }
    } else {
      return "w-full min-h-[calc(100vh-54px)]";
    }
  };

  render() {
    return (
      <div className={this.calcCSSClassName()}>
        {this.state.ui_loadings_get_messages && (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <div className="w-20">
                <img src={LoadingImage} />
              </div>
            </div>
          </div>
        )}

        {!this.state.ui_loadings_get_messages && this.state.current_user && (
          <>
            <div className="shadow p-2 flex items-center bg-gray-800">
              <Link
                to="/chat"
                className="md:hidden px-2 py-0.5 text-2xl rounded-md bg-gray-900 mr-2"
              >
                <i className="fas fa-arrow-left"></i>
              </Link>
              <div className="w-9 rounded-md overflow-hidden">
                <img
                  src={
                    this.state.current_user.main_profile_image
                      ? this.state.current_user.main_profile_image.url
                      : EmptyUserImage
                  }
                  className="object-cover w-9 h-9"
                />
              </div>
              <div className="px-2 ">
                <div className="font-semibold">
                  {this.state.current_user.name}
                </div>
                <div className="d-flex">
                  {this.state.current_user.online ? (
                    <>
                      <span className="w-2 h-2 mr-1 rounded-full bg-green-400 inline-block"></span>
                      <span className="text-sm">Online</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 mr-1 rounded-full bg-gray-600 inline-block"></span>
                      <span className="text-sm">Offline</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div
              className="h-[calc((100vh-54px)-(60px+68px))] md:h-[calc((100vh-54px)-(60px+64px))] overflow-y-auto p-2"
              id="messages-block"
              onScroll={this.getMoreMessages}
            >
              {this.arrangeMessages(this.state.messages).map(
                (message_item, index) => {
                  return (
                    <Message
                      key={index}
                      self={
                        message_item.user_id === this.props.authInfo.user.id
                      }
                      messages={message_item.messages}
                      profile_image_url={
                        this.state.current_user.main_profile_image
                          ? this.state.current_user.main_profile_image.url
                          : EmptyUserImage
                      }
                    />
                  );
                }
              )}
            </div>
            <MemoMessageSender current_user_id={this.props.current_user_id} />
          </>
        )}
      </div>
    );
  }
}

const MemoMessageSender = React.memo(MessageSender);

const hoc = (Child) => {
  return (props) => {
    return (
      <AuthContext.Consumer>
        {({ authInfo }) => {
          return (
            <ChatContext.Consumer>
              {({ current_conversation }) => {
                return (
                  <Child
                    {...props}
                    authInfo={authInfo}
                    current_conversation={current_conversation}
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

export default hoc(MessageSection);
