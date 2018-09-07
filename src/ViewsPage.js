import React, { Component } from 'react';
import SingleView from './SingleView.js'
import Chat from './Chat.js'
import { Link } from 'react-router-dom'

class ViewsPage extends Component {
  componentDidMount () {
    let views = document.querySelectorAll(".SingleView");
    if(views.length < 3) {
      views.forEach((element) => element.style.width = "100%");
    } else {
      views.forEach((element) => element.style.width = "calc(100% * (1/2))");
    }
    if(views.length < 2) {
      document.querySelector(".SingleView").style.height = "100%";
      document.querySelector(".ChatButtons").style.display = "none";
    }
  }

  chatClick(index) {
    console.log(index)
    for(let i=0; i<3; i++)
    {
      document.getElementById('chat_embed_' + i).style.display = index === i ? "block" : "none"
    }
  }

  render() {
    // Prendo nomi streamers dall'url, li separo e rimmuovo il primo elemento vuoto"
    let streamers = this.props.location.pathname.split("/")
    streamers.shift()

    // scorre l'arrey di nomi e aggiunge un "SingleView" ciascuno
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
                <button className="ChatButton" onClick={this.chatClick.bind(this, index)} >{item}</button>
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
