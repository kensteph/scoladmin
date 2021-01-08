const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const auth = require('../middleware/auth');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
const dbController = require("../controllers/Ctrlnotes");
const dbClassroomController = require("../controllers/Ctrlclassroom");
const dbStudentController = require("../controllers/Ctrlstudent");
const dbCoursesController = require("../controllers/Ctrlcourses");
const helper = require("../helpers/helper");
// PERIODES List
router.get('/periode-list', auth, async (req, res) => {
    let modeEvaluation = await dbController.listOfModeEvaluation();
    let msg = "";
    if (req.query.msg) {
        msg = req.query.msg;
    }
    params = {
        pageTitle: "Gestion des périodes d'évaluation ",
        data: modeEvaluation,
        coursesList: [],
        niveau: 1,
        classrooms: [],
        courseCategories: [],
        teachersList: [],
        UserData: req.session.UserData,
        page: 'Notes',
        msg: msg,
    };
    res.render('../views/notes/periodes-list', params);
});
//MANAGE COURSES
router.post('/periode-list', auth, async (req, res) => {
    let response;
    console.log(req.body);

    if (req.body.actionField == "Edit") { //EDIT
        response = await dbController.editMethod(req);
    } else if (req.body.actionField == "Delete") { //DELETE
        response = await dbController.deleteMethod(req);
    } else { //ADD 
        response = await dbController.addMethod(req);
    }
    res.redirect('/periode-list?msg=' + response.msg);
    // if (response.type == "success") {
    //     res.redirect('/courses-list');
    //     console.log(response);
    // } else {
    //     console.log(response.debug);
    //     res.redirect('/courses-list?msg=' + response.msg);
    // }
});
//MANAGE COURSES
router.post('/period', auth, async (req, res) => {
    console.log(req.body);
    let response;
    if (req.body.actionField == "Edit") { //EDIT
        response = await dbController.editCourseAssignment(req);
    } else if (req.body.actionField == "Delete") { //DELETE
        response = await dbController.deleteClassroom(req);
    } else { //ADD 
        response = await dbController.addPeriod(req);
    }
    console.log("DB RESPONSE : ", response);
    if (response.type == "success") {
        console.log(response);
        res.redirect('/periode-list?msg=' + response.msg);
    } else {
        console.log(response.debug);
        res.redirect('/periode-list?msg=' + response.msg);
    }
    //res.json(response);
});

// PERIODES List
router.post('/getPeriod-list', auth, async (req, res) => {
    console.log(req.body);
    let methodEvaluationCode = req.body.methodEvaluationCode;
    let periodList = await dbController.listOfPeriod(methodEvaluationCode);
    console.log(periodList);
    res.json(periodList);
});

//========================================= MANAGE NOTE =======================================
//GET COURSES LIST FOR 
router.post('/getCourses-list', auth, async (req, res) => {
    console.log(req.body);
    let classRoomId = req.body.classRoomId;
    let coursesList = await dbCoursesController.listOfCoursesByClassroom(classRoomId);
    //console.log("COURSES : ", coursesList);
    res.json(coursesList);
});

router.post('/save-notes', auth, async (req, res) => {
    let response;
    let ClassRoom = req.body.ClassRoom;
    let AneAca = req.body.AneAca;
    let CourseSelectedId = req.body.CourseSelectedId;
    let period = req.body.Period;
    console.log(req.body);
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(ClassRoom);
    console.log("CLASS INFO : ", info);
    req.body.Niveau = info.mere;
    console.log(req.body);
    if (req.body.actionField == "Filter") { //FILTER
        res.redirect('/save-notes?year=' + AneAca + '&room=' + ClassRoom + '&course=' + CourseSelectedId + '&period=' + period);
    } else {
        if (req.body.actionField == "Edit") { //EDIT
            response = await dbStudentController.editStudent(req);
            response = await dbStudentController.editStudentAffectation(req);
        } else if (req.body.actionField == "Delete") { //DELETE
            response = await dbStudentController.deleteStudentAffectation(req);
            response = await dbStudentController.deleteStudent(req);
        } else {
            if (req.body.Niveau == 0) {
                response = { msg: "Vous devez choisir le niveau" };
            } else {
                response = await dbStudentController.addStudent(req);
            }

        }

        if (response.type == "success") {
            res.redirect('/save-notes?year=' + AneAca + '&room=' + ClassRoom);
        } else {
            console.log(response.msg);
            res.redirect('/save-notes?msg=' + response.msg);
        }
    }

});

