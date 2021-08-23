const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const auth = require('../middleware/auth');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
const dbController = require("../controllers/Ctrlclassroom");
const dbStudentController = require("../controllers/Ctrlstudent");
const helper=require("../helpers/helper");
//ADD Classrooms to List
router.post('/classrooms-list', auth, async (req, res) => {
    let response;
    console.log(req.body);
    if (req.body.actionField == "Edit") { //EDIT
        response = await dbController.editClassroom(req);
    } else if (req.body.actionField == "Delete") { //DELETE
        response = await dbController.deleteClassroom(req);
    } else {
        if (req.body.Niveau == 0) {
            response = { msg: "Vous devez choisir le niveau" };
        } else {
            response = await dbController.addClassRoom(req);
        }

    }

    if (response.type == "success") {
        res.redirect('/classrooms-list');
    } else {
        console.log(response.msg);
        res.redirect('/classrooms-list?msg=' + response.msg);
    }

});
// Classrooms List
router.get('/classrooms-list', auth, async (req, res) => {
    let response = await dbController.listOfClassrooms("All");
    let niveau = await dbController.listOfClassrooms("Mother");
    let msg = "";
    if (req.query.msg) {
        msg = req.query.msg;
    }
    params = {
        pageTitle: "Gestion des salles de classe",
        data: response,
        niveau: niveau,
        UserData: req.session.UserData,
        page: 'Classrooms',
        msg: msg,
    };
    res.render('../views/classrooms/classrooms-list', params);
});
// EXAMROOMS List
router.get('/examrooms-list', auth, async (req, res) => {
    let academicYearObj = helper.getAcademicYear();
    // console.log("ACADEMIC YEAR OBJ : ", academicYearObj);
    let yearSelected =academicYearObj.Previous; //CURRENT YEAR
    let examRooms = await dbController.listOfExamrooms();
    let studentList = await dbStudentController.listOfStudent("All", yearSelected,1);
    let nbStudents = studentList.length;
    let nbExamRooms = examRooms.length;
    let nbStudentByRoom = Math.ceil(nbStudents/nbExamRooms);
    let splitArray =  helper.splitArray(studentList,nbExamRooms);
    let pageTitle = "Salles d'examen";

     let counts=[];
     for(i=0;i<examRooms.length;i++){
        let count = helper.countObject(splitArray[i],'classroom','abv');
        let info=[];
        for(j=0;j<count.length;j++){
            let nb=count[j].count;
            let room = count[j].examRoom;
            let txt= room+" : "+nb;
            info.push(txt);
        }
        counts.push(info.join(" | "));
     }
     console.log(counts);
    //console.log("STUDENTS : ", studentList);
    params = {
        pageTitle: pageTitle,
        examRooms,
        studentList,
        subList:splitArray,
        counts,
        UserData: req.session.UserData,
        yearSelected: yearSelected,
    };
    req.session.paramsToPrint=params;
    res.render('../views/classrooms/examrooms-list.ejs', params);
});
router.post('/examrooms-list', auth, async (req, res) => {
   // console.log(req.body);
    let Criteria = req.body.Criteria;
    let academicYearObj = helper.getAcademicYear();
    let yearSelected =academicYearObj.Previous; //CURRENT YEAR
    let examRooms = await dbController.listOfExamrooms();
    let studentList = await dbStudentController.listOfStudent("All", yearSelected,1);
    let nbExamRooms = examRooms.length;
    //console.log("ORIGINAL LIST : ",studentList);
    if(Criteria=="R"){ //RANDOMIZE THE NAME
        helper.shuffleArray(studentList); 
        console.log("SHUFFLE LIST : ",studentList);
    }
    
    // let array=[1,2,3,4,5,6,7,8,9,10];
    // helper.shuffleArray(array);
    // console.log(array);
    let splitArray =  helper.splitArray(studentList,nbExamRooms);
    let pageTitle = "Salles d'examen";
    
    
     let counts=[];
     for(i=0;i<examRooms.length;i++){
         //IF THE ARRAY WAS SHUFFLED, ORDER BY ALPHABETIC
        splitArray[i]=helper.sortArrayObj(splitArray[i]);
        let count = helper.countObject(splitArray[i],'classroom','abv');
        let info=[];
        for(j=0;j<count.length;j++){
            let nb=count[j].count;
            let room = count[j].examRoom;
            let txt= room+" : "+nb;
            info.push(txt);
        }
        counts.push(info.join(" | "));
     }
    console.log(counts);
    //console.log("STUDENTS : ", studentList);
    params = {
        pageTitle: pageTitle,
        examRooms,
        studentList,
        subList:splitArray,
        counts,
        UserData: req.session.UserData,
        yearSelected: yearSelected,
    };
    req.session.paramsToPrint=params;
    res.render('../views/classrooms/examrooms-list.ejs', params);
});
//CHANGE STUDENT AFFECTATION OR NIVEAU
router.post('/save-affectation-change-db', auth, async (req, res) => {
    console.log(req.body);
    let roomSelected = req.body.ClassRoom;
    let currentNiveau = req.body.currentNiveau;
    let aneAca = req.body.AneAca;
    let students_str = req.body.students;
    let studentSelectedArray = students_str.split(",");
    let nbStudents = studentSelectedArray.length;
    let userName = req.session.userData.userName;
    console.log("STUDENTS ID : ",studentSelectedArray,"COUNT : ",nbStudents);
    let response ;
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbController.getclassroom(roomSelected);
    let niveauSelected =info.niveau;
    if(niveauSelected == currentNiveau ){
        console.log("CHANGE OF CLASSROOM");
        for(i=0;i<nbStudents;i++){
            let studentID = studentSelectedArray[i];
            response = await dbController.studentAffectationUpdate(studentID,niveauSelected,roomSelected,aneAca);
            console.log(response);
        }
        
    }else{
        console.log("CHANGE OF NIVEAU : ","OLD : ",currentNiveau," NEW :",niveauSelected);
        for(i=0;i<nbStudents;i++){
            let studentID = studentSelectedArray[i];
            response = await dbController.studentAffectation(studentID,niveauSelected,roomSelected,aneAca,userName);
            console.log(response);
        }
    }
    // let response = await dbController.editSettings(req);
    // if (response.type == "success") {
    //     res.json(response);
    //     //res.render('../views/index.ejs');
    //     //console.log(response);
    // }

});
//================================== SETTINGS ==============================

//ADD Classrooms to List
router.post('/edit-settings', auth, async (req, res) => {
    //console.log(req.body);
    let response = await dbController.editSettings(req);
    //console.log(response);
    res.json(response);
});

//================================== PRINTING ==============================
// EXAMROOMS List
router.get('/print-examrooms-list', auth, async (req, res) => {
    let params=req.session.paramsToPrint;
    res.render('../print/templates/salle-examens', params);
});
// Exportation of this router
module.exports = router;