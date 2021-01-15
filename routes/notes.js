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
const printer = require("../print/print");
const fs = require("fs-extra");
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
    //console.log("CLASS INFO : ", info);
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
    //console.log("COURSE : ", infoCourse);
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
    let response;
    let actionField = req.body.actionField;
    if (actionField == "Enregistrer") {
        response = await dbController.saveSingleNote(req);
    } else {
        response = await dbController.editSingleNote(req);
    }
    console.log(response);
    // let ClassRoom = req.body.roomSelected;
    // let AneAca = req.body.yearSelected;
    // let CourseSelectedId = req.body.courseId;
    // let period = req.body.periodSelected;
    //res.redirect('/save-notes?year=' + AneAca + '&room=' + ClassRoom + '&course=' + CourseSelectedId + '&period=' + period);
    res.json(response);
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
        let line = []; //NOTES
        let idNote = [];//ID NOTES
        let sumNote = 0;
        // let sNotes = await dbController.getStudentNotes(StudentId,niveauSelected, periodSelected, yearSelected);
        // console.log("NOTES : ", sNotes);
        for (j = 0; j < coursesList.length; j++) {
            let Course = coursesList[j];
            let note = await dbController.getStudentNoteByCourse(StudentId, Course.id_cours, niveauSelected, periodSelected, yearSelected);
            //console.log(note);
            if (note !== undefined) {
                let noteStudent = parseFloat(note.note);
                line.push(note.note);
                idNote.push(note.id_note);
                sumNote += noteStudent;
                //console.log(Course.libelle, " : ", note.note);
            } else {
                line.push("");
                idNote.push("");
                //console.log(Course.libelle, " : ", "");
            }
        }
        //GET THE TOTAL NOTE FOR THE STUDENT
        // let TotalNote = await dbController.getStudentTotalNote(StudentId, niveauSelected, periodSelected, yearSelected);
        // console.log("STUDENT : ", student.fullname, " : ", TotalNote.total);

        //GET THE MOYENNE
        Moyenne = (sumNote / CoefficientCalcul.CoefMoyenne).toFixed(2);

        palmares.push(line); // NOTES LIST
        Total.push(sumNote); // TOTAL LIST
        Moyennes.push(Moyenne); // MOYENNE LIST

        let obj = { Student: student.fullname, StudentId: StudentId, Moyenne, Notes: line, NoteIds: idNote, Total: sumNote, Sur: CoeffTotal, Moyenne };
        listNotes.push(obj);
    }
    listNotes.sort(helper.compareValues('Moyenne', 'desc'));
    //console.log("PALMAES : ", listNotes);

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

