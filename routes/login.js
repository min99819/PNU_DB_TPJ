const express = require('express');
const router = express.Router();
const qs = require(`querystring`);
const dbClient = require(`../lib/db`);
const cookieParser = require("cookie-parser");
const expressSession = require(`express-session`);


router.get(`/`, (req, res) => {
    res.render(`login`);
});

router.use(cookieParser());

// 세션 설정
router.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
);



router.get("/example", (req, res) => {
    if (req.session.user) {
      // 세션에 유저가 존재한다면
      res.redirect("/login_user"); // 예시로
    } else {
      res.redirect("/login"); // fhrmdlsdmfh
    }
  });


router.post(`/`, (req, res, next) => {
    let body = ``;
    req.on('data', function (data) {
        body += data;
    });

    req.on('end',function(){
        let post = qs.parse(body);

        const querystring = 
            `
            SELECT A.user_id FROM account A
            WHERE A.user_id = '${post.ID_login}' 
                and A.password = '${post.PW_login}';
            `;

        dbClient
            .query(querystring)
            .then((ans)=> {
                if(ans.rowCount == 1) {
                    if (req.session.user) {
                        // 세션에 유저가 존재한다면
                        console.log("이미 로그인 돼있습니다~");
                        
                      } else {
                        req.session.user = {
                          id: post.ID_login,
                          pw: post.PW_login,
                        };
                      }
                    res.render(`login_user`);
                    console.log(`로그인 성공`);
                }
                else{
                    
                    res.render(`alert`, {error : '아이디 / 비밀번호가 맞지 않음'})
                    console.log(`아이디 / 비밀번호가 맞지 않음`)
                }
            })
            .catch((e) => {
                res.render(`alert`, {error : `오류`})
                console.error(e.stack)
            });
    });


    
});

module.exports = router;
