var express = require('express');
var router = express.Router();


// /login == /
router.get('/', (req, res)=> {
    console.log("here")
    res.render('login');
})

router.post('/signin', async (req,res) => {
    const {userName, userPassword} = req.body

    try{
        //DB에서 select 해야됨. and  
        const check = await req.db.query(
            'select * from user where userName = ? and password = ?'
            ,[userName, userPassword]
        )
        console.log(check)

        if (check.length === 0)
        {
            //이 아이디와 비밀번호를 가진 유저가 없음
            return res.send(
                `<script type="text/javascript">
                alert("비밀번호와 아이디이가 잘못되었습니다. 다시 로그인을 해주세여");
                location.href='/login';
                </script>`);
        }
        else 
        {

            //이 아이디와 비밀번호를 가진 유저가 있음
            return res.send(
                `<script type="text/javascript">
                alert("로그인이 성공적으로 진행되었습니다.");
                location.href='/product';
                </script>`);
        }
    }catch(error)
    {
        console.log(error)
    }
})

router.post('/signup', async (req,res) => {
    const {userName, userPassword, phoneNumber} = req.body

    console.log(userName, userPassword, phoneNumber);
    try{
        //DB 넣어줘야죠
        await req.db.query(
            'insert into user(userName, password, phoneNumber) values (?,?,?)'
            ,[userName, userPassword, phoneNumber]
        )
        return res.send(
            `<script type="text/javascript">
            alert("회원가입이 성공적으로 진행되었습니다 다시 로그인을 해주세요");
            location.href='/login';
            </script>`);
    }
    catch(error)
    {
        console.log(error)
    }


})


module.exports = router;