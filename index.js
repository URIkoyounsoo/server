const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
let corsOptions = {
    origin: 'http://localhost:3000', // 출처 허용 옵션
    credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require("mysql");
const PORT = process.env.port || 8000;

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "4264",
    database: "bbs",
});

app.get("/list", (req, res) => {
    const sqlQuery = "SELECT EMPLOYEE_ID, EMPLOYEE_NM,TEL_NO, MAIN_ADDRESS, DATE_FORMAT(REGISTER_DATE, '%Y-%m-%d') AS REGISTER_DATE FROM STORE_BASIC_CONFIG;";

    db.query(sqlQuery, (err, result) => {
        if (result) {
            return res.send(result);
        } else {
            return res.status(201).json({
                err
            });
        }
    });
});

app.post("/insert", (req, res) => {

    res.set({ 'Access-Control-Allow-Origin': '*' });
    var name = req.body.name;
    var tel = req.body.tel;
    var mail = req.body.mail;

    const sqlQuery =
        "INSERT INTO STORE_BASIC_CONFIG (EMPLOYEE_NM, TEL_NO, MAIN_ADDRESS) VALUES (?,?,?);";
    db.query(sqlQuery, [name, tel, mail], (err, result) => {
        res.send(result);
    });
});

app.post("/update", (req, res) => {
    var id = req.body.id;
    var name = req.body.name;
    var tel = req.body.tel;
    var mail = req.body.mail;

    const sqlQuery =
        "UPDATE STORE_BASIC_CONFIG SET EMPLOYEE_NM = ?, TEL_NO = ?, MAIN_ADDRESS = ?,UPDATER_ID = 'artistJay' WHERE EMPLOYEE_ID = ?;";
    db.query(sqlQuery, [name, tel, mail, id], (err, result) => {
        res.send(result);
    });
});

app.post("/detail", (req, res) => {
    const id = req.body.id;

    const sqlQuery =
        "SELECT EMPLOYEE_ID, EMPLOYEE_NM, TEL_NO FROM STORE_BASIC_CONFIG WHERE EMPLOYEE_ID = ?;";
    db.query(sqlQuery, [id], (err, result) => {
        res.send(result);
    });
});

app.post("/delete", (req, res) => {
    const id = req.body.boardIdList;

    const sqlQuery = `DELETE FROM STORE_BASIC_CONFIG WHERE EMPLOYEE_ID IN (${id})`;
    db.query(sqlQuery, (err, result) => {
        res.send(result);
    });
});

app.post("/login", (req, res) => {
    const id = req.body.id;
    const pw = req.body.pw;

    const sqlQuery = `SELECT *FROM USER WHERE USER_ID = ? AND USER_PASSWORD = ?;`;
    db.query(sqlQuery, [id, pw], (err, result) => {
        res.send(result);
    });
});

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});



