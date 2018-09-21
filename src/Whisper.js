import React, { Component } from 'react';

class Whisper extends Component {

  render() {
    return (
      <div className="Whisper">
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

export default Whisper;
