const express = require('express');
const router = express.Router();
const dbClient = require(`../lib/db`);
const qs = require(`querystring`);
const rd = require(`./register_category/register_disabled`);


function check_user_category(name,user_id,user_category){
    if(user_category == 1){
        console.log(`장애인`);
        rd.disabled_register(name, false, false, `축구`, `왼팔장애`, user_id)
    } else if(user_category == 2){
        console.log("보호자");
    } else if(user_category == 3){
        console.log("센터");
    } else if(user_category == 4){
        console.log("강사");
    } else if(user_category == 0){
        console.log("관리자");
    } else {
        console.log("잘못 입력됨");
    }
}

router.get(`/`, (req,res)=>{
    res.render(`register`);
})

router.get(`/dup_chk`,(req,res,next)=>{
    res.render(`id_dup_check`)
})
  
router.post(`/`, (req,res,next)=>{
    let body = ``;
    req.on('data', function (data) {
        body += data;
    });

    req.on('end',function(){
        let post = qs.parse(body);

        const querystring = 
            `insert into Account values ('${post.ID_reg}', '${post.PW_reg}', '${post.NAME_reg}', ${post.user_category});`;

        dbClient
            .query(querystring)
            .then(() => {
                console.log(querystring);
            })
            .then(()=>{
                check_user_category(post.NAME_reg, post.ID_reg, post.user_category);
            })
            .then(()=>{
                res.render(`login`);
            })
            .catch((e) => {
                res.render(`alert`, {error : `가입정보를 다시 확인하세요.`})
                console.error(e.stack)
            })
        
    });
})

// 중복체크
router.post(`/dup_chk`,(req,res,next)=>{
    let body = ``;
    req.on('data', function (data) {
        body += data;
    });

    req.on('end',function(){
        let post = qs.parse(body);

        const querystring = 
            `SELECT * FROM account A WHERE A.user_id = '${post.dup_id}';`;

        dbClient
            .query(querystring)
            .then((ans) => {
                if(ans.rowCount == 1){
                    res.render(`alert`, {error : "중복된 아이디"});
                }
                else if(post.dup_id.length > 15){
                    res.render(`alert`, {error : `너무길어`});
                }
                else{
                    res.render(`alert`, {error : `가입가능한 이이디입니다.`});
                }
            })
            .catch((e) => {
                res.render(`alert`, {error : `오류`})
            })
        
    });
})


module.exports = router;