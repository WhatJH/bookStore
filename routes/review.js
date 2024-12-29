const express = require('express');
const router = express.Router();

// 안 씀



router.get('/', async (req, res) => {


  

    // const {product_idProduct, bookName} = req.body;
    // console.log(product_idProduct, bookName, "13번째  줄")
  
    try{
  
    await req.db.query(
        'select * from BookReview'

        // [product_idProduct, bookName]
      );
        // console.log(bookreview);
        res.render('review', {review})
        
    } catch (error) {
        console.error(error);
        res.status(500).send('review 서버 오류');
    }
  
  });









// router.post('/add', async (req, res) => {

//     const {product_idProduct, bookName} = req.body;
    

//     // const {product_idProduct, bookName} = req.body;
//     console.log(product_idProduct, bookName, "10번째  줄")
//     // console.log(도서평가,"review");
  
//     try{
  
//     await req.db.query(
//         'INSERT INTO 도서평가 (평가점수, 한줄평가, 평가일자) VALUES (?, ?, ?)',
//     [product_idProduct, bookName]
//       );
//         console.log(bookreview);
//         res.render('review', {bookreview})
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('review 서버 오류');
//     }
  
//   });







module.exports = router
