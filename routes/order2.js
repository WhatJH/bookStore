const express = require('express');
const { purge } = require('./order');
const router = express.Router();



// update쿼리 미리 짜둔거임 ㅋㅋ

// update 테이블명 set 속성 값 = ?, 속성 값 = ? where = id = ?
//'UPDATE product SET bookName = ?, bookPrice = ?, quantity = ?, content = ?, WHERE idProduct = ?',

  //- div 
  //- h2 리뷰
  //-   form(action=`/review`, method='post')
    
  //-     div
  //-       span= 도서평가.평가점수
  //-     div 
  //-       span= 도서평가.한줄평가
  //-     div
  //-       span= 도서평가.평가일자





// pug

// h3 카드 정보
// if creditCard.length
//   select(name="selectedCard")
//     each card in creditCard
//       option(value=`${JSON.stringify({
//         idCreditCard: card.idCreditCard,
//         cardType: card.cardType,
//         cardNumber: card.cardNumber,
//         cardPeriod: card.cardPeriod
//       })}`)
//         | #{card.cardType} 카드 - #{card.cardNumber} (유효기간: #{card.cardPeriod})
// else
//   p 카드 정보가 없습니다.









// 주문 처리 라우터를 POST로 변경
// 장바구니 내용 확인 및 결제 페이지 로드
// router.get('/', async (req, res) => {
//     const user_idUser = 1; // 현재 사용자 ID (예시로 고정)

//     try {
//         // 장바구니 내용 조회
//         const cartList = await req.db.query(`
//             SELECT cl.idCartList, cl.productCount, cl.User_idUser, 
//             p.idProduct, p.bookName, p.bookPrice
//             FROM cartList cl
//             JOIN product p ON cl.Product_idProduct = p.idProduct
//             WHERE cl.User_idUser = ?
//         `, [user_idUser]);
        
//         console.log("장바구니 조회 완료");

//     //     if (cartList.length === 0) {
//     //         // 장바구니가 비어 있을 경우 주문 목록 페이지로 리디렉션
//     //         return res.redirect('/orderlist'); 
//     //     }

//     //     // 총 금액 계산
//     //     const totalPrice = cartList.reduce((total, item) => total + (item.productCount * item.bookPrice), 0);

//     //     // 결제 페이지 렌더링
//     //     res.render('order', { cartList, totalPrice });
//     } catch (error) {
//         console.error('장바구니 조회 중 오류 발생:', error);
//         res.status(500).send('장바구니 조회 중 오류가 발생했습니다.');
//     }
// });

// 결제 요청 처리
// router.post('/', async (req, res) => {
//     const User_idUser = 1; // 현재 사용자 ID (예시로 고정)
//     console.log("!!!!");
    
//     try {
//         // 장바구니 내용 조회
//         const cartList = await req.db.query(`
//             SELECT cl.productCount, cl.User_idUser, 
//                     p.idProduct, p.bookName, p.bookPrice
//             FROM cartList cl
//             JOIN product p ON cl.Product_idProduct = p.idProduct`);
//         // 총 금액 계산
//         const totalPrice = cartList.reduce((total, item) => {
//             return total + (item.productCount * item.bookPrice);
//         }, 0);

//         // Orders 테이블에 새로운 주문 삽입
//         const orderResult = await req.db.query(
//             'INSERT INTO Orders (totalPrice, User_idUser) VALUES (?, ?)',
//             [totalPrice, User_idUser]
//         );

//         console.log("주문 삽입 완료");
//         const orderId = orderResult.insertId; // 새로 생성된 주문 ID

//         // OrderList 테이블에 각 항목 삽입
//         for (const item of cartList) { // cartList의 각 항목을 반복
//             await req.db.query(
//                 'INSERT INTO OrderList (OrderListCount, Product_idProduct, Orders_idOrders) VALUES (?, ?, ?)',
//                 [item.productCount, item.idProduct, orderId] // orderId 사용
//             );
//             console.log("주문 항목 삽입 완료");
//         }

//         // 장바구니 비우기
//         await req.db.query('DELETE FROM cartList WHERE User_idUser = ?', [User_idUser]);
//         console.log('주문 처리 완료');
        
//         // 주문 완료 후 주문 목록 페이지로 리디렉션
//         res.redirect('/orderlist'); 
//     } catch (error) {
//         console.error('주문 처리 중 오류 발생:', error);
//         res.status(500).send('주문 처리 중 오류가 발생했습니다.');
//     }
// });


