import React, { Component} from "react";
import { useParams } from "react-router-dom";
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
  constructor(props) {
    super();

    this.state = {
      conversations: [],
    };
  }

  componentDidMount() {
    getConversations().then((res) => {
      this.setState({
        ...this.state,
        conversations: res.data.data.conversations,
      });
    });
  }

  render() {
    return (
      <div className="chat__section chat__section--conversations">
        <div className="chat__section__header">
          <div className="text-input">
            <input type="text" placeholder="Search in messages" />
          </div>
        </div>
        <div className="chat__section__content">
          <ul className="list list--action">
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
