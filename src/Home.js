import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import queryString from 'query-string';
import Streaming from './Streaming.js'
import TopBar from './TopBar.js'
import InputAdd from './InputAdd.js'
import Whisperers from './Whisperers.js'
import { withRouter } from 'react-router-dom'
import ViewsPage from './ViewsPage.js'
import { initDB, requireFB, msgClick, sendMessage, aggiungi, toCoop, addLastchatListener, deleteDB, msgRichiestaCoop } from './funzioniComuni.js'


class Home extends Component {
  state = {
    temp: true,
    lista: {},
    info_user: {},
    giochi: [],
    DbUserInfo: {}
  }

  // PRENDE I DATI DELL'UTENTE E SE E' LIVE MOSTRA LA SCHERMATA PER L'AGGIUNTA ALLA LISTA DI RICERCA COOP
  addToList() {
    // X TEST
    let testValue = document.getElementById('txtUser').value;
    if(testValue)
      this.state.info_user.login = testValue

    // Richiedo info sullo streaming di chi ha fatto l'accesso nel sito
    let url = "https://api.twitch.tv/helix/streams?user_login=" + this.state.info_user.login;
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
  addToDB() {
    if(document.getElementById('txtTitle').value !== '')
      this.str_info.data[0].title = document.getElementById('txtTitle').value;

    this.db.collection("user").doc(this.state.info_user.login).set({
      info: {
        img_url: this.str_info.data[0].thumbnail_url,
        game_name: this.game_info.data[0].name,
        language: this.str_info.data[0].language,
        user_image: this.state.info_user.profile_image_url,
        stream_title: this.str_info.data[0].title,
        presenti: document.querySelector(".presenti").value,
        necessari: document.querySelector(".necessari").value
      }
    }, {merge: true})
    .then(function(docRef) {
      document.querySelector(".AddButton").style.display = "none";
      document.querySelector(".DeleteButton").style.display = "inline-block";
      document.querySelector(".InputAdd").style.display = "none";
      this.db.collection("chat").doc(this.state.info_user.display_name).collection("messaggi_da_leggere").doc("lista").set({});
      // this.setCoop(); DOVREBBE POTERSI TOGLIERE NEL PROGETTO FINALE
      this.setCoop();
    }.bind(this))
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  // IMPOSTA LA BARRA PER CHI NON è IN LISTA
  removeList() {
    document.querySelector(".AddButton").style.display = "inline-block";
    document.querySelector(".DeleteButton").style.display = "none";
    deleteDB.bind(this)();
  }

  // RESTITUISCE LA LISTA DI ELEMENTI <Streaming> CONTENENTI LE INFO DI CHI CERCA COOP
  getList() {
    console.log("getList()");
    let objs = [];
    for (var key in this.state.lista) {
      let item = this.state.lista[key];
      // Se hanno già raggiunto il numero di necessari non vengono mostrati
      if(item.presenti < item.necessari && (this.state.filtro === undefined || this.state.filtro === "" || this.state.filtro === item.game_name))
      {
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
        if(this.state.giochi.indexOf(item.game_name) === -1)
          this.state.giochi.push(item.game_name)
      }
    }
    // RIEMPIO LA LISTA DEL FILTRO DI GIOCHI
    if(document.querySelector(".giochi") && this.state.giochi.length > 1)
    {
      this.riempi_giochi();
    }
    return objs;
  }

  // RIEMPIE LA LISTA DI FILTRI CON I NOMI DEI GIOCHI DEI VARI STREAMING
  riempi_giochi() {
    let divGiochi = document.querySelector(".giochi");
    divGiochi.innerHTML = "";
    let opt = document.createElement("option");
    // Aggiungo un primo elemento non selezionabile che farà da placeholder
    opt.disabled = "disabled";
    opt.selected = "selected";
    opt.innerHTML = "Filters";
    opt.style.display = "none";
    divGiochi.appendChild(opt);
    opt = document.createElement("option");
    // Aggiungo un elemento che farà da "no filtri"
    opt.value = "";
    opt.innerHTML = "No filter";
    divGiochi.appendChild(opt);
    this.state.giochi.sort();
    // Per ogni gioco aggiungo una opzione allelemento select
    for(let key in this.state.giochi) {
      opt = document.createElement("option");
      opt.value = this.state.giochi[key];
      opt.innerHTML = this.state.giochi[key];
      divGiochi.appendChild(opt);
    }
    this.state.filtro = "";
  }

  // INIZIALIZZO IL COLLEGAMENTO CON IL DB DI this.firebase
  componentWillMount() {
    this.whispRef = React.createRef();
    requireFB.bind(this)();
    initDB.bind(this)();

    this.showDB();

    this.access_info = queryString.parse(this.props.location.hash);

    // Rimmuovo l'hash dall'url
    this.props.history.push('/');
    /* Se ci sono dati nella cash usa quelli, altrimenti,
     * se è stato fatto l'accesso con twitch, richiedo i dati dell'utente
     */
    if(localStorage.getItem("info_user")){
      this.state.info_user = JSON.parse(localStorage.getItem("info_user"));
      // Utile solo con i TEST
      if(localStorage.getItem("display_name"))
      {
        this.state.info_user.display_name = localStorage.getItem("display_name");
      }
      this.listenDBChange();
    } else if(this.access_info.access_token !== undefined)
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
        this.state.info_user = user.data[0];
        addLastchatListener.bind(this)();
        // Non si possono salvare oggetti in localStorage, è necessario convertirli in stringa
        localStorage.setItem("info_user", JSON.stringify(this.state.info_user));
        // Renderizzo per i casi in cui la promis si concluda troppo tardi
        this.setState({});
        this.setCoop();
        this.listenDBChange();
      }.bind(this)).catch(function(err) { // .bind(this) per poterlo utilizzare nella funzione
        console.log('e', err);
      });
    }
  }

  /* AGGIUNGE BOTTONE PER VISUALIZZARE LA PROPRIA COOP
   * Aggiunge un listener sul "user".nickUtente e quando ci sono cambiamenti controlla se è in una coop e nel caso
   * mostra il bottone per passare alla visuale della coop
   */
  listenDBChange() {
    // Controllare se serve poi ancora quando non ci sarà più il cambio di nick nel test
    if(this.unsubscribeUser)
      this.unsubscribeUser();
    // assegna a var unsubscribeUser la funzione per rimmuovere il listener
    this.unsubscribeUser = this.db.collection("user").doc(this.state.info_user.display_name)
    .onSnapshot(function(doc) {
      console.log("tutto", (doc.data()), document.querySelector(".coop"));
      if((doc.data()) && (doc.data()).coop)
      {
        if((doc.data()).coop.nome_coop) {
          if(!document.querySelector(".coop")) {
            let btnCoop = document.createElement("button");
            btnCoop.className = "coop";
            btnCoop.innerHTML = "COOP";
            btnCoop.onclick = toCoop.bind(this);
            document.querySelector('.TopBar').appendChild(btnCoop);
          }
          if((doc.data()).coop.nome_coop !== this.state.info_user.display_name && (doc.data()).coop.richiesta_coop === true) {
            alert("Sei stato accettato!");
            this.db.collection("user").doc(this.state.info_user.display_name).update({"coop.richiesta_coop": false});
          }
        }
      }
    }.bind(this));
  }

  setCoop() {

    this.db.collection("user").doc(this.state.info_user.login).get().then((doc) => {
      console.log("!doc.data()",!doc.data());
      if(doc.data() && !(doc.data()).coop)
      {
        this.db.collection("user").doc(this.state.info_user.login).set({
          coop: {
            list: [],
            richiesta_coop: false,
            nome_coop: this.state.info_user.display_name
          }
        },{merge: true})
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
      }
    });
  }

  // IN CASO DI ACCESSO CON TWITCH PRENDO I DATI DELL'UTENTE
  componentDidMount() {
    this.setState({});
    this.contatori = {}; // Per MESSAGGI
    // SOSTITUIRE CONTATORI CON new Date().valueOf(); CHE RESTITUISCE UN NUMERO INTERO BASATO SUL TEMPO

    // X TEST
    document.getElementById('txtUser').value = this.state.info_user.display_name;
  }

  componentDidUpdate() {
    requireFB.bind(this)();
    this.riempi_giochi();
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
      let path = querySnapshot.data().coop.list.length > 0 ? this.selectedStreaming + "/" + querySnapshot.data().coop.list.join("/") : this.selectedStreaming;
      let ref = ReactDOM.render(<ViewsPage path={path}/>, anteprima);
      anteprima.style.display = "block";
      document.querySelector(".cover").style.display = "block";
      document.querySelector(".viewsPage").style.height = "100%";
      document.querySelector(".videosContainer").style.height = "100%";
      document.querySelector(".videosContainer").style.width = "100%";
      document.querySelector(".chats").style.display = "none";
      document.querySelector(".closeButton").style.display = "none";
      let part = document.querySelector(".partecipa");
      part.style.display = "block";
      part.disabled = false;
      part.innerHtml = "PARTECIPA!";

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

  /* MANDA RICHIESTA DI PARTECIPAZIONE ALLA COOP
   * Aggiunge al db di this.selectedStreaming una richiesta di partecipazione che gli comparirà in chat
   */
  partecipa() {
    this.db.collection("user").doc(this.state.info_user.display_name).get().then((userDB) => {
      console.log(userDB.data().coop.list.length);
      if(userDB.data().coop.nome_coop === this.state.info_user.display_name && userDB.data().coop.list.length < 1)
      {
        if(!userDB.data().coop.richiesta_coop)
        {
          this.db.collection("user").doc(this.selectedStreaming).get().then((selectedUserDB) => {
            let info = selectedUserDB.data().info;
            // Controlla che intanto non si sia raggiunto il numero di giocatori necessari
            if(info.presenti < info.necessari)
            {
              this.db.collection("chat").doc(this.selectedStreaming).collection("messaggi_da_leggere").doc("lista").update({
                [this.state.info_user.display_name]: {richiesta: true}
              });
              this.db.collection("user").doc(this.state.info_user.display_name).update({
                "coop.richiesta_coop": true
              });
            } else {
              alert("Non ci sono più posti");
            }
          });
        } else {
          alert("C'è già una richiesta in attesa");
        }
      } else {
        alert("Non puoi richiedere di partecipare se sei già in una coop");
      }
    });
  }

  // SALVA IL FILTRO SELEZIONATO E RIRENDERIZZA PER MOSTRARE SOLO GLI STREAMING FILTRATI
  gameChange(el) {
    this.setState({filtro: el.target.value});
  }

  /* EFFETTUA IL LOGOUT DAL SITO
   * Cancella i dati dalla cash e dallo state, quindi renderizza nuovamente la pagina
   */
  logout () {
    console.log("logout");
    localStorage.clear();
    this.setState({info_user: {}});
  }

  // RICHIEDE LA LISTA AL DB E LA METTE IN this.state.lista
  showDB() {
    let obj = {};
    this.db.collection("user").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if((doc.data()).info)
          obj[doc.id] = (doc.data()).info;
      });
      this.setState({lista: obj});
    })
  }

  // ----- TEST -----

  // X TEST: Richiamata dal click sul bottone "Stampa DB" stampa il contenuto del DB
  stampaDB() {
    this.db.collection("user").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.info.id, doc.info.data());
        });
    });
  }

  // X TEST: EVENTO CAMBIO TESTO NEL TEXTBOX DI TEST
  onChange() {
    console.log("onchange");
    this.state.info_user.display_name = document.getElementById('txtUser').value;
    this.state.info_user.login = this.state.info_user.display_name;
    localStorage.setItem("display_name", this.state.info_user.display_name);
    if(this.state.lista[this.state.info_user.login])
    {
      console.log("onchange SI");
      document.querySelector(".AddButton").style.display = "none";
      document.querySelector(".DeleteButton").style.display = "inline-block";

      this.listenDBChange();

    } else {
      document.querySelector(".AddButton").style.display = "inline-block";
      document.querySelector(".DeleteButton").style.display = "none";
    }

    addLastchatListener.bind(this)();
    //Non posso farlo perchè altrimenti ad ogni modifica della stringa lo aggiunge al db
    //this.setCoop();
  }

  // -----------

  render() {
    console.log("RENDERIZZA")
    return (
      <div className="Home">
        <div className="anteprima"></div>
        <div className="cover"></div>
        <button className="partecipa" onClick={this.partecipa.bind(this)}>PARTECIPA!</button>
        <InputAdd addToDB={this.addToDB.bind(this)}/>
        <div className="boxTest">
          <a href="https://id.twitch.tv/oauth2/authorize?client_id=upk8rrcojp2raiw9pd2edhi0bvhze5&redirect_uri=http://localhost:3000/&response_type=token&scope=user:read:email">Accedi con Twitch</a>
          <br/>
          <button className="AddButtonTest" onClick={this.addToList.bind(this)} >Aggiungiti alla lista</button>
          <br/>
          <input type="text" id="txtUser" placeholder="inserire username per test" onChange={this.onChange.bind(this)}></input>
          <br/>
          <button className="StampaButton" onClick={this.stampaDB.bind(this)} >Stampa DB</button>
          <br/>
          <button className="DeleteButtonTest" onClick={this.removeList.bind(this)} >Rimmuoviti dalla lista</button>
          <br/>
          <button className="ShowButtonTest" onClick={this.showDB.bind(this)} >Show streamer list</button>
        </div>
        <Whisperers ref={this.whispRef} sendMessage={sendMessage.bind(this)} msgClick={msgClick.bind(this)}/>
        <TopBar info_user={this.state.info_user} addToList={this.addToList.bind(this)} removeList={this.removeList.bind(this)}
        gameChange={this.gameChange.bind(this)} riempi_giochi={this.riempi_giochi.bind(this)} logout={this.logout.bind(this)}/>
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
