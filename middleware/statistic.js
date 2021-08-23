module.exports = async (req, res, next) => {
    let ctrlStats = require("../controllers/CtrlStat");
    let ctrlNotes = require("../controllers/Ctrlnotes");
    let ay = req.session.CurrentAcademicYear;
    let currentYear = ay.Previous;
    let lastPeriodeInTableNote= await ctrlNotes.getLastPeriodInTbNote(currentYear);
    let tableToDisplay = global.schoolHonor_board;
    let tableOfHonor=[];
    let title="";
    console.log("TABLE OF HONOR: ",tableToDisplay);
    //let methodEvaluationCode = await ctrlNotes.getYearModeEvaluation(currentYear);

    if(tableToDisplay=="Honorable"){
        let dbClassroomController = require("../controllers/Ctrlclassroom");
        let classroomList = await dbClassroomController.listOfClassrooms("All");
        tableOfHonor = await ctrlNotes.tableOfHonorable("All",classroomList,lastPeriodeInTableNote,currentYear);
        title="Tableau de la mention honorable - "+lastPeriodeInTableNote+" "+currentYear;
    }else{
        tableOfHonor = await ctrlNotes.tableOfHonor("All",lastPeriodeInTableNote,currentYear,5);
        title="Tableau d'honneur - "+lastPeriodeInTableNote+" "+currentYear;
    }
    //console.log(tableOfHonor);
    //STATISTICS
    let nb_students= await ctrlStats.studentsCount(currentYear);
    let nb_classrooms= await ctrlStats.classroomsCount(currentYear);
    let nb_teachers= await ctrlStats.teacherCount();
    let nb_courses= await ctrlStats.coursesCount();
    let params = {
        nb_students,
        nb_teachers,
        currentYear,
        nb_classrooms,
        nb_courses,
        tableOfHonor,
        lastPeriodeInTableNote,
        title
    }
    req.stat = params;
    console.log(ay)
    next();
};