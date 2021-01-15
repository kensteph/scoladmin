var express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');
//SESSION
const session = require('express-session');
let app = express();
//Uses
app.use(express.static('public')); // All our static files
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs'); // Templating
app.use(bodyParser.urlencoded({ extended: true })); // Allow to submit forms
//Use Session
app.use(session({ secret: 'St&phani&1987', resave: false, saveUninitialized: false }));
// External routes
app.use(require('./routes/classrooms'));
app.use(require('./routes/courses'));
app.use(require('./routes/students'));
app.use(require('./routes/notes'));
app.use(require('./routes/employees'));


//SYSTEM IGNITION
intitValues = function async() {
    let helpers = require("./helpers/helper");
    console.log("INITIALISATION....... : ");
    // Global variables
    //let settings = await self.getSettings();
    //console.log(settings);
    //GLOBALS VARIABLES

    global.appName = process.env.APP_NAME;
    global.appRoutes = ['employee-list', ''];
    global.LOGO = helpers.base64("public/images/logo/logo.png");
    //MENU ACCESS
    global.MENU_ITEM = ['Tableau de bord', 'Test Patient', 'Test Laboratoire', 'Patients', 'Examens', 'Gestion de stock', 'Paramètres', 'Administration'];
    global.SUBMENU_ITEM = ['Ajouter Patient', 'Liste des Patients', 'Modifier Patients', 'Rechercher Patient', 'Liste des demandes de Tests', 'Supprimer une demandes de Test', 'Enregistrer Résultat', 'Modifier Résultat', 'Valider Résultat', 'Ajouter Signature', 'Imprimer Résultat', 'Ajouter examens', 'Voir la liste des examens', 'Supprimer examens', 'Modifier examens', 'Ajouter valeurs normales', 'Détails Examens', 'Ajouter Matériau', 'Modifier Matériau', 'Lister les matériaux', 'Ajouter Stock', 'Inventaire', 'Imprimer Inventaire', 'Requete Ajouter/Retirer article du Stock', 'Autoriser Ajouter/Retirer article du Stock', 'Approuver requete relative au stock', 'Voir la liste des requetes de stock', 'Valider/Invalider Stock', 'Modifier Stock', 'Supprimer Stock', 'Supprimer transactions pendantes', 'Mouvement de stock', 'Imprimer Mouvement de Stock'];
    //res.render('login');
}

app.get('/', function (req, res) {
    intitValues();
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
    req.session.modEvaluation = "E4";
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