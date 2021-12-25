import React, { Component } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash";
import ChatContext from "../../../contexts/ChatContext";
import { getConversations } from "../../../api";
import "./conversations.css";
import Conversation from "../conversation/Conversation";
import AuthContext from "../../../contexts/AuthContext";

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

class Conversations extends Component {
  constructor() {
    super();

    this.state = {
      conversations: [],
      ui_once_no_more_conversations: false,
      ui_loadings_get_more_conversations: false,
    };
  }

  componentDidMount() {
    this.conversations_block = document.querySelector("#conversations-block");
    getConversations().then((res) => {
      this.setState({
        ...this.state,
        conversations: res.data.data.conversations,
      });
    });
    this.leaveSocket();
    this.listenSocket();
  }

  listenSocket = () => {
    this.props.socket
      .private(`api.v1.conversation-updated.${this.props.authInfo.user.id}`)
      .listen(".conversation-updated", (res) => {
        if (res.conversation) {
          let new_conversations = this.state.conversations.filter(
            (conversation) => {
              return conversation.id != res.conversation.id;
            }
          );
          this.setState({
            ...this.state,
            conversations: [res.conversation, ...new_conversations],
          });
        }
      });
  };

  leaveSocket = () => {
    this.props.socket.leave(
      `api.v1.conversation-updated.${this.props.authInfo.user.id}`
    );
  };

  getMoreConversations = () => {
    let scroll_end =
      this.conversations_block.scrollHeight -
        this.conversations_block.clientHeight -
        this.conversations_block.scrollTop <
      1;
    if (
      !this.state.ui_once_no_more_conversations &&
      !this.state.ui_loadings_get_more_conversations &&
      scroll_end
    ) {
      this.setState({
        ...this.state,
        ui_loadings_get_more_conversations: true,
      });

      getConversations({
        last_conversation_id: this.state.conversations[this.state.conversations.length - 1].id,
      }).then((res) => {
        if (res.data.data.conversations.length) {
          this.setState({
            ...this.state,
            conversations: [
              ...this.state.conversations,
              ...res.data.data.conversations,
            ],
            ui_loadings_get_more_conversations: false,
          });
        } else {
          this.setState({
            ...this.state,
            ui_once_no_more_conversations: true,
            ui_loadings_get_more_conversations: false,
          });
        }
      });
    }
  };

  render() {
    return (
      <div className="chat__section chat__section--conversations">
        <div className="chat__section__header">
          <div className="text-input">
            <input type="text" placeholder="Search in messages" />
          </div>
        </div>
        <div className="chat__section__content">
          <ul
            className="list list--action"
            id="conversations-block"
            onScroll={this.getMoreConversations}
          >
            {this.state.conversations.map((conversation) => {
              return (
                <Conversation
                  key={conversation.id}
                  conversation={conversation}
                  auth_user_id={this.props.authInfo.user.id}
                  current_user_id={this.props.current_user_id}
                />
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default hoc(Conversations);
