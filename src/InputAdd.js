import React, { Component } from 'react';

class InputAdd extends Component {

  changePresenti(e) {
    console.log(e.target.value);
    document.querySelector('.necessari').value=parseInt(e.target.value) + 1;
    let presenti = document.querySelectorAll('.necessari > option');
    presenti.forEach((element, index) => {
      if(index < e.target.value - 1)
      {
        element.disabled = true;
      } else {
        element.disabled = false;
      }
    })
  }

  render() {
    return (
      <div className="InputAdd">
        Title:
        <input type="text" id="txtTitle" placeholder="inserire titolo"></input><br/>
        Pres:
        <select className="presenti" onChange={this.changePresenti}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        Necess:
        <select className="necessari">
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select><br/>
        <button className="AddInfoButton" onClick={this.props.addToBD}>Aggiunti alla lista</button>
      </div>
    )
  }
}

export default InputAdd;