//=============================================== PRINT =========================================
router.get('/print-palmares-notes', auth, async (req, res) => {
    let methodEvaluationCode = req.session.modEvaluation;
    let periodList = await dbController.listOfPeriod(methodEvaluationCode);
    let response = await dbClassroomController.listOfClassrooms("All");
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = req.query.yearSelected;
    let roomSelected = req.query.roomSelected;
    let periodSelected = req.query.periodSelected;

    //Coefficient de Calcul des moyennes
    let CoefficientCalcul = await dbController.CoefficientCalcul(roomSelected);
    let CoeffTotal = CoefficientCalcul.Total;
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(roomSelected);
    let niveauSelected = info.mere;

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
        let line = []; //NOTES
        let idNote = [];//ID NOTES
        let sumNote = 0;
        // let sNotes = await dbController.getStudentNotes(StudentId,niveauSelected, periodSelected, yearSelected);
        // console.log("NOTES : ", sNotes);
        for (j = 0; j < coursesList.length; j++) {
            let Course = coursesList[j];
            let note = await dbController.getStudentNoteByCourse(StudentId, Course.id_cours, niveauSelected, periodSelected, yearSelected);
            //console.log(note);
            if (note !== undefined) {
                let noteStudent = parseFloat(note.note);
                line.push(note.note);
                idNote.push(note.id_note);
                sumNote += noteStudent;
                //console.log(Course.libelle, " : ", note.note);
            } else {
                line.push("");
                idNote.push("");
                //console.log(Course.libelle, " : ", "");
            }
        }
        //GET THE TOTAL NOTE FOR THE STUDENT
        // let TotalNote = await dbController.getStudentTotalNote(StudentId, niveauSelected, periodSelected, yearSelected);
        // console.log("STUDENT : ", student.fullname, " : ", TotalNote.total);

        //GET THE MOYENNE
        Moyenne = (sumNote / CoefficientCalcul.CoefMoyenne).toFixed(2);

        palmares.push(line); // NOTES LIST
        Total.push(sumNote); // TOTAL LIST
        Moyennes.push(Moyenne); // MOYENNE LIST

        let obj = { Student: student.fullname, StudentId: StudentId, Moyenne, Notes: line, NoteIds: idNote, Total: sumNote, Sur: CoeffTotal, Moyenne };
        listNotes.push(obj);
    }
    listNotes.sort(helper.compareValues('Moyenne', 'desc'));
    //console.log("PALMAES : ", listNotes);

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
    res.render('../print/templates/palmares', params);
    // let report = "palmares";
    // let filename = report + ".pdf";
    // let pathfile = "./tmp/" + filename;
    // let template_name = "palmares";

    // await printer.print(template_name, params, pathfile);
    // //Display the file in the browser
    // let stream = fs.ReadStream(pathfile);
    // // Be careful of special characters
    // filename = encodeURIComponent(filename);
    // // Ideally this should strip them
    // res.setHeader("Content-disposition", 'inline; filename="' + filename + '"');
    // res.setHeader("Content-type", "application/pdf");
    // stream.pipe(res);
});

