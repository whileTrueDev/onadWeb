import React from 'react';
import { Route } from 'react-router-dom';
import RegistStepper from './components/regist/stepper';
import Main from './components/Main';
/* App component do routing all the other components */

const App = () => (
  <div>
    <Route exact path="/" component={Main} />
    <Route path="/regist" component={RegistStepper} />
  </div>
);

export default App;
