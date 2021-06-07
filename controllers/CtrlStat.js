const con = require('./database');
var self = module.exports = {
    //GET THE NUMBER OF STUDENTS
    studentsCount: async function (academicYear) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT COUNT(id_personne) as nb_students FROM tb_affectation WHERE aneaca=?";
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
    //GET THE NUMBER OF STUDENTS
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


}