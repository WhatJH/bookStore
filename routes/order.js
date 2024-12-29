const express = require('express');
const { render } = require('pug');
const router = express.Router();

// 주문창 페이지
router.get('/', async (req, res) => {
  console.log('주문창 페이지');

  try {
    // 장바구니에서 사용자별 주문 데이터 조회
    const orderPages = await req.db.query(`
      select cl.productCount, cl.User_idUser, p.bookName, p.bookPrice
      from cartList cl
      join product p on cl.Product_idProduct = p.idProduct
      where cl.User_idUser = 1
    `);

    // 카드 정보 조회
    const creditCard = await req.db.query(`
      select * from CreditCard where User_idUser = 1
    `);

    // 주소 정보 조회
    const address = await req.db.query(`
      select * from Address where User_idUser = 1
    `);

    // 총 가격 계산
    let totalPrice = 0;
    for (let i = 0; i < orderPages.length; i++) {
      totalPrice += orderPages[i].bookPrice * orderPages[i].productCount;
    }

    let discount = 0;
    const idCoupon = req.query.idCoupon || null;  // 쿠폰 ID 받아오기

    if (idCoupon) {
      // 쿠폰 유효성 검사 및 할인 적용
      const coupons = await req.db.query(`
        SELECT * FROM coupon22 WHERE couponNumber = ?
      `, [idCoupon]);

      if (coupons.length > 0) {
        const coupon = coupons[0];

        // 쿠폰 사용 기간 체크
        const currentDate = new Date();
        const startDate = new Date(coupon.couponStart);  
        const endDate = new Date(coupon.couponEnd);

        if (currentDate >= startDate && currentDate <= endDate && coupon.couponUse === 0) {
          // 쿠폰 타입에 따른 할인 적용
          if (coupon.couponType === 1) {
            discount = 1000;  // 1000원 할인
          } else if (coupon.couponType === 2) {
            discount = totalPrice * 0.1;  // 10% 할인
          }

          totalPrice -= discount;  // 할인 적용

          // 쿠폰 사용 처리
          await req.db.query('UPDATE coupon22 SET couponUse = 1 WHERE couponNumber = ?', [idCoupon]);
        } else {
          console.log('쿠폰이 사용 기간을 벗어났거나 이미 사용되었습니다.');
        }
      } else {
        console.log('잘못된 쿠폰입니다.');
      }
    }

    // 주문서에 보여줄 다른 정보 조회
    res.render('order', { orderPages, creditCard, address, price: totalPrice, discount });
    console.log('주문창 데이터 렌더 완료!');
  } catch (err) {
    console.error(err);
    res.status(500).send('주문창의 서버 오류');
  }
});

// 주문리스트 페이지 처리
router.post('/list', async (req, res) => {
  const user_idUser = 1;  // 사용자 ID (예시로 1번 사용자로 설정)

  try {
    // 장바구니에서 사용자별 데이터 조회
    const cartList = await req.db.query(`
      SELECT cl.idCartList, cl.productCount, cl.User_idUser, 
      p.idProduct, p.bookName, p.bookPrice
      FROM cartList cl
      JOIN product p ON cl.Product_idProduct = p.idProduct
      WHERE cl.User_idUser = ?
    `, [user_idUser]);

    // 장바구니에서 총 가격 계산 (할인 전 가격)
    let totalPrice = cartList.reduce((total, item) => total + (item.productCount * item.bookPrice), 0);
    console.log('할인 전 총 가격 (totalPrice):', totalPrice);  // 할인 전 총 가격 확인

    // 쿠폰 할인 값 처리 (req.body.discount는 쿠폰 적용된 값)
    let discount = req.body.discount || 0;  // 할인 값 받아오기
    console.log('적용할 할인 금액:', discount);  // 적용할 할인 금액 확인

    // 할인 후 가격 계산 (할인 적용된 가격)
    let totalPrice2 = totalPrice - discount;
    console.log('할인 후 총 가격 (totalPrice2):', totalPrice2);  // 할인 후 총 가격 확인

    // 주문 정보 삽입 (할인된 totalPrice2 사용)
    const orderResult = await req.db.query(
      'INSERT INTO Orders (totalPrice, User_idUser) VALUES (?, ?)',
      [totalPrice, user_idUser]  // 할인 전 금액인 totalPrice를 삽입
    );
    const orderId = orderResult.insertId;  // 새로 생성된 주문 ID

    // 장바구니에 있는 각 상품을 OrderList에 추가하고, Product의 totalOrderCount 업데이트
    const orderPromises = cartList.map(async (item) => {
      // OrderList에 삽입
      await req.db.query(
        'INSERT INTO OrderList (orderListCount, Orders_idOrders, Product_idProduct) VALUES (?, ?, ?)',
        [item.productCount, orderId, item.idProduct]
      );

      // Product 테이블의 totalOrderCount 증가
      await req.db.query(
        'UPDATE Product SET totalOrderCount = totalOrderCount + ? WHERE idProduct = ?',
        [item.productCount, item.idProduct]
      );

      console.log(`OrderList에 삽입: 상품 ID: ${item.idProduct}, 주문 수량: ${item.productCount}`);
    });

    // 모든 상품에 대한 처리가 끝난 후 장바구니에서 해당 항목 삭제
    await Promise.all(orderPromises);
    await req.db.query('DELETE FROM CartList WHERE User_idUser = ?', [user_idUser]);

    console.log('주문 ID:', orderId);

    // 주문 리스트 페이지로 이동
    res.render('orderlist', { orderId, cartList, discount, totalPrice: totalPrice2 });
  } catch (error) {
    console.error('주문 처리 도중 오류 발생:', error);
    res.status(500).send('결제 도중 오류 발생했음');
  }
});

module.exports = router;
