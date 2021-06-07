const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const auth = require('../middleware/auth');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
const dbController = require("../controllers/Ctrlstudent");
const dbClassroomController = require("../controllers/Ctrlclassroom");
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
    res.render('../views/admin/student-archives', { pageTitle });
});
// STUDENT ARCHIVES DISPLAY RESULTS
router.post('/student-archives-result', auth, async (req, res) => {
    let response = await dbClassroomController.listOfClassrooms("All");
    let studentList = [];
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = "2020-2021"; //CURRENT YEAR
    let roomSelected;
    let statutSelected = 1;
    let studentFullName = "ARCHIVES";
    let studentInfo;
    let studentIdSelected = req.body.StudentID;
    studentInfo = await dbController.getStudent(studentIdSelected);
    studentFullName = studentInfo.fullname;
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
// Exportation of this router
module.exports = router;