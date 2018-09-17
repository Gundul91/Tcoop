import React, { Component } from 'react';

class TopBar extends Component {
  render() {
    return (
      <div className="TopBar">
        <a className="linkAccesso" href="https://id.twitch.tv/oauth2/authorize?client_id=upk8rrcojp2raiw9pd2edhi0bvhze5&redirect_uri=http://localhost:3000/&response_type=token&scope=user:read:email">Accedi con Twitch</a>
      </div>
    );
  }
}

export default TopBar;
