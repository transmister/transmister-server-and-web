import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Router, Route, Switch } from 'react-router';
import history from './history';

import Navigation from './components/Navigation';

import Conversations from './routes/Conversations';
import Billboard from './routes/Billboard';
import Contacts from './routes/Contacts';
import Profile from './routes/Profile';
import Settings from './routes/Settings';

import { initializeIcons } from '@uifabric/icons';
initializeIcons();

ReactDOM.render(
  <Router history={history}>
    <Navigation />
    <Switch>
      <Route path="/conversations" component={Conversations} />
      <Route path="/billboard" component={Billboard} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
    </Switch>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
