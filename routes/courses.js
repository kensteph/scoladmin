const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const auth = require('../middleware/auth');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
const dbController = require("../controllers/Ctrlcourses");
const dbClassroomController = require("../controllers/Ctrlclassroom");

// COURSES List
router.get('/courses-list', auth, async (req, res) => {
    let coursesList;
    let data;
    let classrooms = await dbClassroomController.listOfClassrooms("child");
    let categorieList = await dbController.listOfCategories();
    let teachersList = await dbController.listOfTeachers();
    let salleClass = "";
    data = await dbController.listOfCourses(0); //SYSTEM'S COURSES
    let msg = "";
    let niveau = 0;
    if (req.query.msg) { msg = req.query.msg; }
    if (req.query.filter) {
        //GET INFO ABOUT THE CLASSROOM
        let info = await dbClassroomController.getclassroom(req.query.filter);
        console.log("CLASS INFO : ", info);
        niveau = info.mere;
        salleClass = " | " + info.classe;
        coursesList = await dbController.listOfCoursesByClassroom(req.query.filter,"All");

    } else {
        coursesList = data;
    }

    params = {
        pageTitle: "Gestion des cours " + salleClass,
        data: data,
        coursesList: coursesList,
        niveau: niveau,
        classrooms: classrooms,
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
        res.redirect('/courses-list?classRoomId=' + req.body.classRoomId + "&filter=" + req.body.classRoomId);
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
// git config --global user.email "kenderromain@gmail.com"
// git config --global user.name "Kender Romain"



// Exportation of this router
module.exports = router;