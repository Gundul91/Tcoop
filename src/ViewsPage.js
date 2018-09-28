import React, { Component } from 'react';
import SingleView from './SingleView.js'
import Chat from './Chat.js'
import { Link } from 'react-router-dom'

class ViewsPage extends Component {

  viewsSize() {
    // Adatto le dimenzioni delle views e delle chat al loro numero
    let views = document.querySelectorAll(".SingleView");
    let altezza = document.querySelector(".VideosContainer").offsetHeight;
    let larghezza = document.querySelector(".VideosContainer").offsetWidth;

    let best = {x: 0, y: 0};
    let x;

    console.log("altezza: " + altezza + " larghezza: " + larghezza);

    for(let i=1; i<=views.length; i++)
    {
      let y = altezza / i;
      console.log("i: " + i + " x: " + ((y/9)*16)*Math.ceil(views.length / i) + " y: " + y);
      if(((y/9)*16)*Math.ceil(views.length / i) > larghezza)
      {
        x = larghezza / Math.ceil(views.length / i);
        y = (x/16)*9;
        console.log("troppo largo x: " + x + " y: " + y);
      } else {
        x = (y/9)*16;
        console.log("giusto x: " + x);
      }
      if(y > best.y)
      {
        best.x = x;
        best.y = y;
      }
    }

    console.log(best);

    views.forEach((element) =>
    {
      element.style.height = best.y + "px";
      element.style.width = best.x + "px";
    });

    /*altezza = altezza / 9;
    larghezza = larghezza / 16;
    let res = altezza / larghezza;

    if(res > 1)
    {
      let calcolo = Math.ceil(views.length / res);
      let robba = (Math.floor((res) * 2));
      views.forEach((element) =>
      {
        if(views.length <= robba)
        {
          element.style.height = "calc( 100% / " + views.length +")";
          element.style.width = "100%";
          console.log("1111111111 " + "res: " + res + "views.length: " + views.length + "altezza: " + altezza + "larghezza: " + larghezza + "calcolo: " + calcolo + "robba: " + robba);
        } else {
          console.log("2222222 " + "res: " + res + "views.length: " + views.length + "altezza: " + altezza + "larghezza: " + larghezza + "calcolo: " + calcolo + "robba: " + robba);
          while(((views.length/calcolo) - calcolo) >= 2)
          {
            calcolo++;
          }
          let cos = Math.ceil((views.length / calcolo));
          element.style.width = "calc( 100% / " + cos +")";
          element.style.height = "calc( 100% / " + calcolo +")";
          console.log("calcolo: " + calcolo + "cos: " + cos );
        }
      });
    } else
    {
      let calcolo = Math.ceil(res * views.length);
      let robba = (Math.ceil((1/res) * 2));
      views.forEach((element) =>
      {
        if(views.length < robba)
        {
          element.style.width = "calc( 100% / " + views.length +")";
          element.style.height = "100%";
          console.log("33333333333 " + "res: " + res + "views.length: " + views.length + "altezza: " + altezza + "larghezza: " + larghezza + "calcolo: " + calcolo + "robba: " + robba );
        } else {
          console.log("44444444444 " + "res: " + res + "views.length: " + views.length + "altezza: " + altezza + "larghezza: " + larghezza + "calcolo: " + calcolo + "robba: " + robba);
          while((calcolo - (views.length-calcolo)) >= 2)
          {
            calcolo--;
          }
          let cos = Math.ceil((views.length / calcolo));
          element.style.width = "calc( 100% / " + calcolo +")";
          element.style.height = "calc( 100% / " + cos +")";
          console.log("calcolo: " + calcolo + "cos: " + cos );
        }
      });
    }*/
  }

  buttonsSize() {

  }

  // show the selected chat and hide the other
  chatClick(index, el) {
    console.log(index, document.getElementById('chat_embed_' + index));
    let chats = document.querySelectorAll(".single_chat");
    document.querySelector(".selected_chat").classList.remove("selected_chat");
    document.getElementById('chat_embed_' + index).classList.add("selected_chat");
  }

  closeChat(el) {
    if(el.target.classList.contains("closeChat"))
    {
      document.querySelector(".chatIcon").src="https://png.icons8.com/metro/1600/chat.png";
      document.querySelector(".Chats").style.display = "none";
      document.querySelector(".VideosContainer").style.width = "100%";
      window.dispatchEvent(new Event('resize'));
      el.target.classList.remove("closeChat");
    } else {
      document.querySelector(".chatIcon").src = "https://png.icons8.com/metro/1600/no-chat.png";
      document.querySelector(".Chats").style.display = "inline-block";
      document.querySelector(".VideosContainer").style.width = "calc(100% - 341px)";
      window.dispatchEvent(new Event('resize'));
      el.target.classList.add("closeChat");
    }
  }

  componentDidMount () {
    this.viewsSize();
    window.addEventListener("resize", this.viewsSize.bind(this));
    this.buttonsSize();
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
        <button className="closeButton closeChat" onClick={this.closeChat}><img className="chatIcon" src="https://png.icons8.com/metro/1600/no-chat.png"></img></button>
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
                className={(!index) ? "single_chat selected_chat" : "single_chat"}
              />
            )
          }
        </div>
      </div>
    );
  }
}

export default ViewsPage;
