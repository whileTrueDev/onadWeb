const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const sql = require('./public/select');
const pool = require('./public/connect');
const schedule = require('node-schedule');
const requestImg = require('./public/requestImg.js')
const checkPlz = require('./public/checkPlz.js')

//view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//static
app.use('/public', express.static(__dirname + '/public')); //디렉토리 정적으로 고정하는 부분

//routing
app.get('/', function(req, res){ //index.html /로 라우팅
    console.log('home')
    res.render('home.ejs')
});

app.get('/wrongIp', function(req, res){
    res.render('wrongIp.ejs')
});

app.get('/wrongUrl', function(req, res){
    res.render('wrongUrl.ejs')
});
app.get('/duplicate', function(req, res){
    res.render('duplicate.ejs')
});
app.get('/browserWarn', function(req, res){
  res.render('browserWarn.ejs')
});
app.get('/banner/server', function(req, res){ // server.html /server로 라우팅 
    //관리자 페이지 접속 시 
    console.log('server')
    var toServer = {};
    var tmp = sql('SELECT bannerId, bannerSrc FROM bannerMatched where contractionState = 1')
    // 현재 송출 중인 배너들을 띄우는 부분
    tmp.select(function(err, data){
        if (err){
            console.log(err)
            res.render('server.ejs')
        }
        else {
            toServer['img'] = {path : data[0].path, name : data[0].name}
            res.render('server', {imgSource : toServer});
        };
        
        // sql.pool.end(function(err){
        //   if (err) console.log(err);
        //   else {
        //     console.log('** Finished');
        //   }
        // });
      });
});

app.get('/banner/:id', function(req, res){ ///banner/:id로 라우팅
    console.log('banner')
    var clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var getIp = sql(`SELECT creatorIp FROM creatorInfo WHERE advertiseUrl = "${fullUrl}"`)
    
    getIp.select(function(err, data){
        if (err){
            console.log(err)
        }
        else { 
            try {
                if(data[0].creatorIp != clientIp){ //나중에 이부분 경고창으로 바꿔야 함. 등록된 아이피가 아니면 접속차단시키는 부분임
                res.render('wrongIp.ejs')    
                } else{
                    res.render('client.ejs');
                }
            } catch(e){
                if(e instanceof TypeError){
                    res.render('wrongUrl.ejs') //url주소 잘못 입력하면 뜨는 경고창 
                    console.log(fullUrl)                   
                }
                else{
                    logMyErrors(e)
                }
            }
        }
    });
});

(function(){
    var socketsInfo = {}; //클라이언트로 보낼 socketinfo 객체
    var serverId = undefined; //서버아이디 체크를 위해 생성
    io.on('connection', function(socket){
        console.log('contact') // 연결이 되면 로그 발생
        var clientId = socket.id; //socketID 획득
        var req = socket.request; // req
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //클라이언트 ip주소 얻는 부분
        var roomInfo = socket.adapter.rooms; // 현재 웹소켓에 접속중이 room들과 그 접속자들의 정보 얻음
        var keys = Object.keys(roomInfo); //websocket 접속자 정보 
        var rule = new schedule.RecurrenceRule(); //스케쥴러 객체 생성
        rule.hour = new schedule.Range(0,23) // cronTask 시간지정
        // rule.minute = [0, 10, 20, 30, 40, 50] //cronTask 실행되는 분(minute)
        rule.second = [0, 30] // 초단위 실행 (테스트용)
        console.log(roomInfo)
        var cronTask = schedule.scheduleJob(rule, function(){ // 스케쥴러를 통해 1분마다 db에 배너정보 전송
                    if(serverId != clientId && clientId != undefined){ //해당 페이지의 클라이언트 아이디가 서버아이디와 일치하지 않고, undefined가 아니면 그건 client라는 뜻
                        socket.emit('response banner data to server', {}); //client로 emit
                        socket.emit('check bannerId', {})
                }   else if(serverId == clientId && serverId!= undefined){ // server가 접속했을떄임
                        io.to(serverId).emit('divReload', {}); //송출중인 배너 div 10분마다 리로드 (실제 송출중인 배너 체크가능)
                        // socket.emit('response banner data to server', {});
                        console.log(serverId + '새로고침완료');
                    }
                });
      
        socket.on('host', function(){ //server 접속시 발생
            keys.splice(keys.indexOf(clientId), 1) //서버의 웹소켓 아이디는 설렉트 박스에 안뜨도록 제거
            socket.emit('id receive', keys, socketsInfo); //socketInfo 객체(클라이언트 socketid와 url이 담김)랑 클라이언트 socketid 전송
            serverId = clientId; //서버아이디 생성
            console.log(socketsInfo, keys);
        });

        socket.on('new client', function(msg){ //새로운 클라이언트 접속 시 발생 
            var _url = msg[0]
            var history = msg[1]
            var urlArray = Object.values(socketsInfo)
            // 서버에 현재 배너창 띄운 크리에이터들 전송///////
            if(serverId == undefined){ //서버페이지의 id가 생성되지 않았을 때는, 전체에 송출을 해서 에러 방지
                socket.broadcast.emit('id receive', clientId);
            } else{ //서버페이지의 id가 생성되었을 때는 서버페이지에게만 클라이언트의 socketID 보낸다.
                io.to(serverId).emit('id receive', clientId);
            };
            /////////////////////////////////////////////////////
            console.log(`-새 접속 ip : ${ip}`)
            console.log(`클라이언트id ${ clientId }`);
            
            if(history != 1){ /*이 부분 !=로 바꾸기*/
              var destination = 'http://localhost:3002/browserWarn'
              socket.emit('browser warning', destination) 
            } else {
                if(urlArray.includes(_url)){
                    console.log('있다')
                    var destination = 'http://localhost:3002/duplicate'
                    socket.emit('redirect warn', destination)
                } else{
                    socketsInfo[Object.keys(roomInfo).pop( )] = _url; //roomInfo에서 소켓아이디 불러와서 socketsInfo 객체에 {'id' : url} 형태로 저장 
                    requestImg(sql, socket, [_url,'any'])
            }}
            console.log(socketsInfo); //접속중인 url 저장된 부분
        });
    
        socket.on('disconnect', function(){ //접속종료시
            delete socketsInfo[clientId] //socketsInfo에서 접속종료한 clientID 삭제
            
            if(serverId == undefined){
                socket.broadcast.emit('id remove', clientId);
            } else{
                io.to(serverId).emit('id remove', clientId);
            };

            console.log(`- ip : ${ip} :  접속종료`);
            clientId = undefined;
            clearInterval(socket.interval);
        });

        /*나중에 쓰일 수 있는 부분
        socket.on('img send', function(msg){ 
            socket.broadcast.emit('img receive', msg);
        });

        socket.on('db img send', function(msg){ 
            socket.broadcast.emit('img receive', msg);
        });

        socket.on('particular img send', function(msg){ //특정 클라이언트에게만 배너 전송
            io.to(msg[0]).emit('img receive', msg[1]);
        });
        */

        socket.on('write to db', function(msg){
            pool.getConnection(function(err, conn){
            if(err) return err;
            var bannername = msg[0]
            var sql = "INSERT INTO contractionTimestamp (contractionId) VALUES (?);"; 
            conn.query(sql, [bannername], function (err, result, fields) { //msg[0]:bannername msg[1]:url msg[2]:category
                conn.release();
                if (err) return err;   
                });
            });   
        });

        socket.on('check plz', function(msg){
            checkPlz(sql, socket, msg)
        });
    })
})();

http.listen(3002, function(){
    console.log('connected!');
});
