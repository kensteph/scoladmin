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

    //Save Modalites paiement
    editCourse: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let mother = req.body.Niveau;
            let classroomName = req.body.classroomName;
            let classroomID = req.body.classroomID;
            let abrevClassroomName = req.body.abrevClassroomName;
            let sql =
                'UPDATE tb_classes SET mere=?, classe =?, abv=? WHERE id=?';
            // console.log(sql);
            con.query(sql, [mother, classroomName, abrevClassroomName, classroomID], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        msg:
                            "<font color='red'><strong>Vous avez déja attribué ces paramètres.</strong></font>",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        success: true,
                        msg:
                            "<font color='green'><strong> " + classroomName + " modifié avec succès...</strong></font>",
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
            let sql = "SELECT * FROM tb_cours_par_classe as ca ,tb_cours as c WHERE c.id=ca.id_cours AND salle_classe=? ORDER BY libelle ";
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