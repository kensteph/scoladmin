const con = require('./database');
const helper = require("../helpers/helper");
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
            let sql = "SELECT *,IFNULL((SELECT DISTINCT mode_evaluation FROM tb_notes WHERE mode_evaluation=code),'Not Found') if_present_in_note FROM tb_mode_evaluations  ORDER BY mode_evaluation";
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
    //CHANGE METHODE EVALUATION FOR AN ACADEMIC YEAR
    changeModeEvaluation: async function (academicYear,newMode) {
        let promise = new Promise((resolve, reject) => {
            
            let sql ='UPDATE tb_notes SET mode_evaluation=? WHERE aneaca=?';
            // console.log(sql);
            con.query(sql, [newMode,academicYear], function (err, result) {
                if (err) {
                    msg = {
                        success: false,
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
                            academicYear+" Nouvelle methode : "+newMode,
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
    //Delete PERIOD
    deletePeriod: async function (periodId) {
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_periodes_evaluation  WHERE id =?";
            con.query(sql, periodId, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        type: "danger",
                        debug: err,
                        success:false
                    });
                } else {
                    resolve({
                        msg: "La periode été supprimée avec succès.",
                        success:true
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //LIST PERIOD
    listOfPeriod: async function (methodEvaluationCode) {
        let sql = "SELECT * FROM tb_periodes_evaluation WHERE mode_evaluation_code=?  ORDER BY id ";
        let promise = new Promise((resolve, reject) => {
            con.query(sql, methodEvaluationCode, function (err, rows) {
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
    //LIST OF GENERAL PERIOD
    listOfGeneralPeriod: async function (methodEvaluationCode) {
        let sql = "SELECT * FROM tb_periodes_evaluation WHERE mode_evaluation_code=? AND type_periode='G' ORDER BY id ";
        let promise = new Promise((resolve, reject) => {
            con.query(sql, methodEvaluationCode, function (err, rows) {
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
    //METHOD EVALUATION
    getModeEvaluation: async function (niveau, aneaca) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT DISTINCT(mode_evaluation) FROM `tb_notes` WHERE niveau=? AND aneaca=?";
            con.query(sql, [niveau, aneaca], function (err, rows) {
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
    //METHOD EVALUATION BY YEAR
    getYearModeEvaluation: async function (aneaca) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT DISTINCT(mode_evaluation) FROM `tb_notes` WHERE  aneaca=?";
            con.query(sql, [aneaca], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0].mode_evaluation);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //======================================================== NOTES=================================================
    //Load All The classrooms
    listOfStudentWithoutNotes: async function (classroom, courseId,period, aneaca) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,af.id as id_affectation FROM tb_personnes as pers,tb_affectation as af WHERE pers.id=af.id_personne AND classroom=? AND aneaca=? AND id_personne NOT IN ( SELECT etudiant FROM tb_notes WHERE niveau=? AND periode=? AND aneaca=? AND cours=?) AND pers.active=1 ORDER BY nom,prenom";
            //console.log(sql);
            con.query(sql, [classroom, aneaca, classroom, period, aneaca, courseId], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        console.log("DATA : ",data,classroom, courseId, period, aneaca);
        return data;
    },
    //SAVE NOTES
    saveNotes: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let students = req.body.studentId;
            let course = req.body.courseId;
            let notes = req.body.note;
            let courseCoeff = req.body.courseCoeff;
            let period = req.body.period;
            let classroomID = req.body.roomSelected;
            let yearAca = req.body.yearAca;
            let abscence = req.body.abscence;
            let methodEvaluationCode = req.body.methodEvaluationCode;
            let user = req.session.UserData.userName;
            let option=1;

            //VALUES foR BULK INSERTION
            let finalValues = [];
            for (i = 0; i < students.length; i++) {
                if (notes[i] != "") {
                    let value = [];
                    value.push(students[i]);
                    value.push(course);
                    value.push(notes[i]);
                    value.push(period);
                    value.push(classroomID);
                    value.push(yearAca);
                    value.push(abscence[i]);
                    value.push(courseCoeff);
                    value.push(methodEvaluationCode);
                    value.push(user);
                    value.push(option);
                    finalValues.push(value);
                } else {

                }

            }
            console.log("VALUES : ", finalValues);
            if (finalValues.length > 0) {
                let sql =
                    'INSERT INTO tb_notes (etudiant,cours,note,periode,niveau,aneaca,tag,sur,mode_evaluation,acteur,options) VALUES ? ';
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
                                " Notes enregistrées  avec succès.",
                        };
                    }

                    resolve(msg);
                    //console.log(msg);
                });
            } else {
                msg = {
                    type: "danger",
                    error: true,
                    msg:
                        " Aucune note n'a été enregistrée.... ",
                };
                resolve(msg);
                //console.log(msg)
            }

        });
        rep = await promise;
        return rep;
    },
    //SAVE SINGLE NOTE
    saveSingleNote: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let student = req.body.studentId;
            let course = req.body.courseId;
            let note = req.body.note;
            let courseCoeff = req.body.coefficient;
            let period = req.body.periodSelected;
            let niveauSelected = req.body.niveauSelected;
            let yearAca = req.body.yearSelected;
            let abscence = req.body.abscence;
            let methodEvaluationCode = req.body.methodEvaluationCode;

            //VALUES foR BULK INSERTION
            let values = [student, course, note, period, niveauSelected, yearAca, abscence, courseCoeff, methodEvaluationCode];
            //console.log("VALUES : ", values);
            if (note != "") {
                let sql =
                    'INSERT INTO tb_notes (etudiant,cours,note,periode,niveau,aneaca,tag,sur,mode_evaluation) VALUES (?,?,?,?,?,?,?,?,?) ';
                con.query(sql, values, function (err, result) {
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
                                " Note enregistrée  avec succès.",
                        };
                    }

                    resolve(msg);
                    //console.log(msg);
                });
            } else {
                msg = {
                    type: "danger",
                    error: true,
                    msg:
                        " Aucune note n'a été enregistrée.... ",
                };
                resolve(msg);
                //console.log(msg)
            }

        });
        rep = await promise;
        return rep;
    },
    //EDIT SINGLE NOTE
    editSingleNote: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let student = req.body.studentId;
            let course = req.body.courseId;
            let note = req.body.note;
            let idNote = req.body.idNote;
            let courseCoeff = req.body.coefficient;
            let period = req.body.periodSelected;
            let niveauSelected = req.body.niveauSelected;
            let yearAca = req.body.yearSelected;
            let abscence = req.body.abscence;
            let methodEvaluationCode = req.body.methodEvaluationCode;

            //VALUES foR BULK INSERTION
            let values = [note, abscence, courseCoeff, methodEvaluationCode, idNote];
            //console.log("VALUES : ", values);
            if (note != "") {
                let sql =
                    'UPDATE  tb_notes SET note = ?,tag=?,sur=?,mode_evaluation=? WHERE  id =?';
                con.query(sql, values, function (err, result) {
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
                                " Note modifiée  avec succès.",
                        };
                    }

                    resolve(msg);
                    //console.log(msg);
                });
            } else {
                msg = {
                    type: "danger",
                    error: true,
                    msg:
                        " Aucune note n'a été enregistrée.... ",
                };
                resolve(msg);
                //console.log(msg)
            }

        });
        rep = await promise;
        return rep;
    },
    //GET STUDENT NOTE BY COURSE
    getStudentNoteByCourse: async function (studentId, courseId, niveau, period, aneaca) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,tb_notes.id as id_note FROM tb_notes ,tb_cours WHERE tb_notes.cours=tb_cours.id AND etudiant=? AND tb_notes.niveau=? AND periode=? AND aneaca=? AND cours=? ";
            con.query(sql, [studentId, niveau, period, aneaca, courseId], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0]);
                }
            });
        });
        data = await promise;
        //console.log(studentId, niveau, period, aneaca,courseId);
        return data;
    },
    //GET STUDENT NOTES
    getStudentNotes: async function (studentId, niveau, period, aneaca) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_notes ,tb_cours WHERE tb_notes.cours=tb_cours.id AND etudiant=? AND tb_notes.niveau=? AND periode=? AND aneaca=? ORDER BY cours ";
            con.query(sql, [studentId, niveau, period, aneaca], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        console.log(studentId, niveau, period, aneaca);
        return data;
    },
    //GET STUDENT GOOD NOTES COUNT
    getStudentListWithOnlyGoodNotes: async function (niveauOrClassRoom, period, aneaca,CoeffPassagePercentage,nbCourses) {
        let sql ="";
        //console.log(niveauOrClassRoom, period, aneaca,CoeffPassagePercentage,nbCourses);
        let promise = new Promise((resolve, reject) => {
            sql = "SELECT etudiant,CONCAT(UPPER(nom),' ',prenom) as fullname,dossier,COUNT(good_notes) count_good_notes FROM ( SELECT IF(note>= sur*"+CoeffPassagePercentage+",'Good','Bad') good_notes,etudiant FROM tb_notes WHERE niveau=? AND periode=? AND aneaca=? GROUP BY etudiant,cours ) grades,tb_personnes student WHERE student.id=etudiant AND good_notes='Good' GROUP BY etudiant HAVING count_good_notes="+nbCourses;
            con.query(sql, [niveauOrClassRoom, period, aneaca], function (err, rows) {
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
    //GET STUDENT NOTE BY COURSE
    getStudentTotalNote: async function (studentId, niveau, period, aneaca) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT SUM(note) as total FROM tb_notes ,tb_cours WHERE tb_notes.cours=tb_cours.id AND etudiant=? AND tb_notes.niveau=? AND periode=? AND aneaca=?";
            con.query(sql, [studentId, niveau, period, aneaca], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0]);
                }
            });
        });
        data = await promise;
        //console.log(studentId, niveau, period, aneaca);
        return data;
    },
    //Coeficient de clacul des moyennes par salle de classe
    CoefficientCalcul: async function (classroom,year="",archive=false) {
        let sql ="";
        if(archive){
           // console.log("ARCHIVES COEFF");
            let promise = new Promise((resolve, reject) => {
                 sql =
                    'SELECT SUM(coefficient) as total FROM tb_notes WHERE cours IN (SELECT DISTINCT(cours),id_cours,libelle,code,coefficient,position FROM tb_notes as grade ,tb_cours as c , tb_cours_par_classe as cpc WHERE c.id=grade.cours AND cpc.id_cours=grade.cours AND grade.niveau=? AND aneaca=?)';
                con.query(sql, [classroom,year], function (err, rows) {
                    if (err) {
                        throw err;
                    } else {
                        coef = rows[0].total * 0.1;
                        info = { Total: rows[0].total, CoefMoyenne: coef };
                        resolve(info);
                    }
                });
            });
            data = await promise;
            return data;
        }else{
            //console.log("NORMAL COEFF");
            let promise = new Promise((resolve, reject) => {
                sql =
                    'SELECT SUM(coefficient) as total FROM tb_cours_par_classe WHERE salle_classe=? AND active=1';
                con.query(sql, classroom, function (err, rows) {
                    if (err) {
                        throw err;
                    } else {
                        coef = rows[0].total * 0.1;
                        info = { Total: rows[0].total, CoefMoyenne: coef };
                        resolve(info);
                    }
                });
            });
            data = await promise;
            //console.log(sql);
            return data;
        }
        
    },
    //Coeficient de clacul des moyennes par salle de classe a partir des matieres
    CoefficientCalculFromCoursesList:  function (coursesList) {
        
        let total = helper.SumArrayObjectByProperties(coursesList,'coefficient');
        let coef = total * 0.1;
        let info = { Total: total, CoefMoyenne: coef };
            // console.log("COURSES RECEIVED : ",coursesList);
            // console.log("TOTAL : ",info);
        return info;
        
    },
    //Calcul de la moyenne geneal
    moyenneGenerale : function(periodList,moyennesByPeriode){
        // console.log("PERIODS LIST :",periodList);
        // console.log("MOYENNES LIST :",moyennesByPeriode);
        let nbPeriodGenerale=0;
        let sommeMoyenne=0;
        let pos=0;
        periodList.forEach(period => {
            let moy=moyennesByPeriode[pos];
            if(period.type_periode=="G"){
                nbPeriodGenerale++;
                sommeMoyenne+=parseFloat(moy);
            }
            //console.log(period.periode,"(",period.type_periode,") : ",moy);
            pos++;
        });
        let moyGen = (sommeMoyenne/nbPeriodGenerale).toFixed(2);
        //console.log("MOY GLE :",sommeMoyenne,"/",nbPeriodGenerale,"=",moyGen);
        //console.log("MOY GLE :",moyGen);
        return moyGen;
    },
    //GET STUDENT NOTE BY COURSE
    getMoyenneGleForYear: async function (studentId,aneaca,nbperiodGle) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT cours, SUM(note)/"+nbperiodGle+" noteGle,sur FROM `tb_notes` WHERE etudiant=? AND aneaca=? GROUP BY cours ORDER BY cours";
            con.query(sql, [studentId, aneaca], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        //console.log("DATA : ",data);
        //CALCUL MOYENNE GENERALE
        let Notes=[];
        let Total=helper.SumArrayObjectByProperties(data,"noteGle").toFixed(2);
        let TotalCoeff = helper.SumArrayObjectByProperties(data,"sur");
        let CoeffCalcul = TotalCoeff*0.1;
        let MoyGle = (Total/CoeffCalcul).toFixed(2);
        for(i=0; i<data.length;i++){
            //console.log("DATA",data[i].noteGle);
            let noteG=parseFloat(data[i].noteGle);
            //Total+=noteG
            //THESE NOTE ARE ORDERED BY ID
            Notes.push(noteG.toFixed(2));
        }
        //console.log(Notes,"TOTAL : ",Total.toFixed(2)," SUR : ",TotalCoeff,"/",CoeffCalcul,"MOYGLE : ",MoyGle);
        let finalData = {Notes,TotalCoeff,Total,MoyGle};
        return finalData;
    },
    //GET STUDENT NOTE BY PERIOD YEAR
    getStudentMoyenneByPeriodAndYear: async function (student,period, aneaca,CoefMoyenne) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT prenom,nom,SUM(note) total,SUM(note)/"+CoefMoyenne+" Moy FROM tb_notes n,tb_personnes p WHERE n.etudiant=p.id AND etudiant=? AND periode=? AND aneaca=?";
            //console.log(sql);
            con.query(sql, [student, period, aneaca], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0]);
                }
            });
        });
        data = await promise;
        //console.log("RECEIVE : ",student,period, aneaca,CoefMoyenne);
        return data;
    },
    //TABLE OF HONOR
    tableOfHonor : async function(roomSelected,periodSelected,yearSelected,display=4){
        const dbStudentController = require("./Ctrlstudent");
        let StudentToDisplay=[];
        let moyennePassage = global.moyennePassage;
        //console.log("MOY PASS :",moyennePassage);
        //STUDENTS LIST
        let  studentList = await dbStudentController.listOfStudent(roomSelected, yearSelected, 1);
        //console.log(studentList);
        for (i = 0; i < studentList.length; i++) {
            let studentID= studentList[i].id_personne;
            let roomStudent;
            if(roomSelected=="All"){
                roomStudent = studentList[i].classroom;
            }else{
                roomStudent = roomSelected;
            }
            //Coefficient de Calcul des moyennes
            let CoefficientCalcul = await self.CoefficientCalcul(roomStudent,false);
            let CoefMoyenne=CoefficientCalcul.CoefMoyenne;
            //console.log("COEFF : ",CoefMoyenne," CLASSEROOM ID : ",roomStudent);
            
            let infoMoy= await self.getStudentMoyenneByPeriodAndYear(studentID,periodSelected,yearSelected,CoefMoyenne);
            let MoyeStudent = infoMoy.Moy? infoMoy.Moy.toFixed(2):0;
            //console.log("STUDENT ID :",studentID," MOY : ",MoyeStudent,"/",moyennePassage);
           if(MoyeStudent>=moyennePassage){
                studentList[i].Moyenne=MoyeStudent;
                studentList[i].sort=MoyeStudent;//IN ORDER TO SORT THE TABLE BY MOY
                StudentToDisplay.push(studentList[i]);
           }
        }
        helper.sortArrayObj(StudentToDisplay,false);
        console.log(StudentToDisplay.length,"/",studentList.length," LIMIT : ",display);
        //TAKE ONLY THE FIRST  4
        StudentToDisplay=StudentToDisplay.slice(0,display);
        //console.log(StudentToDisplay.length,"/",studentList.length);
        return StudentToDisplay;
    },
    //TABLE OF HONORABLE NO BAD NOTE
    tableOfHonorable : async function(roomSelected,classRoomsList,periodSelected,yearSelected){
        let StudentListReturn=[];
        const bdCtrlrCourse = require("./Ctrlcourses");
        let coeffPassagePercentage = global.schoolCoeffPassagePercentage;
        if(roomSelected=="All"){
            for(i=0;i<classRoomsList.length;i++){
                let classroomID= classRoomsList[i].id;
                let classroom= classRoomsList[i].classe;

                
                let Courses = await bdCtrlrCourse.listOfCoursesByClassroomAchivesFromTbNotes(classroomID,yearSelected);
                let nbCourses = Courses.length;
                //Coefficient de Calcul des moyennes
                let CoefficientCalcul = await self.CoefficientCalculFromCoursesList(Courses);
                let CoefMoyenne=CoefficientCalcul.CoefMoyenne;

                // if(classroomID==9){
                //     console.log("CLASS ID : ",classroomID,"COURSES : ",Courses," COURSES COUNT : ",Courses.length);
                //     console.log(CoefficientCalcul);
                // }

                
                
                if(nbCourses>0){
                let info = await self.getStudentListWithOnlyGoodNotes(classroomID,periodSelected,yearSelected,coeffPassagePercentage,nbCourses);
                    if(info.length>0){
                        for(j=0;j<info.length;j++){
                            let studentId = info[j].etudiant;
                            let fullname = info[j].fullname;
                            let dossier = info[j].dossier;
                            let nbGoodNote = info[j].count_good_notes;
                            let infoMoy= await self.getStudentMoyenneByPeriodAndYear(studentId,periodSelected,yearSelected,CoefMoyenne);
                            let Moyenne = infoMoy.Moy? infoMoy.Moy.toFixed(2):0;
                            let StudentInfo = {StudentID:studentId,fullname,dossier,nbGoodNote,Moyenne,classe:classroom,sort:Moyenne}
                            StudentListReturn.push(StudentInfo);
                        }
                    } 
                }
                
            }
        }else{
                let classroomID=roomSelected;
                let Courses = await bdCtrlrCourse.listOfCoursesByClassroomAchivesFromTbNotes(classroomID,yearSelected);
                let nbCourses = Courses.length;
                let info = await self.getStudentListWithOnlyGoodNotes(classroomID,periodSelected,yearSelected,coeffPassagePercentage,nbCourses);
                //Coefficient de Calcul des moyennes
                let CoefficientCalcul = await self.CoefficientCalculFromCoursesList(Courses);
                let CoefMoyenne=CoefficientCalcul.CoefMoyenne;
                if(info.length>0){
                    for(j=0;j<info.length;j++){
                        let studentId = info[j].etudiant;
                        let fullname = info[j].fullname;
                        let dossier = info[j].dossier;
                        let nbGoodNote = info[j].count_good_notes;
                        let infoMoy= await self.getStudentMoyenneByPeriodAndYear(studentId,periodSelected,yearSelected,CoefMoyenne);
                        let Moyenne = infoMoy.Moy? infoMoy.Moy.toFixed(2):0;
                        let StudentInfo = {StudentID:studentId,fullname,dossier,nbGoodNote,Moyenne,classe:roomSelected,sort:Moyenne}
                        StudentListReturn.push(StudentInfo);
                    }
                } 
        }
        
        helper.sortArrayObj(StudentListReturn,false);
        //console.log("LIST RETURN : ",StudentListReturn);
        return StudentListReturn;
    },
    //GET LAST PERIOD IN TB NOTES
    getLastPeriodInTbNote: async function (aneaca) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT periode FROM `tb_notes` WHERE aneaca=? ORDER BY id DESC LIMIT 1";
            con.query(sql, [aneaca], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    console.log("ROWS : ",rows);
                    let etape='Etape 1';
                    if(rows[0].hasOwnProperty('periode')){
                         etape=rows[0].periode;
                    }
                    resolve( etape);
                }
            });
        });
        let data = await promise;
        //console.log(studentId, niveau, period, aneaca);
        return data;
    },

}