export function requireFB() {
  this.firebase = require("firebase");
  // Required for side-effects
  require("firebase/firestore");
}

export function initDB() {

  // Se this.firebase è già inizializzato non ripete l'inizializzazione
  if (!this.firebase.apps.length) {
    // Settings per this.firebase
    this.firebase.initializeApp({
      apiKey: "AIzaSyCaQYYVlMGO7ha0g31l6iYPLxj8pNb9c0o",
      authDomain: "tcoop-6668f.this.firebaseapp.com",
      databaseURL: "https://tcoop-6668f.firebaseio.com",
      projectId: "tcoop-6668f",
      storageBucket: "tcoop-6668f.appspot.com",
      messagingSenderId: "429000425300"
    });
  }

  // Initialize Cloud Firestore through this.firebase
  this.db = this.firebase.firestore();

  // Disable deprecated features
  this.db.settings({
    timestampsInSnapshots: true
  });
}

/* ESEGUITA ALLA APERTURA DI UNA CHAT PRIVATA
 * Cancella dal db i messaggi da leggere della chat che viene aperta
 */
export function msgClick() {
  let whispAperta = document.querySelector(".selectedWhisp");
  if(whispAperta) {
    // whispAperta.id.substring(18) prende solo la stringa dopo i primi 18 caratteri che contiene il nome dello streamer
    this.db.collection("chat").doc(this.state.info_user.display_name).collection("messaggi_da_leggere").doc("lista").update({
      [whispAperta.id.substring(18)]: this.firebase.firestore.FieldValue.delete()
    });
  }
}


// INVIO MESSAGGIO PRIVATO
export function sendMessage() {
  console.log("sendMessage()");
  let utente = document.getElementById('txtRicevente').value;
  let messaggio = document.getElementById('txtMessage').value;

  // Crea una stringa con i nick ordinati che indicherà la chat nel DB
  let stringa = this.state.info_user.display_name > utente ? "chat_" + utente + "_" + this.state.info_user.display_name : "chat_" + this.state.info_user.display_name + "_" + utente;

  // Aggiunge messaggio alla lista dei messaggi da leggere del ricevente
  this.db.collection("chat").doc(utente).collection("messaggi_da_leggere").doc("lista").update({
    [this.state.info_user.display_name]: {messaggio: messaggio,
    randoKey: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}
  });

  // Aggiungo al DB il messaggio
  if(this.contatori[utente]){
      // Calcolo il valore da dare al contatore di questa chat che verrà usato come key del messaggio
      this.contatori[utente] = (this.contatori[utente][this.contatori[utente].length-1] === "9") ? (this.contatori[utente] + 1) : (parseInt(this.contatori[utente]) + 1).toString();
      aggiungi.bind(this)();
  } else {
    this.contatori[utente] = 0;
    // Trovo l'ultima key dela chat e da questa calcolo la successiva
    this.db.collection("chat").doc("chat_con_messaggi").collection(stringa).get().then((querySnapshot) => {
      let lastDocID = (querySnapshot.docs.length > 0) ? querySnapshot.docs[querySnapshot.docs.length - 1].id : -1;
      this.contatori[utente] = (lastDocID[lastDocID.length-1] === "9") ? lastDocID + 1 : parseInt(lastDocID) + 1;
      this.contatori[utente] = this.contatori[utente].toString();
      aggiungi.bind(this)();
    });
  }
}

