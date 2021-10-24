const con = require('./database');
var self = module.exports = {
    //ADD NEW SCOLORITE
    addScolarite: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let niveau = req.body.ClassRoom;
            let Scolarite = req.body.Scolarite;
            let aneaca = req.body.AneAca;
            let classroomName=niveau+" | "+Scolarite+" | "+aneaca;
            let sql =
                'INSERT INTO tb_scolarite (niveau,montant,aneaca) VALUES (?,?,?)';
            con.query(sql, [niveau, Scolarite, aneaca], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            " Vous avez déja ajouté  cette Scolarité '" + classroomName + "' ",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        msg:
                            "Scolarité enregistrée avec succès.",
                    };
                }

                resolve(msg);
                //console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
    //EDIT SCOLARITE
    editScolarite: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let ScolariteID = req.body.ScolariteID;
            let Scolarite = req.body.Scolarite;//amount
            let sql =
                'UPDATE tb_scolarite SET montant=? WHERE id=?';
            // console.log(sql);
            con.query(sql, [Scolarite,ScolariteID], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        msg:
                            "Vous avez déja attribué ces paramètres..",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        success: true,
                        msg:" Scolarité modifié avec succès...",
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
    //SCOLARITE INFO
    getClasseScolarite: async function (classe,aneaca) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT montant FROM tb_scolarite WHERE niveau=? AND aneaca=?";
            let amount=0;
            con.query(sql, [classe,aneaca], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    if(rows.length>0){
                        amount= rows[0].montant;
                    }
                    resolve(amount);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //LOAD SCOLARITE LIST
    listOfScolarite: async function (classe,aneaca) {
        let sql = "";
        console.log("PARAMS : ",classe,aneaca);
        let promise = new Promise((resolve, reject) => {
            let params=[];
          if (classe == "All") {
                sql = "SELECT *,sc.id id_scolarite FROM tb_scolarite sc,tb_classes c WHERE sc.niveau=c.id AND aneaca=? ORDER BY aneaca ";
                params=[aneaca];
          }else{
            if (aneaca == "All") {
                     sql = "SELECT *,sc.id id_scolarite FROM tb_scolarite sc,tb_classes c WHERE sc.niveau=c.id AND niveau=? ORDER BY aneaca ";
                     params=[classe];
            } else {
                sql = "SELECT *,sc.id id_scolarite FROM tb_scolarite sc,tb_classes c WHERE sc.niveau=c.id AND niveau=? AND aneaca=? ORDER BY aneaca ";
                params=[classe,aneaca];
            }
          }
            con.query(sql,params, function (err, rows) {
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
    //============================= MANAGE STUDENT ACCOUNT ===========================================
 
    //ADD NEW ACCOUNT
    addNewAccount: async function (student_id,classe,aneaca) {
        let balance = await self.getClasseScolarite(classe,aneaca);
        let promise = new Promise((resolve, reject) => {
            let sql ='INSERT INTO tb_students_acc (student_id,balance) VALUES (?,?)';
            con.query(sql, [student_id,-balance], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            " Vous avez déja créé  ce compte...",
                        debug: err
                    };
                } else {
                    msg = {
                        success:true,
                        type: "success",
                        msg:
                            "Compte créé avec succès...",
                    };
                }

                resolve(msg);
                //console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
    //LOAD SCOLARITE LIST FOR STUDENTS
    listOfStudentsAccounts: async function (classe,aneaca) {
        let sql = "";
        console.log("PARAMS : ",classe,aneaca);
        let promise = new Promise((resolve, reject) => {
            let params=[];
          if (classe == "All") {
                sql = "SELECT id_personne,dossier, CONCAT(UPPER(nom),' ',prenom) as fullname,CONCAT(UPPER(nom),' ',prenom) as sort,af.id as id_affectation,classe,abv,sexe,acc.id acc_id,balance FROM tb_personnes as pers,tb_affectation as af,tb_classes c,tb_students_acc acc WHERE pers.id=af.id_personne  AND af.classroom=c.id AND pers.id=acc.student_id AND aneaca=?";
                params=[aneaca];
          }else{
                sql = "SELECT id_personne,dossier, CONCAT(UPPER(nom),' ',prenom) as fullname,CONCAT(UPPER(nom),' ',prenom) as sort,af.id as id_affectation,classe,abv,sexe,acc.id acc_id,balance FROM tb_personnes as pers,tb_affectation as af,tb_classes c,tb_students_acc acc WHERE pers.id=af.id_personne  AND af.classroom=c.id AND pers.id=acc.student_id AND af.classroom=? AND aneaca=?";
                params=[classe,aneaca];
          }
            con.query(sql,params, function (err, rows) {
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
    //ADD NEW STUDENT TRANSACTIONS
    addStudentTransaction: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let Versement = req.body.Versement;
            let TransType = req.body.TransType;
            let AneAca = req.body.AneAca;
            let comments = req.body.comments;
            let AccountID = req.body.AccountID;
            let PrevBalance = req.body.PrevBalance;
            let PostBalance = req.body.PostBalance;
            let StudentId = req.body.StudentId;
            let userInfo = req.session.UserData;
            let acteur = userInfo.userName;
            //   /* Begin transaction */
            con.beginTransaction(function (err) {
                if (err) { throw err; }
                //Insert info about the transaction
                let sql = "INSERT INTO tb_transactions (student, amount, prev_balance, post_balance, type_trans, comments, actor,aneaca) VALUES (?,?,?,?,?,?,?,?)";
                con.query(sql, [StudentId, Versement, PrevBalance ,PostBalance ,TransType ,comments ,acteur ,AneAca], function (err, result) {
                    if (err) {
                        console.log(err);
                        con.rollback(function () {

                        });
                    }
                    //let id_personne = result.insertId;
                
                    //UPATE THE STUDENT'S ACCOUNT
                    let sql2 = "UPDATE tb_students_acc SET balance=? WHERE id=?";
                    con.query(sql2, [PostBalance ,AccountID], async function (err, result) {
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
                                msg: "Transaction enregistrée avec succès...",
                                success: true,
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
    //LOAD TRANSACTIONS LIST
    listOfTransactions: async function (date_from,date_to,aneaca) {
        let sql = "";
        console.log("PARAMS : ",date_from,date_to,aneaca);
        let promise = new Promise((resolve, reject) => {
            let params=[];
          if (aneaca == "All") {
                if(date_from==date_to){
                    sql="SELECT *,CONCAT(UPPER(nom),' ',prenom,' | ',dossier) as st_account FROM tb_transactions  trans,tb_personnes pers WHERE pers.id=trans.student AND DATE(created_date) = '"+date_from+"'  ORDER BY created_date ASC"
                }else{
                    sql = "SELECT *,CONCAT(UPPER(nom),' ',prenom,' | ',dossier) as st_account FROM tb_transactions  trans,tb_personnes pers WHERE pers.id=trans.student AND DATE(created_date) BETWEEN '"+date_from+"' AND  '"+date_to+"'  ORDER BY created_date ASC;";
                }
                params=[];
          }else{
              if(date_from==date_to){
                  sql = "SELECT *,CONCAT(UPPER(nom),' ',prenom,' | ',dossier) as st_account FROM tb_transactions trans,tb_personnes pers WHERE pers.id=trans.student AND DATE(created_date) = '"+date_from+"' AND aneaca=? ORDER BY created_date ASC;";
              }else{
                sql = "SELECT *,CONCAT(UPPER(nom),' ',prenom,' | ',dossier) as st_account FROM tb_transactions trans,tb_personnes pers WHERE pers.id=trans.student AND DATE(created_date) BETWEEN '"+date_from+"' AND  '"+date_to+"' AND aneaca=? ORDER BY created_date ASC;";
              }
        
                params=[aneaca];
          }
            con.query(sql,params, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        console.log(sql);
        return data;
    },
    //LOAD STUdENT TRANSACTIONS LIST
    studentListOfTransactions: async function (date_from,date_to,aneaca,studentId) {
        let sql = "";
        console.log("PARAMS : ",date_from,date_to,aneaca);
        let promise = new Promise((resolve, reject) => {
            let params=[];
          if (aneaca == "All") {
                if(date_from==date_to){
                    sql="SELECT *,CONCAT(UPPER(nom),' ',prenom,' | ',dossier) as st_account FROM tb_transactions  trans,tb_personnes pers WHERE pers.id=trans.student AND DATE(created_date) = '"+date_from+"' AND student=?  ORDER BY created_date ASC"
                }else{
                    sql = "SELECT *,CONCAT(UPPER(nom),' ',prenom,' | ',dossier) as st_account FROM tb_transactions  trans,tb_personnes pers WHERE pers.id=trans.student AND DATE(created_date) BETWEEN '"+date_from+"' AND  '"+date_to+"' AND student=?  ORDER BY created_date ASC;";
                }
                params=[studentId];
          }else{
              if(date_from==date_to){
                  sql = "SELECT *,CONCAT(UPPER(nom),' ',prenom,' | ',dossier) as st_account FROM tb_transactions trans,tb_personnes pers WHERE pers.id=trans.student AND DATE(created_date) = '"+date_from+"' AND aneaca=? AND student=? ORDER BY created_date ASC;";
              }else{
                sql = "SELECT *,CONCAT(UPPER(nom),' ',prenom,' | ',dossier) as st_account FROM tb_transactions trans,tb_personnes pers WHERE pers.id=trans.student AND DATE(created_date) BETWEEN '"+date_from+"' AND  '"+date_to+"' AND aneaca=? AND student=? ORDER BY created_date ASC;";
              }
        
                params=[aneaca,studentId];
          }
            con.query(sql,params, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        console.log(sql);
        return data;
    },
}