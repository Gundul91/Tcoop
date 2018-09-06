import React, { Component } from 'react';
import queryString from 'query-string';

class Home extends Component {

  componentDidMount () {
    if(this.tmp.access_token !== undefined)
    {
      let auth = "Bearer " +  this.tmp.access_token
      fetch("https://api.twitch.tv/helix/users", {
        headers: {
          'Authorization': auth
        }
      })
      .then(function(c) {
          return c.json()
      }).then(function(j) {
          console.log(j)
      }).catch(function(err) {
          console.log('e', err);
      });
    }
  }

  render() {
    this.markers = []
    this.tmp = queryString.parse(this.props.location.hash)
    return (
      <div className="Home">
        <a href="https://id.twitch.tv/oauth2/authorize?client_id=upk8rrcojp2raiw9pd2edhi0bvhze5&redirect_uri=http://localhost:3000/&response_type=token&scope=user:read:email">Accedi con Twitch</a>
      </div>
    );
  }
}

export default Home;