// AGGIUNGE IL MESSAGGIO PRIVATO ALLA DISCUSSIONE NEL DB
export function aggiungi() {
  let utente = document.getElementById('txtRicevente').value;
  let messaggio = document.getElementById('txtMessage').value;

  let stringa = this.state.info_user.display_name > utente ? "chat_" + utente + "_" + this.state.info_user.display_name : "chat_" + this.state.info_user.display_name + "_" + utente;
  this.db.collection("chat").doc("chat_con_messaggi").collection(stringa).doc(this.contatori[utente]).set({
    mess: messaggio,
    users: this.state.info_user.display_name
  })
  .then(() => {
    // Aggiunge il messaggio alla lista nella finestra
    if(!document.getElementById("lista_discussione_" + utente))
    {
      let ul = document.createElement("UL");
      ul.id = "lista_discussione_" + utente;
      document.getElementById('discussione').appendChild(ul);
      console.log(document.getElementById('discussione'));
    }
    let li = document.createElement("LI");
    li.innerHTML = this.state.info_user.display_name + ": " + messaggio;
    document.getElementById("lista_discussione_" + utente).appendChild(li);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}

export function toCoop() {
  // Rimmuovo il listener sui cambiamenti nel DB
  this.unsubscribeUser();
  let stringa = "";
  this.db.collection("user").doc(this.state.info_user.login).get().then(function(doc){
    // Se la coop è sua prende la lista dalle sue info nel DB, altrimenti prende le info del creatore della coop
    if((doc.data()).coop.nome_coop === this.state.info_user.login)
    {
      stringa = "/" + this.state.info_user.login;
      if((doc.data()).coop.list.length > 0)
        stringa += "/" + (doc.data()).coop.list.join("/");
      this.props.history.push({pathname: stringa, state: { info_user: this.state.info_user }});
    } else {
      this.db.collection("user").doc((doc.data()).coop.nome_coop).get().then(function(doc){
        let lista = (doc.data()).coop.list;
        lista.splice(lista.indexOf(this.state.info_user.login), 1);
        console.log("index",(doc.data()).coop.list.indexOf(this.state.info_user.login),lista);
        stringa = "/" + this.state.info_user.login + "/" + (doc.data()).coop.nome_coop;
        if(lista.length > 0)
          stringa += "/" + lista.join("/");
        this.props.history.push({pathname: stringa, state: { info_user: this.state.info_user }});
      }.bind(this));
    }
  }.bind(this));
}

// RIMMUOVE STREAMER DALLA LISTA DI RICERCA NEL DB
export function deleteDB() {
  this.db.collection('user').doc(this.state.info_user.login).update({
    info: this.firebase.firestore.FieldValue.delete()
  });
}

// RIMMUOVE user DALLA LISTA DI RICERCA NEL DB
export function deleteUserDB(user) {
  this.db.collection('user').doc(user).update({
    info: this.firebase.firestore.FieldValue.delete()
  });
}

// LISTENER SUL CAMBIO DELL'ELEMENTO "login + _last_chat" NEL DB
export function addLastchatListener() {
  /*this.db.collection("user").doc(this.state.info_user.display_name).get().then((querySnapshot) => {
    this.state.DbUserInfo = ((querySnapshot.data()).info);
  });*/
  if(this.unsubscribeUserChat)
    this.unsubscribeUserChat();
  console.log("login_listener: " + this.state.info_user.display_name);
  this.unsubscribeUserChat = this.db.collection("chat").doc(this.state.info_user.display_name).collection("messaggi_da_leggere").doc("lista")
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
        let dbRef = this.db.collection("chat").doc(this.state.info_user.display_name).collection("messaggi_da_leggere").doc("lista");
        button.innerHTML = us;
        button.style.backgroundColor = "red";
        button.onclick = function(el) {
          el.target.style.backgroundColor = "";
          // Rimmuove us dalla lista dei messaggi da leggere
          dbRef.update({
            [us]: this.firebase.firestore.FieldValue.delete()
          });
          // Cambia le classi alle liste per visualizzare qulla selezionata
          let whispAperta = document.querySelector(".selectedWhisp");
          if(whispAperta)
            whispAperta.className = "whisp";
          document.getElementById("lista_discussione_" + us).className = "selectedWhisp";
        }.bind(this);
        document.getElementById("bottoniWhisperers").appendChild(button);

        let ul = document.createElement("UL");
        ul.id = "lista_discussione_" + us;
        ul.className = "whisp";
        let stringa = this.state.info_user.display_name > us ? "chat_" + us + "_" + this.state.info_user.display_name : "chat_" + this.state.info_user.display_name + "_" + us;
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
            let btnRif = document.createElement("button");
            btnRif.className = "rifiuta";
            btnRif.innerHTML = "Rifiuta";
            // Se viene accettata la richiesta aggiunge il richiedenta alla lista dei cooperanti nel DB
            btnAcc.onclick = function (e) {
              this.db.collection("user").doc(this.state.info_user.display_name).get().then((userDB) => {
                let coop = (userDB.data()).coop.list || [];
                let presenti = parseInt((userDB.data()).info.presenti) +  1;
                coop.push(us);
                this.db.collection("user").doc(this.state.info_user.display_name).update({
                  "info.presenti": presenti.toString(),
                  "coop.list": coop
                })
                .then(function(docRef) {
                  this.db.collection("user").doc(us).get().then((userRichiedenteDB) => {
                    if((userRichiedenteDB.data()).coop.list.length < 1)
                    {
                      this.db.collection("user").doc(us).update({"coop.nome_coop": this.state.info_user.display_name});
                      deleteUserDB.bind(this)(us);
                    } else {
                      // AL POSTO DI CONTROLLARE SE IL RICHIEDENTE HA TROVATO ALTRE COOP TROVARE IL MODO DI CONTROLLARE SE HA ANNULLATO LA RICHIESTA
                    }
                  });
                  if(this.props.location && this.props.location.pathname)
                  {
                    toCoop.bind(this)();
                    this.setState({});
                  }
                }.bind(this))
                .catch(function(error) {
                  console.error("Error adding document: ", error);
                });
              });
              // Rimmuove i bottoni accetta/rifiuta dalla chat
              e.path[2].removeChild(e.path[1]);
            }.bind(this);
            btnRif.onclick = function (e) {
              this.db.collection("chat").doc(us).collection("messaggi_da_leggere").doc("lista").update({
                [this.state.info_user.display_name]: {messaggio: "La richiesta è stata rifiutata",
                randoKey: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}
              })
              .then(function(docRef) {
                this.db.collection("user").doc(us).update({
                  "coop.richiesta_coop": false
                });
              }.bind(this));
              // Rimmuove i bottoni accetta/rifiuta dalla chat
              e.path[2].removeChild(e.path[1]);
            }.bind(this);
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