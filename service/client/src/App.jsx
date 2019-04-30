import React from 'react';
import { Route } from 'react-router-dom';
import Main from './components/Main';
/* App component do routing all the other components
*/

const App = () => (
  <div>
    <Route exact path="/" component={Main} />
  </div>
);

export default App;
