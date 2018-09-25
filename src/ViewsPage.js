import React, { Component } from 'react';
import SingleView from './SingleView.js'
import Chat from './Chat.js'
import { Link } from 'react-router-dom'

class ViewsPage extends Component {
  componentDidMount () {
    // Adatto le dimenzioni delle views e delle chat al loro numero
    let views = document.querySelectorAll(".SingleView");
    let chatButtons = document.querySelectorAll(".ChatButton");
    /*switch(views.length) {
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
    }*/
    let altezza = document.querySelector(".VideosContainer").offsetHeight;
    let larghezza = document.querySelector(".VideosContainer").offsetWidth;
    altezza = altezza / 9;
    larghezza = larghezza / 16;
    /*if(altezza > larghezza)
    {
      let righe = (altezza/larghezza);
      console.log("righe: ", righe);
    } else {
      let colonne = (larghezza/altezza);
      console.log("colonne: ", colonne);
    }*/
    let res = altezza / larghezza;
    if(res > 1)
    {
      console.log("alto");
    } else
    {
      console.log("largo");
      let calcolo = (Math.floor(res * views.length) + 1);
      console.log("calcolo", calcolo);
      console.log("leng", views.length);
      views.forEach((element) =>
      {
        let robba = (Math.ceil((1/res) * 2));
        console.log("vr", robba);
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
          console.log("cos", cos);
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
