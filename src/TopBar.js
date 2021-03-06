import React, { Component } from 'react';

class TopBar extends Component {

  componentDidMount() {
    this.props.riempi_giochi();
  }

  bar_content() {
    let info_user = this.props.info_user;
    console.log("TopBar", info_user);
    if(info_user.id) {
      return (
        <div className="TopBar">
          <img className="userImage" src={info_user.profile_image_url}/>
          <button className="AddButton" onClick={this.props.addToList} >Aggiungiti alla lista</button>
          <button className="DeleteButton" onClick={this.props.removeList} >Rimmuoviti dalla lista</button>
          <select className="giochi" onChange={this.props.gameChange} ></select>
          <button className="logoutButton" onClick={this.props.logout} >Logout</button>
        </div>
      );
    } else {
      return (
        <div className="TopBar">
          <a className="linkAccesso" href="https://id.twitch.tv/oauth2/authorize?client_id=upk8rrcojp2raiw9pd2edhi0bvhze5&redirect_uri=http://localhost:3000/&response_type=token&scope=user:read:email">Accedi con Twitch</a>
          <select className="giochi" onChange={this.props.gameChange}></select>
          <button className="logoutButton" onClick={this.props.logout} >Logout</button>
        </div>
      );
    }
  }

  render() {
    return this.bar_content()
  }
}

export default TopBar;
