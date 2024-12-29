var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/', async (req, res) => {
  const check = await req.db.query(
    'select * from user where idUser = ?'
    ,[1]
  )
  console.log(check);
  res.send('respond with a resource');
});

module.exports = router;
