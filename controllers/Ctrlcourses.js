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
            //let professeur = req.body.Prof;
            let coefficient = req.body.Coeff;
            let position = req.body.Position;

            //VALUES foR BULK INSERTION
            let finalValues = [];
            for (i = 0; i < id_cours.length; i++) {
                let value = [];
                value.push(id_cours[i]);
                value.push(salle_classe);
                //value.push(professeur[i]);
                value.push(coefficient[i]);
                value.push(position[i]);
                finalValues.push(value);
            }
            console.log("VALUES : ", finalValues);
            let sql =
                'INSERT INTO tb_cours_par_classe (id_cours,salle_classe,coefficient,position) VALUES ? ';
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
    //ASSING COURSE TO CLASSROOM
    assignCourseFromList: async function (listCourses,targetClassRoom) {
        let promise = new Promise((resolve, reject) => {
        
            //VALUES foR BULK INSERTION
            let finalValues = [];
            for (i = 0; i < listCourses.length; i++) {
                let course = listCourses[i];
                let value = [];
                value.push(course.id_cours);
                value.push(targetClassRoom);
                value.push(course.coefficient);
                value.push(course.position);
                finalValues.push(value);
            }
            console.log("VALUES : ", finalValues);
            let sql =
                'INSERT INTO tb_cours_par_classe (id_cours,salle_classe,coefficient,position) VALUES ? ';
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
            let Coeff = req.body.EditCoeff;
            let Position = req.body.EditPos;
            let Activation = req.body.Active;
            let sql =
                'UPDATE tb_cours_par_classe SET coefficient=?,position=?,active=? WHERE id=?';
            // console.log(sql);
            con.query(sql, [Coeff, Position, Activation, assignmentID], function (err, result) {
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
                console.log(msg);
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
    //Load All The courese
    listOfCoursesByClassRoomNiveau: async function (niveau,classroom) {
        let promise = new Promise((resolve, reject) => {
            //SELECT * FROM tb_cours tc LEFT JOIN tb_cours_prof tcp ON tc.id=tcp.id_cours WHERE niveau=7 
            let sql = "";
            con.query(sql, [niveau,classroom], function (err, rows) {
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
    listOfCoursesByClassroom: async function (classRoom,active=1) {
        let promise = new Promise((resolve, reject) => {
            let sql="";
            let values=[];
            if(active=="All"){
                sql = "SELECT *,ca.id as assigment_id FROM tb_cours_par_classe as ca ,tb_cours as c WHERE c.id=ca.id_cours AND salle_classe=? ORDER BY position ";
                values= [classRoom];
            }else{
                sql= "SELECT *,ca.id as assigment_id FROM tb_cours_par_classe as ca ,tb_cours as c WHERE c.id=ca.id_cours AND salle_classe=? AND active=?  ORDER BY position ";
                values= [classRoom,active];
            }
            //console.log(sql);
            con.query(sql,values, function (err, rows) {
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
    //Load All The coureses BY CLASSROOM
    listOfCoursesByClassroomAchivesFromTbNotes: async function (classRoom,aneAca) {
        let promise = new Promise((resolve, reject) => {
            let sql="";
            let values=[];
            sql = "SELECT DISTINCT(cours),id_cours,libelle,code,sur coefficient,position FROM tb_notes as grade ,tb_cours as c , tb_cours_par_classe as cpc WHERE c.id=grade.cours AND cpc.id_cours=grade.cours AND grade.niveau=? AND aneaca=? ORDER BY position";
            values= [classRoom,aneAca];
           
            //console.log(sql);
            con.query(sql,values, function (err, rows) {
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
    courseInfoById: async function (courseID, classRoomId) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,ca.id as assigment_id FROM tb_cours_par_classe as ca ,tb_cours as c WHERE c.id=ca.id_cours AND id_cours=? AND salle_classe=? ORDER BY libelle ";
            //console.log(sql);
            con.query(sql, [courseID, classRoomId], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0]);
                }
            });
        });
        data = await promise;
        //console.log("DATA COURSE : ",data);
        return data;
    },
     //Load All The courese BY CLASSROOM
     courseInfoTeacher: async function (courseID, classRoomId) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT id_cours,libelle,id_salle,id_prof,CONCAT(prenom,' ',nom) as fullname FROM tb_cours tc,tb_cours_prof tcp,tb_personnes pers  WHERE tc.id=tcp.id_cours AND pers.id=tcp.id_prof  AND id_salle=? AND id_cours=?";
            //console.log(sql);
            con.query(sql, [classRoomId,courseID], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0]);
                }
            });
        });
        data = await promise;
        //console.log("DATA COURSE : ",data);
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
   //ATTRIBUER COURS
    attribCourse: async function (id_prof,id_cours,id_salle) {
    let promise = new Promise((resolve, reject) => {
        let sql =
            'INSERT INTO tb_cours_prof (id_prof,id_cours,id_salle) VALUES (?,?,?)';
        con.query(sql, [id_prof,id_cours,id_salle], function (err, result) {
            if (err) {
                msg = {
                    type: "danger",
                    error: true,
                    msg:
                        " Vous avez déja ajouté  ",
                    debug: err
                };
            } else {
                msg = {
                    success:true,
                    type: "success",
                    msg:
                        " enregistré avec succès.",
                };
            }

            resolve(msg);
            //console.log(msg);
        });
    });
    rep = await promise;
    return rep;
    },
    //Load All The teacher's courses
    listOfTeacherCourses: async function (idprof) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,cp.id id_attrib FROM tb_cours c,tb_cours_prof cp,tb_classes cr WHERE c.id=cp.id_cours AND cr.id=cp.id_salle AND id_prof=? ORDER BY libelle";
            con.query(sql, [idprof], function (err, rows) {
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
    //Delete ATTRIBUTION DE COURS
    deleteAttribution: async function (id_attrib) {
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_cours_prof  WHERE id =?";
            //console.log(sql + " ID : " + id_personne);
            con.query(sql, id_attrib, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        
                        msg: "Les informations  ont été supprimées avec succès.",
                        success: true
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
}