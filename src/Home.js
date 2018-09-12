import React, { Component } from 'react';
import queryString from 'query-string';


const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

class Home extends Component {
  info_user = {}

  addToList() {
    // per test
    let testValue = document.getElementById('txtUser').value;
    if(testValue)
      this.info_user.login = testValue
    let url = "https://api.twitch.tv/helix/streams?user_login=" + this.info_user.login;
    fetch(url, {
      headers: {
        'Client-ID': "upk8rrcojp2raiw9pd2edhi0bvhze5"
      }
    })
    .then(function(c) {
    console.log(c)
      return c.json()
    }).then(function(j) {
      console.log(j)
      if(j.data.length === 0)
      {
        console.log("non è live")
      } else {
        fetch("https://api.twitch.tv/helix/games?id=" + j.data[0].game_id, {
          headers: {
            'Client-ID': "upk8rrcojp2raiw9pd2edhi0bvhze5"
          }
        })
        .then(function(c) {
          return c.json()
        }).then(function(k) {
          console.log(k)
          console.log("è live su " + k.data[0].name)

          // Aggiunge queste informazione al DB nella collection "user"
          this.db.collection("user").doc(this.info_user.login).set({
              img_url: k.data[0].box_art_url,
              game_name: k.data[0].name,
              language: j.data[0].language,
              user_image: j.data[0].thumbnail_url,
              stream_title: j.data[0].title
          })
          .then(function(docRef) {
              console.log("Document written with ID: ", docRef.id);
          })
          .catch(function(error) {
              console.error("Error adding document: ", error);
          });
        }.bind(this))
      }
    }.bind(this))
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

  deleteDB() {
    this.db.collection('user').doc('sodapoppin').delete();

    // Remove the 'capital' field from the document
    /*var removeCapital = cityRef.update({
      img_url: firebase.firestore.FieldValue.delete(),
      game_name: firebase.firestore.FieldValue.delete(),
      language: firebase.firestore.FieldValue.delete(),
      user_image: firebase.firestore.FieldValue.delete(),
      stream_title: firebase.firestore.FieldValue.delete(),
      name: firebase.firestore.FieldValue.delete()
    });*/
  }

  componentDidMount () {
    if(this.tmp.access_token !== undefined)
    {
      let auth = "Bearer " +  this.tmp.access_token
      fetch("https://api.twitch.tv/helix/users", {
        headers: {
          'Authorization': auth
        }
      })
      .then(function(c) {
        return c.json()
      }).then(function(j) {
        this.info_user = j.data[0];
        console.log(this.info_user)
      }.bind(this)).catch(function(err) { // .bind(this) per poterlo utilizzare nella funzione
        console.log('e', err);
      });
    }

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

  }

  render() {
    this.markers = []
    this.tmp = queryString.parse(this.props.location.hash)
    return (
      <div className="Home">
        <a href="https://id.twitch.tv/oauth2/authorize?client_id=upk8rrcojp2raiw9pd2edhi0bvhze5&redirect_uri=http://localhost:3000/&response_type=token&scope=user:read:email">Accedi con Twitch</a>
        <br/>
        <button className="AddButton" onClick={this.addToList.bind(this)} >Aggiungiti alla lista</button>
        <br/>
        <input type="text" id="txtUser" placeholder="inserire username per test" ></input>
        <br/>
        <button className="StampaButton" onClick={this.stampaDB.bind(this)} >Stampa DB</button>
        <br/>
        <button className="UpdateButton" onClick={this.updateDB.bind(this)} >Update DB</button>
        <br/>
        <button className="DeleteButton" onClick={this.deleteDB.bind(this)} >Delete DB</button>
      </div>
    );
  }
}

export default Home;
