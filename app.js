// console.log = function () {};
var express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');
const helper = require('./helpers/helper');
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
app.use(require('./routes/economat'));

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
    global.schoolName = settings.school_name;
    global.schoolAddress = settings.school_address;
    global.schoolPhone = settings.school_phone;
    global.schoolEmail = settings.school_email;
    //
    global.schoolDirector = settings.director;
    global.schoolHonor_board = settings.honor_board;
    global.schoolModEvaluation = settings.school_evaluation_method;
    global.schoolCoeffPassage = settings.coeff_passage;
    global.schoolCoeffPassagePercentage = settings.coeff_passage/100;
    global.moyennePassage = settings.coeff_passage*0.1;
    req.session.modEvaluation = settings.school_evaluation_method;
    req.session.CurrentAcademicYear = helper.getAcademicYear();
}
app.get('/', async (req, res) => {
    await intitValues(req);
    let msg=req.query.msg;
    console.log(msg);
    let isHome=true;
    res.render('login',{msg,isHome});
});
app.get('/dash-board', statistic, async (req, res) => {
    await intitValues(req);
    let params = req.stat;
    params.UserData = req.session.UserData;
    params.isHome=true;
    //console.log("TST : ", params,"CURRENT YEAR : ",req.session.CurrentAcademicYear);
    res.render('index', params);
});
//LOGIN
app.post('/login', statistic, async (req, res) => {
    //console.log(req.body);
    let username = req.body.Username;
    let password = req.body.Password;
    //GET USER INFO
    const userController = require('./controllers/CtrlEmployee');
    let userInfo = await userController.getUser(username);
    if(userInfo!=null){
        //console.log(userInfo);
            let passwordDB = userInfo.pass_word;
            let title = userInfo.title;
                    if(userController.compareHashedPassword(password,passwordDB)){
                        await intitValues(req);
                        //USER'S ACCESSS
                        let userAccess = await userController.listOfUserAccess(username);
                        let actions = userAccess.actions;
                        let routesAccess=userAccess.routes;
                        let accessId=userAccess.access_id;
                        let uniqueRoutes = [...new Set(routesAccess)];
                        //console.log("UNIQUE ROUTES : ",uniqueRoutes);
                        routesAccess=uniqueRoutes;
                        if(username=="admin" && title=="Super admin"){
                            actions=['All'];
                            routesAccess=['All'];
                        }
                        let userData = { userName: username, title,userAccess: actions,routesAccess ,accessId};
                        req.session.UserData = userData
                        let params = req.stat;
                        params.UserData = userData;
                        params.isHome=true;
                        //console.log(params)
                        res.render('index',params);
                    }else{
                        console.log("You are not authenticated...NO PASS");
                        let msg="Votre nom d'utilisateur ou mot de passe est incorrect...";
                        res.redirect('/?msg='+msg);
                    }
            
    }else{
        console.log("You are not authenticated...");
        let msg="Votre nom d'utilisateur ou mot de passe est incorrect...";
        res.redirect('/?msg='+msg);
    }
});
app.get('/login', async (req, res) => {
    res.redirect('/');
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
//IF USER POINT A BAD ROUTE
app.get('*',auth, (req, res) => {
    res.redirect('/dash-board')
})

//LISTEN
app.listen(process.env.SERVER_PORT, function () {
    console.log(`SCOLADMIN IS RUNNING AT PORT ${process.env.SERVER_PORT}!`);
});