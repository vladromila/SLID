import React from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom';

class RegisterPage extends React.Component {
    render() {
        return (
            <div class="container">
                <h1>Register</h1>
                <div class="row">
                    <div class="col s12">
                        <div class="row">
                            <div class="input-field col s12">
                                <i class="material-icons prefix">email</i>
                                <input id="email" type="email" class="validate" ref={email => this.email = email} />
                                <label for="email">Email</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12">
                                <i class="material-icons prefix">vpn_key</i>
                                <input id="password" type="password" ref={password => this.password = password} />
                                <label for="password">Password</label>
                            </div>
                        </div>
                        <div class="row">
                            <button class="btn waves-effect waves-light"
                                onClick={() => {
                                    firebase.auth().createUserWithEmailAndPassword(this.email.value, this.password.value)
                                        .catch((e) => {
                                            alert(e.message);
                                        })
                                }}
                            >Register
                    <i class="material-icons right">send</i>
                            </button>
                        </div>
                        <div className="row">
                            <Link to="/login">
                                <button className="btn waves-effect waves-light" name="action">Login
                                <i className="material-icons right">send</i>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RegisterPage;