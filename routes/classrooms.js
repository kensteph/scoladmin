const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const auth = require('../middleware/auth');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
const dbController = require("../controllers/Ctrlclassroom");

//ADD Classrooms to List
router.post('/classrooms-list', auth, async (req, res) => {
    let response;
    console.log(req.body);
    if (req.body.actionField == "Edit") { //EDIT
        response = await dbController.editClassroom(req);
    } else if (req.body.actionField == "Delete") { //DELETE
        response = await dbController.deleteClassroom(req);
    } else {
        response = await dbController.addClassRoom(req);
    }

    if (response.type == "success") {
        res.redirect('/classrooms-list');
    } else {
        console.log(response.msg);
        res.redirect('/classrooms-list?msg=' + response.msg);
    }

});
// git config --global user.email "kenderromain@gmail.com"
// git config --global user.name "Kender Romain"

// Classrooms List
router.get('/classrooms-list', auth, async (req, res) => {
    let response = await dbController.listOfClassrooms("All");
    let niveau = await dbController.listOfClassrooms("Mother");
    let msg = "";
    if (req.query.msg) {
        msg = req.query.msg;
    }
    params = {
        pageTitle: "Gestion des salles de classe",
        data: response,
        niveau: niveau,
        UserData: req.session.UserData,
        page: 'Classrooms',
        msg: msg,
    };
    res.render('../views/classrooms/classrooms-list', params);
});

// Exportation of this router
module.exports = router;