import React, { Component } from 'react';

class Whisperers extends Component {

  /* Aggiunge lista al componente
   *
   */
  addChat(listId) {
    let ul = document.createElement("UL");
    ul.id = "lista_discussione_" + listId;
    ul.className = "whisp";
    document.getElementById('discussione').appendChild(ul);
  }

  /* Aggiunge messaggio alla lista "listId"
   *
   */
  addMessage(messaggio, listId) {
    let li = document.createElement("LI");
    li.innerHTML = messaggio;
    document.getElementById("lista_discussione_" + listId).appendChild(li);
  }

  /* Aggiunge messaggio alla lista "listId"
   *
   */
  addElementMessage(elements, listId) {
    let li = document.createElement("LI");
    elements.forEach((el) => li.appendChild(el));
    document.getElementById("lista_discussione_" + listId).appendChild(li);
  }


  /* Nasconde lista "listId"
   *
   */
  hideList(listId) {
    let whispAperta = document.getElementById("lista_discussione_" + listId);
    whispAperta.className = "whisp";
  }

  /* Mostra lista "listId"
   *
   */
  showList(listId) {
    let whispAperta = document.querySelector(".selectedWhisp");
    if(whispAperta)
      whispAperta.className = "whisp";
    let newWhisp = document.getElementById("lista_discussione_" + listId);
    if(newWhisp)
    {
      newWhisp.className = "selectedWhisp";
    } else {
      this.addChat(listId);
      (document.getElementById("lista_discussione_" + listId)).className = "selectedWhisp";
    }
    this.props.msgClick();
  }

  /* Nasconde lista lista attualmente aperta
   *
   */
  hideShowedList() {
    let whispAperta = document.querySelector(".selectedWhisp");
    if(whispAperta)
      whispAperta.className = "whisp";
  }

  render() {
    return (
      <div className="Whisperers">
        <div id="bottoniWhisperers">

        </div>
        <div id="discussione">

        </div>
        Messaggi:
        <input type="text" id="txtMessage" placeholder="Inserisci il messaggio"></input><br/>
        Pres:
        <button className="sendMessage" onClick={this.props.sendMessage}>Manda messaggio</button>
      </div>
    )
  }
}

export default Whisperers;
