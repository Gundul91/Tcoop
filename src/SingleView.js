import React, { Component } from 'react';

class SingleView extends Component {
  avvia (){
    var options = {
      width: "100%",
      height: "100%",
      channel: this.props.nick
    };
    var player = new window.Twitch.Player("player" + this.props.index, options);
    player.setVolume(0.5);
  }

  componentDidMount () {
    this.avvia()
  }

  render() {
    return (
      <div className="SingleView">
        <div id={"player" + this.props.index}></div>
      </div>
    );
  }
}

export default SingleView;
