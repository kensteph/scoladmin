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
const helper = require("../helpers/helper");
// COURSES List
router.get('/courses-list', auth, async (req, res) => {
    let coursesList;
    let data;
    let classrooms = await dbClassroomController.listOfClassrooms("All");
    let classroomsM = await dbClassroomController.listOfClassrooms("Mother");
    let categorieList = await dbController.listOfCategories();
    let teachersList = await dbController.listOfTeachers();
    let methodEvaluationCode = req.session.modEvaluation;
    let periodList = await dbControllerNotes.listOfPeriod(methodEvaluationCode);
    let aneacaList = await dbClassroomController.getAcademicYear();
    let salleClass = "";
    let roomSelected;
    let academicYearObj = helper.getAcademicYear();
    let currentAcademicYear =academicYearObj.Previous; //CURRENT YEAR
    let yearSelected = currentAcademicYear;
    let periodSelected;
    data = await dbController.listOfCourses(0); //SYSTEM'S COURSES
    let msg = "";
    let niveau = 0;
    if (req.query.msg) { msg = req.query.msg; }
    if (req.query.filter) {
        roomSelected = req.query.filter;
        periodSelected = req.query.periodSelected;
        yearSelected = req.query.yearSelected;
        methodEvaluationCode = req.query.modEvaluation;
        //GET INFO ABOUT THE CLASSROOM
        let info = await dbClassroomController.getclassroom(roomSelected);
        //console.log("CLASS INFO : ", info);
        niveau = info.niveau;
        salleClass = " | " + info.classe;
        //coursesList = await dbController.listOfCourses(niveau);
        coursesList = await dbController.listOfCoursesByClassroom(roomSelected,"All");

    } else {
        coursesList = data;
    }
    
    //console.log("COURSES : ", coursesList);

    for(i=0;i<coursesList.length;i++){
        let coursId=coursesList[i].id;
        let libelle=coursesList[i].libelle;
        let teacherInfo = await dbController.courseInfoTeacher(coursId,roomSelected);
        let teacher="";
        if(teacherInfo!=undefined){
            teacher=teacherInfo.fullname;
        }
        coursesList[i].teacher=teacher;
        //console.log(libelle," : ",teacher);
    }

    params = {
        pageTitle: "Gestion des cours " + salleClass,
        data: data,
        coursesList: coursesList,
        niveau: niveau,
        classrooms: classrooms,
        classroomsM,
        roomSelected,
        yearSelected,
        periodSelected,
        periodList,
        aneacaList,
        methodEvaluationCode,
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
    //console.log(req.body);
    if (req.body.actionField == "Filter") { //Filter 
        res.redirect('/courses-list?classRoomId=' + req.body.classRoomFilter + "&filter=" + req.body.classRoomFilter + "&periodSelected=" + req.body.PeriodFilter+ "&modEvaluation=" + req.body.modEvaluationFilter+ "&yearSelected=" + req.body.AneAcaFilter);
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
    // if (response.type == "success") {
    //     console.log(response);
    //     res.redirect('/courses-list?msg=' + response.msg + '&filter=' + req.body.ClassRoom);
    // } else {
    //     console.log(response.debug);
    //     res.redirect('/courses-list?msg=' + response.msg + '&filter=' + req.body.ClassRoom);
    // }
    res.json(response);
});

//MANAGE COURSES
router.post('/edit-courses-assignation', auth, async (req, res) => {
    //console.log(req.body);
    let response = await dbController.editCourseAssignment(req);
    res.json(response);
});
// ATTRIBUTION DES COURS D'UNE CLASSE A UNE AUTRE
router.post('/courses-assignation-old-list', auth, async (req, res) => {
    //console.log(req.body);
    let salleFrom = req.body.salleFrom;
    let salleTo = req.body.salleTo;
    let coursesList = await dbController.listOfCoursesByClassroom(salleFrom);
    let response = await dbController.assignCourseFromList(coursesList,salleTo);
    //console.log(response);
    res.json(response);
});
// COURSES LIST BY CLASSROOM
router.post('/getCourses-list', auth, async (req, res) => {
    //console.log(req.body);
    let classRoomId = req.body.classRoomId;
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(classRoomId);
    let niveau =info.niveau;
    let coursesList = await dbController.listOfCoursesByClassroom(classRoomId);
    //console.log(coursesList);
    res.json(coursesList);
});
// ATTRIBUTION FOR A TEACHER
router.post('/teacher-attribution', auth, async (req, res) => {
    //console.log(req.body);
    let courseSelected = req.body.courseSelected;
    let profSelected = req.body.Teacher;
    let roomSelected = req.body.classRoomId;
    let nbAtt= courseSelected.length;
    let nbSuc=0;
    for(i=0;i<nbAtt;i++){
        let courseId=courseSelected[i];
        let response = await dbController.attribCourse(profSelected,courseId,roomSelected);
        if(response.success){
            nbSuc++;
        }
    }
    let msg={msg:nbSuc+"/"+nbAtt+" attribution(s) reussie(s)"};
    res.json(msg);
});
//DET TEACHER " LIST"
router.post('/getTeacherCoursesList', auth, async (req, res) => {
    console.log(req.body);
    let id_prof=req.body.idprof;
    let coursesList = await dbController.listOfTeacherCourses(id_prof);
    //console.log(coursesList);
    res.json(coursesList);
});
//REMOVE ATTRIBUTION
router.post('/remove-attribution', auth, async (req, res) => {
    //console.log(req.body);
    let id_attrib=req.body.idAttrib;
    let response = await dbController.deleteAttribution(id_attrib);
    console.log(response);
    res.json(response);
});
//================================================= PRINTING ============================================
router.get('/print-course-palmares', auth, async (req, res) => {
    let ClassRoom = req.query.ClassRoom;
    let AneAca = req.query.AneAca;
    let periode = req.query.Periode;
    let course = req.query.Course;
    let courseCoeff = req.query.CourseCoeff;
    let courseId = req.query.CourseId;
    let Teacher = req.query.Teacher;
    let methodEvaluationCode = req.query.modEvaluation;
    let periodList = await dbControllerNotes.listOfPeriod(methodEvaluationCode);
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(ClassRoom);
    //console.log("CLASS INFO : ", info);
    //GET THE LIST
    let studentList = await dbControllerStudents.listOfStudent(ClassRoom, AneAca,1);
    let  studentNotes = [];
    for(i=0;i<studentList.length;i++){
        let idStudent = studentList[i].id_personne;
        let fullname = studentList[i].fullname;
        let notes=[];
        if (periode == "All") { 
            for(j=0;j<periodList.length;j++){
                let etape=periodList[j].periode;
                let noteInfo= await dbControllerNotes.getStudentNoteByCourse(idStudent,courseId,ClassRoom,etape,AneAca);
                let note="";
                if(noteInfo!=null){
                    note = noteInfo.note;
                }
                notes.push(note);
                console.log("STUDENT : ",fullname," ETAPE : ",etape," NOTE : ",note);
                
            }
            studentNotes.push(notes);
        }else{
            let noteInfo= await dbControllerNotes.getStudentNoteByCourse(idStudent,courseId,ClassRoom,periode,AneAca);
            let note="";
                if(noteInfo!=null){
                    note = noteInfo.note;
                }
                studentNotes.push(note);
                console.log("STUDENT : ",fullname," ETAPE : ",periode," NOTE : ",note);
        }
        
      
    }
console.log(studentNotes);
    if (periode == "All") { periode = ""; }
    let pageTitle = "Palmarès  " + course.toUpperCase() + " " + info.classe + " " + AneAca;
    let params = {
        pageTitle,
        studentList,
        periodList,
        periode,
        Teacher,
        courseCoeff,
        studentNotes
    };
    res.render('../print/templates/palmares-cours', params);
});
//COURSES LIST BY CLASS
router.get('/print-courses-list', auth, async (req, res) => {
    let info = await dbClassroomController.getclassroom(ClassRoom);
    //console.log("CLASS INFO : ", info);
    let params={};
    res.render('../print/templates/courses-list', params);
});

// Exportation of this router
module.exports = router;