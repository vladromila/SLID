#!/usr/bin/env node
const program = require("commander");
const express = require("express");
const bodyParser = require("body-parser");
const opn = require("opn");
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
let app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
    res.render("index.html");
})
const login = () => {
    var email = readlineSync.question('Album Email: ');
    var password = readlineSync.question('Album password: ');
    firebase.auth().signInWithEmailAndPassword(email.trim(), password.trim())
        .then((data) => {
            fs.writeFile(__dirname + "/userdata.json", JSON.stringify({ email: email, password: password }), function (err) {

                if (err) {
                    return console.log(err);
                }

                if (readlineSync.keyInYN('User has been saved. Do you want to start the server?') === true) {
                    app.listen(5100, () => {
                        console.log("The slid server has already started");
                        opn("http://localhost:5100");
                    })
                }
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
                        app.listen(5100, () => {
                            console.log("The slid server has already starterd");
                            opn("http://localhost:5100");
                        })
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
