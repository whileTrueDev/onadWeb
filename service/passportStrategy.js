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

// 암호화 체크 객체 생성
const encrpyto = require('./encryption');
const doQuery = require('./model/doQuery');
const config = require('./config.json');

const HOST = process.env.NODE_ENV === 'production' ? config.production.apiHostName : config.dev.apiHostName

//serializeUser를 정의한다. session에 저장해둘 data를 구현하는 것.
passport.serializeUser((user, done)=>{
    console.log('serialize');
    done(null, user);
});

//로그인이 되었을 때 매 요청시마다 자동으로 수행되는 session에서 인증된 req.user의 영역으로 저장하기.
passport.deserializeUser((user, done)=>{
    //db에서 추가로 데이터를 req.user에 저장.
    console.log('deserialize');
    done(null, user);
})


/* 2019-07-03 박찬우

1. session에 저장할 값 (변경되지 않는 영속적인 값)
    - useType
    - userId
    - marketerUserType

2. context에 저장할 값 (User의 기본적인 정보.)
    - userid : userid,
    - userType: 'marketer',
    - marketerName
    - marketerEmail
    - marketerContraction
    - marketerPhoneNum
    - marketerUserType
    - marketerAccountNumber

3. 구동방식

추후에 비밀번호 및 ID에 대한 오류 수정.

*/

passport.use( new LocalStrategy(
    {
        usernameField : 'userid',
        passwordField : 'passwd',
        session       :  true,
        passReqToCallback : false,
    },

    (userid, passwd, done) => {
        console.log("로그인을 수행합니다.");
        const checkQuery = `
        SELECT marketerPasswd, marketerSalt,
        marketerId, marketerName, marketerMail, marketerPhoneNum, marketerBusinessRegNum,
        marketerUserType, marketerAccountNumber, marketerEmailAuth
        FROM marketerInfo
        WHERE marketerId = ? `

        doQuery(checkQuery, [userid])
        .then((row)=>{
            if(row.result[0]){
                const marketerData = row.result[0];
                if(encrpyto.check(passwd, marketerData.marketerPasswd, marketerData.marketerSalt)){
                    let user = {
                        userid : userid,
                        userType: 'marketer',
                        marketerUserType: marketerData.marketerUserType,
                        marketerMail: marketerData.marketerMail,
                        marketerAccountNumber: marketerData.marketerAccountNumber,
                        marketerBusinessRegNum: marketerData.marketerBusinessRegNum,
                        marketerName: marketerData.marketerName,
                        marketerPhoneNum: marketerData.marketerPhoneNum,
                    };
                    console.log("로그인이 완료되었습니다");
                    return done(null, user);        
                }
                else{
                    console.log('비밀번호가 일치하지 않습니다.');
                    return done(null, {message : '비밀번호가 일치하지 않습니다.'});        
                }
            }
            else{
                console.log('회원이 아닙니다.');
                return done('회원이 아닙니다.');
            }
        })
        .catch((errorData)=>{
            return done(errorData);
        })
    }
));

/* 2019-07-02 박찬우

1. twitch를 통해 받는 데이터
    - creator ID => creatorId
    - creator DisplayName => creatorName
    - creator Name
    - creator Mail
    - creator Logo

2. 구동방식
    1) twitch를 통해 전달받은 데이터들은 session으로 전달된다.
    2) 매 로그인 시, Data가 존재하는지 확인한다.

    * 최초 로그인이 아닐 때
    3-1) Data가 존재하므로 creatorName, creatorMail을 가져온다.
    3-2) 현재 DB에서 가져온 값과 session으로 획득한 값을 비교하여 DB 수정.
    3-3) 나머지 data는 session에 띄워놓고 필요할 때 바로 사용할 수 있도록 session을 context화 하여 필요한 Component에서 접근이 가능하게 구현한다.

    * 최초 로그인시
    3-1) creator Logo를 제외한 모든 값을 creatorInfo table에 저장한다.

    - DB에 저장될 데이터 (col명 : twitchdata 명)
        - creatorId : _id
        - creatorName : display_name
        - creatorMail : email
        - advertiseUrl : 난수를 생성하여 추가.
        - creatorIp : 현재 Ip를 추가.
        - creatorAccountNumber : Null
        - creatorAlarmAgreement : 0
        - creatorContractionAgreement : 0

3. clientID, clientSecret은 초기화 및 파일화하여 배포.
*/

