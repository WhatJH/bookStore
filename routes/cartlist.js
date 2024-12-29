var express = require('express');
var router = express.Router();




    // 장바구니 목록임
    router.get('/', async (req, res) => {
        console.log("장바구니 목록부분이다람쥐");
        const User_idUser = 1;

        try {
            // const userId = req.session.userId; // 세션에서 사용자 ID 가져오기
    
            const cartItems = await req.db.query(`
                SELECT cl.idCartList, cl.productCount, cl.cartDate, 
                p.idProduct, p.bookName, p.bookPrice
                FROM cartList cl
                JOIN product p ON cl.Product_idProduct = p.idProduct`
            ,[User_idUser]);
    
            console.log(cartItems);
    
            res.render('cartlist', { cartlist: cartItems || [] });
        } catch (err) {
            console.error(err);
            res.status(500).send('서버 오류');
        }
    });
    


// 갯수 바꿈에 대한 update
// router.post('/update', async(req, res) =>{
//     const {productCount} = req.body;

//     console.log(productCount);

//     try {
//     const check = await req.db.query(
//     'update cartList set prouctCount = ?',
//     [productCount]
// );
// } catch (error){
//     console.error(error);
// }
// });



//장바구니 업데이트
router.post('/update', async (req, res) => {
    const { idCartList, Product_idProduct, productCount } = req.body;
    console.log('!!!')

    try {
      // 제품 ID에 해당하는 상품의 수량 업데이트
    const check = await req.db.query(
        'update CartList set productCount = ? where idCartList = ?',
        [productCount, idCartList]
    );
    

    if (check.affectedRows > 0) {
        console.log('장바구니 수량이 성공적으로 업데이트되었습니다.');
        res.redirect('/cartlist');
        
    } else {
        console.log('업데이트 실패: 해당 상품을 찾을 수 없습니다.');
        res.status(404).send('Product not found');
    }
    } catch (error) {
        console.error('Error updating product count: ', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;