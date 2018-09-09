import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom'
import Home from './Home.js'
import ViewsPage from './ViewsPage.js'

class App extends Component {

  render() {
    this.markers = []
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" exact component={Home}/>
          <Route component={ViewsPage}/>
        </Switch>
      </div>
    );
  }
}

export default App;