router.get('/print-all-bulletin', auth, async (req, res) => {
    let methodEvaluationCode = req.session.modEvaluation;
    let periodList = await dbController.listOfPeriod(methodEvaluationCode);
    let response = await dbClassroomController.listOfClassrooms("All");
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = req.query.yearSelected;
    let roomSelected = req.query.roomSelected;
    let periodSelected = req.query.periodSelected;
    let logo = helper.base64("public/images/logo/logo.png");

    //Coefficient de Calcul des moyennes
    let CoefficientCalcul = await dbController.CoefficientCalcul(roomSelected);
    let CoeffTotal = CoefficientCalcul.Total;
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(roomSelected);
    let niveauSelected = info.mere;

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
        let line = []; //NOTES
        let idNote = [];//ID NOTES
        let sumNote = 0;
        // let sNotes = await dbController.getStudentNotes(StudentId,niveauSelected, periodSelected, yearSelected);
        // console.log("NOTES : ", sNotes);
        for (j = 0; j < coursesList.length; j++) {
            let Course = coursesList[j];
            let note = await dbController.getStudentNoteByCourse(StudentId, Course.id_cours, niveauSelected, periodSelected, yearSelected);
            //console.log(note);
            if (note !== undefined) {
                let noteStudent = parseFloat(note.note);
                line.push(note.note);
                idNote.push(note.id_note);
                sumNote += noteStudent;
                //console.log(Course.libelle, " : ", note.note);
            } else {
                line.push("");
                idNote.push("");
                //console.log(Course.libelle, " : ", "");
            }
        }
        //GET THE TOTAL NOTE FOR THE STUDENT
        // let TotalNote = await dbController.getStudentTotalNote(StudentId, niveauSelected, periodSelected, yearSelected);
        // console.log("STUDENT : ", student.fullname, " : ", TotalNote.total);

        //GET THE MOYENNE
        Moyenne = (sumNote / CoefficientCalcul.CoefMoyenne).toFixed(2);

        palmares.push(line); // NOTES LIST
        Total.push(sumNote); // TOTAL LIST
        Moyennes.push(Moyenne); // MOYENNE LIST

        let obj = { Student: student.fullname, StudentId: StudentId, Moyenne, Notes: line, NoteIds: idNote, Total: sumNote, Sur: CoeffTotal, Moyenne };
        listNotes.push(obj);
    }
    listNotes.sort(helper.compareValues('Moyenne', 'desc'));
    console.log("PALMAES : ", listNotes);

    let pageTitle = "Bulletin " + info.classe + " | " + periodSelected + " " + yearSelected;

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
        logo,
        page: 'Notes',
        msg: msg,
    };
    res.render('../print/templates/all-bulletin.ejs', params);
    // let report = "allBulletin";
    // let filename = report + ".pdf";
    // let pathfile = "./tmp/" + filename;
    // let template_name = "all-bulletin";

    // await printer.print(template_name, params, pathfile);
    // //Display the file in the browser
    // let stream = fs.ReadStream(pathfile);
    // // Be careful of special characters
    // filename = encodeURIComponent(filename);
    // // Ideally this should strip them
    // res.setHeader("Content-disposition", 'inline; filename="' + filename + '"');
    // res.setHeader("Content-type", "application/pdf");
    // stream.pipe(res);
});
router.get('/print-bulletin', auth, async (req, res) => {
    let methodEvaluationCode = req.session.modEvaluation;
    let periodList = await dbController.listOfPeriod(methodEvaluationCode);
    let response = await dbClassroomController.listOfClassrooms("All");
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = req.query.yearSelected;
    let roomSelected = req.query.roomSelected;
    let periodSelected = req.query.periodSelected;
    let studentSelected = req.query.studentId;
    let place = req.query.place;

    //Coefficient de Calcul des moyennes
    let CoefficientCalcul = await dbController.CoefficientCalcul(roomSelected);
    let CoeffTotal = CoefficientCalcul.Total;
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(roomSelected);
    let niveauSelected = info.mere;

    //console.log(req.body);
    // console.log("ANE ACA : ", aneacaList);
    let msg = "";
    let studentInfo = await dbStudentController.getStudent(studentSelected);
    //COURSES LIST
    let coursesList = await dbCoursesController.listOfCoursesByClassroom(roomSelected);
    //GET STUDENT NOTES
    //let studentNotes  = await dbController.getStudentNotes(studentSelected, niveauSelected, periodSelected, yearSelected);
    let studentNotes = [];
    let sumNote = 0;
    for (j = 0; j < coursesList.length; j++) {
        let Course = coursesList[j];
        let note = await dbController.getStudentNoteByCourse(studentSelected, Course.id_cours, niveauSelected, periodSelected, yearSelected);
        //console.log(note);
        if (note !== undefined) {
            let noteStudent = parseFloat(note.note);
            studentNotes.push(note.note);
            sumNote += noteStudent;
            //console.log(Course.libelle, " : ", note.note);
        } else {
            studentNotes.push("");
        }
    }
    //GET THE MOYENNE
    let Moyenne = (sumNote / CoefficientCalcul.CoefMoyenne).toFixed(2);
    console.log("NOTES : ", studentNotes);
    let pageTitle = "Bulletin " + info.classe + " | " + periodSelected + " " + yearSelected;

    params = {
        pageTitle: pageTitle,
        data: response,
        Notes: studentNotes,
        Moyenne,
        place,
        Total: sumNote,
        TotalCoeff: CoeffTotal,
        periodList: periodList,
        periodSelected: periodSelected,
        Student: studentInfo,
        coursesList: coursesList,
        aneacaList: aneacaList,
        UserData: req.session.UserData,
        yearSelected: yearSelected,
        roomSelected: roomSelected,
        niveauSelected: niveauSelected,
        page: 'Notes',
        msg: msg,
    };
    let report = "bulletin";
    let filename = report + ".pdf";
    let pathfile = "./tmp/" + filename;
    let template_name = "bulletin";

    await printer.print(template_name, params, pathfile);
    //Display the file in the browser
    let stream = fs.ReadStream(pathfile);
    // Be careful of special characters
    filename = encodeURIComponent(filename);
    // Ideally this should strip them
    res.setHeader("Content-disposition", 'inline; filename="' + filename + '"');
    res.setHeader("Content-type", "application/pdf");
    stream.pipe(res);
});

// Exportation of this router
module.exports = router;