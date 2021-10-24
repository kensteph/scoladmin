const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const auth = require('../middleware/auth');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
const dbController = require("../controllers/CtrlEconomat");
const dbStudentController = require("../controllers/Ctrlstudent");
const dbClassroomController = require("../controllers/Ctrlclassroom");
const helpers = require('../helpers/helper');
const con = require('../controllers/database');

// SCOLARITE List
router.post('/scolarite-list', auth, async (req, res) => {
console.log("SCOLARITE POST ", req.body);
    let response;
    let ClassRoom = req.body.ClassRoom;
    let AneAca = req.body.AneAca;
    let classStyle ='card-title h-red';

    if (req.body.actionField == "Filter") { //FILTER
        orderSelected = req.body.OrderBy;
        res.redirect('/scolarite-list?year=' + AneAca + '&room=' + ClassRoom);
    } else {
        if (req.body.actionField == "Add") { //FILTER
            response = await dbController.addScolarite(req);
        }else if (req.body.actionField == "Edit") { //FILTER
            response = await dbController.editScolarite(req);
        }
        if (response.type == "success") {
            classStyle ='card-title h-green'
            res.redirect('/scolarite-list?year=' + AneAca + '&room=' + ClassRoom +'&msg='+ response.msg+'&classStyle='+classStyle);
        } else {
            console.log(response.msg);
            res.redirect('/scolarite-list?year=' + AneAca + '&room=' + ClassRoom +'&msg='+ response.msg+'&classStyle='+classStyle);
        }
    }
    console.log(response);
});
// SCOLARITE List
router.get('/scolarite-list', auth, async (req, res) => {
    let response = await dbClassroomController.listOfClassrooms("Mother");
    let aneacaList = await dbClassroomController.getAcademicYear();
    let academicYearObj = helpers.getAcademicYear();
    let scolariteList = [];
    console.log("ACADEMIC YEAR OBJ : ", academicYearObj);
    let currentYear =academicYearObj.Previous; //CURRENT YEAR
    let nextYear = academicYearObj.Next; //NEXT YEAR
    let roomSelected="All";
    let yearSelected=currentYear;
    let info;
    let classStyle ;
    let pageTitle = "Scolarité "+yearSelected;
    // console.log(response);
    let msg = "";
    if (req.query.msg) {
        msg = req.query.msg;
        classStyle = req.query.classStyle;
    }
    //FILTER
    if (req.query.year && req.query.room) {
        roomSelected = req.query.room;
        yearSelected = req.query.year;
        scolariteList = await dbController.listOfScolarite(roomSelected, yearSelected);
        let txtYear=yearSelected;
        if(yearSelected=="All"){ txtYear=""; }
        if (roomSelected != "All") {
            //GET INFO ABOUT THE CLASSROOM
            info = await dbClassroomController.getclassroom(roomSelected);
            pageTitle = "Scolarité "+info.classe + " " + txtYear;
        } else {
            pageTitle = "Scolarité "+txtYear;
        }

    }else{
        scolariteList = await dbController.listOfScolarite(roomSelected, yearSelected);
        console.log("NO FILTER...");
    }
    console.log("SCOLARITES : ", scolariteList);
    params = {
        pageTitle: pageTitle,
        data: response,
        scolariteList,
        aneacaList: aneacaList,
        UserData: req.session.UserData,
        currentYear,
        yearSelected: yearSelected,
        nextYear,
        roomSelected: roomSelected,
        classStyle,
        msg: msg,
    };
    res.render('../views/economat/scolarite-list', params);
});
// ACCOUNT List
router.post('/account-list', auth, async (req, res) => {
console.log("SCOLARITE POST ", req.body);
    let response;
    let ClassRoom = req.body.ClassRoom;
    let AneAca = req.body.AneAca;
    let classStyle ='card-title h-red';

    if (req.body.actionField == "Filter") { //FILTER
        orderSelected = req.body.OrderBy;
        res.redirect('/account-list?year=' + AneAca + '&room=' + ClassRoom);
    } else {
        if (req.body.actionField == "Add") { //FILTER
            response = await dbController.addScolarite(req);
        }else if (req.body.actionField == "Edit") { //FILTER
            response = await dbController.editScolarite(req);
        }
        if (response.type == "success") {
            classStyle ='card-title h-green'
            res.redirect('/account-list?year=' + AneAca + '&room=' + ClassRoom +'&msg='+ response.msg+'&classStyle='+classStyle);
        } else {
            console.log(response.msg);
            res.redirect('/account-list?year=' + AneAca + '&room=' + ClassRoom +'&msg='+ response.msg+'&classStyle='+classStyle);
        }
    }
    console.log(response);
});
// ACCOUNT List
router.get('/account-list', auth, async (req, res) => {
    let response = await dbClassroomController.listOfClassrooms("All");
    let aneacaList = await dbClassroomController.getAcademicYear();
    let academicYearObj = helpers.getAcademicYear();
    let accountLists = [];
    let currentYear =academicYearObj.Previous; //CURRENT YEAR
    let nextYear = academicYearObj.Next; //NEXT YEAR
    let roomSelected="All";
    let yearSelected=currentYear;
    let currentDate = helpers.getCurrentDate("EN");
    console.log("CurrentDate : ",currentDate);
    let date_from=currentDate;
    let date_to=currentDate;
    let info;
    let classStyle ;
    let pageTitle = "Liste des comptes "+yearSelected;
    let msg = "";
    if (req.query.msg) {
        msg = req.query.msg;
        classStyle = req.query.classStyle;
    }
    //FILTER
    if (req.query.year && req.query.room) {
        roomSelected = req.query.room;
        yearSelected = req.query.year;
        accountLists = await dbController.listOfStudentsAccounts(roomSelected, yearSelected);
        let txtYear=yearSelected;
        if(yearSelected=="All"){ txtYear=""; }
        if (roomSelected != "All") {
            //GET INFO ABOUT THE CLASSROOM
            info = await dbClassroomController.getclassroom(roomSelected);
            pageTitle = "Liste des comptes "+info.classe + " " + txtYear;
        } else {
            pageTitle = "Liste des comptes "+txtYear;
        }

    }else{
        accountLists = await dbController.listOfStudentsAccounts(roomSelected, yearSelected);
        console.log("NO FILTER...");
    }
    console.log("ACCOUNTS : ", accountLists);
    params = {
        pageTitle: pageTitle,
        data: response,
        accountLists,
        aneacaList: aneacaList,
        UserData: req.session.UserData,
        currentYear,
        date_from,
        date_to,
        yearSelected: yearSelected,
        nextYear,
        roomSelected: roomSelected,
        classStyle,
        msg: msg,
    };
    res.render('../views/economat/account-list', params);
});
//CREATE ACCOUNT FOR STUDENTS
router.post('/create-account', auth, async (req, res) => {
    console.log("CREATE ACC : ",req.body);
    let msg="";
    let yearSelected = req.body.AneAca;
    let studentList = await dbStudentController.listOfStudent("All", yearSelected,1);
    let nb_students = studentList.length;
    console.log("NB STUDENTS WITHOUT ACCOUNT : ",nb_students);
    //console.log("STUDENTS : ",studentList);
    let pos=1;
    let counter=0;
    for(i=0;i<nb_students;i++){
        let studentInfo = studentList[i];
        console.log(pos,"-",studentInfo.fullname,studentInfo.id_personne," | ",studentInfo.niveau,studentInfo.classe);
        //CREATE ACCOUNT FOR EVERY SINGLE ONE
        let response = await dbController.addNewAccount(studentInfo.id_personne,studentInfo.niveau,yearSelected);
        if(response.success){
            counter++;
        }
        pos++;
    }
    
    if(counter==0){
        msg = "Tous les élèves ont déja eu leur compte."
    }else{
        msg = counter+" / "+nb_students+" comptes ont été créés avec succès..."
    }
    console.log("CREATED ACC : ",msg);
    res.json(msg);
});
//ADD TRANSACTION FOR STUDENTS
router.post('/add-transaction', auth, async (req, res) => {
    console.log("ADD TRANSACTION : ",req.body);
    let response = await dbController.addStudentTransaction(req);
    res.json(response);
});
//TRANSACTIONS LIST
router.post('/transactions', auth, async (req, res) => {
    let AneAca = req.body.AneAca;
    let date_from = req.body.date_from;
    let date_to = req.body.date_to;
    console.log("SEARCH PARAMS : ",req.body);
    if(req.body.studentSelected){
        let studentID=req.body.studentSelected;
        res.redirect('/transactions?studentID='+studentID+'&year=' + AneAca+'&date_from='+date_from+'&date_to='+date_to);
    }else{
        res.redirect('/transactions?year=' + AneAca+'&date_from='+date_from+'&date_to='+date_to);
    }
    
});
// TRANSACTIONS List
router.get('/transactions', auth, async (req, res) => {
    let aneacaList = await dbClassroomController.getAcademicYear();
    let transactionList = [];
    let academicYearObj = helpers.getAcademicYear();
    let currentYear =academicYearObj.Previous; //CURRENT YEAR
    let yearSelected= currentYear;
    let pageTitle = "Transactions des élèves "+yearSelected;
    let currentDate = helpers.getCurrentDate("EN");
    console.log("CurrentDate : ",currentDate);
    let date_from=currentDate;
    let date_to=currentDate;
    let date_f_t;
    let params;
    let singleAcc= false;
    let studentID;
    //FILTER
    if (req.query.year) {
        yearSelected = req.query.year;
        date_from = req.query.date_from;
        date_to = req.query.date_to;
        if(req.query.studentID){ //Transactions for a single student
            singleAcc=true;
            studentID=req.query.studentID;
            transactionList = await dbController.studentListOfTransactions(date_from,date_to,yearSelected,studentID);
        }else{
            transactionList = await dbController.listOfTransactions(date_from,date_to,yearSelected);
        }
        
        if(date_from==date_to){
            date_f_t=helpers.formatDate(date_from,'FR');
        }else{
            date_f_t=helpers.formatDate(date_from,'FR')+ " - " + helpers.formatDate(date_to,'FR');
        }
        if(yearSelected=="All"){
            pageTitle = "Transactions des élèves | " +date_f_t ;
        }else{
            pageTitle = "Transactions des élèves | " +date_f_t+" | "+yearSelected ;
        }
    }else{
        transactionList = await dbController.listOfTransactions(date_from,date_to,yearSelected);
    }

    
    console.log("TRANSACTIONS : ", transactionList);
    let singleTitle = date_f_t+" | "+yearSelected ;
    params = {
        pageTitle: pageTitle,
        aneacaList,
        transactionList,
        UserData: req.session.UserData,
        yearSelected,
        singleAcc,
        studentID,
        singleTitle,
        date_from,
        date_to,
    };
    res.render('../views/economat/transactions', params);
});

//============================================ PRINTING =====================================================================

router.get('/print-students-list', auth, async (req, res) => {
    let ClassRoom = req.query.ClassRoom;
    let AneAca = req.query.AneAca;
    let status = req.query.statut;
    let orderSelected = req.query.orderSelected;
    if(status==0){
        statusTxt = " desactivés";
    }else{
        statusTxt = " actifs";
    }
    let pageTitle;
    if (ClassRoom == "All") {
        pageTitle = "Liste des étudiants/élèves "+statusTxt+" "+ AneAca;
    } else {
        //GET INFO ABOUT THE CLASSROOM
        let info = await dbClassroomController.getclassroom(ClassRoom);
        pageTitle = "Liste " + info.classe + " " + AneAca;
        console.log("CLASS INFO : ", info);
    }
    //GET THE LIST
    let studentList = await dbController.listOfStudent(ClassRoom, AneAca,status,orderSelected);
    console.log("PRINT : ","PARAMS : ",ClassRoom, AneAca,status,"DATA : ",studentList);


    let params = {
        pageTitle,
        studentList,
        ClassRoom
    };
    res.render('../print/templates/list-eleves', params);
});
// Exportation of this router
module.exports = router;