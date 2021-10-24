const con = require('./database');
var self = module.exports = {
    //ADD NEW CLASSROOM
    addClassRoom: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let mother = req.body.Niveau;
            let classroomName = req.body.classroomName;
            let abrevClassroomName = req.body.abrevClassroomName;
            let sql =
                'INSERT INTO tb_classes (mere,classe,abv) VALUES (?,?,?)';
            con.query(sql, [mother, classroomName, abrevClassroomName], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            " Vous avez déja ajouté '" + classroomName + "' ",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        msg:
                            classroomName + " enregistré avec succès.",
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
    editClassroom: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let mother = req.body.Niveau;
            let classroomName = req.body.classroomName;
            let classroomID = req.body.classroomID;
            let abrevClassroomName = req.body.abrevClassroomName;
            let ifExamRoom = req.body.ExamRoom;
            let sql =
                'UPDATE tb_classes SET mere=?, classe =?, abv=?,if_exam_room=? WHERE id=?';
            // console.log(sql);
            con.query(sql, [mother, classroomName, abrevClassroomName,ifExamRoom, classroomID], function (err, result) {
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
                        msg:classroomName + " modifié avec succès...",
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
    //CLASSROOM INFO
    getclassroom: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,IF(mere=0,id,mere) as niveau FROM `tb_classes` WHERE id=? ";
            con.query(sql, [id], function (err, rows) {
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

    //ALL ACADEMIC YEAR
    getAcademicYear: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT DISTINCT(aneaca) FROM tb_affectation ORDER BY aneaca ";
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
    //Load All The classrooms
    listOfClassrooms: async function (classType) {
        let sql = "";
        let promise = new Promise((resolve, reject) => {
            
            if (classType == "Mother") {
                sql = "SELECT *,IF(mere=0,id,mere) as niveau FROM `tb_classes` WHERE mere=0 ORDER BY niveau ";
            } else {
                sql = "SELECT *,IF(mere=0,id,mere) as niveau FROM `tb_classes` ORDER BY niveau ";
            }
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        //console.log(sql);
        return data;
    },
     //GET THE NUMBER OF CLASSROOMS WITH STUDENTS
     classroomsWithStudents: async function (academicYear) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT COUNT(DISTINCT classroom) as nb_classrooms FROM tb_affectation a,tb_personnes b WHERE a.id_personne=b.id AND b.active=1 AND aneaca=?";
            con.query(sql, academicYear, function (err, rows) {
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
     //Load All The Examrooms
     listOfExamrooms: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,IF(mere=0,id,mere) as niveau FROM `tb_classes` WHERE if_exam_room=1 ORDER BY niveau ";
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
    //============================ MANAGE SETTINGS ================================

    //GET THE SETTINGS
    getSettings: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_settings ";
            con.query(sql, function (err, rows) {
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
    //EDIT SETTINGS
    editSettings: async function (req) {
        //console.log(req.body);
        let promise = new Promise((resolve, reject) => {
            let school_name = req.body.schoolName;
            let school_address = req.body.schoolAddress;
            let school_phone = req.body.schoolPhone;
            let school_email = req.body.schoolEmail;
            let school_evaluation_method = req.body.modeEvaluation;
            let director = req.body.schoolDirector;
            let coeff_passage = req.body.schoolCoeffPassage;
            let TableauHonneurToDisplay = req.body.TableauHonneur;

            let sql =
                'UPDATE tb_settings SET school_name=?,school_address=?,school_phone=?,school_email=?,school_evaluation_method=?,director=?,coeff_passage=?,honor_board=? WHERE id=1';
            // console.log(sql);
            con.query(sql, [school_name, school_address, school_phone, school_email, school_evaluation_method, director, coeff_passage,TableauHonneurToDisplay], function (err, result) {
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
                            "Modifications effectuées avec succès...",
                        nb_success: result.affectedRows,
                    };
                }

                resolve(msg);
                console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
//============================ ADMISSION ================================
    //Save Student Affectation
    studentAffectation: async function (id_personne,niveau,classroom,aneaca,acteur="System") {
    let promise = new Promise((resolve, reject) => {
        let sql = "INSERT INTO tb_affectation (id_personne,niveau,classroom,aneaca,acteur) VALUES (?,?,?,?,?)";
        // console.log(sql);
        con.query(sql, [id_personne,niveau,classroom,aneaca,acteur],async function (err, result) {
            if (err) {
                msg = await self.studentAffectationUpdate();
                // msg = {
                //     type: "danger",
                //     msg:
                //         "<font color='red'><strong>Vous avez déja affecté cet eleve.</strong></font>",
                //     debug: err
                // };
            } else {
                msg = {
                    type: "success",
                    success: true,
                    msg:
                        "Affection réalisée avec succès...",
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
    //Save Student Affectation
    studentAffectationUpdate: async function (id_personne,niveau,classroom,aneaca) {
        let promise = new Promise((resolve, reject) => {
            let sql = "UPDATE  tb_affectation SET niveau=?,classroom=? WHERE id_personne=? AND aneaca=?";
            console.log(id_personne,niveau,classroom,aneaca);
            con.query(sql, [niveau,classroom,id_personne,aneaca], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        msg:
                            "Vous avez déja affecté cet eleve.",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        success: true,
                        msg:
                            "Modification Affection réalisée avec succès...",
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
    

}