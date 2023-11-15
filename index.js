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

app.post("/onLogin", (req, res) => {
    // username, password 변수로 선언
    const username = req.body.username
    const password = req.body.password

    const sqlQuery = `SELECT * FROM USER WHERE username = ? AND password = ?;`;
    db.query(sqlQuery, [username, password], (err, result) => {
        res.send(result);

        // // 입력된 username 와 동일한 username 가 mysql 에 있는 지 확인
        // const sql1 = 'SELECT COUNT(*) AS result FROM USER WHERE username = ?'

        // db.query(sql1, [username], (err, data) => {
        //     if (!err) {
        //         // 결과값이 1보다 작다면(동일한 username 가 없다면)
        //         if (data[0].result < 1) {
        //             res.send({ 'msg': '입력하신 username 가 일치하지 않습니다.' })
        //         } else { // 동일한 username 가 있으면 비밀번호 일치 확인
        //             const sql2 = `SELECT 
        //                             CASE (SELECT COUNT(*) FROM USER WHERE username = ? AND password = ?)
        //                                 WHEN 0 THEN NULL
        //                                 ELSE (SELECT username FROM USER WHERE username = ? AND password = ?) END AS username
        //                             CASE (SELECT COUNT(*) FROM USER WHERE username = ? AND password = ?)
        //                                 WHEN 0 THEN NULL
        //                                 ELSE (SELECT password FROM USER WHERE username = ? AND password = ?) END AS password`;
        //             // sql 란에 필요한 parameter 값을 순서대로 기재
        //             const params = [username, password]
        //             db.query(sql2, params, (err, data) => {
        //                 if (!err) {
        //                     res.send(data[0])
        //                 } else {
        //                     res.send(err)
        //                 }
        //             })
        //         }
        //     } else {
        //         res.send(err)
        //     }
    })
});

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});