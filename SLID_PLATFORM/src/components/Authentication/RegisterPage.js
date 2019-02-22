import React from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom';

class RegisterPage extends React.Component {
    render() {
        return (
            <div class="container">
                <h1>Register</h1>
                <div class="row">
                    <form class="col s12">
                        <div class="row">
                            <div class="input-field col s12">
                                <i class="material-icons prefix">email</i>
                                <input id="email" type="email" class="validate" />
                                <label for="email">Email</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12">
                                <i class="material-icons prefix">vpn_key</i>
                                <input id="password" type="password" class="validate" />
                                <label for="password">Password</label>
                                <span class="helper-text" data-error="wrong" data-success="right">Set a password with more than 8 characters including <strong>uppercase letters (A-Z)</strong>, <strong>lowercase letters (a-z)</strong> and <strong>numbers (0-9)</strong>.</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12">
                                <i class="material-icons prefix">vpn_key</i>
                                <input id="password" type="password" class="validate" />
                                <label for="password">Confrim Password</label>
                            </div>
                        </div>
                        <div class="row">
                            <button class="btn waves-effect waves-light" type="submit" name="action">Register
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
                    </form>
                </div>
            </div>
        )
    }
}

export default RegisterPage;