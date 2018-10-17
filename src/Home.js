import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import queryString from 'query-string';
import Streaming from './Streaming.js'
import TopBar from './TopBar.js'
import InputAdd from './InputAdd.js'
import Whisperers from './Whisperers.js'
import { withRouter } from 'react-router-dom';
import ViewsPage from './ViewsPage.js'


const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

class Home extends Component {
  state = {
    lista: {}
  }

  info_user = {}

  // PRENDE I DATI DELL'UTENTE E SE E' LIVE MOSTRA LA SCHERMATA PER L'AGGIUNTA ALLA LISTA DI RICERCA COOP
  addToList() {
    // X TEST
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
      // Può aggiungersi alla lista solo se è in live
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
          console.log("è live su " + game_info.data[0].name)
          this.str_info = str_info;
          this.game_info = game_info;
          // mostra la schermata di aggiunta al db
          document.querySelector(".InputAdd").style.display = "block";
        }.bind(this))
      }
    }.bind(this))
  }

  /* AGGIUNGE L'USER AL DB
   * Viene eseguito quando l'utente clicca di aggiungersi al DB nella finestra InputAdd
   */
  addToBD() {
    if(document.getElementById('txtTitle').value !== '')
      this.str_info.data[0].title = document.getElementById('txtTitle').value;

    this.db.collection("user").doc(this.info_user.login).set({
      img_url: this.str_info.data[0].thumbnail_url,
      game_name: this.game_info.data[0].name,
      language: this.str_info.data[0].language,
      user_image: this.info_user.profile_image_url,
      stream_title: this.str_info.data[0].title,
      presenti: document.querySelector(".presenti").value,
      necessari: document.querySelector(".necessari").value,
      coop: []
    })
    .then(function(docRef) {
      document.querySelector(".AddButton").style.display = "none";
      document.querySelector(".DeleteButton").style.display = "inline-block";
      document.querySelector(".InputAdd").style.display = "none";
      this.db.collection("chat").doc(this.info_user.display_name).collection("messaggi_da_leggere").doc("lista").set({});
    }.bind(this))
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  // RIMMUOVE STREAMER DALLA LISTA DI RICERCA NEL DB
  deleteDB() {
    this.db.collection('user').doc(this.info_user.login).delete();
    document.querySelector(".AddButton").style.display = "inline-block";
    document.querySelector(".DeleteButton").style.display = "none";
  }

  // RESTITUISCE LA LISTA DI ELEMENTI <Streaming> CONTENENTI LE INFO DI CHI CERCA COOP
  getList() {
    console.log("getList()");
    let objs = [];
    for (var key in this.state.lista) {
      let item = this.state.lista[key];
      // Se hanno già raggiunto il numero di necessari non vengono mostrati
      if(item.presenti < item.necessari)
        objs.push(<Streaming
          game_name={item.game_name}
          img_url={item.img_url}
          language={item.language}
          stream_title={item.stream_title}
          user_image={item.user_image}
          streamer_name={key}
          presenti={item.presenti}
          necessari={item.necessari}
          mostraAnteprima={this.mostraAnteprima.bind(this)}
        />);
    }
    return objs;
  }

  // INIZIALIZZO IL COLLEGAMENTO CON IL DB DI FIREBASE
  componentWillMount() {
    // Se firebase è già inizializzato non ripete l'inizializzazione
    if (!firebase.apps.length) {
      // Settings per firebase
      firebase.initializeApp({
        apiKey: "AIzaSyCaQYYVlMGO7ha0g31l6iYPLxj8pNb9c0o",
        authDomain: "tcoop-6668f.firebaseapp.com",
        databaseURL: "https://tcoop-6668f.firebaseio.com",
        projectId: "tcoop-6668f",
        storageBucket: "tcoop-6668f.appspot.com",
        messagingSenderId: "429000425300"
      });
    }

    // Initialize Cloud Firestore through Firebase
    this.db = firebase.firestore();

    // Disable deprecated features
    this.db.settings({
      timestampsInSnapshots: true
    });

    this.showDB();
  }

  // IN CASO DI ACCESSO CON TWITCH PRENDO I DATI DELL'UTENTE
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

    this.contatori = {}; // Per MESSAGGI

  }

  // MOSTRA LA SCHERMATA DELL'ANTEPRIMA DELLA COOP SELEZIONATA
  mostraAnteprima(el) {
    // Scorre fino all'elemento Streaming che nlle classi ha il nome della coop
    while(!el.target.classList.contains("Streaming")){
      el.target = el.target.parentElement;
    }

    let anteprima = document.querySelector(".anteprima");

    // la seconda classe di el.target è il nome della coop
    this.selectedStreaming = el.target.classList.item(1);
    this.db.collection("user").doc(this.selectedStreaming).get().then((querySnapshot) => {
      // Se ci sono elementi nella coop li aggiungo all'anteprima
      let path = querySnapshot.data().coop ? this.selectedStreaming + "/" + querySnapshot.data().coop.join("/") : this.selectedStreaming;
      let ref = ReactDOM.render(<ViewsPage path={path}/>, anteprima);
      anteprima.style.display = "block";
      document.querySelector(".cover").style.display = "block";
      document.querySelector(".viewsPage").style.height = "100%";
      document.querySelector(".videosContainer").style.height = "100%";
      document.querySelector(".videosContainer").style.width = "100%";
      document.querySelector(".chats").style.display = "none";
      document.querySelector(".closeButton").style.display = "none";
      document.querySelector(".partecipa").style.display = "block";

      //Scateno il resize per far calcolare le proporzioni delle views
      window.dispatchEvent(new Event('resize'));

      document.addEventListener("click", function handler(event) {

        // Se clicca sull'elemento / chat / bottone partecipa non succede nulla
        if (event.target.closest(".anteprima") || event.target.closest(".partecipa") || event.target.closest(".Whisperers")) return;

        // Se clicca fuori rimuovo l'anteprima
        anteprima.style.display = "none";
        document.querySelector(".cover").style.display = "none";
        document.querySelector(".partecipa").style.display = "none";
        // Rimuovo il listener per il resize della finestra
        ref.removeListener();
        ReactDOM.unmountComponentAtNode(anteprima);
        // Rimuovo questo click event handler
        event.currentTarget.removeEventListener(event.type, handler);
      });
    });

  }

  // LISTENER SUL CAMBIO DELL'ELEMENTO "login + _last_chat" NEL DB
  addLastchatListener() {
    console.log("login_listener: " + this.info_user.display_name);
    this.db.collection("chat").doc(this.info_user.display_name).collection("messaggi_da_leggere").doc("lista")
    .onSnapshot(function(doc) {
      let da_leggere = doc.data();
      console.log("cambiato: ", da_leggere);
      // us sono le key che sono i nick mentre da_leggere e l'array di messaggi_da_leggere
      for(let us in da_leggere)
      {
        // Se la lista non esiste la crea e la riempie
        if(!document.getElementById("lista_discussione_" + us))
        {
          let button = document.createElement("BUTTON");
          let dbRef = this.db.collection("chat").doc(this.info_user.display_name).collection("messaggi_da_leggere").doc("lista");
          button.innerHTML = us;
          button.style.backgroundColor = "red";
          button.onclick = function() {
            this.style.backgroundColor = "";
            // Rimmuove us dalla lista dei messaggi da leggere
            dbRef.update({
              [us]: firebase.firestore.FieldValue.delete()
            });
            // Cambia le classi alle liste per visualizzare qulla selezionata
            let whispAperta = document.querySelector(".selectedWhisp");
            if(whispAperta)
              whispAperta.className = "whisp";
            document.getElementById("lista_discussione_" + us).className = "selectedWhisp";
          };
          document.getElementById("bottoniWhisperers").appendChild(button);

          let ul = document.createElement("UL");
          ul.id = "lista_discussione_" + us;
          ul.className = "whisp";
          let stringa = this.info_user.display_name > us ? "chat_" + us + "_" + this.info_user.display_name : "chat_" + this.info_user.display_name + "_" + us;
          this.db.collection("chat").doc("chat_con_messaggi").collection(stringa).get().then((querySnapshot) => {
            // Scorre i messaggi del DB e li aggiunge alla lista
            querySnapshot.forEach((doc) => {
                let msg = doc.data();
                let li = document.createElement("LI");
                li.innerHTML = msg.users + ": " + msg.mess;
                ul.appendChild(li);
            });
            // Se c'è una richiesta di coop viene aggiunta alla chat
            if(da_leggere[us].richiesta) {
              let li = document.createElement("LI");
              let btnAcc = document.createElement("button");
              btnAcc.className = "accetta";
              btnAcc.innerHTML = "Accetta";
              // Se viene accettata la richiesta aggiunge il richiedenta alla lista dei cooperanti nel DB
              btnAcc.onclick = function (e) {
                this.db.collection("user").doc(this.info_user.login).get().then((querySnapshot) => {
                  let coop = (querySnapshot.data()).coop || [];
                  let presenti = parseInt((querySnapshot.data()).presenti) +  1;
                  coop.push(us);
                  this.db.collection("user").doc(this.info_user.login).update({
                    presenti: presenti.toString(),
                    coop: coop
                  })
                  .then(function(docRef) {
                    e.path[2].removeChild(e.path[1]);
                    // Cancellare richiesta da db e lista
                  }.bind(this))
                  .catch(function(error) {
                    console.error("Error adding document: ", error);
                  });
                });
              }.bind(this);
              let btnRif = document.createElement("button");
              btnRif.className = "rifiuta";
              btnRif.innerHTML = "Rifiuta";
              li.appendChild(btnAcc);
              li.appendChild(btnRif);
              ul.appendChild(li);
            }
          });
          document.getElementById('discussione').appendChild(ul);
        } else {
          // Se la lista esiste aggiunge il messaggio ad essa
          let li = document.createElement("LI");
          li.innerHTML = (da_leggere[us].richiesta) ? 'Vuole partecipare alla coop </br> <button class="accetta">Accetta</button> <button class="rifiuta">Rifiuta</button>' : us + ": " + da_leggere[us].messaggio;
          document.getElementById("lista_discussione_" + us).appendChild(li);
        }
      }
    }.bind(this));
  }

  /* MANDA RICHIESTA DI PARTECIPAZIONE ALLA COOP
   * Aggiunge al db di this.selectedStreaming una richiesta di partecipazione che gli comparirà in chat
   */
  partecipa() {
    this.db.collection("chat").doc(this.selectedStreaming).collection("messaggi_da_leggere").doc("lista").update({
      [this.info_user.display_name]: {richiesta: true}
    });
  }

  /* ESEGUITA ALLA APERTURA DI UNA CHAT PRIVATA
   * Cancella dal db i messaggi da leggere della chat che viene aperta
   */
  msgClick() {
    let whispAperta = document.querySelector(".selectedWhisp");
    if(whispAperta) {
      // whispAperta.id.substring(18) prende solo la stringa dopo i primi 18 caratteri che contiene il nome dello streamer
      this.db.collection("chat").doc(this.info_user.display_name).collection("messaggi_da_leggere").doc("lista").update({
        [whispAperta.id.substring(18)]: firebase.firestore.FieldValue.delete()
      });
    }
  }

  /* WHISPER */

  // INVIO MESSAGGIO PRIVATO
  sendMessage() {
    let utente = document.getElementById('txtRicevente').value;
    let messaggio = document.getElementById('txtMessage').value;

    // Crea una stringa con i nick ordinati che indicherà la chat nel DB
    let stringa = this.info_user.display_name > utente ? "chat_" + utente + "_" + this.info_user.display_name : "chat_" + this.info_user.display_name + "_" + utente;

    // Aggiunge messaggio alla lista dei messaggi da leggere del ricevente
    this.db.collection("chat").doc(utente).collection("messaggi_da_leggere").doc("lista").update({
      [this.info_user.display_name]: {messaggio: messaggio,
      randoKey: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}
    });

    // Aggiungo al DB il messaggio
    if(this.contatori[utente]){
        // Calcolo il valore da dare al contatore di questa chat che verrà usato come key del messaggio
        this.contatori[utente] = (this.contatori[utente][this.contatori[utente].length-1] === "9") ? (this.contatori[utente] + 1) : (parseInt(this.contatori[utente]) + 1).toString();
        this.aggiungi();
    } else {
      this.contatori[utente] = 0;
      // Trovo l'ultima key dela chat e da questa calcolo la successiva
      this.db.collection("chat").doc("chat_con_messaggi").collection(stringa).get().then((querySnapshot) => {
        let lastDocID = querySnapshot.docs[querySnapshot.docs.length - 1].id;
        this.contatori[utente] = (lastDocID[lastDocID.length-1] === "9") ? lastDocID + 1 : parseInt(lastDocID) + 1;
        this.contatori[utente] = this.contatori[utente].toString();
        this.aggiungi();
      });
    }
  }

  // AGGIUNGE IL MESSAGGIO PRIVATO ALLA DISCUSSIONE NEL DB
  aggiungi() {
    let utente = document.getElementById('txtRicevente').value;
    let messaggio = document.getElementById('txtMessage').value;

    let stringa = this.info_user.display_name > utente ? "chat_" + utente + "_" + this.info_user.display_name : "chat_" + this.info_user.display_name + "_" + utente;
    this.db.collection("chat").doc("chat_con_messaggi").collection(stringa).doc(this.contatori[utente]).set({
      mess: messaggio,
      users: this.info_user.display_name
    })
    .then(() => {
      // Aggiunge il messaggio alla lista nella finestra
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

  // ----- TEST -----

  // X TEST: Richiamata dal click sul bottone "Stampa DB" stampa il contenuto del DB
  stampaDB() {
    this.db.collection("user").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, doc.data());
        });
    });
  }

  // X TEST: EVENTO CAMBIO TESTO NEL TEXTBOX DI TEST
  onChange() {
    this.info_user.display_name = document.getElementById('txtUser').value;
    this.info_user.login = this.info_user.display_name;
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

  // X TEST: RICHIEDE LA LISTA AL DB E LA METTE IN this.state.lista
  showDB() {
    let obj = {};
    this.db.collection("user").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          obj[doc.id] = doc.data();
      });
      this.setState({lista: obj});
    })
  }

  // -----------

  render() {
    this.access_info = queryString.parse(this.props.location.hash);
    return (
      <div className="Home">
        <div className="anteprima"></div>
        <div className="cover"></div>
        <button className="partecipa" onClick={this.partecipa.bind(this)}>PARTECIPA!</button>
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
          <button className="DeleteButtonTest" onClick={this.deleteDB.bind(this)} >Rimmuoviti dalla lista</button>
          <br/>
          <button className="ShowButtonTest" onClick={this.showDB.bind(this)} >Show streamer list</button>
        </div>
        <Whisperers sendMessage={this.sendMessage.bind(this)} msgClick={this.msgClick.bind(this)}/>
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

export default withRouter(Home);
