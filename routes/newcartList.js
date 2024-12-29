// router/cartlist.js
// 여기는 안 쓰는 코드임
const express = require('express');
const router = express.Router();

// POST 요청: 장바구니에 상품 추가
router.post('/', async (req, res) => {
    const { id, quantity } = req.body; // 상품 ID와 수량 가져오기
    const cartId = 1; // 세션이나 데이터베이스에서 가져올 수 있는 Cart ID (예: 사용자 세션)

    try {
        // 장바구니에 상품 추가
        await req.db.query(
            'insert into CartList (productCount, Product_idProduct, Cart_idCart) values (?, ?, ?)',
            [quantity, id, cartId]
        );

        console.log('상품이 장바구니에 추가되었습니다.');
        res.redirect('/cartlist'); // 장바구니 페이지로 리다이렉트
    } catch (error) {
        console.error('장바구니 추가 중 오류 발생:', error);
        res.status(500).send('Internal Server Error'); // 오류 처리
    }
});





// 장바구니 목록에 추가 되는 것 (cart랑 다름.)
router.post('/', async(req,res) => {
    const {productCount, product_idProduct, Cart_idCart} = req.body;

    console.log(productCount, product_idProduct, Cart_idCart);

    try{
        const check = await req.db.query(
            'insert into CartList(productCount, Product_idProduct, Cart_idCart) values(?, ?, ?)'
            ,[productCount, product_idProduct, Cart_idCart ]
        );
        console.log('상품이 장바구니에 담겼음', check);
    } catch (error) {
        console.error('장바구니 추가 중 오류 발생', error); 
    }
})





router.post('/cart/add', async (req, res) => {
    //장바구니에 담기
    const {product_idProduct,productCount } = req.body
    console.log(product_idProduct, productCount);
    const User_idUser = 1;
  
    try{
  
    const check = await req.db.query(
      'insert into CartList(productCount, User_idUser, Product_idProduct) values(?, ?, ?)', [productCount, User_idUser, product_idProduct]
    );
    console.log('상품이 장바구니로 저장되었음', check);
  
  
    // res.redirect('/product');
  
  
    // return res.send(
    //   `<script type="text/javascript">
    //   alert("상품이 정상적으로 담겼습니다.");
    //   location.href='/product';
    //   </script>`);
  
  }
   catch(error)
  {
      console.error('Error adding to cart:', error);
      res.status(500).send('장바구니 추가 중 오류 발생했음')
  }
  })

  

  
module.exports = router;




