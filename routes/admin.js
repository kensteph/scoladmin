const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const auth = require('../middleware/auth');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
const dbController = require("../controllers/Ctrlstudent");
const dbClassroomController = require("../controllers/Ctrlclassroom");
const dbNotesController = require("../controllers/Ctrlnotes");
const helpers = require('../helpers/helper');


// STUDENT ARCHIVES
router.post('/student-live-search', auth, async (req, res) => {
    let keyWordToSearch = req.body.key;
    let studentInfo = await dbController.liveStudentSearch(keyWordToSearch);
    res.json(studentInfo);
    //console.log("LIVE-SEARCH : ", studentInfo);
});
// STUDENT ARCHIVES
router.get('/student-archives', auth, async (req, res) => {
    let studentFullName = "ARCHIVES";
    let pageTitle = studentFullName;
        res.render('../views/admin/student-archives', { pageTitle, UserData: req.session.UserData });
});
// STUDENT ARCHIVES DISPLAY RESULTS
router.post('/student-archives-result', auth, async (req, res) => {
    let response = await dbClassroomController.listOfClassrooms("All");
    let studentList = [];
    let roomSelected;
    let statutSelected = 1;
    let studentFullName = "ARCHIVES";
    let studentInfo;
    let studentIdSelected = req.body.StudentID;
    let moyennePassage = global.moyennePassage;
    let fromClass;
    let toClass;
    let fromToClass;
    let saOrSes="sa classe";//sa ou ses classes
    //INFO ABOUT THE STUDENT
    studentInfo = await dbController.getStudent(studentIdSelected);
    studentFullName = studentInfo.fullname;
    //console.log("ID-STUDENT : ", studentIdSelected, "INFO : ", studentInfo);

    //INFO ABOUT THE CLASSES
    let allClasses = await dbController.getStudentClasses(studentIdSelected);
    console.log("Student Classes : ", allClasses);
    let periodsByYear = [];
    let lastMoyGle;
    let lastYear;
    let lastClassRoom;
    
    for (let yearAca of allClasses) {
        console.log("STUDENT YEARS  : ",yearAca);
        let methodeEvaluationForThisYear = await dbNotesController.getModeEvaluation(yearAca.classroom, yearAca.aneaca);
        let methode;
        console.log("METHODE : ", methodeEvaluationForThisYear);
        if (methodeEvaluationForThisYear!=null) {
            //console.log("METHODE : ", methodeEvaluationForThisYear);
            methode = methodeEvaluationForThisYear.mode_evaluation;
            //ADD NEW PROPERTY TO ALLCLASSES ARRAY
            yearAca.evaluation=methode;
            //INFO ABOUT THE PERIODE  LIST
            let periodList = await dbNotesController.listOfPeriod(methode);
            //console.log("ALL PERIODS : ", periodList);
            periodsByYear.push(periodList);
        } else {
            methode=req.session.modEvaluation;
            //Remove that year
            allClasses.pop();
        }
        //GET THE MOY GLE FOR EACH YEAR
        let nbPeriodGle = await dbNotesController.listOfGeneralPeriod(methode);
        //console.log("PERIOD GLE : ",nbPeriodGle);
        let moyenneGleStudent = await dbNotesController.getMoyenneGleForYear(studentIdSelected,yearAca.aneaca,nbPeriodGle.length);
        let mention = helpers.studentMention(studentInfo,moyenneGleStudent.MoyGle,moyennePassage);
        let ifPromoted=mention.ifPromoted;
        let decision =mention.decision;

        moyenneGleStudent.ifPromoted=ifPromoted;
        moyenneGleStudent.aneaca=yearAca.aneaca;
        moyenneGleStudent.decision=decision;

        lastMoyGle=moyenneGleStudent;
        lastYear=yearAca.aneaca;
        lastClassRoom=yearAca.classroom;
        // console.log("YEAR : ", yearAca.aneaca, " METHODE : ", methode," NBPERIODGLE : ",nbPeriodGle.length,"MOYENNE PASSAGE : ",moyennePassage);
        // console.log("MOYENNE GLE : ",moyenneGleStudent);
    }
  // console.log("LAST GLE : ",lastMoyGle);
  let nbClass=allClasses.length;
    console.log("ALL CLASSES : ", allClasses,"SIZE : ",nbClass);
    fromClass= allClasses[0];
    toClass= allClasses[allClasses.length-1];
    let beforeLastYear;
    let fromToClassbeforeLastYear="";
    if(nbClass==1){
        fromToClass=fromClass.classe+"  "+fromClass.aneaca;
    }else{
        fromToClass=fromClass.classe+"  "+fromClass.aneaca+" à "+toClass.classe+"  "+toClass.aneaca;
        saOrSes="ses classes";
        let beforLastClass = allClasses[allClasses.length-2];
        beforeLastYear=beforLastClass.aneaca;
        toClassBeforeLast= allClasses[allClasses.length-2];
        fromToClassbeforeLastYear=fromClass.classe+"  "+fromClass.aneaca+" à "+toClassBeforeLast.classe+"  "+toClassBeforeLast.aneaca;
    }
    
    //console.log("ALL PERIODES : ", periodsByYear);

    let pageTitle = studentFullName;
    let msg = "";
    if (req.query.msg) {
        msg = req.query.msg;
    }

    params = {
        pageTitle: pageTitle,
        allClasses,
        lastMoyGle,
        lastYear,
        beforeLastYear,
        lastClassRoom,
        fromToClass,
        fromToClassbeforeLastYear,
        saOrSes,
        periodsByYear,
        data: response,
        studentInfo,
        studentIdSelected,
        studentList: studentList,
        UserData: req.session.UserData,
        roomSelected: roomSelected,
        statutSelected,
        page: 'Students',
        msg: msg,
    };
    res.render('../views/admin/student-archives-result', params);
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
router.get('/papier-entete', auth, async (req, res) => {
    res.render('../print/templates/papier-entete');
});
// Exportation of this router
module.exports = router;