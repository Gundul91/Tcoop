import React, { Component } from 'react';

class Streaming extends Component {

  componentDidMount () {

  }

  render() {
    return (
      <div className="Streaming">
        <img className="streamingImg" src={this.props.img_url.slice(0, -20) + "400x225.jpg"}/>
        <br/>
        <img className="streamerImg" src={this.props.user_image}/>
        <div className="streamingInfo">
          <h3 className="streamingTitle">{this.props.stream_title}</h3>
          <p className="streamerName">{this.props.streamer_name}</p>
          <p className="streamingGame">{this.props.game_name}</p>
        </div>
        <p className="streamingLanguage">{this.props.language}</p>
      </div>
    );
  }
}

export default Streaming;
