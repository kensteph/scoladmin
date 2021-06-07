module.exports = async (req, res, next) => {
    let ctrlStats = require("../controllers/CtrlStat");
    //STATISTICS
    let nb_students= await ctrlStats.studentsCount('2020-2021');
    let nb_teachers= await ctrlStats.teacherCount();
    let params = {
        nb_students,
        nb_teachers,
        test: 100
    }
    req.stat = params;
    // console.log(nbStudents)
    next();
};