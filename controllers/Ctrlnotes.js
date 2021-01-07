const con = require('./database');
var self = module.exports = {
    //============================MANAGE MODE & PERIODE EVALUATION ================================
    //ADD NEW METHOD
    addMethod: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let Methode = req.body.Methode;
            let codeMethode = req.body.codeMethode;
            let nbPeriode = req.body.nbPeriode;
            let sql =
                'INSERT INTO tb_mode_evaluations (mode_evaluation,code,nb_controles) VALUES (?,?,?)';
            con.query(sql, [Methode, codeMethode, nbPeriode], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            " Vous avez déja ajouté '" + Methode + "' ",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        msg:
                            Methode + " enregistré avec succès.",
                    };
                }

                resolve(msg);
                //console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
    //LIST EVALUATION
    listOfModeEvaluation: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_mode_evaluations  ORDER BY mode_evaluation ";
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        console.log(data);
        return data;
    },
    //EDIT COURSE'S SYSTEM
    editMethod: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let methodID = req.body.methodID;
            let Methode = req.body.Methode;
            let codeMethode = req.body.codeMethode;
            let nbPeriode = req.body.nbPeriode;
            let sql =
                'UPDATE tb_mode_evaluations SET mode_evaluation=?,code=?,nb_controles=? WHERE id=?';
            // console.log(sql);
            con.query(sql, [Methode, codeMethode, nbPeriode, methodID], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        msg:
                            "Vous avez déja ajouté",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        success: true,
                        msg:
                            Methode + " modifié avec succès...",
                        nb_success: result.affectedRows,
                    };
                }

                resolve(msg);
                //console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
    //Delete METHOD
    deleteMethod: async function (req) {
        let methodID = req.body.methodID;
        let Methode = req.body.Methode;
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_mode_evaluations  WHERE id =?";
            //console.log(sql + " ID : " + id_personne);
            con.query(sql, methodID, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Les informations concernant " + Methode + " ont été supprimées avec succès.",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //ASSING COURSE TO CLASSROOM
    addPeriod: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let periods = req.body.periodName;
            let Type = req.body.Type;
            let methodCode = req.body.methodCode;

            //VALUES foR BULK INSERTION
            let finalValues = [];
            for (i = 0; i < periods.length; i++) {
                let value = [];
                value.push(methodCode);
                value.push(periods[i]);
                value.push(Type[i]);
                finalValues.push(value);
            }
            console.log("VALUES : ", finalValues);
            let sql =
                'INSERT INTO tb_periodes_evaluation (mode_evaluation_code,periode,type_periode) VALUES ? ';
            con.query(sql, [finalValues], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            " Vous avez déja ajouté ",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        msg:
                            " Ajout des périodes effectué avec succès.",
                    };
                }

                resolve(msg);
                //console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
    //LIST PERIOD
    listOfPeriod: async function (methodEvaluationCode) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_periodes_evaluation WHERE mode_evaluation_code=?  ORDER BY id ";
            con.query(sql, methodEvaluationCode, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //======================================================== NOTES===========================
    //ASSING COURSE TO CLASSROOM
    saveNotes: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let students = req.body.studentId;
            let course = req.body.courseId;
            let notes = req.body.note;
            let courseCoeff = req.body.courseCoeff;
            let period = req.body.period;
            let niveauSelected = req.body.niveauSelected;
            let yearAca = req.body.yearAca;
            let abscence = req.body.abscence;
            let methodEvaluationCode = req.body.methodEvaluationCode

            //VALUES foR BULK INSERTION
            let finalValues = [];
            for (i = 0; i < students.length; i++) {
                if (notes[i] != "") {
                    let value = [];
                    value.push(students[i]);
                    value.push(course);
                    value.push(notes[i]);
                    value.push(period);
                    value.push(niveauSelected);
                    value.push(yearAca);
                    value.push(abscence[i]);
                    value.push(courseCoeff);
                    value.push(methodEvaluationCode);
                    finalValues.push(value);
                } else {

                }

            }
            console.log("VALUES : ", finalValues);
            let sql =
                'INSERT INTO tb_notes (etudiant,cours,note,periode,niveau,aneaca,tag,sur,mode_evaluation) VALUES ? ';
            con.query(sql, [finalValues], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            " Vous avez déja ajouté ",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        msg:
                            " Notes enregistrées  avec succès.",
                    };
                }

                resolve(msg);
                //console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },

}