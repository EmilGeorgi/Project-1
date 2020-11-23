"use strict";
Object.defineProperty(exports, '__esModule', { value: true });
/*
 * GET home page.
 */
const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let user = false;
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bodegaplanete',
});

router.post('/login', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  connection.query('SELECT * FROM user INNER JOIN userrole on user.roleId = userrole.UserRoleId',(err, row, fields) => {
      if (err) {
        res.send(err);
      }
      if(row) {
        for (let i = 0; i < row.length; i++) {
          let passMatch = bcrypt.compareSync(req.query.Password, row[i].Password);
          if (row[i].Username === req.query.Username && passMatch) {
            res.send({ isUser: true, role: user.Roles, user: row[i] });
          }
          if(row.length === i+1) {
            console.log(row[i])
            if(!res.headersSent) {
              res.send({message: 'your username or password is wrong', error: true});    
            } 
          }
        }
        res.end();
      }
  });
})

router.get('/message', (req, res) => {
  if (!req.query.userId) {
    res.send({ message: 'you are not logged in', error: true });
  }
  res.set('Access-Control-Allow-Origin', '*');
  let today = new Date();
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    connection.query(
      "SELECT * FROM message WHERE `published` = CURDATE()",
      function (err, result, fields) {
        if(err) {
          res.send(err);
        }
        if(result.length > 0){
            if (result[0].content) {
                res.send({ message: result[0].content });
            }
        } 
        else {
          res.send({ message: 'ingen daglig meddelse fundet' });
        }
      }
    );
});

router.post('/message', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (!req.query.UserId && req.query.role === 'user') {
    res.send({ message: 'you need to be a moderator', error: true });
  } else {
    connection.query(
      "INSERT INTO message (content, UserId) VALUES ('" +
        req.query.message +
        "','" +
        user.UserId +
        "')",
      function (err, result, fields) {
        res.send(result);
      }
    );
  }
});

router.post('/user', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.query.userId && req.query.Roles === 'Administrator') {
    connection.query("SELECT * FROM user WHERE Username =  '"+ req.query.Username + "'", (err, result, fields) => {
        if (result.length === 0) {
            bcrypt.hash(req.query.Password, saltRounds, function(err, hash)  {
                console.log(hash);
                connection.query("INSERT INTO user (username, Password) VALUES ('" + req.query.Username + "', '" + hash + "')",
                function (err, result, fields) {
                  res.send(result);
                });
            });
        }
        else {
            res.send({affectedRows: 0})
        }
    })

  } else {
    res.send({ message: 'you dont have admin rights', error: true });
  }
});
module.exports = router;
//# sourceMappingURL=index.js.map
