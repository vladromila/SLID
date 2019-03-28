#!/usr/bin/env node
const program = require("commander");
const express = require("express");
const bodyParser = require("body-parser");
const opn = require("opn");
const firebase = require("firebase");
const fs = require("fs");
const readlineSync = require('readline-sync');

firebase.initializeApp({
    apiKey: "AIzaSyBZwaUfj4RaI9kVGXWgHUz23jroUGd-mn0",
    authDomain: "slidalbums.firebaseapp.com",
    databaseURL: "https://slidalbums.firebaseio.com",
    projectId: "slidalbums",
    storageBucket: "slidalbums.appspot.com",
    messagingSenderId: "167009021016"
})
let app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/slid_cli_web_control'));

app.get("/", (req, res, next) => {
    res.render("index.html");
})
app.get("/nextSlide", (req, res, next) => {
    firebase.database().ref(`${firebase.auth().currentUser.uid}/controls`)
        .push({ type: "nextSlide", from: "cli_web" })
        .then(() => {
            res.end();
        })
})
app.get("/previousSlide", (req, res, next) => {
    firebase.database().ref(`${firebase.auth().currentUser.uid}/controls`)
        .push({ type: "previousSlide", from: "cli_web" })
        .then(() => {
            res.end();
        })
})
app.get("/enableVoice", (req, res, next) => {
    firebase.database().ref(`${firebase.auth().currentUser.uid}/controls`)
        .push({ type: "enableVoice", from: "cli_web" })
        .then(() => {
            res.end();
        })
})

const login = () => {
    var email = readlineSync.question('Album Email: ');
    var password = readlineSync.question('Album password: ', { hideEchoBack: true });
    firebase.auth().signInWithEmailAndPassword(email.trim(), password.trim())
        .then((data) => {
            fs.writeFile(__dirname + "/userData.json", JSON.stringify({ email: email, password: password }), function (err) {
                if (err) {
                    return console.log(err);
                }
                else {
                    console.log("You have been successfully logged in!");
                }
            })
        })
        .catch((e) => {
            if (readlineSync.keyInYN(e.message + " Would you like to try again?") === true)
                login();
        })
}
const loginAndOpen = () => {
    var email = readlineSync.question('Album Email: ');
    var password = readlineSync.question('Album password: ', { hideEchoBack: true });
    firebase.auth().signInWithEmailAndPassword(email.trim(), password.trim())
        .then((data) => {
            fs.writeFile(__dirname + "/userData.json", JSON.stringify({ email: email, password: password }), function (err) {
                if (err) {
                    return console.log(err);
                }
                else {
                    app.listen(5001, () => {
                        console.log("SLID Site Control is now opened!")
                        opn("http://localhost:5001")
                    })
                }
            })
        })
        .catch((e) => {
            if (readlineSync.keyInYN(e.message + " Would you like to try again?") === true)
                loginAndOpen();
        })
}
const loginWithCommand = () => {
    var email = readlineSync.question('Album Email: ');
    var password = readlineSync.question('Album password: ', { hideEchoBack: true });
    firebase.auth().signInWithEmailAndPassword(email.trim(), password.trim())
        .then((data) => {
            fs.writeFile(__dirname + "/userData.json", JSON.stringify({ email: email, password: password }), function (err) {
                if (err) {
                    return console.log(err);
                }
                else {
                    command();
                }
            })
        })
        .catch((e) => {
            if (readlineSync.keyInYN(e.message + " Would you like to try again?") === true)
                loginWithCommand();
        })
}
let command = () => {
    let commands = ["next", "nextslide", "next slide", "prev", "previous", "previousslide", "previous slide", "voice", "voiceenable", "enablevoice", "enable voice"];
    let comm = readlineSync.question("Command: ");
    if (commands.indexOf(comm.toLowerCase().trim()) > -1)
        if (commands.indexOf(comm.toLowerCase()) <= 2) {
            firebase.database().ref(`${firebase.auth().currentUser.uid}/controls`)
                .push({ type: "nextSlide", from: "cli" })
                .then(() => {
                    command();
                })
        }
        else
            if (commands.indexOf(comm.toLowerCase()) <= 6) {
                firebase.database().ref(`${firebase.auth().currentUser.uid}/controls`)
                    .push({ type: "previousSlide", from: "cli" })
                    .then(() => {
                        command();
                    })
            }
            else {
                firebase.database().ref(`${firebase.auth().currentUser.uid}/controls`)
                    .push({ type: "enableVoice", from: "cli" })
                    .then(() => {
                        command();
                    })
            }
    else {
        console.log("This command does not exist");
        command();
    }
}
program
    .command("login")
    .action(() => {
        fs.readFile(__dirname + "/userData.json", (err, data) => {
            if (err) {
                login();
            }
            else {
                firebase.auth().signInWithEmailAndPassword(JSON.parse(data).email, JSON.parse(data).password)
                    .then(() => {
                        if (readlineSync.keyInYN("You are already logged in on this machine? Would you like to access another album?") === true) {
                            login();
                        }
                        else {

                        }
                    })
                    .catch((e) => {
                        if (readlineSync.keyInYN("The credentials that you have previously entered are invalid or your internet connection is weak. Would you like to log in again?") === true) {
                            login();
                        }
                        else {

                        }
                    })
            }
        })
    })
program
    .command("logout")
    .action(() => {
        fs.unlinkSync(__dirname + "/userData.json");
    })
program
    .command("web")
    .action(() => {
        fs.readFile(__dirname + "/userData.json", (err, data) => {
            if (err) {
                if (readlineSync.keyInYN("You are not logged in. Would you like to access an album?") === true)
                    loginAndOpen();
            }
            else {
                firebase.auth().signInWithEmailAndPassword(JSON.parse(data).email, JSON.parse(data).password)
                    .then(() => {
                        app.listen(5001, () => {
                            console.log("SLID Site Control is now opened!")
                            opn("http://localhost:5001")
                        })
                    })
                    .catch(() => {
                        if (readlineSync.keyInYN("The credentials that you have previously entered are invalid or your internet connection is weak. Would you like to log in again?") === true) {
                            loginAndOpen();
                        }
                    })
            }
        })
    })
program
    .command("start")
    .action(() => {
        fs.readFile(__dirname + "/userData.json", (err, data) => {
            if (err) {
                if (readlineSync.keyInYN("You are not logged in. Would you like to access an album?") === true) {
                    loginWithCommand();
                }
                else {
                    firebase.auth().signInWithEmailAndPassword(JSON.parse(data).email, JSON.parse(data).password)
                        .then(() => {
                            command();
                        })
                        .catch(() => {
                            if (readlineSync.keyInYN("The credentials that you have previously entered are invalid or your internet connection is weak. Would you like to log in again?") === true) {
                                loginWithCommand();
                            }
                        })
                }
            }
        })
    })
program.parse(process.argv)
