// 현우햄 코드

router.get('/review', async (req, res) => {
    try {
        const books = await req.db.query(`SELECT * FROM booklist`);
        const reviews = []; 
        const selected_book_id = null; 
        res.render('review', { books, reviews, selected_book_id });
    } catch (error) {
        console.error(error);
        res.status(500).send('페이지 로드 중 오류가 발생했습니다.');
    }
  });
  
  router.post('/review/select', async (req, res) => {
    const { book_id } = req.body;
  
    try {
        const reviews = await req.db.query(
            `SELECT r.review_id, u.name AS reviewer_name, r.review_content, r.rating, r.created_at, b.book_name
             FROM review r
             JOIN user u ON r.user_id = u.user_id
             JOIN booklist b ON r.book_id = b.book_id
             WHERE r.book_id = ?`,
            [book_id]
        );
  
        const books = await req.db.query(`SELECT * FROM booklist`);
        res.render('review', { books, reviews, selected_book_id: book_id });
    } catch (error) {
        console.error(error);
        res.status(500).send('도서 선택 중 오류가 발생했습니다.');
    }
  });
  
  
  // 리뷰 작성
  router.post('/review/add/:book_id', async (req, res) => {
    const { book_id } = req.params;
    const { review_content, rating } = req.body;
  
    if (!req.session.user_id) {
        return res.render('login', { message: "로그인 후 리뷰를 작성해주세요." });
    }
  
    try {
        // 중복 리뷰 확인
        const existingReview = await req.db.query(
            `SELECT * FROM review WHERE user_id = ? AND book_id = ?`,
            [req.session.user_id, book_id]
        );
  
        if (existingReview.length > 0) {
            const books = await req.db.query(`SELECT * FROM booklist`);
            const reviews = await req.db.query(
                `SELECT r.review_id, u.name AS reviewer_name, r.review_content, r.rating, r.created_at, b.book_name
                 FROM review r
                 JOIN user u ON r.user_id = u.user_id
                 JOIN booklist b ON r.book_id = b.book_id
                 WHERE r.book_id = ?`,
                [book_id]
            );
  
            return res.render('review', {
                reviews,
                books,
                selected_book_id: book_id,
                message: "이미 이 도서에 대한 리뷰를 작성하셨습니다."
            });
        }
  
        // 리뷰 저장
        await req.db.query(
            `INSERT INTO review (user_id, book_id, review_content, rating) 
             VALUES (?, ?, ?, ?)`,
            [req.session.user_id, book_id, review_content, rating]
        );
  
        // 리뷰 목록 다시 조회
        const reviews = await req.db.query(
            `SELECT r.review_id, u.name AS reviewer_name, r.review_content, r.rating, r.created_at, b.book_name
             FROM review r
             JOIN user u ON r.user_id = u.user_id
             JOIN booklist b ON r.book_id = b.book_id
             WHERE r.book_id = ?`,
            [book_id]
        );
  
        const books = await req.db.query(`SELECT * FROM booklist`);
        
        // 작성된 리뷰와 책 목록 렌더링
        return res.render('review', {
            reviews,
            books,
            selected_book_id: book_id,
            message: "리뷰가 성공적으로 작성되었습니다."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("리뷰 작성 중 오류가 발생했습니다.");
    }
  });
  review.js
  
  
  
  router.get('/review', async (req, res) => {
    try {
        const books = await req.db.query(`SELECT * FROM booklist`);
        const reviews = []; 
        const selected_book_id = null; 
        res.render('review', { books, reviews, selected_book_id });
    } catch (error) {
        console.error(error);
        res.status(500).send('페이지 로드 중 오류가 발생했습니다.');
    }
  });
  
  router.post('/review/select', async (req, res) => {
    const { book_id } = req.body;
  
    try {
        const reviews = await req.db.query(
            `SELECT r.review_id, u.name AS reviewer_name, r.review_content, r.rating, r.created_at, b.book_name
             FROM review r
             JOIN user u ON r.user_id = u.user_id
             JOIN booklist b ON r.book_id = b.book_id
             WHERE r.book_id = ?`,
            [book_id]
        );
  
        const books = await req.db.query(`SELECT * FROM booklist`);
        res.render('review', { books, reviews, selected_book_id: book_id });
    } catch (error) {
        console.error(error);
        res.status(500).send('도서 선택 중 오류가 발생했습니다.');
    }
  });
  
  
  // 리뷰 작성
  router.post('/review/add/:book_id', async (req, res) => {
    const { book_id } = req.params;
    const { review_content, rating } = req.body;
  
    if (!req.session.user_id) {
        return res.render('login', { message: "로그인 후 리뷰를 작성해주세요." });
    }
  
    try {
        // 중복 리뷰 확인
        const existingReview = await req.db.query(
            `SELECT * FROM review WHERE user_id = ? AND book_id = ?`,
            [req.session.user_id, book_id]
        );
  
        if (existingReview.length > 0) {
            const books = await req.db.query(`SELECT * FROM booklist`);
            const reviews = await req.db.query(
                `SELECT r.review_id, u.name AS reviewer_name, r.review_content, r.rating, r.created_at, b.book_name
                 FROM review r
                 JOIN user u ON r.user_id = u.user_id
                 JOIN booklist b ON r.book_id = b.book_id
                 WHERE r.book_id = ?`,
                [book_id]
            );
  
            return res.render('review', {
                reviews,
                books,
                selected_book_id: book_id,
                message: "이미 이 도서에 대한 리뷰를 작성하셨습니다."
            });
        }
  
        // 리뷰 저장
        await req.db.query(
            `INSERT INTO review (user_id, book_id, review_content, rating) 
             VALUES (?, ?, ?, ?)`,
            [req.session.user_id, book_id, review_content, rating]
        );
  
        // 리뷰 목록 다시 조회
        const reviews = await req.db.query(
            `SELECT r.review_id, u.name AS reviewer_name, r.review_content, r.rating, r.created_at, b.book_name
             FROM review r
             JOIN user u ON r.user_id = u.user_id
             JOIN booklist b ON r.book_id = b.book_id
             WHERE r.book_id = ?`,
            [book_id]
        );
  
        const books = await req.db.query(`SELECT * FROM booklist`);
        
        // 작성된 리뷰와 책 목록 렌더링
        return res.render('review', {
            reviews,
            books,
            selected_book_id: book_id,
            message: "리뷰가 성공적으로 작성되었습니다."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("리뷰 작성 중 오류가 발생했습니다.");
    }
  });
  
  
  review.pug