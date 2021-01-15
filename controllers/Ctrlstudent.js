const con = require('./database');
var self = module.exports = {
    //ADD NEW STUDENT
    //Save Test in the DB
    addStudent: async function (req) {
        let promise = new Promise((resolve, reject) => {

            let prenom = req.body.Firstname;
            let nom = req.body.Lastname;
            let sexe = req.body.Sexe;
            let userInfo = req.session.userData;
            let acteur = userInfo.userName;


            //   /* Begin transaction */
            con.beginTransaction(function (err) {
                if (err) { throw err; }
                //Insert info into personne table
                let sql = "INSERT INTO tb_personnes (prenom,nom,sexe) VALUES (?,?,?)";
                con.query(sql, [prenom, nom, sexe], function (err, result) {
                    if (err) {
                        console.log(err);
                        con.rollback(function () {

                        });
                    }
                    let id_personne = result.insertId;
                    let niveau = req.body.Niveau;
                    let classroom = req.body.ClassRoom;
                    let aneaca = req.body.AneAca;

                    //INSERT INFO INTO TABLE affectation
                    let sql2 = "INSERT INTO tb_affectation (id_personne,niveau,classroom,aneaca,acteur) VALUES (?,?,?,?,?)";
                    con.query(sql2, [id_personne, niveau, classroom, aneaca, acteur], async function (err, result) {
                        if (err) {
                            con.rollback(function () {
                                console.log(err);
                            });
                        }
                        //COMMIT IF ALL DONE COMPLETELY
                        con.commit(function (err) {
                            if (err) {
                                con.rollback(function () {
                                    msg = {
                                        type: "danger",
                                        msg:
                                            "Une erreur est survenue. Veuillez réessayer s'il vous plait.",
                                    };
                                    resolve(msg);
                                });
                            }
                            msg = {
                                type: "success",
                                success: true,
                                msg: "Nouvelle demande de test laboratoire ajoutée avec succès."
                            }
                            resolve(msg);
                        });

                    });
                });
            });
            /* End transaction */
        });
        data = await promise;
        //console.log(data); 
        return data;
    },

    //Save Modalites paiement
    editStudent: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let Firstname = req.body.Firstname;
            let Lastname = req.body.Lastname;
            let Sexe = req.body.Sexe;
            let StudentID = req.body.StudentID;
            let sql =
                'UPDATE tb_personnes SET prenom=?, nom =?, sexe=? WHERE id=?';
            // console.log(sql);
            con.query(sql, [Firstname, Lastname, Sexe, StudentID], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        msg:
                            "Vous avez déja attribué ces paramètres.",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        success: true,
                        msg:
                            " modifié avec succès.",
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
    //Save Modalites paiement
    editStudentAffectation: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let niveau = req.body.Niveau;
            let classroom = req.body.ClassRoom;
            let aneaca = req.body.AneAca;
            let affectationID = req.body.AffectationID;

            let sql =
                'UPDATE tb_affectation SET niveau=?, classroom =?, aneaca=? WHERE id=?';
            // console.log(sql);
            con.query(sql, [niveau, classroom, aneaca, affectationID], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        msg:
                            "Vous avez déja attribué ces paramètres.",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        success: true,
                        msg:
                            " modifié avec succès.",
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
    getStudent: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,af.id as id_affectation FROM tb_personnes as pers,tb_affectation as af WHERE pers.id=? ";
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
    listOfStudent: async function (classroom, aneAca) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,af.id as id_affectation FROM tb_personnes as pers,tb_affectation as af WHERE pers.id=af.id_personne AND classroom=? AND aneaca=? ORDER BY nom,prenom";
            //console.log(sql);
            con.query(sql, [classroom, aneAca], function (err, rows) {
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
    //Delete STUDENT DEFINITEVELY
    deleteStudent: async function (req) {
        let Firstname = req.body.Firstname;
        let Lastname = req.body.Lastname;
        let Fullname = Firstname + " " + Lastname;
        let ClassRoom = req.body.ClassRoom;

        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_personnes  WHERE id =?";
            //console.log(sql + " ID : " + id_personne);
            con.query(sql, ClassRoom, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Les informations concernant " + Fullname + " ont été supprimées avec succès.",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //Delete STUDENT DEFINITEVELY
    deleteStudentAffectation: async function (req) {
        let id_affectation = req.body.AffectationID;
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_affectation  WHERE id =?";
            //console.log(sql + " ID : " + id_personne);
            con.query(sql, id_affectation, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Affectation supprimée avec succès.",
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