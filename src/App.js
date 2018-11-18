import React, { Component } from "react";
import PersonList from "./components/PersonList";

class App extends Component {
  render() {
    return (
      <div className="container">
        <PersonList />
      </div>
    );
  }
}

export default App;
