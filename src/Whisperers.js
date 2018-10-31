import React, { Component } from 'react';

class Whisperers extends Component {

  /* Aggiunge lista al componente
   *
   */
  addChat(listId) {
    let ul = document.createElement("UL");
    ul.id = listId;
    document.getElementById('discussione').appendChild(ul);
  }

  /* Aggiunge messaggio alla lista "listId"
   *
   */
  addMessage(messaggio, listId) {
    let li = document.createElement("LI");
    li.innerHTML = messaggio;
    document.getElementById(listId).appendChild(li);
  }

  /* Aggiunge messaggio alla lista "listId"
   *
   */
  addElementMessage(elements, listId) {
    let li = document.createElement("LI");
    elements.forEach((el) => li.appendChild(el));
    document.getElementById(listId).appendChild(li);
  }


  /* Nasconde lista "listId"
   *
   */
  hideList(listId) {
    let whispAperta = document.getElementById(listId);
    whispAperta.className = "whisp";
  }

  /* Mostra lista "listId"
   *
   */
  showList(listId) {
    let whispAperta = document.getElementById(listId);
    whispAperta.className = "selectedWhisp";
  }

  render() {
    return (
      <div className="Whisperers">
        <div id="bottoniWhisperers">

        </div>
        <div id="discussione">

        </div>
        A chi mandare:
        <input type="text" id="txtRicevente" placeholder="Nick ricevente"></input><br/>
        Messaggi:
        <input type="text" id="txtMessage" placeholder="Inserisci il messaggio" onClick={this.props.msgClick}></input><br/>
        Pres:
        <button className="sendMessage" onClick={this.props.sendMessage}>Manda messaggio</button>
      </div>
    )
  }
}

export default Whisperers;
