import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom'
import Home from './Home.js'
import ViewsPage from './ViewsPage.js'

class App extends Component {

  render() {
    this.markers = []
    return (
      <div className="App">
        <Route exact path="/" component={Home}/>
        <Route exact path="/*" component={ViewsPage}/>
      </div>
    );
  }
}

export default App;
