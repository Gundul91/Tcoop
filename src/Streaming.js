import React, { Component } from 'react';

class Streaming extends Component {

  componentDidMount () {

  }

  render() {
    return (
      <div className="Streaming">
        <img className="streamingImg" src={this.props.img_url.slice(0, -20) + "400x300.jpg"}/>
        <img className="streamerImg" src={this.props.user_image.slice(0, -20) + "400x300.jpg"}/>
        <h2 className="streamingTitle">{this.props.stream_title}</h2>
        //<span className="streamerName">{this.props.streamer_name}</span>
        <span className="streamingGame">{this.props.game_name}</span>
        <span className="streamingLanguage">{this.props.language}</span>
      </div>
    );
  }
}

export default Streaming;
