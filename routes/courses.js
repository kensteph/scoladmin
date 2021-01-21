const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const auth = require('../middleware/auth');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
const dbController = require("../controllers/Ctrlcourses");
const dbControllerStudents = require("../controllers/Ctrlstudent");
const dbControllerNotes = require("../controllers/Ctrlnotes");
const dbClassroomController = require("../controllers/Ctrlclassroom");

// COURSES List
router.get('/courses-list', auth, async (req, res) => {
    let coursesList;
    let data;
    let classrooms = await dbClassroomController.listOfClassrooms("child");
    let categorieList = await dbController.listOfCategories();
    let teachersList = await dbController.listOfTeachers();
    let methodEvaluationCode = req.session.modEvaluation;
    let periodList = await dbControllerNotes.listOfPeriod(methodEvaluationCode);
    let aneacaList = await dbClassroomController.getAcademicYear();
    let salleClass = "";
    let roomSelected;
    let yearSelected = "2020-2021";
    let periodSelected;
    data = await dbController.listOfCourses(0); //SYSTEM'S COURSES
    let msg = "";
    let niveau = 0;
    if (req.query.msg) { msg = req.query.msg; }
    if (req.query.filter) {
        roomSelected = req.query.filter;
        periodSelected = req.query.periodSelected;
        //GET INFO ABOUT THE CLASSROOM
        let info = await dbClassroomController.getclassroom(roomSelected);
        console.log("CLASS INFO : ", info);
        niveau = info.mere;
        salleClass = " | " + info.classe;
        coursesList = await dbController.listOfCoursesByClassroom(roomSelected, "All");

    } else {
        coursesList = data;
    }

    params = {
        pageTitle: "Gestion des cours " + salleClass,
        data: data,
        coursesList: coursesList,
        niveau: niveau,
        classrooms: classrooms,
        roomSelected,
        yearSelected,
        periodSelected,
        periodList,
        aneacaList,
        courseCategories: categorieList,
        teachersList: teachersList,
        UserData: req.session.UserData,
        page: 'Classrooms',
        msg: msg,
    };
    res.render('../views/courses/courses-list', params);
});
//MANAGE COURSES
router.post('/courses-list', auth, async (req, res) => {
    let response;
    console.log(req.body);
    if (req.body.actionField == "Filter") { //Filter
        res.redirect('/courses-list?classRoomId=' + req.body.classRoomId + "&filter=" + req.body.classRoomId + "&periodSelected=" + req.body.Period);
    } else {
        if (req.body.actionField == "Edit") { //EDIT
            response = await dbController.editCourse(req);
        } else if (req.body.actionField == "Delete") { //DELETE
            response = await dbController.deleteClassroom(req);
        } else { //ADD 
            response = await dbController.addCourse(req);
        }
        res.redirect('/courses-list?msg=' + response.msg);
        // if (response.type == "success") {
        //     res.redirect('/courses-list');
        //     console.log(response);
        // } else {
        //     console.log(response.debug);
        //     res.redirect('/courses-list?msg=' + response.msg);
        // }
    }
});
//MANAGE COURSES
router.post('/courses-assignation', auth, async (req, res) => {
    console.log(req.body);
    let response;
    if (req.body.actionField == "Edit") { //EDIT
        response = await dbController.editCourseAssignment(req);
    } else if (req.body.actionField == "Delete") { //DELETE
        response = await dbController.deleteClassroom(req);
    } else { //ADD 
        response = await dbController.assignCourse(req);
    }
    console.log("DB RESPONSE : ", response);
    if (response.type == "success") {
        console.log(response);
        res.redirect('/courses-list?msg=' + response.msg + '&filter=' + req.body.ClassRoom);
    } else {
        console.log(response.debug);
        res.redirect('/courses-list?msg=' + response.msg + '&filter=' + req.body.ClassRoom);
    }
    //res.json(response);
});
//================================================= PRINTING ============================================
router.get('/print-course-palmares', auth, async (req, res) => {
    let ClassRoom = req.query.ClassRoom;
    let AneAca = req.query.AneAca;
    let periode = req.query.Periode;
    let course = req.query.Course;
    let methodEvaluationCode = req.session.modEvaluation;
    let periodList = await dbControllerNotes.listOfPeriod(methodEvaluationCode);
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(ClassRoom);
    //console.log("CLASS INFO : ", info);
    //GET THE LIST
    let studentList = await dbControllerStudents.listOfStudent(ClassRoom, AneAca);
    if (periode == "All") { periode = ""; }
    let pageTitle = "Palmarès  " + course.toUpperCase() + " " + info.classe + " " + AneAca;
    let params = {
        pageTitle,
        studentList,
        periodList,
        periode
    };
    res.render('../print/templates/palmares-cours', params);
});
// Exportation of this router
module.exports = router;