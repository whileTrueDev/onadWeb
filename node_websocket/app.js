const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const session = require('express-session');
const sql = require('./public/select');
const pool = require('./public/connect');
const schedule = require('node-schedule');



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/public', express.static(__dirname + '/public')); //디렉토리 정적으로 고정하는 부분

app.use(session({
    resave : false,
    saveUninitialized : false,
    secret : 'kevin',
    cookie : {
        httpOnly : false,  
        secure : false,
        },
    })
);

app.get('/', function(req, res){ //index.html /로 라우팅
    console.log('home')
    res.render('home.ejs')
});

app.get('/banner/server', function(req, res){ // server.html /server로 라우팅 
    console.log('server')
    var toServer = {};
    var tmp = sql('SELECT name, path FROM banner where state = 1')
    tmp.select(function(err, data){
        if (err){
            console.log(err)
            res.render('server.ejs')
        }
        else {
            data.forEach(function(item, index, array){
                toServer['img'+index] = {path : item.path, name : item.name}
            });
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
    var tmp = sql('SELECT ipAdr FROM creatorinfo')
    tmp.select(function(err, data){
        if (err){
            console.log(err)
        }
        else {
            if(data[0].ipAdr != clientIp){ //나중에 이부분 경고창으로 바꿔야 함. 등록된 아이피가 아니면 접속차단시키는 부분임
                console.log(data[0].ipAdr)
                res.render('client.ejs')    
            } else{
                console.log(data[0].ipAdr)
                res.render('client.ejs');
            }
        }
    });
});

app.get('/text', function(req, res){
    res.render('clientText.ejs');
});

io.use( function(socket, next) {
    require('express-session')({
        resave : false,
        saveUninitialized : false,
        secret : 'kevin',
        cookie : {
            httpOnly : false,
            secure : false,
        },
    })(socket.request, socket.request.res, next);
  });

(function(){
    var socketsInfo = {};
    var serverId = undefined;
    io.on('connection', function(socket){
        console.log('contact') // 연결이 되면 로그 발생
        var clientId = socket.id; //socketID 획득
        var req = socket.request;
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //클라이언트 ip주소 얻는 부분
        var roomInfo = socket.adapter.rooms; // 현재 웹소켓에 접속중이 room들과 그 접속자들의 정보 얻음
        var keys = Object.keys(roomInfo); //websocket 접속자 정보 
        var rule = new schedule.RecurrenceRule(); //스케쥴러 객체 생성

        rule.hour = new schedule.Range(0,23) 
        // rule.minute = [0, 10, 20, 30, 40, 50] //cronTask 실행되는 분(minute)
        rule.second = [0, 10, 20, 30, 40, 50]
        
        var cronTask = schedule.scheduleJob(rule, function(){ // 스케쥴러를 통해 1분마다 db에 배너정보 전송
                    if(serverId != clientId && clientId != undefined){
                        socket.emit('response banner data to server', {});
                        socket.emit('refresh request img', {})
                }   else if(serverId == clientId && serverId!= undefined){
                        io.to(serverId).emit('divReload', {});
                        // socket.emit('response banner data to server', {});
                        console.log(serverId + '새로고침완료');
                    }
                });
    
        socket.on('host', function(){ //server 접속시 발생
            keys.splice(keys.indexOf(clientId), 1) //서버의 웹소켓 아이디는 설렉트 박스에 안뜨도록 제거
            socket.emit('id receive', keys, socketsInfo); //id receive socketInfo 객체(클라이언트 socketid와 url이 담김)랑 클라이언트 socketid 전송
            serverId = clientId;
            console.log(socketsInfo, keys);
        });

        socket.on('new client', function(_url){ //새로운 클라이언트 접속 시 발생 
            if(serverId == undefined){
                socket.broadcast.emit('id receive', clientId);
                console.log('아디가 읍넹')
            } else{
                io.to(serverId).emit('id receive', clientId);
                console.log('아디가 있넹')
            };
            console.log(`-새 접속 ip : ${ip}`)
            console.log(`클라이언트id ${ clientId }`);
            socketsInfo[Object.keys(roomInfo).pop()] = _url;
            console.log(socketsInfo); //접속중인 url 저장된 부분
        });

        socket.on('disconnect', function(){ 
            delete socketsInfo[clientId]
            if(serverId == undefined){
                socket.broadcast.emit('id remove', clientId);
                console.log('아디가 읍넹')
            } else{
                io.to(serverId).emit('id remove', clientId);
                console.log('아디가 있넹')
            };
            console.log(`- ip : ${ip} :  접속종료`);
            clientId = undefined;
            clearInterval(socket.interval);
        });
        socket.on('img send', function(msg){ 
            socket.broadcast.emit('img receive', msg);
        });
        socket.on('db img send', function(msg){ 
            socket.broadcast.emit('img receive', msg);
        });
        socket.on('particular img send', function(msg){
            io.to(msg[0]).emit('img receive', msg[1]);
        });
        socket.on('text send', function(msg){
            socket.broadcast.emit('text receive', msg);
        });
        socket.on('write to db', function(msg){
            pool.getConnection(function(err, conn){
            if(err) return err;
            var sql = "INSERT INTO broadcastingcheck (bannerName, url, category) VALUES (?, ?, ?);";
             
            conn.query(sql, [msg[0], msg[1], msg[2]], function (err, result, fields) { //msg[0]:bannername msg[1]:url msg[2]:category
                conn.release();
                if (err) return err;   
                });
            });   
        });
        socket.on('request img', function(msg){
            var toServer = {};
            var getQuery = sql(`SELECT * FROM matchedbanner WHERE matchedbanner.url = "${msg[0]}";`)
            getQuery.select(function(err, data){
                if (err){
                    console.log(err)
                }
                else {
                    if(data.length == 0){ //계약된 거가 없을때
                        getQuery = sql(`SELECT name, path FROM banner;`)
                                    getQuery.select(function(err, data){
                                        if (err){
                                            console.log(err)
                                        }
                                        else {
                                            data.forEach(function(item, index){
                                                toServer['img'+index] = {path : item.path, name : item.name}
                                            });
                                            console.log(toServer['img0'].name)
                                            socket.emit('img receive', [toServer['img0'].path, toServer['img0'].name ])
                                        };
                                    })
                    } else{
                        getQuery = sql(`SELECT category FROM matchedbanner WHERE matchedbanner.url = "${msg[0]}";`) //계약 된게 있을때
                        getQuery.select(function(err, data){
                            if (err){
                                console.log(err)
                            }
                            else {
                                if(msg[1] == data[0].category || data[0].category == 'any' ){ //계약된게 있고, 카테고리가 any거나 일치할떄
                                    getQuery = sql(`SELECT name, path FROM banner JOIN matchedbanner where matchedbanner.url = "${ msg[0] }" AND matchedbanner.bannerId = banner.name;`)
                                    getQuery.select(function(err, data){
                                        if (err){
                                            console.log(err)
                                        }
                                        else {
                                            data.forEach(function(item, index){
                                                toServer['img'+index] = {path : item.path, name : item.name}
                                            });
                                            console.log(toServer['img0'].name)
                                            socket.emit('img receive', [toServer['img0'].path, toServer['img0'].name ])
                                        };
                                    })
                                } else{ //계약된게 있지만 카테고리가 일치하지 않을때
                                    getQuery = sql(`SELECT name, path FROM banner;`)
                                    getQuery.select(function(err, data){
                                        if (err){
                                            console.log(err)
                                        }
                                        else {
                                            data.forEach(function(item, index){
                                                toServer['img'+index] = {path : item.path, name : item.name}
                                            });
                                            console.log(toServer['img0'].name)
                                            socket.emit('img receive', [toServer['img0'].path, toServer['img0'].name ])
                                        };
                                    })
                                }
                            };
                        });

                        
                    };
                }
            })
            // var getQuery = sql(`SELECT name, path FROM banner JOIN matchedbanner where matchedbanner.url = "${ msg[0] }" AND matchedbanner.bannerId = banner.name;`)

            // getQuery.select(function(err, data){
            //     if (err){
            //         console.log(err)
            //     }
            //     else {
            //         data.forEach(function(item, index){
            //             toServer['img'+index] = {path : item.path, name : item.name}
            //         });
            //         console.log(toServer['img0'].name)
            //         socket.emit('img receive', [toServer['img0'].path, toServer['img0'].name ])
            //     };
                // sql.pool.end(function(err){
                //   if (err) console.log(err);
                //   else {
                //     console.log('** Finished');
                //   }
                // });
            //   });
            
        });
    });  
}());

http.listen(3002, function(){
    console.log('connected!');
});
