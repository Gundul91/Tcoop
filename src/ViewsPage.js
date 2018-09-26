import React, { Component } from 'react';
import SingleView from './SingleView.js'
import Chat from './Chat.js'
import { Link } from 'react-router-dom'

class ViewsPage extends Component {
  componentDidMount () {
    // Adatto le dimenzioni delle views e delle chat al loro numero
    let views = document.querySelectorAll(".SingleView");
    let chatButtons = document.querySelectorAll(".ChatButton");
    let altezza = document.querySelector(".VideosContainer").offsetHeight;
    let larghezza = document.querySelector(".VideosContainer").offsetWidth;

    altezza = altezza / 9;
    larghezza = larghezza / 16;
    let res = altezza / larghezza;
    let calcolo = Math.ceil(views.length / res);
    let robba = (Math.floor((res) * 2));

    if(res > 1)
    {
      views.forEach((element) =>
      {
        if(views.length <= robba)
        {
          element.style.height = "calc( 100% / " + views.length +")";
          element.style.width = "100%";
        } else {
          while((calcolo - (views.length-calcolo)) >= 2)
          {
            calcolo--;
          }
          let cos = Math.ceil((views.length / calcolo));
          element.style.width = "calc( 100% / " + cos +")";
          element.style.height = "calc( 100% / " + calcolo +")";
        }
      });
    } else
    {
      views.forEach((element) =>
      {
        if(views.length < robba)
        {
          element.style.width = "calc( 100% / " + views.length +")";
          element.style.height = "100%";
        } else {
          while((calcolo - (views.length-calcolo)) >= 2)
          {
            calcolo--;
          }
          let cos = Math.ceil((views.length / calcolo));
          element.style.width = "calc( 100% / " + calcolo +")";
          element.style.height = "calc( 100% / " + cos +")";
        }
      });
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
