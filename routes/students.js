const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const auth = require('../middleware/auth');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
const dbController = require("../controllers/Ctrlstudent");
const dbClassroomController = require("../controllers/Ctrlclassroom");

//ADD Classrooms to List
router.post('/students-list', auth, async (req, res) => {
    let response;
    let ClassRoom = req.body.ClassRoom;
    let AneAca = req.body.AneAca;
    console.log(req.body);
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(ClassRoom);
    console.log("CLASS INFO : ", info);
    req.body.Niveau = info.mere;
    console.log(req.body);
    if (req.body.actionField == "Filter") { //FILTER
        res.redirect('/students-list?year=' + AneAca + '&room=' + ClassRoom);
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
            res.redirect('/students-list?year=' + AneAca + '&room=' + ClassRoom);
        } else {
            console.log(response.msg);
            res.redirect('/students-list?msg=' + response.msg);
        }
    }

});
// Classrooms List
router.get('/students-list', auth, async (req, res) => {
    let response = await dbClassroomController.listOfClassrooms("All");
    let studentList = [];
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = "2020-2021"; //CURRENT YEAR
    let roomSelected;
    let pageTitle = "Gestion des Etudiants/Elèves";
    console.log("ANE ACA : ", aneacaList);
    let msg = "";
    if (req.query.msg) {
        msg = req.query.msg;
    }
    //FILTER
    if (req.query.year && req.query.room) {
        roomSelected = req.query.room;
        yearSelected = req.query.year;
        studentList = await dbController.listOfStudent(roomSelected, yearSelected);
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
        page: 'Students',
        msg: msg,
    };
    res.render('../views/students/students-list', params);
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