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

app.get("/", (req, res, next) => {
    res.write("<h1>WELCOME TO THE SLID SERVER!</h1>")
    res.write("<h4>by RVA Media Products</h4>");
    res.end();
})
app.listen(process.env.PORT || 5000, () => {
    console.log('SLID server has successfully started');
})