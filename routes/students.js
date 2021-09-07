const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const auth = require('../middleware/auth');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
const dbController = require("../controllers/Ctrlstudent");
const dbClassroomController = require("../controllers/Ctrlclassroom");
const helpers = require('../helpers/helper');

//ADD EDIT DELETE 
router.post('/students-list', auth, async (req, res) => {
    let response;
    let ClassRoom = req.body.ClassRoom;
    let AneAca = req.body.AneAca;
    let active = 1;
    let info;
    if(ClassRoom!="All"){
        //Info about the classroom
        info = await dbClassroomController.getclassroom(ClassRoom);
        req.body.Niveau= info.niveau;
    }
    if (req.body.Statut) {
        active = req.body.Statut;
    }
    console.log(req.body);
    
    if (req.body.actionField == "Filter") { //FILTER
        res.redirect('/students-list?year=' + AneAca + '&room=' + ClassRoom + '&statut=' + active);
    } else {
        if (req.body.actionField == "Edit") { //EDIT
            response = await dbController.editStudent(req);
            response = await dbController.editStudentAffectation(req);
        } else if (req.body.actionField == "Delete") { //DELETE
            response = await dbController.deleteStudentAffectation(req);
            // response = await dbController.deleteStudent(req);
            //DESACTIVE AU LIEU SUPPRIMER
            //let idStudent=
            //response = await dbController.setStudentStatus(req);

        } else {
            if (req.body.Niveau== 0) {
                response = { msg: "Vous devez choisir la salle de classe" };
            } else {
                response = await dbController.addStudent(req);
            }

        }

        if (response.type == "success") {
            res.redirect('/students-list?year=' + AneAca + '&room=' + ClassRoom + '&statut=' + active+'&msg='+ response.msg);
        } else {
            console.log(response.msg);
            res.redirect('/students-list?msg=' + response.msg);
        }
    }

});
// STUDENT List
router.get('/students-list', auth, async (req, res) => {
    let response = await dbClassroomController.listOfClassrooms("All");
    let studentList = [];
    let aneacaList = await dbClassroomController.getAcademicYear();
    let academicYearObj = helpers.getAcademicYear();
    console.log("ACADEMIC YEAR OBJ : ", academicYearObj);
    let currentYear =academicYearObj.Previous; //CURRENT YEAR
    let roomSelected;
    let yearSelected=currentYear;
    let niveau;
    let statutSelected = 1;
    let statusName = "actifs";
    let info;
    let pageTitle = "Etudiants/Elèves";
    //console.log(response);
    let msg = "";
    if (req.query.msg) {
        msg = req.query.msg;
    }
    //FILTER
    if (req.query.year && req.query.room) {
        roomSelected = req.query.room;
        yearSelected = req.query.year;
        statutSelected = req.query.statut;
        if (statutSelected == 0) { statusName = "désactivés" }
        studentList = await dbController.listOfStudent(roomSelected, yearSelected, statutSelected);
        if (roomSelected != "All") {
            //GET INFO ABOUT THE CLASSROOM
            info = await dbClassroomController.getclassroom(roomSelected);
            niveau = info.niveau;
            pageTitle = info.classe + " " + yearSelected + " | " + statusName;
        } else {
            pageTitle = "Etudiants/Elèves" + " " + yearSelected + " | " + statusName;
        }

    }
    //console.log("STUDENTS : ", studentList);
    params = {
        pageTitle: pageTitle,
        data: response,
        studentList: studentList,
        aneacaList: aneacaList,
        UserData: req.session.UserData,
        currentYear,
        yearSelected: yearSelected,
        roomSelected: roomSelected,
        niveau,
        statutSelected,
        page: 'Students',
        msg: msg,
    };
    res.render('../views/students/students-list', params);
});

