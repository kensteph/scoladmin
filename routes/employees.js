const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const auth = require('../middleware/auth');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
const dbClassroomController = require("../controllers/Ctrlclassroom");
const dbEmployeeController = require("../controllers/CtrlEmployee");
// == EMPLOYEE SECTION =======
router.get('/employee-list', auth, async (req, res) => {
    res.render('../views/employees/employee-list');
});

//======== TEACHER  SECTION ========
router.get('/teacher-list', auth, async (req, res) => {
    let response = await dbClassroomController.listOfClassrooms("All");
    let teacherList = await dbEmployeeController.listOfTeacher("All");
    //console.log(teacherList);
    params = {
        data: response,
        teacherList,
        UserData: req.session.UserData
    };
    res.render('../views/employees/teacher-list',params);
});

router.post('/teacher-list', auth, async (req, res) => {
    //console.log(req.body);
    let response;
    let action=req.body.actionField;
    console.log("ACTION : ",action);
    if(action=="Edit"){
        response = await dbEmployeeController.editTeacher(req);
    }else if(action=="Delete"){
        response = await dbEmployeeController.deleteTeacher(req);
    }else{
        //ADD 
        response = await dbEmployeeController.addTeacher(req);
    }
    //console.log(response);
    res.json(response);
});


//======== USER  SECTION ========
router.get('/user-list', auth, async (req, res) => {
    let employeeListCandidate = await dbEmployeeController.employeesNotUsers(1);
    let usersList = await dbEmployeeController.listOfUser("All");
    //console.log(employeeList);
    params = {
        usersList,
        employeeList:employeeListCandidate,
        UserData: req.session.UserData
    };
    res.render('../views/employees/users-list',params);
});

router.post('/user-list', auth, async (req, res) => {
    console.log(req.body);
    let response;
    let action=req.body.actionField;
    console.log("ACTION : ",action);
    if(action=="Edit"){
        response = await dbEmployeeController.editTeacher(req);
    }else if(action=="Delete"){
        response = await dbEmployeeController.deleteTeacher(req);
    }else{
        //ADD USER
        response = await dbEmployeeController.addUser(req);
    }
    console.log(response);
    res.json(response);
});
//USER CHANGE HIS PASWORD
router.post('/change-user-pass', auth, async (req, res) => {
    console.log(req.body);
    let CPassword = req.body.CPassword;//CURRENT PASSWORD
    let encryptedNPassword =  dbEmployeeController.encrypt(req.body.NPassword);
    let username = req.session.UserData.userName;
    let userInfo = await dbEmployeeController.getUser(username);
    let response={success:false,msg:""};
    if(userInfo!=null){
        let passwordDB = userInfo.pass_word;
        if(dbEmployeeController.compareHashedPassword(CPassword,passwordDB)){
            //PASSWORD CAN CHANGE
            response = await dbEmployeeController.setUserPassword(username,encryptedNPassword);
        }else{
            //THE CURRENT PASSWORD IS NOT VERIFIED
            response.msg="Le mot de passe est incorrect. Veuillez vérifier votre mot de passe actuel.";
        }
    }else{
        console.log("User not exists...");
    }
    res.json(response);
});
//ADMIN RESET USER'S PASWORD
router.post('/rest-user-password', auth, async (req, res) => {
    //console.log(req.body);
    let newPassword= req.body.newPassword;
    let username = req.body.username;
    let encryptedPassword =  dbEmployeeController.encrypt(newPassword);
    //console.log("Password : ",newPassword,"New Password : ",encryptedPassword);
    let response = await dbEmployeeController.setUserPassword(username,encryptedPassword);
    res.json(response);
});
//ADMIN RESET USER'S PASWORD
router.post('/delete-user', auth, async (req, res) => {
    let username = req.body.username;
    let response = await dbEmployeeController.removeUser(username);
    res.json(response);
});
// Exportation of this router
module.exports = router;