// 주문 목록 페이지 orderlist
router.get('/list', async (req, res) => {
    const user_idUser = 1; 

    console.log("주문목록");

    try {
        const orderList = await req.db.query(`
SELECT 
    item.bookName, 
    o.totalPrice, 
    o.orderTime 
FROM 
    OrderList ol
JOIN 
    Orders o ON ol.Orders_idOrders = o.idOrders -- 주문 ID 기준으로 조인
JOIN 
    Product item ON ol.Product_idProduct = item.idProduct -- 제품 ID 기준으로 조인

    `, [user_idUser]);
    
        res.render('orderlist', { orderList }); 
        console.log("주문 목록~!! order, 110")

        } catch (error) {
        console.error('주문 목록 조회 중 오류 발생:', error);
        res.status(500).send('주문 목록 조회 중 오류가 발생했습니다.');
    }
});



/* GET order page */
router.get('/', async (req, res) => {
    // const User_idUser =1;

    try {
    // 주소 정보 가져오기
    const Address = await req.db.query(
    'SELECT postNumber, defaultAdd, detailAdd * FROM Address WHERE User_idUser = 1',
    [User_idUser]
    );

    // 카드 정보 가져오기
    const CreditCard = await req.db.query(
    'SELECT * FROM CreditCard WHERE User_idUser = 1',
    [User_idUser]
    );

    // 카트 내용 가져오기
    const User_idUser = 1;
    const CartList = await req.db.query(
      'SELECT * FROM CartList WHERE User_idUser = 1',
    [User_idUser]
    );

    if (CartList.length === 0) {
        return res.send(
        `<script>alert("주문할 상품이 없습니다."); location.href='/cartlist';</script>`
        );
    }

    // // 총 가격 계산
    // const totalPrice = CartList.reduce((total, item) => {
    //   return total + item.productCount * item.productPrice;
    // }, 0);

    console.log('totalprce부근 order의 155')
    res.render('order', { totalPrice, Address, CreditCard});
    // res.render('order', { totalPrice, Address, CreditCard, cartList });

    } catch (error) {
    console.error('Error fetching order data:', error);
    res.status(500).send(
    `<script>alert("주문 처리 중 오류 발생"); location.href='/cartList';</script>`
    );
}
});



// /* POST order */ 얘는 뭐임??????????????????????
router.post('/list', async (req, res) => {
  const User_idUser = 1;

  try {
    const { item, userName } = req.body;
    const list = JSON.parse(item);
    let totalPrice = 0;
    console.log("!!!! order 174!", list);
    for(let i=0; i< list.length; i++){

        totalPrice+= list[i].bookPrice*list[i].productCount;
    }
    console.log("totalPrice:" , totalPrice);

    const user = await req.db.query("select * from user where userName = ?", [userName]);
    // console.log(user[0]);
    
    // 주문 정보 저장
    const orderResult = await req.db.query(
      'INSERT INTO Orders (totalPrice, User_idUser) VALUES (?, ?)',
      // [totalPrice, user[0].idUser]
      [totalPrice, User_idUser]);



      console.log("order의 주문 정보 저장 193번줄")
    // );
    
    // console.log(orderResult[0]);
    

    // const idOders = orderResult[0].insertId; // 방금 생성된 주문 ID 가져오기
    // console.log("id" , idOders);
    const lastOrder = await req.db.query("SELECT * FROM bookStore2.Orders WHERE User_idUser = 2 ORDER BY orderTime DESC LIMIT 1;");
    console.log(lastOrder[0]);
    
    
    // 주문 항목 저장 및 카트 비우기
    // const CartList = await req.db.query('SELECT * FROM CartList WHERE user_idUser = ?', [user_idUser]);
    for(let i=0; i< list.length;i++){
        await req.db.query("insert into OrderList values (null,?,?,?)",[
            list[i].productCount, lastOrder[0].idOrders, list[i].idProduct
        ]);
        
    }

    for(let i=0; i< list.length;i++){
        await req.db.query("delete from CartList where Product_idProduct = ?", [Number(list[i].idProduct)]);
    }
    try {

    } catch (error) {
        console.log(error);
        
    }

    // for (const item of CartList) {
    //   await req.db.query(
    //     'INSERT INTO OrderList (OrderListCount, Product_idProduct, Orders_idOrders) VALUES (?, ?, ?)',
    //     [item.productCount, item.Product_idProduct, orderId]
    //   );

    //   // 카트에서 해당 항목 삭제
    //   await req.db.query('DELETE FROM CartList WHERE user_idUser = ?', [user[0].idUser]);
    // }

    res.send(
      `<script>alert("주문이 완료되었습니다!"); location.href='/';</script>`
    );

  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).send(
      `<script>alert("주문 처리 중 오류 발생"); location.href='/cartlist';</script>`
    );
  }
});

module.exports = router;
