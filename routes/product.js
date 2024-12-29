var express = require('express');
var router = express.Router();


// 책 목록
router.get('/', async (req, res) => {
  try {
    console.log("producty here")
    // Product 테이블에서 모든 데이터 가져오기
    const rows = await req.db.query('SELECT * FROM Product');
    console.log("Fetched products:", rows); // 가져온 데이터 확인
    // products 템플릿에 전달
    res.render('product', { products: rows });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//여기서 장바구니 담기
router.post('/cart/add', async (req, res) => {
  // 장바구니에 담기
  const { product_idProduct, productCount } = req.body;
  console.log(product_idProduct, productCount, "  25번줄");
  const User_idUser = 1; // 현재 사용자 ID (예시로 고정)

  try {
    // 장바구니에서 해당 상품을 찾기
    const existingItem = await req.db.query(
      'select * from CartList where Product_idProduct = ? and User_idUser = ?',
      [product_idProduct, User_idUser]
    );

    if (existingItem.length > 0) {
      // 이미 장바구니에 있는 경우, 수량 업데이트
      const updatedCount = Number(existingItem[0].productCount) + Number(productCount); // 형 변환 후 덧셈
      console.log('수량 업데이트 !');
      await req.db.query(
        'update CartList set productCount = ? where idCartList = ?',
        [updatedCount, existingItem[0].idCartList] // idCartList로 특정 항목을 업데이트
      );

      console.log('장바구니의 수량이 업데이트되었습니다.', updatedCount);
    } else {
      // 장바구니에 없는 경우, 새로 추가
      console.log('장바구니에 새로 추가됨')
      await req.db.query(
        'INSERT INTO CartList (productCount, User_idUser, Product_idProduct) VALUES (?, ?, ?)',
        [productCount, User_idUser, product_idProduct]
      );

      console.log('상품이 장바구니에 추가되었습니다.');
    }
    return res.send(
      `<script type="text/javascript">
      alert("상품이 정상적으로 담겼습니다.");
      location.href='/product';
      </script>`);

  } catch (error) {
    console.error('장바구니 업데이트 중 오류 발생:', error);
    res.status(500).send('장바구니 추가 중 오류 발생했음')
  }
});


// 상품 검색
// router.get('/search', async (req, res) => {
//   const bookName = req.query.bookName; // 쿼리에서 bookName 가져오기

//   console.log('!!!!')
//     try {
//         // 책 제목으로 제품 검색
//         const check = await req.db.query(
//             'select * from Product where bookName like ?',
//             [`${bookName}%`]
//         );

//         console.log('책제목')
//         if (check.length > 0) {
//             res.render('search', {check}); 

//         } else {
//             res.send('해당 책이 없습니다.');
//         }
//     } catch (error) {
//         console.error('Error searching for product: ', error);
//         res.status(500).send('서버 오류가 발생했습니다.');
//     }
// });



router.get('/search', async (req, res) => {
  const bookName = req.query.bookName;

  try {
      const check = await req.db.query(
          'SELECT * FROM Product WHERE bookName LIKE ?',
          [`%${bookName}%`] 
      );

      // 검색 결과를 Pug 템플릿에 전달
      res.render('search', { products: check });
  } catch (error) {
      console.error('Error searching products: ', error);
      res.status(500).send('Internal Server Error');
  }
});




// 상품 수정
router.post('/update/:idProduct', async (req, res) => {
  const { bookName, bookPrice, quantity, content } = req.body;
  console.log(bookName, bookPrice, quantity, content, idProduct);

  try{

    const check = await req.db.query(
      'UPDATE product SET bookName = ?, bookPrice = ?, quantity = ?, content = ?, WHERE idProduct = ?',
      [bookName, bookPrice, quantity, content, idProduct]
      
    );
      console.log(check);
      
  } catch (error) {
    console.error(error);
  }

});







// 상품 상세 보기 페이지 
// 근데 뭔가 보여줄게 있나...
router.get('/detail/:idProduct', async (req, res) => {

  // id를 가져옴
  const idProduct = req.params.idProduct;

  try {
    // 쿼리 실행 후 첫 번째 결과를 직접 가져옵니다.
    const [product] = await req.db.query('SELECT * FROM Product WHERE idProduct = ?', [idProduct]);
    console.log('Query result:', product); // 결과 확인

    if (product) {
      res.render('productdetail', { product }); // 단일 객체로 렌더링
    } else {
      res.status(404).send('Product not found');
    }


    
    // req.db.query('select totalOrderCount, bookName from Product where order by desc totalOrderCount')

    
// @@@@@@@
// POST 요청이 아닌 GET 요청으로 변경
// router.get\('/best', async (req, res) => {
//   // const user_idUser = 1;

//   try {
//     const bestBook = await req.db.query(
//       `SELECT 도서번호, SUM(판매량) AS 총판매량
//        FROM 일별베스트셀러
//        GROUP BY 도서번호
//        ORDER BY 총판매량 DESC;`
//     );

//     res.render('bestbook', { bestsellers: bestBook });

//   } catch (error) {
//     console.error('베스트북 오류 발생:', error);
//     res.status(500).send('베스트북 데이터를 가져오는 도중 오류 발생');
//   }
// });







// !!!!!!!!!


    // // 리뷰 !! 조회
    // const review = await  req.db.query('select * from BookReview');
    // console.log('책 상세페이지 리뷰',{review});


    // // 리뷰 새로 작성 !!
    // const [newReview] = await req.db.query('insert into BookReview(score, content, Product_idProduct) values(?, ?, ?) ', [score, contents, productId])
    // console.log('score:', newReview);  // score 값이 잘 들어왔는지 확인


    // !!!
//  // Product 테이블에서 totalOrderCount 업데이트
// await db.query(
//   'UPDATE Product SET totalOrderCount = totalOrderCount + ? WHERE idProduct = ?',
//   [quantity, productId]
// );



  } catch (error) {
    console.error("Error product detail: ", error);
    res.status(500).send('Internal Server Error');
  }
});






module.exports = router