import React, { Component } from 'react';
import queryString from 'query-string';

class Home extends Component {
  info_user = {}

  addToList() {
    let url = "https://api.twitch.tv/helix/streams?user_login=ninja";
    //let url = "https://api.twitch.tv/helix/streams?user_id=" + this.info_user.id;
    fetch(url, {
      headers: {
        'Client-ID': "upk8rrcojp2raiw9pd2edhi0bvhze5"
      }
    })
    .then(function(c) {
      return c.json()
    }).then(function(j) {
      console.log(j)
      if(j.data.length == 0)
      {
        console.log("non è live")
      } else {
        fetch("https://api.twitch.tv/helix/games?id=" + j.data[0].game_id, {
          headers: {
            'Client-ID': "upk8rrcojp2raiw9pd2edhi0bvhze5"
          }
        })
        .then(function(c) {
          return c.json()
        }).then(function(j) {
          console.log(j)
          console.log("è live su " + j.data[0].name)
        })
      }
    })
  }

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
        this.info_user = j.data[0];
        console.log(this.info_user)
      }.bind(this)).catch(function(err) { // .bind(this) per poterlo utilizzare nella funzione
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
        <br/>
        <button className="AddButton" onClick={this.addToList.bind(this)} >Aggiungiti alla lista</button>
      </div>
    );
  }
}

export default Home;
