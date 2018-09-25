import React, { Component } from 'react';
import queryString from 'query-string';
import Streaming from './Streaming.js'
import TopBar from './TopBar.js'
import InputAdd from './InputAdd.js'
import Whisperers from './Whisperers.js'


const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

class Home extends Component {
  state = {
    lista: {}
  }

  info_user = {}

  addToList() {
    // per test
    let testValue = document.getElementById('txtUser').value;
    if(testValue)
      this.info_user.login = testValue

    // Richiedo info sullo streaming di chi ha fatto l'accesso nel sito
    let url = "https://api.twitch.tv/helix/streams?user_login=" + this.info_user.login;
    fetch(url, {
      headers: {
        'Client-ID': "upk8rrcojp2raiw9pd2edhi0bvhze5"
      }
    })
    .then(function(c) {
      return c.json()
    }).then(function(str_info) {
      console.log(str_info)
      if(str_info.data.length === 0)
      {
        console.log("non è live")
      } else {
        // Richiedo info sul gioco con l'id ricevuto dalla precedente richiesta
        fetch("https://api.twitch.tv/helix/games?id=" + str_info.data[0].game_id, {
          headers: {
            'Client-ID': "upk8rrcojp2raiw9pd2edhi0bvhze5"
          }
        })
        .then(function(c) {
          return c.json()
        }).then(function(game_info) {
          console.log(game_info)
          console.log("è live su " + game_info.data[0].name)
          this.str_info = str_info;
          this.game_info = game_info;
          document.querySelector(".InputAdd").style.display = "block";
        }.bind(this))
      }
    }.bind(this))
  }

