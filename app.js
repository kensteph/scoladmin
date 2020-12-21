var express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');
//SESSION
const session = require('express-session');
var app = express();
//GLOBALS VARIABLES
global.appName = process.env.APP_NAME;
global.appRoutes = ['employee-list', ''];
//Uses
app.use(express.static('public')); // All our static files
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs'); // Templating
app.use(bodyParser.urlencoded({ extended: true })); // Allow to submit forms
//Use Session
app.use(session({ secret: 'St&phani&1987', resave: false, saveUninitialized: false }));
// External routes
app.use(require('./routes/classrooms'));
app.use(require('./routes/employees'));


app.get('/', function (req, res) {
    res.render('login');
});

app.get('/dash-board', function (req, res) {
    res.render('index');
});

//LOGIN
app.post('/login', async (req, res) => {
    let username = "keromain";
    //USER'S ACCESSS
    let userAccess = ["Employee-list"];
    req.session.userData = { userName: username, userAccess: userAccess };
    res.render('index');
});

//Exit Point
app.get('/logout', async (req, res) => {
    console.log("Go to Login page");
    res.redirect('/');
    // console.log("Destroy Session");
    // req.session.destroy(function (err) {
    //     // cannot access session here
    //     console.log("Session destroyed....");
    // });
});


app.listen(process.env.SERVER_PORT, function () {
    console.log(`SCOLADMIN IS RUNNING AT PORT ${process.env.SERVER_PORT}!`);
});