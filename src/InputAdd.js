import React, { Component } from 'react';

class InputAdd extends Component {

  render() {
    return (
      <div className="InputAdd">
        Title:
        <input type="text" id="txtTitle" placeholder="inserire titolo"></input><br/>
        Num:
        <input type="text" id="txtNumber" placeholder="inserire numero partecipanti"></input><br/>
        <button className="AddInfoButton" onClick={this.props.addToBD}>Aggiunti alla lista</button>
      </div>
    )
  }
}

export default InputAdd;
