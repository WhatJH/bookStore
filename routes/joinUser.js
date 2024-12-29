var express = require('express');
var router = express.Router();
// var db = require('../db');


// var userName = req.body.userName;
// const sql = 'insert into User(userName, password, phoneNumber) values("${userName}","${password}" ,"${phoneNumber}")';
// var sql = 'insert into User(userName, password, phoneNumber) values(userName ,password ,phoneNumber)';
// var values = ["userName", "password", "phoneNumber"];

// router.get('/', async (req, res) => {
//   const check = await req.db.query(
//     'insert into User(userName, password, phoneNumber) values(?, ?, ?)'
//   )
//   console.log(check);
//   res.send('respond with a resource');
//   // return res.status(200).json("회원가입 완료");
// });

router.get('/', (req, res)=>{
  res.render('joinUser');
})


router.post('/joinUser', async (req, res) => {

  const { userName, password, phoneNumber} = req.body;
  const sql = 'insert into User(userName, password, phoneNumber) values(?, ?, ?)';

db.query(sql,values, function (err, result){
  if (err){
    console.log(err);
    res.status(500).send('Internal Server Error');
  } else {
    res.redirect('/' + result.insertid);
  }
})
})


module.exports = router;
