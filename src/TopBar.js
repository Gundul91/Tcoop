import React, { Component } from 'react';

class TopBar extends Component {

  bar_content() {
    let info_user=this.props.info_user;
    console.log("TopBar", info_user);
    if(info_user.id) {
      return (
        <div className="TopBar">
          <img className="userImage" src={info_user.profile_image_url}/>
          <button className="AddButton" onClick={this.props.addToList} >Aggiungiti alla lista</button>
          <button className="DeleteButton" onClick={this.props.deleteDB} >Rimmuoviti dalla lista</button>
          <select className="giochi"></select>
        </div>
      );
    } else {
      return (
        <div className="TopBar">
          <a className="linkAccesso" href="https://id.twitch.tv/oauth2/authorize?client_id=upk8rrcojp2raiw9pd2edhi0bvhze5&redirect_uri=http://localhost:3000/&response_type=token&scope=user:read:email">Accedi con Twitch</a>
          <select className="giochi"></select>
        </div>
      );
    }
  }

  render() {
    return this.bar_content()
  }
}

export default TopBar;
