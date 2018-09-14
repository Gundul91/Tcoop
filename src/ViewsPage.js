import React, { Component } from 'react';
import SingleView from './SingleView.js'
import Chat from './Chat.js'
import { Link } from 'react-router-dom'

class ViewsPage extends Component {
  componentDidMount () {
    // Adatto le dimenzioni delle views e delle chat al loro numero
    let views = document.querySelectorAll(".SingleView");
    let chatButtons = document.querySelectorAll(".ChatButton");
    switch(views.length) {
      case 1:
        document.querySelector(".ChatButtons").style.display = "none";
        document.querySelector(".single_chat").style.height = "100%";
        views.forEach((element) =>
        {
          element.style.height = "100%";
          element.style.width = "100%";
        });
        break;
      case 2:
        chatButtons.forEach((element) =>
        {
          element.style.height = "100%";
          element.style.width = "50%";
        });
        views.forEach((element) =>
        {
          element.style.height = "50%";
          element.style.width = "100%";
        });
        break;
      case 3:
        chatButtons.forEach((element) => element.style.width = "50%");
        views.forEach((element) => element.style.width = "100%");
        break;
      case 4:
        chatButtons.forEach((element) => element.style.width = "50%");
        views.forEach((element) => element.style.height = "50%");
        break;
    }
  }

  // show the selected chat and hide the other
  chatClick(index) {
    let chats = document.querySelectorAll(".single_chat");
    for(let i=0; i<chats.length; i++)
    {
      document.getElementById('chat_embed_' + i).style.display = index === i ? "block" : "none"
    }
  }

  render() {
    // Prendo nomi streamers dall'url, li separo e rimmuovo il primo elemento vuoto"
    let streamers = this.props.location.pathname.split("/")
    streamers.shift()

    /* Scorre l'arrey di streamer e aggiunge un "SingleView" ciascuno
     * Aggiunto anche un bottone ed una chat per ogni streamer
     */
    return (
      <div className="ViewsPage">
        <div className="VideosContainer">
          {
            streamers.map((item, index) =>
              <SingleView
                nick={item}
                index={index}
              />
            )
          }
        </div>
        <div className="Chats">
          <div className="ChatButtons">
            {
              streamers.map((item, index) =>
                <button
                  className="ChatButton"
                  onClick={this.chatClick.bind(this, index)}
                >{item}</button>
              )
            }
          </div>
          {
            streamers.map((item, index) =>
              <Chat
                nick={item}
                index={index}
              />
            )
          }
        </div>
      </div>
    );
  }
}

export default ViewsPage;
