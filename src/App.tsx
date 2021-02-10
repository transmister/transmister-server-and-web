import * as React from 'react';
import './App.css';

export default class App extends React.Component {
  render() {
    return <>
      {this.props.children}
    </>
  }
};
