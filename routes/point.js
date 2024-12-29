// var express = require('express');
// var router = express.Router();

// router.get('/', async (req, res) => {
//   const user_idUser = 1; 

//   console.log("적립금 거래 내역");

//   try {
//       // 데이터베이스 쿼리 실행
//       const point = await req.db.query(`
//           SELECT 
//               u.userName,
//               p.pointMoney,          
//               p.pointAccoiunt,         
//               p.pointType,      
//               p.pointContent,
//               p.pointDate         
//           FROM 
//               Point p
//           JOIN 
//               User u ON o.User_idUser = u.idUser
//           WHERE 
//               u.idUser = ?;        
//       `, [user_idUser]);

//       res.render('point', { point }); 
//       console.log("포인트 목록.");
//   } catch (error) {
//       console.error('포인트 목록 조회 중 오류 발생:', error);
//       res.status(500).send('포인트 목록 조회 중 오류가 발생했습니다.');
//   }
// });

// module.exports = router;
