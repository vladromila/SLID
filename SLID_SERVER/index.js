let express = require('express');
let bodyParser = require('body-parser');
let firebase = require('firebase');
let firebase_admin = require('firebase-admin');
let f_ad = require('./f_ad.json');
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

firebase_admin.database().ref('/developers/')
    .on("value", (snapshot) => {
        if (snapshot.val())
            Object.keys(snapshot.val()).forEach(userKey => {
                if (snapshot.val()[userKey].notAddedAlbums) {
                    Object.keys(snapshot.val()[userKey].notAddedAlbums).forEach(key => {
                        firebase.auth().createUserWithEmailAndPassword(`${snapshot.val()[userKey].notAddedAlbums[key].username.trim()}@slid.com`, snapshot.val()[userKey].notAddedAlbums[key].password)
                            .then(() => {
                                firebase_admin.database().ref(`/developers/${userKey}/notAddedAlbums/${key}`)
                                    .remove();
                            })
                    })
                }
            })
    })
app.post('/adduserandreturnuid', (req, res, next) => {
    firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
        .then((data) => {
            res.send({ uid: data.user.uid });
        })
})

app.post("/controlSlide", (req, res, next) => {
    console.log(req.body);
    firebase.database().ref(`/${req.body.albumUid}/controls/`)
        .push({
            type: req.body.type
        })
        .then(() => {
            res.send()
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