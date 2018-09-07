import React, { Component } from 'react';
import SingleView from './SingleView.js'
import Chat from './Chat.js'

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
