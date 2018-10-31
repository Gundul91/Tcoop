import React, { Component } from 'react';
import SingleView from './SingleView.js'
import Chat from './Chat.js'
import { Link } from 'react-router-dom'
import Whisperers from './Whisperers.js'
import { initDB, requireFB, msgClick, sendMessage, aggiungi, toCoop, addLastchatListener } from './funzioniComuni.js'

class ViewsPage extends Component {

  state = {

  }

  // CALCOLA PROPORZIONI FINESTRE E BOTTONI CHAT
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

  // MOSTRA LA CHAT SELEZIONATA E NASCONDE LE ALTRE
  chatClick(index, el) {
    let chats = document.querySelectorAll(".singleChat");
    document.querySelector(".selectedChat").classList.remove("selectedChat");
    document.getElementById('chat_embed_' + index).classList.add("selectedChat");
  }

  // MOSTRA O NASCONDE LE CHAT
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

  // ELIMINA IL LISTENER SUL WINDOWS RESIZE
  removeListener() {
    window.removeEventListener("resize", this.viewsSizeBindato);
  }

  componentWillMount() {
    this.whispRef = React.createRef();
  }

  // LANCIA LA FUNZIONE PER CALCOLARE LE PROPORZIONI E AGGIUNGE IL LISTENER SUL WINDOWS RESIZE
  componentDidMount () {
    if(document.querySelectorAll(".SingleView").length === 1)
      document.querySelector(".chatButtons").style.display = "none";
      console.log("btn", document.querySelector(".chatButton"))
    this.viewsSize();
    this.viewsSizeBindato = this.viewsSize.bind(this);
    window.addEventListener("resize", this.viewsSizeBindato);
    if(this.props.location && this.props.location.state)
    {
      this.contatori = [];
      this.state.info_user = this.props.location.state.info_user;
      console.log("this.state.info_user", this.state.info_user);
      requireFB.bind(this)();
      initDB.bind(this)();
      addLastchatListener.bind(this)();
    }
  }

  componentDidUpdate () {
    this.componentDidMount();
  }

  render() {
    // Prendo nomi streamers dall'url, li separo e rimmuovo il primo elemento vuoto"
    let streamers = []
    if(this.props.location && this.props.location.pathname)
    {
      streamers = this.props.location.pathname.split("/")
      streamers.shift()
    }

    if(this.props.path)
    {
      streamers = this.props.path.split("/")
    }
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
        {
          (this.props.location) && (this.props.location.state) && <Whisperers ref={this.whispRef} sendMessage={sendMessage.bind(this)} msgClick={msgClick.bind(this)}/>
        }
      </div>
    );
  }
}

export default ViewsPage;
