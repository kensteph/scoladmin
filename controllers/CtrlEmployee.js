const con = require('./database');
var self = module.exports = {
    //Add Teacher
    addTeacher: async function (req) {
        let promise = new Promise((resolve, reject) => {

            let prenom = req.body.Firstname;
            let nom = req.body.Lastname;
            let sexe = req.body.Sexe;
            //let userInfo = req.session.userData;
            //   /* Begin transaction */
            con.beginTransaction(function (err) {
                if (err) { throw err; }
                //Insert info into personne table
                let sql = "INSERT INTO tb_personnes (prenom,nom,sexe,type) VALUES (?,?,?,?)";
                con.query(sql, [prenom, nom, sexe,'Employee'], function (err, result) {
                    if (err) {
                        console.log(err);
                        con.rollback(function () {

                        });
                    }
                    let id_personne = result.insertId;

                    //INSERT INFO INTO TABLE affectation
                    let sql2 = "INSERT INTO tb_professeurs (id_personne) VALUES (?)";
                    con.query(sql2, [id_personne], async function (err, result) {
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
                                msg: "Nouveau professeur ajouté avec succès."
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
    editTeacher: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let Firstname = req.body.Firstname;
            let Lastname = req.body.Lastname;
            let Sexe = req.body.Sexe;
            let StudentID = req.body.StudentID;
            let Statut = req.body.Statut;
            let sql =
                'UPDATE tb_personnes SET prenom=?, nom =?, sexe=?,active=? WHERE id=?';
            // console.log(sql);
            con.query(sql, [Firstname, Lastname, Sexe, Statut, StudentID], function (err, result) {
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
                            " Modifié avec succès.",
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
    //TEACHER INFO
    getTeacher: async function (id) {
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
    //Load All The Teachers
    listOfTeacher: async function (active = "All") {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            let params = [];
            if (active == "All") {
                sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname FROM tb_personnes as pers,tb_professeurs as prof WHERE pers.id=prof.id_personne ORDER BY nom,prenom";
                params = [];
            } else {
                sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname FROM tb_personnes as pers,tb_professeurs as prof WHERE pers.id=prof.id_personne AND active=? ORDER BY nom,prenom";
                params = [active];
            }

            //console.log(sql);
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
    deleteTeacher: async function (req) {
        let Firstname = req.body.Firstname;
        let Lastname = req.body.Lastname;
        let Fullname = Firstname + " " + Lastname;
        let StudentID = req.body.StudentID;

        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_personnes  WHERE id =?";
            console.log(sql + " ID : " + StudentID);
            con.query(sql, StudentID, async function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous plait réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    await self.deleteTeacherAttribution(StudentID);
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
    deleteTeacherAttribution: async function (idprof) {
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_cours_prof  WHERE id_prof =?";
            //console.log(sql + " ID : " + id_personne);
            con.query(sql, idprof, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous plait réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Attribution supprimée avec succès.",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //===================== USER SECTION ========================
    //HASH PASSWORD VIA BCRYPT
    encrypt: function(password){
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        return bcrypt.hashSync(password, saltRounds);
    },
    //compare HASHED PASSWORD VIA BCRYPT
    compareHashedPassword: function(password,passwordDB){
        const bcrypt = require('bcrypt');
        return bcrypt.compareSync(password, passwordDB); // true
    },
     //ADD NEW USER
    addUser: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let user_name = req.body.Username.toLowerCase();
            let pass_word = self.encrypt(req.body.Password);
            let pers_id = req.body.EmployeeID;
            let sql =
                'INSERT INTO tb_users (user_name, pass_word, pers_id) VALUES (?,?,?)';
            con.query(sql, [user_name, pass_word, pers_id], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            " Vous avez déja ajouté '" + user_name.toUpperCase() + "' ",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        msg:
                        user_name.toUpperCase() + " enregistré avec succès.",
                    };
                }

                resolve(msg);
                //console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
    //TEACHER INFO
    getUser: async function (userName) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_users u,tb_personnes p WHERE u.pers_id=p.id AND user_name=?";
            con.query(sql, [userName], function (err, rows) {
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
    //Load All The Users
    listOfUser: async function (active = "All") {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            let params = [];
            if (active == "All") {
                sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname FROM tb_personnes as pers,tb_users as prof WHERE pers.id=prof.pers_id AND type NOT IN('Super Admin') ORDER BY nom,prenom";
                params = [];
            } else {
                sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname FROM tb_personnes as pers,tb_users as prof WHERE pers.id=prof.pers_id AND active=? AND type NOT IN('Super Admin') ORDER BY nom,prenom";
                params = [active];
            }

            //console.log(sql);
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
    //Load All The Teachers
    employeesNotUsers: async function (active = "All") {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            let params = [];
            if (active == "All") {
                sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname FROM tb_personnes as pers WHERE type NOT IN('Student','Super Admin') AND pers.id NOT IN(SELECT pers_id FROM tb_users) ORDER BY nom,prenom";
                params = [];
            } else {
                sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname FROM tb_personnes as pers WHERE type NOT IN('Student','Super Admin') AND active=? AND  pers.id NOT IN(SELECT pers_id FROM tb_users) ORDER BY nom,prenom";
                params = [active];
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
     //CHANGE USER PASWORD
    setUserPassword: async function (userName,newPassword) {
        let promise = new Promise((resolve, reject) => {
            let sql =
                'UPDATE tb_users SET pass_word=? WHERE user_name=?';
            // console.log(sql);
            con.query(sql, [newPassword,userName], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        msg:
                            "Une erreur est survenue. Veuillez réessayer.",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        success: true,
                        msg:
                            " Le mot de passe de '"+userName.toUpperCase()+"' a été réintialisé avec succès.",
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
    //Delete User
    removeUser: async function (user) {
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_users  WHERE user_name =?";
            con.query(sql, user, async function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous plait réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Les informations concernant '" + user.toUpperCase() + "' ont été supprimées avec succès.",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
     //Load The app Menu
     menuList: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_app_menu WHERE type_access='MENU' ORDER BY belong_to"
            //console.log(sql);
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
     //Load The app SUBMenu && ACtions
     getSubMenuAndActionsFor: async function (menu) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_app_menu WHERE type_access!='MENU' AND belong_to=?"
            //console.log(sql);
            con.query(sql,menu, function (err, rows) {
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
    //Load All The USER'S ACCESS
    listOfUserAccess: async function (username) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT ua.access access_id,route,IF(type_access='MENU',route,action) actions FROM tb_users u,tb_user_access ua,tb_app_menu al WHERE u.user_name=ua.user_name AND al.id=ua.access AND u.user_name=?";
            //console.log(sql);
            con.query(sql,username, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        let actions=[];
        let routes=[];
        let accessId=[];
        for(i=0;i<data.length;i++){
            actions.push(data[i].actions);
            routes.push(data[i].route);
            accessId.push(data[i].access_id);
        }
        let access={actions,routes,accessId};
        //console.log(data);
        return access;
    },
    //ADD USER ACCESSS
    addUserAccess: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let username = req.body.username;
            let userAccess = req.body.UserAccess;
            let granted_by = req.session.UserData.userName;
            //VALUES foR BULK INSERTION
            let finalValues = [];
            for (i = 0; i < userAccess.length; i++) {
                let value = [];
                value.push(username);
                value.push(userAccess[i]);
                value.push(granted_by);
                finalValues.push(value);
            }
            console.log("VALUES : ", finalValues);
            let sql =
                'INSERT INTO tb_user_access (user_name, access,granted_by) VALUES ? ';
            con.query(sql, [finalValues], function (err, result) {
                if (err) {
                    msg = {
                        success:false,
                        msg:
                            " Vous avez déja ajouté ",
                        debug: err
                    };
                } else {
                    msg = {
                        success:true,
                        msg:
                            " Acces ajouté avec succès.",
                    };
                }

                resolve(msg);
                //console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
    //REMOVE ALL USER'S ACCESS
    deleteUserAccess: async function (user) {
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_user_access  WHERE user_name =?";
            con.query(sql, user, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        type: "danger",
                        debug: err,
                        success:false
                    });
                } else {
                    resolve({
                        msg: "Les acces ont été supprimés avec succès.",
                        success:true
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
}