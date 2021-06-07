const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const auth = require('../middleware/auth');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
const dbController = require("../controllers/Ctrlstudent");
const dbClassroomController = require("../controllers/Ctrlclassroom");
const { response } = require('express');
//UPLOAD FILE
// var multer = require('multer')
// var upload = multer({ dest: 'uploads/' })

const helpers = require('../helpers/helper');

//ADD Classrooms to List
router.post('/students-list', auth, async (req, res) => {
    let response;
    let ClassRoom = req.body.ClassRoom;
    let AneAca = req.body.AneAca;
    let active = 1;
    if (req.body.Statut) {
        active = req.body.Statut;
    }
    console.log(req.body);
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(ClassRoom);
    console.log("CLASS INFO : ", info);
    req.body.Niveau = info.mere;
    console.log(req.body);
    if (req.body.actionField == "Filter") { //FILTER
        res.redirect('/students-list?year=' + AneAca + '&room=' + ClassRoom + '&statut=' + active);
    } else {
        if (req.body.actionField == "Edit") { //EDIT
            response = await dbController.editStudent(req);
            response = await dbController.editStudentAffectation(req);
        } else if (req.body.actionField == "Delete") { //DELETE
            response = await dbController.deleteStudentAffectation(req);
            response = await dbController.deleteStudent(req);
        } else {
            if (req.body.Niveau == 0) {
                response = { msg: "Vous devez choisir le niveau" };
            } else {
                response = await dbController.addStudent(req);
            }

        }

        if (response.type == "success") {
            res.redirect('/students-list?year=' + AneAca + '&room=' + ClassRoom + '&statut=' + active);
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
    let yearSelected = "2020-2021"; //CURRENT YEAR
    let roomSelected;
    let statutSelected = 1;
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
        studentList = await dbController.listOfStudent(roomSelected, yearSelected, statutSelected);
        //GET INFO ABOUT THE CLASSROOM
        let info = await dbClassroomController.getclassroom(roomSelected);
        pageTitle = info.classe + " " + yearSelected;
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
    res.render('../views/students/students-list', params);
});

// STUDENT DETAILS
router.get('/student-details', auth, async (req, res) => {
    let response = await dbClassroomController.listOfClassrooms("All");
    let studentList = [];
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = "2020-2021"; //CURRENT YEAR
    let roomSelected;
    let statutSelected = 1;
    let studentIdSelected = req.query.ID;
    let studentInfo = await dbController.getStudent(studentIdSelected);
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
        yearSelected: yearSelected,
        roomSelected: roomSelected,
        statutSelected,
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
    res.redirect('/student-details?ID=' + StudentID);
});


//============================================ PRINTING =====================================================================

router.get('/print-students-list', auth, async (req, res) => {
    let ClassRoom = req.query.ClassRoom;
    let AneAca = req.query.AneAca;
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(ClassRoom);
    console.log("CLASS INFO : ", info);
    //GET THE LIST
    let studentList = await dbController.listOfStudent(ClassRoom, AneAca);

    let pageTitle = "Liste " + info.classe + " " + AneAca;
    let params = {
        pageTitle,
        studentList
    };
    res.render('../print/templates/list-eleves', params);
});
// Exportation of this router
module.exports = router;