const makeUrl = () => {
    let password = "";

    for(let i = 0; i < 8; i++){
        let lowerStr = String.fromCharCode(Math.floor(Math.random() * 26 + 97));
        if(i % 2 == 0){
        password += String(Math.floor(Math.random() * 10));
        }else{
        password += lowerStr;
        }
    }
    return password;
}

const clientID = process.env.NODE_ENV === 'production'
    ? config.production.clientID
    : config.dev.clientID
const clientSecret = process.env.NODE_ENV === 'production'
    ? config.production.clientSecret
    : config.dev.clientSecret

passport.use(new twitchStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: `${HOST}/api/login/twitch/callback`,	
    scope: "user_read",
    passReqToCallback: true,
  },
  // login성공시 수행되는 함수.
  function(req, accessToken, refreshToken, profile, done) {
        let user = {
            creatorId : profile._json._id,
            creatorDisplayName: profile._json.display_name,
            creatorName : profile._json.name,
            creatorMail : profile._json.email,
            creatorLogo : profile._json.logo,
            userType: "creator"
        }

        doQuery(`SELECT creatorIp, creatorId, creatorName, creatorMail FROM creatorInfo WHERE creatorId = ? `, [user.creatorId])
        .then((row)=>{
            const creatorData = row.result[0];
            if(creatorData){
                console.log(`${user.creatorDisplayName} 님이 로그인 하셨습니다.`);
                user['creatorIp'] = creatorData.creatorIp;
                
                // Data 변경시에 변경된 값을 반영하는 영역.
                if(!(creatorData.creatorName === user.creatorDisplayName && creatorData.creatorMail === user.creatorMail)){
                    const UpdateQuery = `
                    UPDATE creatorInfo
                    SET 
                    creatorName = ? ,
                    creatorMail = ?
                    WHERE creatorId = ?
                    `
                    doQuery(UpdateQuery, [user.creatorDisplayName, user.creatorMail, user.creatorId])
                    .then(()=>{
                        return done(null, user);
                    })
                    .catch((errorData)=>{
                        console.log(errorData);
                        done(errorData, false);
                    })
                }else{
                    return done(null, user);
                }

            }else{
                console.log(`${user.creatorDisplayName} 님이 최초 로그인 하셨습니다.`);
                const creatorIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                const creatorBannerUrl = makeUrl();
                user['creatorIp'] = creatorIp;

                const Infoquery = `
                INSERT INTO creatorInfo
                (creatorId, creatorName, creatorMail, creatorIp, advertiseUrl)
                VALUES (?, ?, ?, ?, ?)`;

                const Incomequery = `
                INSERT INTO creatorIncome 
                (creatorId, creatorTotalIncome, creatorReceivable) 
                VALUES (?, ?, ?)`;

                const Pricequery = `
                INSERT INTO creatorPrice
                (creatorId, grade, viewerAverageCount, unitPrice)
                VALUES (?, ?, ?, ?)
                `
                Promise.all([
                    doQuery(Infoquery,  [user.creatorId, user.creatorDisplayName, user.creatorMail, creatorIp, `/${creatorBannerUrl}`]),
                    doQuery(Incomequery,   [user.creatorId, 0, 0]),
                    doQuery(Pricequery,   [user.creatorId, 1, 0, 1])
                ])
                .then(()=>{
                    return done(null, user);
                })
                .catch((errorData)=>{
                    console.log(errorData);
                    done(errorData, false);
                })
            }
        })
        .catch((errorData)=>{
            console.log(errorData);
            done(errorData, false);
        })

    }
));

module.exports = passport;
