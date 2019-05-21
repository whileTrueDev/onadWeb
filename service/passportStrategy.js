/*
1. passport-local을 통해 직접 passport를 통한 로그인을 구현한다.
2. passport를 사용하기 위해서 LocalStrategy를 custom으로 정의해야한다. (option, verify callback function)으로 구성
3. app.js에서 해당 LocalStrategy를 사용하여 passport를 정의하고 app.use로 추가한다.
4. app.use(passport.initialize()); 추가
5. app.use(passport.session()); 추가
6. passport.serializeUser() 를 오버라이딩하여 session에 저장할 데이터를 지정.
7. passport.unserializeUser()를 오버라이딩하여 session의 값을 이용하여 매 req에 저장할 데이터를 지정.
8. /login 에 post Method 정의할 때, connection middleware로 callback 함수전에 passport.authenticate('local')을 사용하여 session 변경
9. user-defined function인 승인된 session인지 체크하는 ensureAuthenticated() 미들웨어 정의
10. routing 마다 callback 함수 전에 체크 후 진행하도록 한다.
*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const twitchStrategy = require("passport-twitch").Strategy;

// DB 객체 생성
const pool = require('./model/connectionPool');

// 암호화 체크 객체 생성
const encrpyto = require('./encryption');

//serializeUser를 정의한다. session에 저장해둘 data를 구현하는 것.
//user는 LocalStrategy를 통해 정의된 done()을 통해 전달되는 인자값.
passport.serializeUser((user, done)=>{
    console.log('serialize');
    //req.session.passport.user(inner property)의 영역으로 저장된다.
    done(null, user);
});

//로그인이 되었을 때 매 요청시마다 자동으로 수행되는 session에서 인증된 req.user의 영역으로 저장하기.
passport.deserializeUser((user, done)=>{
    console.log('deserialize');
    //db에서 추가로 데이터를 req.user에 저장.
    done(null, user);
})

passport.use( new LocalStrategy(
    // option of LocalStrategy
    {
        usernameField : 'userid',
        passwordField : 'passwd',
        session       :  true,
        passReqToCallback : true,
    },
    
    // verify callback function
    // 위에서 정의한 username, password field명으로 인자값을 받는다.
    (req, userid, passwd, done) => {
        // db관련 오류 핸들러.
        pool.getConnection(function(err, conn){
            if(err){ 
                return done(err);
            }
            // 쿼리문을 userid로 검색하면된다.
            conn.query(`SELECT marketerPasswd, marketerSalt, marketerEmailAuth, temporaryLogin FROM marketerInfo WHERE marketerId = ? `, [userid], function(err, result, fields){
                if(result[0]){
                    //비밀번호를 위한 수행
                    if(encrpyto.check(passwd, result[0].marketerPasswd, result[0].marketerSalt)){
                        conn.release();
                        let user = {userid : userid}
                        if(!result[0].marketerEmailAuth){
                            user['marketerEmailAuth'] = result[0].marketerEmailAuth;
                        }   
                        if(result[0].temporaryLogin){
                            user['temporaryLogin'] = result[0].temporaryLogin;
                        }
                        return done(null, user);        
                    }
                    else{
                        conn.release();
                        return done(null, false);        
                    }
                }
                conn.release();
                req.session.message = 'ID가 존재하지 않습니다.'
                return done(null, false);
                
            });
        });
    }
));


passport.use(new twitchStrategy({
    clientID: 'mzmtrk1xlqerih1u10ilip2xwhowil',
    clientSecret: 'urhry446c5geg16ucmr55hozif1tfq',
    callbackURL: "http://localhost:3000/login/twitch/callback",
    scope: "user_read",
    passReqToCallback: true,
  },
  function(req, accessToken, refreshToken, profile, done) {
        let user = {
            creatorName : profile._json.name,
            creatorMail : profile._json.email
        }
        return done(null, user);
    } 
));

module.exports = passport;
