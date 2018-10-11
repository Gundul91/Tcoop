import React, { Component } from 'react';
import SingleView from './SingleView.js'
import Chat from './Chat.js'
import { Link } from 'react-router-dom'

class ViewsPage extends Component {

  viewsSize() {
    console.log("viewsSize()");
    // Adatto le dimenzioni delle views e dei bottoni delle chat al loro numero
    let views = document.querySelectorAll(".SingleView");
    let altezza = document.querySelector(".videosContainer").offsetHeight - 1;
    let larghezza = document.querySelector(".videosContainer").offsetWidth - 1;

    let best = {w: 0, h: 0};
    let w, h;

    for(let i=1; i<=views.length; i++)
    {
      h = altezza / i;
      if(((h / 9) * 16) * Math.ceil(views.length / i) > larghezza)
      {
        w = larghezza / Math.ceil(views.length / i);
        h = (w / 16) * 9;
      } else {
        w = (h / 9) * 16;
      }
      if(h > best.h)
      {
        best.w = w;
        best.h = h;
      }
    }

    views.forEach((element) =>
    {
      element.style.height = best.h + "px";
      element.style.width = best.w + "px";
    });

    // Calcolo dimensioni bottoni chat
    if((views.length * 33) + 38 > document.querySelector(".viewsPage").offsetHeight)
    {
      let height = ((document.querySelector(".viewsPage").offsetHeight - 38 - (3 * views.length)) / views.length);
      document.querySelector(".chatButtons").style.fontSize = (height < 15) ? "0.7em" : "1em";
      document.querySelectorAll(".chatButton").forEach((el) => {
        el.style.height = height  + "px";
      });
    } else if(document.querySelector(".chatButton").style.height !== "30px")
    {
      document.querySelector(".chatButtons").style.fontSize = "1em";
      document.querySelectorAll(".chatButton").forEach((el) => {
        el.style.height = "30px";
      });
    }
  }

  // show the selected chat and hide the other
  chatClick(index, el) {
    let chats = document.querySelectorAll(".singleChat");
    document.querySelector(".selectedChat").classList.remove("selectedChat");
    document.getElementById('chat_embed_' + index).classList.add("selectedChat");
  }

  // Funzione eseguita al click del bottone di apertura/chiusura chat
  closeChat(el) {
    if(el.target.classList.contains("closeChat"))
    {
      document.querySelector(".chatIcon").src="https://png.icons8.com/metro/1600/chat.png";
      document.querySelector(".chats").style.display = "none";
      document.querySelector(".videosContainer").style.width = "100%";
      window.dispatchEvent(new Event('resize')); // Scateno l'evento di "resize" della pagina per far riadattare le views
      el.target.classList.remove("closeChat");
    } else {
      document.querySelector(".chatIcon").src = "https://png.icons8.com/metro/1600/no-chat.png";
      document.querySelector(".chats").style.display = "inline-block";
      document.querySelector(".videosContainer").style.width = "calc(100% - 341px)";
      window.dispatchEvent(new Event('resize'));
      el.target.classList.add("closeChat");
    }
  }

  removeListener() {
    window.removeEventListener("resize", this.viewsSizeBindato);
  }

  componentDidMount () {
    if(document.querySelectorAll(".SingleView").length === 1)
      document.querySelector(".chatButtons").style.display = "none";
    this.viewsSize();
    this.viewsSizeBindato = this.viewsSize.bind(this);
    window.addEventListener("resize", this.viewsSizeBindato);
  }

  render() {
    // Prendo nomi streamers dall'url, li separo e rimmuovo il primo elemento vuoto"
    let streamers = []
    if(this.props.location)
    {
      streamers = this.props.location.pathname.split("/")
      streamers.shift()
    }

    if(this.props.path)
    {
      streamers = this.props.path.split("/")
    }
    console.log("streamers: ", streamers)
    /*if(streamers[streamers.length -1][0] === "#")*/

    /* Scorre l'arrey di streamer e aggiunge un "SingleView" ciascuno
     * Aggiunto anche un bottone ed una chat per ogni streamer
     */
    return (
      <div className="viewsPage">
        <div className="videosContainer">
          {
            streamers.map((item, index) =>
              <SingleView
                nick={item}
                index={index}
              />
            )
          }
        </div>
        <button className="closeButton closeChat" onClick={this.closeChat}><img className="chatIcon" src="https://png.icons8.com/metro/1600/no-chat.png"></img></button>
        <div className="chats">
          <div className="chatButtons">
            {
              streamers.map((item, index) =>
                <button
                  className="chatButton"
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
                className={(!index) ? "singleChat selectedChat" : "singleChat"}
              />
            )
          }
        </div>
      </div>
    );
  }
}

export default ViewsPage;