//ADD EDIT DELETE REGISTRATION
router.post('/registered-students-list', auth, async (req, res) => {
    let response;
    let ClassRoom = req.body.ClassRoom;
    let AneAca = req.body.AneAca;
    let active = 0;
    let info;
    if(ClassRoom!="All"){
        //Info about the classroom
        info = await dbClassroomController.getclassroom(ClassRoom);
        req.body.Niveau= info.niveau;
    }
    if (req.body.Statut) {
        active = req.body.Statut;
    }
    console.log(req.body);
    
    if (req.body.actionField == "Filter") { //FILTER
        res.redirect('/registered-students-list?year=' + AneAca + '&room=' + ClassRoom + '&statut=' + active);
    } else {
        if (req.body.actionField == "Edit") { //EDIT
            response = await dbController.editStudent(req);
            response = await dbController.editStudentAffectation(req);
        } else if (req.body.actionField == "Delete") { //DELETE
            response = await dbController.deleteStudentAffectation(req);
            // response = await dbController.deleteStudent(req);
            //DESACTIVE AU LIEU SUPPRIMER
            //let idStudent=
            //response = await dbController.setStudentStatus(req);

        } else {
            if (req.body.Niveau== 0) {
                response = { msg: "Vous devez choisir la salle de classe" };
            } else {
                response = await dbController.registerStudent(req);
            }

        }

        if (response.type == "success") {
            res.redirect('/registered-students-list?year=' + AneAca + '&room=' + ClassRoom + '&statut=' + active+'&msg='+ response.msg);
        } else {
            console.log(response.msg);
            res.redirect('/registered-students-list?msg=' + response.msg);
        }
    }

});
// STUDENT List
router.get('/registered-students-list', auth, async (req, res) => {
    let response = await dbClassroomController.listOfClassrooms("Mother");
    let studentList = [];
    let aneacaList = await dbClassroomController.getAcademicYear();
    let academicYearObj = helpers.getAcademicYear();
    console.log("ACADEMIC YEAR OBJ : ", academicYearObj);
    let currentYear =academicYearObj.Next; //CURRENT YEAR
    let roomSelected;
    let yearSelected=currentYear;
    let niveau="All";
    let statutSelected ="All";
    let statusName = "";
    let info;
    let pageTitle = "Liste des Inscriptions ";
    //console.log(response);
    let msg = "";
    if (req.query.msg) {
        msg = req.query.msg;
    }
    //FILTER
    if (req.query.year && req.query.room) {
        roomSelected = req.query.room;
        yearSelected = req.query.year;
        statutSelected = req.query.statut;
        if (statutSelected == -1) { statusName = " | Rejetées" }else if(statutSelected == 1){ statusName = " | Approuvées";}else if(statutSelected == 0){ statusName = " | En attente";}
        studentList = await dbController.listOfRegisteredStudent(roomSelected, yearSelected, statutSelected);
        if (roomSelected != "All") {
            //GET INFO ABOUT THE CLASSROOM
            info = await dbClassroomController.getclassroom(roomSelected);
            niveau = info.niveau;
            pageTitle = "Liste des Inscriptions "+info.classe + " " + yearSelected + "" + statusName;
        } else {
            pageTitle = "Liste des Inscriptions" + " " + yearSelected + "" + statusName;
        }

    }
    console.log("STUDENTS : ", studentList);
    params = {
        pageTitle: pageTitle,
        data: response,
        studentList: studentList,
        aneacaList: aneacaList,
        UserData: req.session.UserData,
        currentYear,
        yearSelected: yearSelected,
        roomSelected: roomSelected,
        niveau,
        statutSelected,
        page: 'Students',
        msg: msg,
    };
     req.session.PrintJob=params;
    res.render('../views/students/inscription-list', params);
});
// STUDENT GALLERY
router.get('/students-gallery', auth, async (req, res) => {
    let response = await dbClassroomController.listOfClassrooms("All");
    let studentList = [];
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = "2020-2021"; //CURRENT YEAR
    let roomSelected;
    let statutSelected = 1;
    let statusName = "actifs";
    let info;
    let pageTitle = "Etudiants/Elèves";
    console.log("ANE ACA : ", aneacaList);
    let msg = "";
    if (req.query.msg) {
        msg = req.query.msg;
    }
    //FILTER
    if (req.query.year && req.query.room) {
        roomSelected = req.query.room;
        yearSelected = req.query.year;
        statutSelected = req.query.statut;
        if (statutSelected == 0) { statusName = "désactivés" }
        studentList = await dbController.listOfStudent(roomSelected, yearSelected, statutSelected);
        if (roomSelected != "All") {
            //GET INFO ABOUT THE CLASSROOM
            info = await dbClassroomController.getclassroom(roomSelected);
            pageTitle = info.classe + " " + yearSelected + " | " + statusName;
        } else {
            pageTitle = "Etudiants/Elèves" + " " + yearSelected + " | " + statusName;
        }

    }
    console.log("STUDENTS : ", studentList);
    params = {
        pageTitle: pageTitle,
        data: response,
        studentList: studentList,
        aneacaList: aneacaList,
        UserData: req.session.UserData,
        yearSelected: yearSelected,
        roomSelected: roomSelected,
        statutSelected,
        page: 'Students',
        msg: msg,
    };
    res.render('../views/students/student-gallery', params);
});
// STUDENT DETAILS
router.get('/student-details', auth, async (req, res) => {
    let response = await dbClassroomController.listOfClassrooms("All");
    let studentList = [];
    let aneacaList = await dbClassroomController.getAcademicYear();
    let statutSelected = 1;
    let studentIdSelected = req.query.ID;
    let studentInfo =[];
    let what='Student';
    console.log(req.query.registered);
    if(req.query.registered!="undefined"){
        //GET INFO FROM INSCRIPTION
        console.log('INFO ABOUT NEW REGISTER');
        what='registered';
        studentInfo= await dbController.getNewRegisterInfo(studentIdSelected);
        studentInfo.id_personne=studentInfo.pers_id;
    }else{
        studentInfo= await dbController.getStudent(studentIdSelected);
    }
    
    let studentFullName = studentInfo.fullname;
    console.log("ID-STUDENT : ", studentIdSelected, "INFO : ", studentInfo);
    let pageTitle = studentFullName;
    console.log("ANE ACA : ", aneacaList);
    let msg = "";
    if (req.query.msg) {
        msg = req.query.msg;
    }

    params = {
        pageTitle: pageTitle,
        data: response,
        studentInfo,
        studentList: studentList,
        aneacaList: aneacaList,
        UserData: req.session.UserData,
        statutSelected,
        what,
        page: 'Students',
        msg: msg,
    };
    res.render('../views/students/student-details', params);
});
// STUDENT DETAILS
router.post('/student-details', auth, async (req, res) => {

    let StudentID = req.body.StudentID;
    let OldImgName = req.body.OldImgName;
    let fileNameWithExtention = OldImgName;
    let what = req.body.What;
    //IF FILES EXIST
    if (req.files) {
        let path = "public/uploads/";
        let fileName = "IMG-" + StudentID;
        let info = helpers.simpleUpload(req, fileName, path, "avatar");
        console.log(info);
        fileNameWithExtention = info.data.name;
    }
    req.body.ImageName = fileNameWithExtention;
    console.log("DATA POSTED : ", req.body);
    console.log("FILE DATA POSTED : ", req.files);
    let response = await dbController.editStudent(req);
    console.log('EDIT RESPONSE : ', response);
    res.redirect('/student-details?ID=' + StudentID+"&"+what);
});


//============================================ PRINTING =====================================================================

router.get('/print-students-list', auth, async (req, res) => {
    let ClassRoom = req.query.ClassRoom;
    let AneAca = req.query.AneAca;
    let status = req.query.statut;
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
    let studentList = await dbController.listOfStudent(ClassRoom, AneAca,status);
    console.log("PRINT : ","PARAMS : ",ClassRoom, AneAca,status,"DATA : ",studentList);


    let params = {
        pageTitle,
        studentList,
        ClassRoom
    };
    res.render('../print/templates/list-eleves', params);
});

router.get('/print-inscrit-list', auth, async (req, res) => {
    let params = req.session.PrintJob;
    res.render('../print/templates/inscrits-list', params);
});
// Exportation of this router
module.exports = router;