router.get('/save-notes', auth, async (req, res) => {
    let methodEvaluationCode = req.session.modEvaluation;
    let periodList = await dbController.listOfPeriod(methodEvaluationCode);
    let response = await dbClassroomController.listOfClassrooms("All");
    let studentList = [];
    let coursesList = [];
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = "2020-2021"; //CURRENT YEAR
    let roomSelected;
    let niveauSelected;
    let CourseSelectedId;
    let periodSelected;
    let infoCourse = [];
    //console.log(req.body);
    let pageTitle = "Gestion des notes";
    // console.log("ANE ACA : ", aneacaList);
    let msg = "";
    if (req.query.msg) {
        msg = req.query.msg;
    }
    //FILTER
    if (req.query.year && req.query.room) {
        roomSelected = req.query.room;
        yearSelected = req.query.year;
        CourseSelectedId = req.query.course;
        periodSelected = req.query.period;
        //GET INFO ABOUT THE CLASSROOM
        let info = await dbClassroomController.getclassroom(roomSelected);
        niveauSelected = info.mere;
        //GET INFO ABOUT THE COURSE
        infoCourse = await dbCoursesController.courseInfoById(CourseSelectedId, roomSelected);
        //COURSES LIST
        coursesList = await dbCoursesController.listOfCoursesByClassroom(roomSelected);
        studentList = await dbController.listOfStudentWithoutNotes(roomSelected, CourseSelectedId, niveauSelected, periodSelected, yearSelected);

        pageTitle = "Notes " + info.classe + " " + periodSelected + " " + yearSelected + " | " + infoCourse.libelle;
    }
    console.log("COURSE : ", infoCourse);
    params = {
        pageTitle: pageTitle,
        data: response,
        periodList: periodList,
        periodSelected: periodSelected,
        studentList: studentList,
        coursesList: coursesList,
        infoCourse: infoCourse,
        aneacaList: aneacaList,
        UserData: req.session.UserData,
        yearSelected: yearSelected,
        roomSelected: roomSelected,
        niveauSelected: niveauSelected,
        page: 'Notes',
        msg: msg,
    };
    res.render('../views/notes/save-notes', params);
});

//SAVE NOTES TO DB
router.post('/save-notes-db', auth, async (req, res) => {
    req.body.methodEvaluationCode = req.session.modEvaluation;
    console.log(req.body);
    let response = await dbController.saveNotes(req);
    console.log(response);
    let ClassRoom = req.body.roomSelected;
    let AneAca = req.body.yearAca;
    let CourseSelectedId = req.body.courseId;
    let period = req.body.period;
    res.redirect('/save-notes?year=' + AneAca + '&room=' + ClassRoom + '&course=' + CourseSelectedId + '&period=' + period);
    //res.json(response);
});
//SAVE OR EDIT SINGLE NOTE TO DB
router.post('/save-edit-notes-db', auth, async (req, res) => {
    req.body.methodEvaluationCode = req.session.modEvaluation;
    console.log(req.body);
    // let response = await dbController.saveNotes(req);
    // console.log(response);
    // let ClassRoom = req.body.roomSelected;
    // let AneAca = req.body.yearAca;
    // let CourseSelectedId = req.body.courseId;
    // let period = req.body.period;
    // res.redirect('/save-notes?year=' + AneAca + '&room=' + ClassRoom + '&course=' + CourseSelectedId + '&period=' + period);
    //res.json(response);
});

