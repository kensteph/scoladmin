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
    assignCourse: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let id_cours = req.body.Cours;
            let salle_classe = req.body.ClassRoom;
            let professeur = req.body.Prof;
            let coefficient = req.body.Coeff;
            let position = req.body.Position;

            //VALUES foR BULK INSERTION
            let finalValues = [];
            for (i = 0; i < id_cours.length; i++) {
                let value = [];
                value.push(id_cours[i]);
                value.push(salle_classe);
                value.push(professeur[i]);
                value.push(coefficient[i]);
                value.push(position[i]);
                finalValues.push(value);
            }
            console.log("VALUES : ", finalValues);
            let sql =
                'INSERT INTO tb_cours_par_classe (id_cours,salle_classe,professeur,coefficient,position) VALUES ? ';
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
                            " Assignation effectuée avec succès.",
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