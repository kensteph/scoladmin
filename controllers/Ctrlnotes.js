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
    //Load All The classrooms
    listOfStudentWithoutNotes: async function (classroom, courseId, niveau, period, aneaca) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,af.id as id_affectation FROM tb_personnes as pers,tb_affectation as af WHERE pers.id=af.id_personne AND classroom=? AND aneaca=? AND id_personne NOT IN ( SELECT etudiant FROM tb_notes WHERE niveau=? AND periode=? AND aneaca=? AND cours=?) ORDER BY nom,prenom";
            //console.log(sql);
            con.query(sql, [classroom, aneaca, niveau, period, aneaca, courseId], function (err, rows) {
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
    //SAVE NOTES
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
            if (finalValues.length > 0) {
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
            } else {
                msg = {
                    type: "danger",
                    error: true,
                    msg:
                        " Aucune note n'a été enregistrée.... ",
                };
                resolve(msg);
                //console.log(msg)
            }

        });
        rep = await promise;
        return rep;
    },
    //SAVE SINGLE NOTE
    saveSingleNote: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let student = req.body.studentId;
            let course = req.body.courseId;
            let note = req.body.note;
            let courseCoeff = req.body.coefficient;
            let period = req.body.periodSelected;
            let niveauSelected = req.body.niveauSelected;
            let yearAca = req.body.yearSelected;
            let abscence = req.body.abscence;
            let methodEvaluationCode = req.body.methodEvaluationCode;

            //VALUES foR BULK INSERTION
            let values = [student, course, note, period, niveauSelected, yearAca, abscence, courseCoeff, methodEvaluationCode];
            //console.log("VALUES : ", values);
            if (note != "") {
                let sql =
                    'INSERT INTO tb_notes (etudiant,cours,note,periode,niveau,aneaca,tag,sur,mode_evaluation) VALUES (?,?,?,?,?,?,?,?,?) ';
                con.query(sql, values, function (err, result) {
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
                                " Note enregistrée  avec succès.",
                        };
                    }

                    resolve(msg);
                    //console.log(msg);
                });
            } else {
                msg = {
                    type: "danger",
                    error: true,
                    msg:
                        " Aucune note n'a été enregistrée.... ",
                };
                resolve(msg);
                //console.log(msg)
            }

        });
        rep = await promise;
        return rep;
    },
    //EDIT SINGLE NOTE
    editSingleNote: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let student = req.body.studentId;
            let course = req.body.courseId;
            let note = req.body.note;
            let idNote = req.body.idNote;
            let courseCoeff = req.body.coefficient;
            let period = req.body.periodSelected;
            let niveauSelected = req.body.niveauSelected;
            let yearAca = req.body.yearSelected;
            let abscence = req.body.abscence;
            let methodEvaluationCode = req.body.methodEvaluationCode;

            //VALUES foR BULK INSERTION
            let values = [note, abscence, courseCoeff, methodEvaluationCode, idNote];
            //console.log("VALUES : ", values);
            if (note != "") {
                let sql =
                    'UPDATE  tb_notes SET note = ?,tag=?,sur=?,mode_evaluation=? WHERE  id =?';
                con.query(sql, values, function (err, result) {
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
                                " Note modifiée  avec succès.",
                        };
                    }

                    resolve(msg);
                    //console.log(msg);
                });
            } else {
                msg = {
                    type: "danger",
                    error: true,
                    msg:
                        " Aucune note n'a été enregistrée.... ",
                };
                resolve(msg);
                //console.log(msg)
            }

        });
        rep = await promise;
        return rep;
    },
    //GET STUDENT NOTE BY COURSE
    getStudentNoteByCourse: async function (studentId, courseId, niveau, period, aneaca) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,tb_notes.id as id_note FROM tb_notes ,tb_cours WHERE tb_notes.cours=tb_cours.id AND etudiant=? AND tb_notes.niveau=? AND periode=? AND aneaca=? AND cours=? ";
            con.query(sql, [studentId, niveau, period, aneaca, courseId], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0]);
                }
            });
        });
        data = await promise;
        //console.log(studentId, niveau, period, aneaca);
        return data;
    },
    //GET STUDENT NOTES
    getStudentNotes: async function (studentId, niveau, period, aneaca) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_notes ,tb_cours WHERE tb_notes.cours=tb_cours.id AND etudiant=? AND tb_notes.niveau=? AND periode=? AND aneaca=? ORDER BY cours ";
            con.query(sql, [studentId, niveau, period, aneaca], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        console.log(studentId, niveau, period, aneaca);
        return data;
    },
    //GET STUDENT NOTE BY COURSE
    getStudentTotalNote: async function (studentId, niveau, period, aneaca) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT SUM(note) as total FROM tb_notes ,tb_cours WHERE tb_notes.cours=tb_cours.id AND etudiant=? AND tb_notes.niveau=? AND periode=? AND aneaca=?";
            con.query(sql, [studentId, niveau, period, aneaca], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0]);
                }
            });
        });
        data = await promise;
        //console.log(studentId, niveau, period, aneaca);
        return data;
    },
    //Coeficient de clacul des moyennes par salle de classe
    CoefficientCalcul: async function (classroom) {
        let promise = new Promise((resolve, reject) => {
            let sql =
                'SELECT SUM(coefficient) as total FROM tb_cours_par_classe WHERE salle_classe=? AND active=1';
            con.query(sql, classroom, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    coef = rows[0].total * 0.1;
                    info = { Total: rows[0].total, CoefMoyenne: coef };
                    resolve(info);
                }
            });
        });
        data = await promise;
        return data;
    },

}