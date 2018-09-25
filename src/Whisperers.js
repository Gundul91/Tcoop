import React, { Component } from 'react';

class Whisperers extends Component {

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
        <input type="text" id="txtMessage" placeholder="Inserisci il messaggio"></input><br/>
        Pres:
        <button className="sendMessage" onClick={this.props.sendMessage}>Manda messaggio</button>
      </div>
    )
  }
}

export default Whisperers;
