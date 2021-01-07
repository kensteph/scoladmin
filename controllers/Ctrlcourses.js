const con = require('./database');
var self = module.exports = {
    //ADD NEW COURSE
    addCourse: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let libelle = req.body.courseName;
            let categorie = req.body.Categorie;
            let code = req.body.courseCode;
            let cours = libelle + "(" + code + ")";
            let sql =
                'INSERT INTO tb_cours (libelle,code,categorie) VALUES (?,?,?)';
            con.query(sql, [libelle, code, categorie,], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            " Vous avez déja ajouté '" + cours + "' ",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        msg:
                            cours + " enregistré avec succès.",
                    };
                }

                resolve(msg);
                //console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
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

    //EDIT COURSE'S SYSTEM
    editCourse: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let courseID = req.body.courseID;
            let courseName = req.body.courseName;
            let courseCode = req.body.courseCode;
            let Categorie = req.body.Categorie;
            let sql =
                'UPDATE tb_cours SET libelle=?, code =?, categorie=? WHERE id=?';
            // console.log(sql);
            con.query(sql, [courseName, courseCode, Categorie, courseID], function (err, result) {
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
                            courseName + " modifié avec succès...",
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

    //EDIT COURSE'S ASSIGNMENT
    editCourseAssignment: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let assignmentID = req.body.assignmentID;
            let courseID = req.body.EditCourse;
            let ClassRoom = req.body.ClassRoom;
            let Coeff = req.body.EditCoeff;
            let Position = req.body.EditPos;
            let Professeur = req.body.EditProf;

            let sql =
                'UPDATE tb_cours_par_classe SET id_cours=?, salle_classe =?, professeur=?,coefficient=?,position=? WHERE id=?';
            // console.log(sql);
            con.query(sql, [courseID, ClassRoom, Professeur, Coeff, Position, assignmentID], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        msg:
                            "Une erreur est survenue.Veuillez réessayez.",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        success: true,
                        msg:
                            "Assignation modifiée avec succès.",
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

    //Load All The courese
    listOfCourses: async function (niveau) {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            if (niveau == "All") {
                sql = "SELECT * FROM tb_cours WHERE niveau !=0 ORDER BY niveau ";
            } else {
                sql = "SELECT * FROM tb_cours WHERE niveau=? ORDER BY libelle ";
            }
            con.query(sql, [niveau], function (err, rows) {
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
    //Load All The courese BY CLASSROOM
    listOfCoursesByClassroom: async function (classRoom) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,ca.id as assigment_id FROM tb_cours_par_classe as ca ,tb_cours as c WHERE c.id=ca.id_cours AND salle_classe=? ORDER BY libelle ";
            // console.log(sql);
            con.query(sql, [classRoom], function (err, rows) {
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
    //Load All The courese BY CLASSROOM
    courseInfoById: async function (courseID) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,ca.id as assigment_id FROM tb_cours_par_classe as ca ,tb_cours as c WHERE c.id=ca.id_cours AND id_cours=? ORDER BY libelle ";
            // console.log(sql);
            con.query(sql, courseID, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0]);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },

    //LIST OF CATEGORIES
    listOfCategories: async function (classType) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_categorie_cours ORDER BY categorie ";
            con.query(sql, function (err, rows) {
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
    //Delete PATIENT DEFINITEVELY
    deleteClassroom: async function (req) {
        let classroomName = req.body.classroomName;
        let classroomID = req.body.classroomID;
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_classes  WHERE id =?";
            //console.log(sql + " ID : " + id_personne);
            con.query(sql, classroomID, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Les informations concernant " + classroomName + " ont été supprimées avec succès.",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },

    //LIST OF TEACHERS
    listOfTeachers: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname FROM tb_professeurs as prof,tb_personnes as pers WHERE pers.id=prof.id_personne ORDER BY nom";
            con.query(sql, function (err, rows) {
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

}