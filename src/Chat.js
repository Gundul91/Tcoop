import React, { Component } from 'react';

class Chat extends Component {
  render() {
    return (
      <div id={"chat_embed_" + this.props.index} className={this.props.className}>
        <p class="chat_title">{this.props.nick}</p>
        <iframe frameborder="0"
            scrolling="yes"
            src={"https://www.twitch.tv/embed/" + this.props.nick + "/chat"}
            height="100%"
            width="100%">
        </iframe>
      </div>
    );
  }
}

export default Chat;
