#!/usr/bin/env node
const program = require("commander")
const firebase = require("firebase");
const fs = require("fs");
var readlineSync = require('readline-sync');

firebase.initializeApp({
    apiKey: "AIzaSyBZwaUfj4RaI9kVGXWgHUz23jroUGd-mn0",
    authDomain: "slidalbums.firebaseapp.com",
    databaseURL: "https://slidalbums.firebaseio.com",
    projectId: "slidalbums",
    storageBucket: "slidalbums.appspot.com",
    messagingSenderId: "167009021016"
})

const getCommand = () => {
    let command = readlineSync.question("Command:");
    if (command.toLowerCase() === "next" || command.toLowerCase() === "next slide" || command.toLowerCase().indexOf("next") > -1)
        firebase.database().ref(`${firebase.auth().currentUser.uid}/controls`)
            .push({ type: "nextSlide" })
            .then(()=>{
                getCommand();
            })
    else
        if (command.toLowerCase() === "previous" || command.toLowerCase() === "previous slide" || command.toLowerCase() === "prev" || command.toLowerCase().indexOf("previous") > -1)
            firebase.database().ref(`${firebase.auth().currentUser.uid}/controls`)
                .push({ type: "previousSlide" })
                .then(()=>{
                    getCommand();
                })
}
const startCommand = () => {
    if (readlineSync.keyInYN('Do you want to start entering commands?') === true) {
        getCommand();
    }
}
const login = () => {
    var email = readlineSync.question('Album Email: ');
    var password = readlineSync.question('Album password: ');
    firebase.auth().signInWithEmailAndPassword(email.trim(), password.trim())
        .then((data) => {
            fs.writeFile(__dirname + "/userdata.json", JSON.stringify({ email: email, password: password }), function (err) {

                if (err) {
                    return console.log(err);
                }
                startCommand();
            })
        })
        .catch(() => {
            console.log("There was an error signing in your accout.")
        })
}
program
    .command("login")
    .action(() => login())
program
    .command("start")
    .action(() => {
        fs.readFile(__dirname + '/userdata.json', function read(err, data) {
            if (err) {
                console.log("You need to sign in in order to start the server!")
                if (readlineSync.keyInYN('Do you want to sign in?') === true)
                    login();
                else
                    process.exit();
            }
            else {
                firebase.auth().signInWithEmailAndPassword(JSON.parse(data).email, JSON.parse(data).password)
                    .then(() => {
                        startCommand();
                    })
                    .catch(() => {
                        console.log("The credentials you have previously entered are now invalid.")
                        if (readlineSync.keyInYN('Do you want to sign in again?') === true)
                            login();
                        else
                            process.exit();
                    })
            }
        })


    })
program.parse(process.argv)
