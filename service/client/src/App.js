import React, {Component} from 'react';
import { Route } from 'react-router-dom';
import RegistStepper from './regist/stepper';
import Home from 'home';



class App extends Component{
  render() {
    return (
      <div>
        <Route exact path="/" component={Home}/>
        <Route path="/regist" component={RegistStepper}/>
      </div>
    )
  }
}

export default App;

