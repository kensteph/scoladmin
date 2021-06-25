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

    //Edit student Info
    editStudent: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let Firstname = req.body.Firstname;
            let Lastname = req.body.Lastname;
            let Sexe = req.body.Sexe;
            let BloodType = req.body.BloodType;
            let Address = req.body.Address;
            let Phone = req.body.Phone;
            let Nif = req.body.Nif;
            if (Nif == "") { Nif = null; }
            let ImageName = req.body.ImageName;
            let StudentID = req.body.StudentID;
            let Statut = req.body.Statut;
            let sql =
                'UPDATE tb_personnes SET prenom=?, nom =?, sexe=?,groupe_sanguin=?,adresse=?,phone=?,nif=?,img_profile=?,active=? WHERE id=?';
            // console.log(sql);
            con.query(sql, [Firstname, Lastname, Sexe, BloodType, Address, Phone, Nif, ImageName, Statut, StudentID], function (err, result) {
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
    //Edit student Affectation
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

    //Student Info
    getStudent: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,af.id as id_affectation FROM tb_personnes as pers,tb_affectation as af WHERE pers.id=af.id_personne AND pers.id=? ";
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

    //Student Info CLASSES
    getStudentClasses: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_affectation   WHERE id_personne=? ORDER BY aneaca ";
            con.query(sql, [id], function (err, rows) {
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
    //Student Live Search
    liveStudentSearch: async function (keyWorkToSearch) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,CONCAT(id,' - ',prenom,' ',nom) as fullname FROM tb_personnes WHERE  CONCAT(prenom,' ',nom,' ',phone,' ',id) LIKE '%" + keyWorkToSearch + "%' OR CONCAT(prenom,' ',nom) LIKE '%" + keyWorkToSearch + "%' AND type='Student' ";
            console.log(sql);
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        // console.log(sql);
        return data;
    },
    //Load All The students
    listOfStudent: async function (classroom, aneAca, active = "All") {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            let params = [];
            if (active == "All") {
                if (classroom == "All") {
                    sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,af.id as id_affectation FROM tb_personnes as pers,tb_affectation as af WHERE pers.id=af.id_personne  AND aneaca=? ORDER BY nom,prenom";
                    params = [aneAca];
                } else {
                    sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,af.id as id_affectation FROM tb_personnes as pers,tb_affectation as af WHERE pers.id=af.id_personne AND classroom=? AND aneaca=? ORDER BY nom,prenom";
                    params = [classroom, aneAca];
                }

            } else {
                if (classroom == "All") {
                    sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,af.id as id_affectation FROM tb_personnes as pers,tb_affectation as af WHERE pers.id=af.id_personne  AND aneaca=? AND active=? ORDER BY nom,prenom";
                    params = [aneAca, active];
                } else {
                    sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,af.id as id_affectation FROM tb_personnes as pers,tb_affectation as af WHERE pers.id=af.id_personne AND classroom=? AND aneaca=? AND active=? ORDER BY nom,prenom";
                    params = [classroom, aneAca, active];
                }

            }

            console.log(sql);
            con.query(sql, params, function (err, rows) {
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