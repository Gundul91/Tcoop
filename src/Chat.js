import React, { Component } from 'react';

class Chat extends Component {
  render() {
    return (
      <iframe frameborder="0"
          scrolling="yes"
          id={"chat_embed_" + this.props.index}
          className="single_chat"
          src={"https://www.twitch.tv/embed/" + this.props.nick + "/chat"}
          height="100%"
          width="100%">
      </iframe>
    );
  }
}

export default Chat;
