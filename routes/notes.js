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
    let academicYearObj = helper.getAcademicYear();
    let msg = "";
    if (req.query.msg) {
        msg = req.query.msg;
    }
    for(i=0;i<modeEvaluation.length;i++){
        //GET THE PERIOD LIST FOR THIS METHOD
        let pl= await dbController.listOfPeriod(modeEvaluation[i].code);
        let periods=[];
        for(p=0;p<pl.length;p++){
            periods.push(pl[p].periode+"("+pl[p].type_periode+")");
        }
        modeEvaluation[i].periodesList=periods.join("|");
    }
    //console.log(modeEvaluation);
    params = {
        pageTitle: "Gestion des périodes d'évaluation ",
        data: modeEvaluation,
        academicYearObj,
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
//PERIODES List
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
//ADD PERIODES List
router.post('/period', auth, async (req, res) => {
    console.log(req.body);
    let response = await dbController.addPeriod(req);
    res.json(response);
});
//REMOVE SINGLE PERIODE
router.post('/remove-period', auth, async (req, res) => {
    console.log(req.body);
    let periodToRemove=req.body.periodToRemove;
    let response = await dbController.deletePeriod(periodToRemove);
    console.log(response);
    res.json(response);
});
// PERIODES List
router.post('/getPeriod-list', auth, async (req, res) => {
    console.log(req.body);
    let methodEvaluationCode = req.body.methodEvaluationCode;
    //GET THE EVALUATION MODE FOR THAT YEAR
    if(req.body.academicYear){
        let roomSelected=req.body.classRoomId;
        let yearSelected=req.body.academicYear;
        methodeEvaluationForThisYear = await dbController.getModeEvaluation(roomSelected,yearSelected);
        console.log("ME",methodeEvaluationForThisYear)
        if(typeof methodeEvaluationForThisYear != 'undefined'){
            methodEvaluationCode = methodeEvaluationForThisYear.mode_evaluation;
        }else{
            methodEvaluationCode = req.session.modEvaluation;
        }
       
    }
    console.log("EVALUATION MODE : ",methodEvaluationCode);
    
    let periodList = await dbController.listOfPeriod(methodEvaluationCode);
    //console.log("PERIODE : ",periodList);
    res.json(periodList);
});
//SAVE CHANGE METHOD EVALUATION
router.post('/change-mode-evaluation', auth, async (req, res) => {
    console.log(req.body);
    let academicYear = req.body.AneAca;
    let newMode = req.body.EvaluationMode;
    let response = await dbController.changeModeEvaluation(academicYear,newMode);
    console.log(response);
    res.json(response);
});
//========================================= MANAGE NOTE =======================================
//GET COURSES LIST TO POPULATE INTO COMBOBOX 
router.post('/getCourses-list', auth, async (req, res) => {
    console.log(req.body);
    let classRoomId = req.body.classRoomId;
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(classRoomId);
    console.log("CLASS INFO : ", info);
    if(info.mere !=0){classRoomId= info.mere }
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
    let academicYearObj = helper.getAcademicYear();
    let yearSelected =academicYearObj.Previous; //CURRENT YEAR
    let Nextyear =academicYearObj.Next; //Next YEAR
    let roomSelected;
    let niveauSelected;
    let CourseSelectedId;
    let periodSelected;
    let infoCourse = [];
    console.log(req.body);
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
        niveauSelected = info.niveau;
        //GET INFO ABOUT THE COURSE
        console.log("COURSE ID : ",CourseSelectedId,"NIVEAU : ", niveauSelected);
        infoCourse = await dbCoursesController.courseInfoById(CourseSelectedId, roomSelected);
        //COURSES LIST
        coursesList = await dbCoursesController.listOfCoursesByClassroom(roomSelected);
        studentList = await dbController.listOfStudentWithoutNotes(roomSelected, CourseSelectedId, periodSelected, yearSelected);

        pageTitle = "Notes " + info.classe + " " + periodSelected + " " + yearSelected + " | " + infoCourse.libelle;
    }
    //console.log("COURSE : ", infoCourse);
    //Get only the 2 last years
    aneacaList = aneacaList.slice(aneacaList.length-2);
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
        Nextyear,
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
    let msg = response.msg;
    let ClassRoom = req.body.roomSelected;
    let AneAca = req.body.yearAca;
    let CourseSelectedId = req.body.courseId;
    let period = req.body.period;
    res.redirect('/save-notes?year=' + AneAca + '&room=' + ClassRoom + '&course=' + CourseSelectedId + '&period=' + period+'&msg='+msg);
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
    let academicYearObj = helper.getAcademicYear();
    console.log("ACADEMIC YEAR OBJ : ", academicYearObj);
    let yearSelected =academicYearObj.Previous; //CURRENT YEAR
    let methodEvaluationCode = req.session.modEvaluation;
    let periodList = await dbController.listOfPeriod(methodEvaluationCode);
    let response = await dbClassroomController.listOfClassrooms("All");
    let studentList = [];
    let coursesList = [];
    let aneacaList = await dbClassroomController.getAcademicYear();

    let roomSelected;
    let niveauSelected;
    let CourseSelectedId;
    let periodSelected;
    let infoCourse = [];
    let listNotes = [];
    //console.log(req.body);
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
        
        //GET INFO ABOUT THE CLASSROOM
        let info = await dbClassroomController.getclassroom(roomSelected);
        //niveauSelected =info.niveau;
        //if(info.mere !=0){niveauSelected= info.mere }else{niveauSelected = roomSelected;}
        //COURSES LIST
        coursesList = await dbCoursesController.listOfCoursesByClassroomAchivesFromTbNotes(roomSelected);
        studentList = await dbStudentController.listOfStudent(roomSelected, yearSelected, 1);
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
        methodEvaluationCode,
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
    console.log(req.body);
    let academicYearObj = helper.getAcademicYear();
    let currentAcademicYear =academicYearObj.Previous; //CURRENT YEAR
    let methodEvaluationCode = req.body.modEvaluationFilter;
    let yearSelected = req.body.AneAcaFilter; //CURRENT YEAR
    let roomSelected = req.body.classRoomFilter;
    let periodSelected = req.body.PeriodFilter;
    let ifLastPeriod=false;
    let ifAdmission=false;

    let periodList = await dbController.listOfPeriod(methodEvaluationCode);
    let response = await dbClassroomController.listOfClassrooms("All");
    let aneacaList = await dbClassroomController.getAcademicYear();

    //Get the last Period
    let lastPeriod = periodList[periodList.length - 1];
    console.log("LAST PERIOD : ", lastPeriod.periode,"PERIOD SELECTED : ",periodSelected);
    if(lastPeriod.periode == periodSelected || periodSelected=="All"){
        ifLastPeriod=true;
        periodSelected=lastPeriod.periode;
    }
    if(yearSelected==currentAcademicYear){
        ifAdmission = true;
    }
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(roomSelected);
    let niveauSelected =info.niveau;
    //if(info.mere !=0){niveauSelected= info.mere }else{niveauSelected = roomSelected;}
    //console.log(req.body);
    // console.log("ANE ACA : ", aneacaList);
    let msg = "";
    
    console.log("YEAR SELECTED : ",yearSelected,"CURRENT YEAR : ",currentAcademicYear,);
    //COURSES LIST
    let coursesList = await dbCoursesController.listOfCoursesByClassroomAchivesFromTbNotes(roomSelected,yearSelected);

    //Coefficient de Calcul des moyennes
    let CoefficientCalcul = dbController.CoefficientCalculFromCoursesList(coursesList);
    let CoeffTotal = CoefficientCalcul.Total;
    console.log(CoefficientCalcul);
    //STUDENTS LIST
    let studentList = await dbStudentController.listOfStudent(roomSelected, yearSelected, 1);
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
            let note = await dbController.getStudentNoteByCourse(StudentId, Course.id_cours, roomSelected, periodSelected, yearSelected);
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
        methodEvaluationCode,
        periodSelected: periodSelected,
        ifLastPeriod,
        ifAdmission,
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
//MANAGE STUDENT ADMISSION
router.post('/student-admission', auth, async (req, res) => {
    console.log("DATA RECEIVED : ",req.body);
    console.log("MOYENNE PASSAGE : ",global.moyennePassage);
    let moyennePassage=global.moyennePassage;
    let methodEvaluationCode =  req.body.methodEvaluationCode;
    let periodList = await dbController.listOfGeneralPeriod(methodEvaluationCode);
    let nbPeriodGle = periodList.length;
    let aneacaList = await dbClassroomController.getAcademicYear();
    let academicYearObj = helper.getAcademicYear();
    let yearSelected = req.body.yearSelected;
    let roomSelected = req.body.roomSelected;
    let periodSelected = req.body.periodSelected;
    console.log(" NB PERIOD GEN : ",nbPeriodGle);
    
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(roomSelected);
    let niveauSelected=info.niveau;
    let Nextniveau=parseInt(info.niveau)+1;
    let infoNext = await dbClassroomController.getclassroom(Nextniveau);
    let netxAcaYear = academicYearObj.Next;
    let nextClassName = infoNext.classe+" "+netxAcaYear;
    console.log(" CURRENT CLASS : ",info.classe,academicYearObj.Previous," NEXT CLASS : ",nextClassName);
    //if(info.mere !=0){niveauSelected= info.mere }else{niveauSelected = roomSelected;}
    //console.log(req.body);
    // console.log("ANE ACA : ", aneacaList);
    let msg = "";

    let studentList = await dbStudentController.listOfStudent(roomSelected, yearSelected, 1);
    //COURSES LIST
    let coursesList = await dbCoursesController.listOfCoursesByClassroomAchivesFromTbNotes(roomSelected,yearSelected);
    //Coefficient de Calcul des moyennes
    let CoefficientCalcul = await dbController.CoefficientCalculFromCoursesList(coursesList);

    let bulletins=[];
    let countSuccess=0;
    let countFail=0;
    let successID=[];
    let failID=[];

    for (i = 0; i < studentList.length; i++) {
                    let studentInfo = studentList[i] ;
                    let studentNotes = [];
                    let sumNoteGenerale =0;
                    let idStudent = studentInfo.id_personne;
                    //FOR EAcH COURSE
                    for (j = 0; j < coursesList.length; j++) {
                        let Course = coursesList[j];
                        let sumNote = 0;
                            //FOR EAcH PERIOD
                            for (p = 0; p < periodList.length; p++) {
                                
                                let periodSelected = periodList[p].periode;

                                let note = await dbController.getStudentNoteByCourse(idStudent, Course.id_cours, roomSelected, periodSelected, yearSelected);
                                
                                    if (note !== undefined) {
                                        let noteStudent = parseFloat(note.note);
                                        //studentNotes.push(note.note);
                                        sumNote += noteStudent;
                                        //console.log(periodSelected," - ",Course.libelle, " : ", note.note);
                                    } else {
                                        //studentNotes.push("");
                                    }
                                    
                                }

                        //NOTE GENERALE
                        let noteGen = parseFloat((sumNote/nbPeriodGle).toFixed(2));
                        sumNoteGenerale+=parseFloat(noteGen);
                        studentNotes.push(noteGen);
                        //console.log("NOTE GLE "," - ",Course.libelle, " : ", sumNote,"/",nbPeriodGle,"=",noteGen);        
                        
                    }
                    
                    //GET THE MOYENNE
                    let Moyenne = (sumNoteGenerale / CoefficientCalcul.CoefMoyenne).toFixed(2);
                    let promoted = 0;
                    
                    if(Moyenne>=moyennePassage){
                        promoted = 1;
                        countSuccess++;
                        successID.push(idStudent);
                    }else{
                        countFail++;
                        failID.push(idStudent);
                    }
                    sumNoteGenerale = sumNoteGenerale.toFixed(2);
                    //console.log(i+1,"-", studentInfo.fullname);
                    //console.log("MOY GLE : ",Moyenne," SUR ",moyennePassage," PROMU,E : ",promoted);
                    let studentBulletin = {
                        Student:studentInfo.fullname,
                        Moyenne,
                        promoted,
                    };
                    //console.log("BULLETIN",studentBulletin);
                   bulletins.push(studentBulletin);
    }
    let data={bulletins,countSuccess,countFail,Nextniveau,nextClassName,netxAcaYear,successID,failID};
    req.session.successID=successID;
    req.session.failID=failID;
    req.session.Nextniveau=Nextniveau;
    req.session.netxAcaYear=netxAcaYear;
    console.log(data,"SUCCESS : ",countSuccess,"  FAIL : ",countFail);
    res.json(data);
});
//TABLEAU d'HONNEUR
router.get('/tableau-honneur', auth, async (req, res) => {
    let academicYearObj = helper.getAcademicYear();
    let currentAcademicYear =academicYearObj.Previous; //CURRENT YEAR
    let methodEvaluationCode = req.session.modEvaluation;
    let yearSelected = currentAcademicYear; //CURRENT YEAR
    let roomSelected="All";
    let periodSelected='Etape 1';
    let classRoomStudent=' de l\'ecole ';
    let mention ='Honneur';
    let infoClassRoom ;
    let displayClassroom=false;
    let classroomList = await dbClassroomController.listOfClassrooms("All");
    let aneacaList = await dbClassroomController.getAcademicYear();
    let StudentToDisplay= [];

    if(req.query.ClassRoom){
        console.log("params",req.query);
        roomSelected=req.query.ClassRoom;
        periodSelected=req.query.Period;
        yearSelected=req.query.AneAca;
        methodEvaluationCode=req.query.modEvaluation;
        mention =req.query.Mention;
    }

    if(roomSelected!="All"){
        //GET INFO ABOUT THE CLASSROOM
         infoClassRoom = await dbClassroomController.getclassroom(roomSelected);
         //niveauSelected =infoClassRoom.niveau;
         classRoomStudent = infoClassRoom.classe;
    }else{
        displayClassroom=true;
    }
    
    let periodList = await dbController.listOfPeriod(methodEvaluationCode);
    
    if(mention =='Honneur'){
        StudentToDisplay= await dbController.tableOfHonor(roomSelected,periodSelected,yearSelected);
    }else{
        StudentToDisplay= await dbController.tableOfHonorable(roomSelected,classroomList,periodSelected,yearSelected);
    }
       
    let pageTitle = "Tableau d'honneur "+classRoomStudent+" "+periodSelected+" "+yearSelected;
    
    if(mention=="Honorable"){
        pageTitle = "Tableau de la mention Honorable "+classRoomStudent+" "+periodSelected+" "+yearSelected;
    }
    params = {
        pageTitle: pageTitle,
        studentList :StudentToDisplay,
        data: classroomList,
        periodList: periodList,
        methodEvaluationCode,
        aneacaList: aneacaList,
        UserData: req.session.UserData,
        yearSelected: yearSelected,
        roomSelected ,
        periodSelected,
        displayClassroom,
        page: 'Notes',
    };
    req.session.paramsToPrint=params;
    res.render('../views/notes/tableau-honneur', params);
});
//=============================================== PRINT =========================================
router.get('/print-palmares-notes', auth, async (req, res) => {
    let methodEvaluationCode =  req.query.methodEvaluationCode;
    let periodList = await dbController.listOfPeriod(methodEvaluationCode);
    let response = await dbClassroomController.listOfClassrooms("All");
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = req.query.yearSelected;
    let roomSelected = req.query.roomSelected;
    let periodSelected = req.query.periodSelected;

    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(roomSelected);
    // let niveauSelected =info.niveau;
    //if(info.mere !=0){niveauSelected= info.mere }else{niveauSelected = roomSelected;}
    //console.log(req.body);
    // console.log("ANE ACA : ", aneacaList);
    let msg = "";
    
    //COURSES LIST
    let coursesList = await dbCoursesController.listOfCoursesByClassroomAchivesFromTbNotes(roomSelected,yearSelected);
    //console.log("COURSES LIST : ",coursesList);
    //Coefficient de Calcul des moyennes
    let CoefficientCalcul = await dbController.CoefficientCalculFromCoursesList(coursesList);
    let CoeffTotal = CoefficientCalcul.Total;

    //STUDENTS LIST
    let studentList = await dbStudentController.listOfStudent(roomSelected, yearSelected, 1);
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
            let note = await dbController.getStudentNoteByCourse(StudentId, Course.id_cours, roomSelected, periodSelected, yearSelected);
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
    listNotes.sort(helper.compareValues('Student'));
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
        page: 'Notes',
        msg: msg,
    };
    res.render('../print/templates/palmares', params);

});
router.get('/print-palmares-general', auth, async (req, res) => {
    let methodEvaluationCode =  req.query.methodEvaluationCode;
    let periodList = await dbController.listOfGeneralPeriod(methodEvaluationCode);
    let nbPeriodGle = periodList.length;
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = req.query.yearSelected;
    let roomSelected = req.query.roomSelected;
    let periodSelected = req.query.periodSelected;
    //console.log(" NB PERIOD GEN : ",nbPeriodGle);
    
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(roomSelected);
    // let niveauSelected =info.niveau;
    //if(info.mere !=0){niveauSelected= info.mere }else{niveauSelected = roomSelected;}
    //console.log(req.body);
    // console.log("ANE ACA : ", aneacaList);
    let msg = "";

    let studentList = await dbStudentController.listOfStudent(roomSelected, yearSelected, 1);
    //COURSES LIST
    let coursesList = await dbCoursesController.listOfCoursesByClassroomAchivesFromTbNotes(roomSelected,yearSelected);
    //Coefficient de Calcul des moyennes
    let CoefficientCalcul = await dbController.CoefficientCalculFromCoursesList(coursesList);
    let CoeffTotal = CoefficientCalcul.Total;

    let bulletins=[];
    for (i = 0; i < studentList.length; i++) {
                    let studentInfo = studentList[i] ;
                    let studentNotes = [];
                    let sumNoteGenerale =0;
                    //console.log("===================================================================");
                    //console.log("STUDENT : ", studentInfo.fullname);
                    //FOR EAcH COURSE
                    for (j = 0; j < coursesList.length; j++) {
                        let Course = coursesList[j];
                        let sumNote = 0;
                            //FOR EAcH PERIOD
                            for (p = 0; p < periodList.length; p++) {
                                
                                let periodSelected = periodList[p].periode;

                                let note = await dbController.getStudentNoteByCourse(studentInfo.id_personne, Course.id_cours, roomSelected, periodSelected, yearSelected);
                                
                                    if (note !== undefined) {
                                        let noteStudent = parseFloat(note.note);
                                        //studentNotes.push(note.note);
                                        sumNote += noteStudent;
                                        //console.log(periodSelected," - ",Course.libelle, " : ", note.note);
                                    } else {
                                        //studentNotes.push("");
                                    }
                                    
                                }

                        //NOTE GENERALE
                        let noteGen = parseFloat((sumNote/nbPeriodGle).toFixed(2));
                        sumNoteGenerale+=parseFloat(noteGen);
                        studentNotes.push(noteGen);
                        //console.log("NOTE GLE "," - ",Course.libelle, " : ", sumNote,"/",nbPeriodGle,"=",noteGen);        
                        
                    }
                    
                    //GET THE MOYENNE
                    let Moyenne = (sumNoteGenerale / CoefficientCalcul.CoefMoyenne).toFixed(2);
                    sumNoteGenerale = sumNoteGenerale.toFixed(2);
                    let studentBulletin = {
                        Student:studentInfo.fullname,
                        notes:studentNotes,
                        sumNoteGenerale,
                        Moyenne,
                        CoeffTotal
                    };
                    console.log("BULLETIN",studentBulletin);
                   bulletins.push(studentBulletin);
    }
    let pageTitle = "Palmarès Général " + info.classe + " | " + yearSelected;
    
    params = {
        pageTitle: pageTitle,
        bulletins,
        periodList: periodList,
        periodSelected: periodSelected,
        coursesList: coursesList,
        aneacaList: aneacaList,
        CoeffTotal,
        UserData: req.session.UserData,
        yearSelected: yearSelected,
        roomSelected: roomSelected,
        page: 'Notes',
        msg: msg,
    };
    res.render('../print/templates/palmares-general', params);
});
router.get('/print-all-bulletin', auth, async (req, res) => {
    let methodEvaluationCode =  req.query.methodEvaluationCode;
    let periodList = await dbController.listOfPeriod(methodEvaluationCode);
    let response = await dbClassroomController.listOfClassrooms("All");
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = req.query.yearSelected;
    let roomSelected = req.query.roomSelected;
    let periodSelected = req.query.periodSelected;
    
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(roomSelected);
    // let niveauSelected =info.niveau;
    //if(info.mere !=0){niveauSelected= info.mere }else{niveauSelected = roomSelected;}
    //console.log(req.body);
    // console.log("ANE ACA : ", aneacaList);
    let msg = "";
    //COURSES LIST
    let coursesList = await dbCoursesController.listOfCoursesByClassroomAchivesFromTbNotes(roomSelected,yearSelected);
    //Coefficient de Calcul des moyennes
    let CoefficientCalcul = await dbController.CoefficientCalculFromCoursesList(coursesList);
    let CoeffTotal = CoefficientCalcul.Total;

    //STUDENTS LIST
    let studentList = await dbStudentController.listOfStudent(roomSelected, yearSelected, 1);
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
            let note = await dbController.getStudentNoteByCourse(StudentId, Course.id_cours, roomSelected, periodSelected, yearSelected);
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
        let eleve= student.prenom+" "+student.nom.toUpperCase()+" ("+student.dossier+")";
        let obj = { Student: eleve, StudentId: StudentId, Moyenne, Notes: line, NoteIds: idNote, Total: sumNote, Sur: CoeffTotal, Moyenne };
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
        page: 'Notes',
        msg: msg,
    };
    res.render('../print/templates/all-bulletin.ejs', params);
});
router.get('/print-bulletin', auth, async (req, res) => {
    let methodEvaluationCode =  req.query.methodEvaluationCode;
    let periodList = await dbController.listOfPeriod(methodEvaluationCode);
    let response = await dbClassroomController.listOfClassrooms("All");
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = req.query.yearSelected;
    let roomSelected = req.query.roomSelected;
    let periodSelected = req.query.periodSelected;
    let studentSelected = req.query.studentId;
    let place = req.query.place;

    
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(roomSelected);
    // let niveauSelected =info.niveau;
    //if(info.mere !=0){niveauSelected= info.mere }else{niveauSelected = roomSelected;}
    //console.log(req.body);
    // console.log("ANE ACA : ", aneacaList);
    let msg = "";
    let studentInfo = await dbStudentController.getStudent(studentSelected);
    //COURSES LIST
    let coursesList = await dbCoursesController.listOfCoursesByClassroomAchivesFromTbNotes(roomSelected,yearSelected);
    //Coefficient de Calcul des moyennes
    let CoefficientCalcul = await dbController.CoefficientCalculFromCoursesList(coursesList);
    let CoeffTotal = CoefficientCalcul.Total;

    //GET STUDENT NOTES
    //let studentNotes  = await dbController.getStudentNotes(studentSelected, niveauSelected, periodSelected, yearSelected);
    let studentNotes = [];
    let sumNote = 0;
    for (j = 0; j < coursesList.length; j++) {
        let Course = coursesList[j];
        let note = await dbController.getStudentNoteByCourse(studentSelected, Course.id_cours, roomSelected, periodSelected, yearSelected);
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
    //console.log("NOTES : ", studentNotes);
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
        page: 'Notes',
        msg: msg,
    };
    res.render('../print/templates/bulletin', params);
});
router.get('/print-bulletin-general', auth, async (req, res) => {
    let methodEvaluationCode =  req.query.methodEvaluationCode;
    let periodList = await dbController.listOfGeneralPeriod(methodEvaluationCode);
    let yearSelected = req.query.yearSelected;
    let roomSelected = req.query.roomSelected;
    let studentSelected = req.query.studentId;
    let moyennePassage = global.moyennePassage;
    //console.log(periodList," NB PERIOD GEN : ",nbPeriodGeneral);
    
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(roomSelected);
    // let niveauSelected =info.niveau;
    let msg = "";
    let studentInfo = await dbStudentController.getStudent(studentSelected);
    //COURSES LIST
    let coursesList = await dbCoursesController.listOfCoursesByClassroomAchivesFromTbNotes(roomSelected,yearSelected);
    //Coefficient de Calcul des moyennes
    let CoefficientCalcul = await dbController.CoefficientCalculFromCoursesList(coursesList);
    let CoeffTotal = CoefficientCalcul.Total;

    
    let studentNotesEachPeriod = [];
    let studentTotalNote=[];
    let studentMoyenne=[];
    //FOR EAcH PERIOD
    for (p = 0; p < periodList.length; p++) {
        let studentNotes = [];
        let sumNote = 0;
        //FOR EAcH COURSE
        for (j = 0; j < coursesList.length; j++) {

        let Course = coursesList[j];
        let periodSelected = periodList[p].periode;

        let note = await dbController.getStudentNoteByCourse(studentSelected, Course.id_cours, roomSelected, periodSelected, yearSelected);
        
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
        studentNotesEachPeriod.push(studentNotes);
        studentTotalNote.push(sumNote);
        studentMoyenne.push(Moyenne);
    }
    
    // console.log("NOTES : ", studentNotesEachPeriod);
    // console.log("TOTAL : ", studentTotalNote);
    // console.log("MOYENNE : ",studentMoyenne);
    let lastMoyenne= studentMoyenne[studentMoyenne.length-1];
    let moyGen = dbController.moyenneGenerale(periodList,studentMoyenne);
    let mention = helper.studentMention(studentInfo,moyGen,moyennePassage);
    let ifPromoted=mention.ifPromoted;
    let decision =mention.decision;
    let pageTitle = "Bulletin Général " + info.classe + " | " + yearSelected;

    params = {
        pageTitle: pageTitle,
        Notes: studentNotesEachPeriod,
        studentTotalNote,
        studentMoyenne,
        CoeffTotal,
        lastMoyenne,
        moyGen,
        decision,
        periodList: periodList,
        Student: studentInfo,
        coursesList: coursesList,
        yearSelected: yearSelected,
        roomSelected: roomSelected,
        page: 'Notes',
        msg: msg,
    };
    res.render('../print/templates/bulletin-general', params);
});
router.get('/print-all-bulletin-general', auth, async (req, res) => {
    let methodEvaluationCode =  req.query.methodEvaluationCode;
    let periodList = await dbController.listOfGeneralPeriod(methodEvaluationCode);
    let aneacaList = await dbClassroomController.getAcademicYear();
    let yearSelected = req.query.yearSelected;
    let roomSelected = req.query.roomSelected;
    let periodSelected = req.query.periodSelected;
    let moyennePassage = global.moyennePassage;
    //console.log(periodList," NB PERIOD GEN : ",nbPeriodGeneral);
    
    //GET INFO ABOUT THE CLASSROOM
    let info = await dbClassroomController.getclassroom(roomSelected);
    // let niveauSelected =info.niveau;
    //if(info.mere !=0){niveauSelected= info.mere }else{niveauSelected = roomSelected;}
    //console.log(req.body);
    // console.log("ANE ACA : ", aneacaList);
    let msg = "";

    let studentList = await dbStudentController.listOfStudent(roomSelected, yearSelected, 1);
    //COURSES LIST
    let coursesList = await dbCoursesController.listOfCoursesByClassroomAchivesFromTbNotes(roomSelected,yearSelected);
    //Coefficient de Calcul des moyennes
    let CoefficientCalcul = await dbController.CoefficientCalculFromCoursesList(coursesList);
    let CoeffTotal = CoefficientCalcul.Total;

    let bulletins=[];
    for (i = 0; i < studentList.length; i++) {

                    let studentInfo = studentList[i] ;

                    
                    let studentNotesEachPeriod = [];
                    let studentTotalNote=[];
                    let studentMoyenne=[];
                    //FOR EAcH PERIOD
                    for (p = 0; p < periodList.length; p++) {
                        let studentNotes = [];
                        let sumNote = 0;
                        //FOR EAcH COURSE
                        for (j = 0; j < coursesList.length; j++) {

                        let Course = coursesList[j];
                        let periodSelected = periodList[p].periode;

                        let note = await dbController.getStudentNoteByCourse(studentInfo.id_personne, Course.id_cours, roomSelected, periodSelected, yearSelected);
                        
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
                        studentNotesEachPeriod.push(studentNotes);
                        studentTotalNote.push(sumNote);
                        studentMoyenne.push(Moyenne);
                    }
                    
                    // console.log("NOTES : ", studentNotesEachPeriod);
                    // console.log("TOTAL : ", studentTotalNote);
                    // console.log("MOYENNE : ",studentMoyenne);
                    let lastMoyenne= studentMoyenne[studentMoyenne.length-1];
                    let moyGen = dbController.moyenneGenerale(periodList,studentMoyenne);
                    let mention = helper.studentMention(studentInfo,moyGen,moyennePassage);
                    let ifPromoted=mention.ifPromoted;
                    let decision =mention.decision;
                    let studentBulletin = {
                        Student:studentInfo,
                        notes:studentNotesEachPeriod,
                        studentTotalNote,
                        studentMoyenne,
                        lastMoyenne,
                        moyGen,
                        ifPromoted,
                        decision,
                    };
                    //console.log("BULLETIN",studentBulletin);
                   bulletins.push(studentBulletin);
    }
    let pageTitle = "Bulletin Général " + info.classe + " | " + yearSelected;

    params = {
        pageTitle: pageTitle,
        bulletins,
        periodList: periodList,
        periodSelected: periodSelected,
        coursesList: coursesList,
        aneacaList: aneacaList,
        CoeffTotal,
        UserData: req.session.UserData,
        yearSelected: yearSelected,
        roomSelected: roomSelected,
        page: 'Notes',
        msg: msg,
    };
    res.render('../print/templates/all-bulletin-general', params);
});
// TABLEAU DE BORD
router.get('/print-tableau-honneur', auth, async (req, res) => {
    let params=req.session.paramsToPrint;
    res.render('../print/templates/tableau-honneur', params);
});
router.get('/print-releve-notes', auth, async (req, res) => {
    let yearSelected = req.query.yearSelected;
    let roomSelected = req.query.roomSelected;
    let fromToClass = req.query.fromToClass;
    let studentSelected = req.query.studentId;
    let sexe="Il";
    let saOrSesClasse=req.query.saOrSesClasse ;
    let studentInfo = await dbStudentController.getStudent(studentSelected);

    if(studentInfo.sexe=="F"){ sexe="Elle"; }
    //COURSES LIST
    let coursesList = await dbCoursesController.listOfCoursesByClassroomAchivesFromTbNotes(roomSelected,yearSelected);
    //GET STUDENT NOTES
    let methodeEvaluationForThisYear = await dbController.getModeEvaluation(roomSelected,yearSelected);
    let methode = methodeEvaluationForThisYear.mode_evaluation;
    //GET THE MOY GLE FOR THE LAST YEAR
    let nbPeriodGle = await dbController.listOfGeneralPeriod(methode);
    //console.log("PERIOD GLE : ",nbPeriodGle);
    let moyenneGleStudent = await dbController.getMoyenneGleForYear(studentSelected,yearSelected,nbPeriodGle.length);
    console.log("INFO : ",moyenneGleStudent);
    
    let studentNotes = [];
    let sumNote = 0;
    //GET THE MOYENNE
    let Moyenne = 0;

    params = {
        NotesInfo: moyenneGleStudent,
        fromToClass,
        Student: studentInfo,
        sexe,
        saOrSesClasse,
        coursesList: coursesList,
        UserData: req.session.UserData,
    };
    res.render('../print/templates/releve-notes', params);
});
//========================================= ADDMISSION =======================================

router.post('/valider-admission', auth, async (req, res) => {
    console.log(req.session);
    let successID = req.session.successID;
    let failID = req.session.failID;
    let Nextniveau = req.session.Nextniveau;
    let PreviousNiveau =parseInt(Nextniveau)-1 ;
    let netxAcaYear = req.session.netxAcaYear;
    let nbSuccess = successID.length;
    let nbFail = failID.length;
    let Total = nbSuccess+nbFail;
    let transSucceed=0;
    //SUCCESS
    console.log("SUCCESS ===> ",Nextniveau);
    for(i=0;i<nbSuccess;i++){
        let info = await dbClassroomController.studentAffectation(successID[i],Nextniveau,Nextniveau,netxAcaYear);
        if(info.success){
            transSucceed++;
        }
        //console.log("ID : ",successID[i],info);
    }
    //FAIL
    console.log("FAIL =====> ",PreviousNiveau);
    for(i=0;i<nbFail;i++){
        let info = await dbClassroomController.studentAffectation(failID[i],PreviousNiveau,PreviousNiveau,netxAcaYear);
        if(info.success){
            transSucceed++;
        }
        //console.log("ID : ",successID[i],info);
    }
    console.log(transSucceed,"/",Total);
    res.json({transSucceed,Total,nbFail,nbSuccess});
});

// Exportation of this router
module.exports = router;