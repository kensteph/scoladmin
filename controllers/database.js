//LOCAL DATABASE
var mysql = require('mysql');
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: 'date',
    charset: 'latin1_swedish_ci' //PRISE EN COMPTE DES CARACTERES SPECIAUX
});
let conState = "";
con.connect(function (err) {
    conState = con.state;
    if (err) {
        console.log('DATABASE ' + process.env.DB_NAME + ' NOT AVAILABLE!');
        console.log("CON : ", conState);
        con.connect();
    } else {
        console.log('Connected to ' + process.env.DB_NAME + '!');
        console.log("CON SUCCESS: ", conState);
    }
});

module.exports = con;
