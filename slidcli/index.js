#!/usr/bin/env node
const program = require("commander");
const express = require("express");
const bodyParser = require("body-parser");
const opn = require("opn");

let app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/",(req,res,next)=>{
    res.send("<h1>This is the slid server!</h1>")
})
program
    .command('start')
    .description('Server start')
    .action(() => {
        app.listen(5100, () => {
            console.log("The slid server has already starterd");
            opn("http://localhost:5100");
        })
    })
program
    .command('next <uid>')
    .description('Slide next')
    .action((uid) => {
        request.post({
            headers: { 'content-type': 'application/json' },
            url: 'https://slidserver.herokuapp.com/controlSlide',
            body: JSON.stringify({
                albumUid: uid,
                type: "nextSlide"
            })
        }, function (error, response, body) {
            process.exit();
        });
    })
program
    .command('prev <uid>')
    .description('Slide next')
    .action((uid) => {
        request.post({
            headers: { 'content-type': 'application/json' },
            url: 'https://slidserver.herokuapp.com/controlSlide',
            body: JSON.stringify({
                albumUid: uid,
                type: "previousSlide"
            })
        }, function (error, response, body) {
            process.exit();
        });
    })
program.parse(process.argv);