  addToBD() {
    // Aggiunge queste informazione al DB nella collection "user"
    if(document.getElementById('txtTitle').value !== '')
      this.str_info.data[0].title = document.getElementById('txtTitle').value;


    //Da midificare la if e aggiungere il numero di persone cercate


    this.db.collection("user").doc(this.info_user.login).set({
      img_url: this.str_info.data[0].thumbnail_url,
      game_name: this.game_info.data[0].name,
      language: this.str_info.data[0].language,
      user_image: this.info_user.profile_image_url,
      stream_title: this.str_info.data[0].title,
      presenti: document.querySelector(".presenti").value,
      necessari: document.querySelector(".necessari").value
    })
    .then(function(docRef) {
      document.querySelector(".AddButton").style.display = "none";
      document.querySelector(".DeleteButton").style.display = "inline-block";
      document.querySelector(".InputAdd").style.display = "none";
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  // Richiamata dal click sul bottone "Stampa DB" stampa il contenuto del DB
  stampaDB() {
    this.db.collection("user").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, doc.data());
        });
    });
  }

  updateDB() {
    var washingtonRef = this.db.collection("user").doc("jB41qkZsJZWQvWcXoRbx");

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        name: null
    })
    .then(function() {
        console.log("Document successfully updated!");
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
  }

  // Event cambio testo nel textboxdi testo
  onChange() {
    this.info_user.display_name = document.getElementById('txtUser').value;
    this.info_user.login = this.info_user.display_name.toLowerCase();
    if(this.state.lista[this.info_user.login])
    {
      document.querySelector(".AddButton").style.display = "none";
      document.querySelector(".DeleteButton").style.display = "inline-block";
    } else {
      document.querySelector(".AddButton").style.display = "inline-block";
      document.querySelector(".DeleteButton").style.display = "none";
    }

    this.addLastchatListener();
  }

  deleteDB() {
    this.db.collection('user').doc(this.info_user.login).delete();
    document.querySelector(".AddButton").style.display = "inline-block";
    document.querySelector(".DeleteButton").style.display = "none";
  }

  // Richiede la lista al DB e la mette in this.state.lista
  showDB() {
    let obj = {};
    this.db.collection("user").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          obj[doc.id] = doc.data();
      });
      this.setState({lista: obj});
    })
  }

  // Restituisce la lista di elementi <Streaming> contenenti le info di chi cerca coop
  getList() {
    let objs = [];
    for (var key in this.state.lista) {
      let item = this.state.lista[key];
      objs.push(<Streaming
        game_name={item.game_name}
        img_url={item.img_url}
        language={item.language}
        stream_title={item.stream_title}
        user_image={item.user_image}
        streamer_name={key}
        presenti={item.presenti}
        necessari={item.necessari}
      />);
    }
    return objs;
  }

  // Inizializza il collegamento con il db di firebase
  componentWillMount() {
    // Settings per firebase
    firebase.initializeApp({
      apiKey: "AIzaSyCaQYYVlMGO7ha0g31l6iYPLxj8pNb9c0o",
      authDomain: "tcoop-6668f.firebaseapp.com",
      databaseURL: "https://tcoop-6668f.firebaseio.com",
      projectId: "tcoop-6668f",
      storageBucket: "tcoop-6668f.appspot.com",
      messagingSenderId: "429000425300"
    });

    // Initialize Cloud Firestore through Firebase
    this.db = firebase.firestore();

    // Disable deprecated features
    this.db.settings({
      timestampsInSnapshots: true
    });

    this.showDB();
  }

  // Richiede i dati di chi accede
  componentDidMount() {
    // Se è stato fatto l'accesso con twitch richiedo i dati dell'utente
    if(this.access_info.access_token !== undefined)
    {
      let auth = "Bearer " +  this.access_info.access_token
      fetch("https://api.twitch.tv/helix/users", {
        headers: {
          'Authorization': auth
        }
      })
      .then(function(c) {
        return c.json()
      }).then(function(user) {
        this.info_user = user.data[0];
        console.log(this.info_user);
        this.addLastchatListener();
      }.bind(this)).catch(function(err) { // .bind(this) per poterlo utilizzare nella funzione
        console.log('e', err);
      });
    }

    this.contatore = 0; // Per MESSAGGI

  }

  addLastchatListener() {
    /* LISTENER SU ELEMENTO DEL DB
     * Stampa quando cambia l'elemento "login + _last_chat" nel // DB
     * Aggiungere qui la comparsa della notifica di un nuovo messaggio o di una richiesta di tcoop
     */
    console.log("login_listener: " + this.info_user.login);
    this.db.collection("chat").doc(this.info_user.login + "_last_chat")
    .onSnapshot(function(doc) {
      let messaggio = doc.data();
      if(messaggio) {
        if(!document.getElementById("lista_discussione_" + messaggio.utente))
        {
          let button = document.createElement("BUTTON");
          button.innerHTML = messaggio.utente;
          button.onclick = function() {
            let chatVarie = document.querySelectorAll("#discussione > ul");
            console.log(chatVarie);
            chatVarie.forEach((el) => {
              el.style.display = "none";
            });
            document.getElementById("lista_discussione_" + messaggio.utente).style.display = "block";
          };
          document.getElementById("bottoniWhisperers").appendChild(button);

          let ul = document.createElement("UL");
          ul.id = "lista_discussione_" + messaggio.utente;
          ul.style.display = "none";
          document.getElementById('discussione').appendChild(ul);
        }
        let li = document.createElement("LI");
        li.innerHTML = messaggio.utente + ": " + messaggio.messaggio;
        document.getElementById("lista_discussione_" + messaggio.utente).appendChild(li);
      }
    });
  }

  /* WHISPER */

  sendMessage() {
    let utente = document.getElementById('txtRicevente').value.toLowerCase();
    let messaggio = document.getElementById('txtMessage').value;

    this.contatore ++;
    let stringa = this.info_user.login > utente ? "chat_" + utente + "_" + this.info_user.login : "chat_" + this.info_user.login + "_" + utente;

    // Elemento su cui mettere listener
    let d = new Date();
    this.db.collection("chat").doc(utente + "_last_chat").set({
      stringa: stringa,
      messaggio: messaggio,
      utente: this.info_user.display_name,
      contatore: this.contatore
    });

    // Aggiungo al DB il messaggio
    // DA CAMBIARE, OGNI VOLTA CHE RICARICO LA PAGINA IL CONTATORE TORNA A 0 E SOVRASCRIVE I MESSAGGI
    this.db.collection("chat").doc("chat_con_messaggi").collection(stringa).doc("messaggio" + this.contatore).set({
      mess: messaggio,
      users: this.info_user.display_name
    })
    .then(() => {
      if(!document.getElementById("lista_discussione_" + utente))
      {
        let ul = document.createElement("UL");
        ul.id = "lista_discussione_" + utente;
        document.getElementById('discussione').appendChild(ul);
      }
      let li = document.createElement("LI");
      li.innerHTML = this.info_user.display_name + ": " + messaggio;
      document.getElementById("lista_discussione_" + utente).appendChild(li);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  render() {
    this.access_info = queryString.parse(this.props.location.hash);
    return (
      <div className="Home">
        <InputAdd addToBD={this.addToBD.bind(this)}/>
        <div className="boxTest">
          <a href="https://id.twitch.tv/oauth2/authorize?client_id=upk8rrcojp2raiw9pd2edhi0bvhze5&redirect_uri=http://localhost:3000/&response_type=token&scope=user:read:email">Accedi con Twitch</a>
          <br/>
          <button className="AddButtonTest" onClick={this.addToList.bind(this)} >Aggiungiti alla lista</button>
          <br/>
          <input type="text" id="txtUser" placeholder="inserire username per test" onChange={this.onChange.bind(this)}></input>
          <br/>
          <button className="StampaButton" onClick={this.stampaDB.bind(this)} >Stampa DB</button>
          <br/>
          <button className="UpdateButtonTest" onClick={this.updateDB.bind(this)} >Update DB</button>
          <br/>
          <button className="DeleteButtonTest" onClick={this.deleteDB.bind(this)} >Rimmuoviti dalla lista</button>
          <br/>
          <button className="ShowButtonTest" onClick={this.showDB.bind(this)} >Show streamer list</button>
        </div>
        <Whisperers sendMessage={this.sendMessage.bind(this)}/>
        <TopBar info_user={this.info_user} addToList={this.addToList.bind(this)} deleteDB={this.deleteDB.bind(this)} userInList={this.state.lista[this.info_user.login]}/>
        <div className="listaStreaming">
          {
            this.getList()
          }
        </div>
      </div>
    );
  }
}

export default Home;