//PALMARES
router.get('/palmares-notes', auth, async (req, res) => {
    let methodEvaluationCode = req.session.modEvaluation;
    let periodList = await dbController.listOfPeriod(methodEvaluationCode);
    let response = await dbClassroomController.listOfClassrooms("All");
    let studentList = [];
    let coursesList = [];
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = "2020-2021"; //CURRENT YEAR
    let roomSelected;
    let niveauSelected;
    let CourseSelectedId;
    let periodSelected;
    let infoCourse = [];
    let listNotes = [];
    console.log(req.body);
    let pageTitle = "Palmarès ";
    // console.log("ANE ACA : ", aneacaList);
    let msg = "";
    if (req.query.msg) {
        msg = req.query.msg;
    }
    //FILTER
    if (req.query.year && req.query.room) {
        roomSelected = req.query.room;
        yearSelected = req.query.year;
        CourseSelectedId = req.query.course;
        periodSelected = req.query.period;
        //COURSES LIST
        coursesList = await dbCoursesController.listOfCoursesByClassroom(roomSelected);
        studentList = await dbStudentController.listOfStudent(roomSelected, yearSelected);
        //GET INFO ABOUT THE CLASSROOM
        let info = await dbClassroomController.getclassroom(roomSelected);
        niveauSelected = info.mere;
        //GET INFO ABOUT THE COURSE
        infoCourse = await dbCoursesController.courseInfoById(CourseSelectedId, roomSelected);
        //console.log("COURSE INFO :", infoCourse);
        pageTitle = "Notes " + info.classe + " " + periodSelected + " " + yearSelected + " | " + infoCourse.libelle;
    }
    //console.log("STUDENTS : ", studentList);
    params = {
        pageTitle: pageTitle,
        data: response,
        periodList: periodList,
        periodSelected: periodSelected,
        studentList: studentList,
        coursesList: coursesList,
        infoCourse: infoCourse,
        aneacaList: aneacaList,
        listNotes,
        UserData: req.session.UserData,
        yearSelected: yearSelected,
        roomSelected: roomSelected,
        niveauSelected: niveauSelected,
        page: 'Notes',
        msg: msg,
    };
    res.render('../views/notes/palmares-notes', params);
});

router.post('/palmares-notes', auth, async (req, res) => {
    let methodEvaluationCode = req.session.modEvaluation;
    let periodList = await dbController.listOfPeriod(methodEvaluationCode);
    let response = await dbClassroomController.listOfClassrooms("All");
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = req.body.AneAca; //CURRENT YEAR
    let roomSelected = req.body.ClassRoom;
    //Coefficient de Calcul des moyennes
    let CoefficientCalcul = await dbController.CoefficientCalcul(roomSelected);
    let CoeffTotal = CoefficientCalcul.Total;
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(roomSelected);
    let niveauSelected = info.mere;;
    let periodSelected = req.body.Period;
    //console.log(req.body);
    // console.log("ANE ACA : ", aneacaList);
    let msg = "";
    //COURSES LIST
    let coursesList = await dbCoursesController.listOfCoursesByClassroom(roomSelected);
    //STUDENTS LIST
    let studentList = await dbStudentController.listOfStudent(roomSelected, yearSelected);
    let palmares = [];
    let Total = [];
    let Moyennes = [];
    let listNotes = [];
    for (i = 0; i < studentList.length; i++) {
        let student = studentList[i];
        let StudentId = student.id_personne;
        let line = [];
        let sumNote = 0;
        //line.push(student.fullname);
        //console.log("STUDENT : ", student.fullname);
        for (j = 0; j < coursesList.length; j++) {
            let Course = coursesList[j];
            let note = await dbController.getStudentNoteByCourse(student.id_personne, Course.id_cours, niveauSelected, periodSelected, yearSelected);
            //console.log(note);
            if (note !== undefined) {
                let noteStudent = parseFloat(note.note);
                line.push(note.note);
                sumNote += noteStudent;
                //console.log(Course.libelle, " : ", note.note);
            } else {
                line.push("");
                //console.log(Course.libelle, " : ", "");
            }
        }

        Moyenne = (sumNote / CoefficientCalcul.CoefMoyenne).toFixed(2);
        palmares.push(line);
        Total.push(sumNote);
        Moyennes.push(Moyenne);
        let obj = { Student: student.fullname, StudentId: StudentId, Moyenne, Notes: line, Total: sumNote, Sur: CoeffTotal, Moyenne };
        listNotes.push(obj);
    }
    listNotes.sort(helper.compareValues('Moyenne', 'desc'));
    console.log("PALMAES : ", listNotes);

    let pageTitle = "Palmarès " + info.classe + " | " + periodSelected + " " + yearSelected;

    //let palmares = await dbController.palmares(roomSelected, yearSelected, periodSelected);

    params = {
        pageTitle: pageTitle,
        data: response,
        Notes: palmares,
        Moyennes,
        Total,
        CoeffTotal,
        listNotes,
        periodList: periodList,
        periodSelected: periodSelected,
        studentList: studentList,
        coursesList: coursesList,
        aneacaList: aneacaList,
        UserData: req.session.UserData,
        yearSelected: yearSelected,
        roomSelected: roomSelected,
        niveauSelected: niveauSelected,
        page: 'Notes',
        msg: msg,
    };
    res.render('../views/notes/palmares-notes', params);
});

// Exportation of this router
module.exports = router;