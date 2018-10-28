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
