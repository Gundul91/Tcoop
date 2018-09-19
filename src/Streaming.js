import React, { Component } from 'react';

class Streaming extends Component {
  render() {
    return (
      <div className="Streaming">
        <span className="streamingQuantity">{this.props.presenti + " / " + this.props.necessari}</span>
        <p className="streamingLanguage">{this.props.language}</p>
        <img className="streamingImg" src={this.props.img_url.slice(0, -20) + "400x225.jpg"}/>
        <br/>
        <img className="streamerImg" src={this.props.user_image}/>
        <div className="streamingInfo">
          <div className="streamingTitle" title={this.props.stream_title}>{this.props.stream_title}</div>
          <p className="streamerName">{this.props.streamer_name}</p>
          <p className="streamingGame">{this.props.game_name}</p>
        </div>
      </div>
    );
  }
}

export default Streaming;
