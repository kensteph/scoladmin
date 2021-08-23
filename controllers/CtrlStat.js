const con = require('./database');
var self = module.exports = {
    //GET THE NUMBER OF STUDENTS
    studentsCount: async function (academicYear) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT COUNT(id_personne) as nb_students FROM tb_affectation a,tb_personnes b WHERE a.id_personne=b.id AND b.active=1 AND aneaca=?";
            con.query(sql, academicYear, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0].nb_students);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //GET THE NUMBER OF CLASSROOMS WITH STUDENTS
    classroomsCount: async function (academicYear) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT COUNT(DISTINCT classroom) as nb_classrooms FROM tb_affectation a,tb_personnes b WHERE a.id_personne=b.id AND b.active=1 AND aneaca=?";
            con.query(sql, academicYear, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0].nb_classrooms);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //GET THE NUMBER OF TEACHER
    teacherCount: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT COUNT(id_personne) as nb_teachers FROM tb_professeurs";
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0].nb_teachers);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //GET THE NUMBER OF COURSES
    coursesCount: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT COUNT(*) nb_courses FROM tb_cours WHERE niveau=0";
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0].nb_courses);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },

}