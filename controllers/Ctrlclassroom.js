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

    //CLASSROOM INFO
    getclassroom: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_classes WHERE id=? ";
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
    //Load All The classrooms
    listOfClassrooms: async function (classType) {
        let promise = new Promise((resolve, reject) => {
            let sql = ""
            if (classType == "Mother") {
                sql = "SELECT * FROM tb_classes WHERE mere=0 ORDER BY id ";
            } else {
                sql = "SELECT * FROM tb_classes WHERE mere!=0 ORDER BY id ";
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

}