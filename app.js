var express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');
//SESSION
const session = require('express-session');
const statistic = require('./middleware/statistic');
let app = express();
//Uses
app.use(express.static('public')); // All our static files
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs'); // Templating
app.use(bodyParser.urlencoded({ extended: true })); // Allow to submit forms
const fileupload = require('express-fileupload'); // Allow to submit forms with files
// enable files upload
app.use(fileupload({ createParentPath: true }));
//Use Session
app.use(session({ secret: 'St&phani&1987', resave: false, saveUninitialized: false }));

// External routes
app.use(require('./routes/classrooms'));
app.use(require('./routes/courses'));
app.use(require('./routes/students'));
app.use(require('./routes/notes'));
app.use(require('./routes/employees'));
app.use(require('./routes/admin'));


//SYSTEM IGNITION
intitValues = async function (req) {
    console.log("INITIALISATION DES VARIABLES DU SYSTEME....... : ");
    let ctrlNotes = require("./controllers/Ctrlnotes");
    let ctrlSetting = require("./controllers/Ctrlclassroom");

    let settings = await ctrlSetting.getSettings();
    //console.log(settings);
    //GLOBALS VARIABLES
    global.modeEvaluation = await ctrlNotes.listOfModeEvaluation();
    global.appName = process.env.APP_NAME;
    global.appRoutes = ['employee-list', ''];
    global.schoolName = settings.school_name;
    global.schoolAddress = settings.school_address;
    global.schoolPhone = settings.school_phone;
    global.schoolEmail = settings.school_email;
    //
    global.schoolDirector = settings.director;
    global.schoolModEvaluation = settings.school_evaluation_method;
    global.schoolCoeffPassage = settings.coeff_passage;
    req.session.modEvaluation = settings.school_evaluation_method;

    //MENU ACCESS
    global.MENU_ITEM = ['Tableau de bord', 'Test Patient', 'Test Laboratoire', 'Patients', 'Examens', 'Gestion de stock', 'Paramètres', 'Administration'];
    global.SUBMENU_ITEM = ['Ajouter Patient', 'Liste des Patients', 'Modifier Patients', 'Rechercher Patient', 'Liste des demandes de Tests', 'Supprimer une demandes de Test', 'Enregistrer Résultat', 'Modifier Résultat', 'Valider Résultat', 'Ajouter Signature', 'Imprimer Résultat', 'Ajouter examens', 'Voir la liste des examens', 'Supprimer examens', 'Modifier examens', 'Ajouter valeurs normales', 'Détails Examens', 'Ajouter Matériau', 'Modifier Matériau', 'Lister les matériaux', 'Ajouter Stock', 'Inventaire', 'Imprimer Inventaire', 'Requete Ajouter/Retirer article du Stock', 'Autoriser Ajouter/Retirer article du Stock', 'Approuver requete relative au stock', 'Voir la liste des requetes de stock', 'Valider/Invalider Stock', 'Modifier Stock', 'Supprimer Stock', 'Supprimer transactions pendantes', 'Mouvement de stock', 'Imprimer Mouvement de Stock'];
}

app.get('/', async (req, res) => {
    await intitValues(req);
    res.render('login');
});

app.get('/dash-board', statistic, async (req, res) => {
    await intitValues(req);
    let params = req.stat;
    console.log("TST : ", params);
    res.render('index', params);
});

//LOGIN
app.post('/login', statistic, async (req, res) => {
    await intitValues(req);
    let username = "keromain";
    //USER'S ACCESSS
    let userAccess = ["Employee-list"];
    req.session.userData = { userName: username, userAccess: userAccess };
    let params = req.stat;
    console.log("TST : ", params);
    res.render('index', params);
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