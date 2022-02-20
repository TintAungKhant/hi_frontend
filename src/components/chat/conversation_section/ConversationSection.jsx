import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../../contexts/AuthContext";
import socket from "../../../socket";
import { getConversations } from "../../../api";
import Conversation from "../conversation/Conversation";
import { greeting } from "../../../helpers";
import LoadingImage from "../../../assets/loading.gif";

class ConversationSection extends Component {
  static contextType = AuthContext;

  constructor() {
    super();

    this.state = {
      conversations: [],
      ui_once_no_more_conversations: false,
      ui_loadings_get_conversations: true,
      ui_loadings_get_more_conversations: false,
    };
  }

  componentDidMount() {
    getConversations().then((res) => {
      this.setState({
        ...this.state,
        conversations: res.data.data.conversations,
        ui_loadings_get_conversations: false,
      });
    });

    this.leaveSocket();
    this.listenSocket();
  }

  listenSocket = () => {
    socket
      .private(`api.v1.conversation-updated.${this.context.authInfo.user.id}`)
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
    socket.leave(
      `api.v1.conversation-updated.${this.context.authInfo.user.id}`
    );
  };

  shouldLoadMore = () => {
    let conversations_block = document.querySelector("#conversations-block");

    let scroll_end =
      conversations_block.scrollHeight -
        conversations_block.clientHeight -
        conversations_block.scrollTop <
      1;

    return (
      !this.state.ui_once_no_more_conversations &&
      !this.state.ui_loadings_get_more_conversations &&
      scroll_end
    );
  };

  getMoreConversations = () => {
    if (this.shouldLoadMore()) {
      this.setState({
        ...this.state,
        ui_loadings_get_more_conversations: true,
      });

      getConversations({
        last_conversation_id:
          this.state.conversations[this.state.conversations.length - 1].id,
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

  calcCSSClassName = () => {
    if (window.screen.width <= 768) {
      if (this.props.current_user_id) {
        return "hidden w-full min-h-[calc(100vh-54px)] md:border-r md:border-r-gray-800";
      } else {
        return "w-full min-h-[calc(100vh-54px)] md:border-r md:border-r-gray-800";
      }
    } else {
      return "w-[22rem] min-w-[19rem] min-h-[calc(100vh-54px)] overflow-y-auto md:border-r md:border-r-gray-800";
    }
  };

  render() {
    return (
      <div
        className={this.calcCSSClassName()}
        id="conversations-block"
        onScroll={this.getMoreConversations}
      >
        {this.state.ui_loadings_get_conversations && (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <div className="w-20">
                <img src={LoadingImage} />
              </div>
            </div>
          </div>
        )}

        {!this.state.ui_loadings_get_conversations &&
        this.state.conversations[0] ? (
          this.state.conversations.map((conversation) => {
            return (
              <Conversation key={conversation.id} conversation={conversation} />
            );
          })
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <div className="text-lg mb-2">{greeting()}...</div>
              <Link to="/explore" className="btn btn-indigo">
                Start Explore People
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ConversationSection;
