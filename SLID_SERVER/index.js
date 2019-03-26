let express = require('express');
let bodyParser = require('body-parser');
let firebase = require('firebase');
let firebase_admin = require('firebase-admin');
let app = express();
let cors = require('cors');
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

firebase.initializeApp(JSON.parse(process.env.FIREBASE_CONFIG))

firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_CONFIG)),
    databaseURL: "https://slid-24099.firebaseio.com"
});
app.post("/getonlineresources/", (req, res, next) => {
    firebase_admin.database().ref(`/albums/${req.body.uid}`)
        .once("value", (snapshot) => {
            if (snapshot.val()) {
                let resources = [];
                Object.keys(snapshot.val()).forEach(key => {
                    resources.push(snapshot.val()[key])
                })
                res.send({ resources })
            }
            else
                res.send({});
        })
})
app.post("/addalbumsuser", (req, res, next) => {
    firebase.auth().createUserWithEmailAndPassword(req.body.username + "@slid.com", req.body.password)
        .then((data, err) => {
            if (err)
                res.status(406)
            res.status(200).send({ uid: data.user.uid });
            res.end();
        })
        .catch(() => {
            res.status(406);
            res.end();
        })
})
app.post("/deletealbumuser", (req, res, next) => {
    console.log(req.body.username, req.body.password)
    firebase.auth().signInWithEmailAndPassword(req.body.username + "@slid.com", req.body.password)
        .then((data, err) => {
            firebase.auth().currentUser.delete()
                .then(() => {
                    res.status(200).send({ uid: data.user.uid });
                    res.end();
                })
        })
        .catch(() => {
            res.status(406);
            res.end();
        })
})

app.get("/", (req, res, next) => {
    res.write("<h1>WELCOME TO THE SLID SERVER!</h1>")
    res.write("<h4>by RVA Media Products</h4>");
    res.end();
})
app.listen(process.env.PORT || 5000, () => {
    console.log('SLID server has successfully started');
})