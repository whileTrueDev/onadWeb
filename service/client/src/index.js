import Root from './root';
import * as serviceWorker from './serviceWorker';

import React from 'react';
import ReactDOM from 'react-dom';
// index가 첫 시작점.
// rendering을 ReactFullPage으로 시작.


ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
