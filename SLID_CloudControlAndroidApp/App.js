import React from 'react';
import Main from './src/components/main';
import firebase from 'firebase';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk'
import reducers from './src/reducers';

export default class App extends React.Component {
  componentWillMount() {
    firebase.initializeApp({
      apiKey: "AIzaSyBZwaUfj4RaI9kVGXWgHUz23jroUGd-mn0",
      authDomain: "slidalbums.firebaseapp.com",
      databaseURL: "https://slidalbums.firebaseio.com",
      projectId: "slidalbums",
      storageBucket: "slidalbums.appspot.com",
      messagingSenderId: "167009021016"
    });
  }
  render() {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(reduxThunk))}>
        <Main />
      </Provider>
    );
  }
}