const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const auth = require('../middleware/auth');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));

// ADD EMPLOYEE
router.get('/employee-list', auth, async (req, res) => {
    res.render('../views/employees/employee-list');
});

// Exportation of this router
module.exports = router;