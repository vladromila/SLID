import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Link } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import reduxThunk from 'redux-thunk';
import PrivateRoute from './config/PrivateRoute';
import firebase from 'firebase';
import DashBoard from './components/DashBoard/DashBoard';
import LoginPage from './components/Authentication/LoginPage';
import RegisterPage from './components/Authentication/RegisterPage';
import AlbumEdit from './components/AlbumEdit/AlbumEdit';
import logo from './slid-logo.png';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: 'notVerified',
      albums: []
    }
  }
  checUser(user) {
    if (user) {
      this.setState({ user });
      firebase.database().ref(`/developers/${firebase.auth().currentUser.uid}/albums`)
        .on('value', snapshot => {
          let albums = [];
          if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach(key => {
              albums.push({ ...snapshot.val()[key], uid: key })
            })
          }
          this.setState({ albums })
        })
    }
    else
      this.setState({ user: null })
  }

  componentWillMount() {
    firebase.initializeApp(
      {
        apiKey: "AIzaSyBIluGjGo5SubXbV5AeIpt7cUKaqQwnPK4",
        authDomain: "slid-24099.firebaseapp.com",
        databaseURL: "https://slid-24099.firebaseio.com",
        projectId: "slid-24099",
        storageBucket: "slid-24099.appspot.com",
        messagingSenderId: "336177522017"
      }
    )
    firebase.auth().onAuthStateChanged(user => this.checUser(user))
  }
  render() {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(reduxThunk))}>
        <BrowserRouter>
          <React.Fragment>
            <React.Fragment>
              <nav>
                <div className="nav-wrapper teal lighten-2">
                  <Link className="brand-logo" to="/"><img src={logo} style={{height:"60px"}} /></Link>
                  <ul className="right hide-on-med-and-down">
                    {this.state.user === 'notVerified' ? null : this.state.user ?
                      <React.Fragment>
                        <li><a
                          onClick={() => {
                            firebase.auth().signOut();
                          }}
                        >Logout</a></li>
                      </React.Fragment>
                      :
                      <React.Fragment>
                        <li><Link to="/register"><i className="material-icons left">person_add</i>Regsiter</Link></li>
                        <li><Link to="/login"><i className="material-icons left">how_to_reg</i>Login</Link></li>
                      </React.Fragment>}
                  </ul>
                </div>
              </nav>
              <ul className="sidenav" id="mobile-demo">
                {this.state.user === 'notVerified' ? null : this.state.user ?
                  <React.Fragment>
                    <li><a
                      onClick={() => {
                        firebase.auth().signOut();
                      }}
                    >Logout</a></li>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <li><Link to="/register"><i className="material-icons left">person_add</i>Regsiter</Link></li>
                    <li><Link to="/login"><i className="material-icons left">how_to_reg</i>Login</Link></li>
                  </React.Fragment>}
              </ul>
            </React.Fragment>
            <Switch>
              <PrivateRoute
                path="/login"
                user={this.state.user}
                component={LoginPage}
                albums={this.state.albums}
                type="auth"
              />
              <PrivateRoute
                path="/register"
                user={this.state.user}
                component={RegisterPage}
                albums={this.state.albums}
                type="auth"
              />
              <PrivateRoute
                path="/album/:handle"
                user={this.state.user}
                component={AlbumEdit}
                albums={this.state.albums}
                type="dashboard"
              />
              <PrivateRoute
                path="/"
                user={this.state.user}
                component={DashBoard}
                albums={this.state.albums}
                type="dashboard"
              />
            </Switch>
          </React.Fragment>
        </BrowserRouter>
      </Provider >
    );
  }
}

export default App;
