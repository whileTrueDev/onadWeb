const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const sql = require('./public/select');
const pool = require('./public/connect');
const schedule = require('node-schedule');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use('/public', express.static(__dirname + '/public')); //디렉토리 정적으로 고정하는 부분

app.get('/', function(req, res){ //index.html /로 라우팅
    console.log('home')
    res.render('home.ejs')
});

app.get('/banner/server', function(req, res){ // server.html /server로 라우팅 
    console.log('server')
    var toServer = {};
    var tmp = sql('SELECT bannerId, bannerSrc FROM bannerMatched where contractionState = 1')
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
    var tmp = sql('SELECT ipAdr FROM creatorInfo')
    tmp.select(function(err, data){
        if (err){
            console.log(err)
        }
        else {
            if(data[0].ipAdr != clientIp){ //나중에 이부분 경고창으로 바꿔야 함. 등록된 아이피가 아니면 접속차단시키는 부분임
                res.render('client.ejs')    
            } else{
                res.render('client.ejs');
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
        rule.hour = new schedule.Range(0,23) 
        rule.minute = [0, 10, 20, 30, 40, 50] //cronTask 실행되는 분(minute)
        // rule.second = [0, 10, 20, 30, 40, 50] // 초단위 실행
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

        socket.on('new client', function(_url){ //새로운 클라이언트 접속 시 발생 
            
            // 서버에 현재 배너창 띄운 크리에이터들 전송///////
            if(serverId == undefined){ //해당페이지가 서버가 아님을 확인 
                socket.broadcast.emit('id receive', clientId);
            } else{
                io.to(serverId).emit('id receive', clientId);
            };
            /////////////////////////////////////////////////////

            console.log(`-새 접속 ip : ${ip}`)
            console.log(`클라이언트id ${ clientId }`);
            socketsInfo[Object.keys(roomInfo).pop()] = _url;
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

        socket.on('img send', function(msg){ 
            socket.broadcast.emit('img receive', msg);
        });

        socket.on('db img send', function(msg){ 
            socket.broadcast.emit('img receive', msg);
        });

        socket.on('particular img send', function(msg){ //특정 클라이언트에게만 배너 전송
            io.to(msg[0]).emit('img receive', msg[1]);
        });

        socket.on('write to db', function(msg){
            pool.getConnection(function(err, conn){
            if(err) return err;
            var sql = "INSERT INTO contractionTimestamp (bannerid) VALUES (?);"; 
            conn.query(sql, [msg[0]/*, msg[1], msg[2]*/], function (err, result, fields) { //msg[0]:bannername msg[1]:url msg[2]:category
                conn.release();
                if (err) return err;   
                });
            });   
        });

        socket.on('request img', function(msg){
            var toServer = {}; //서버로 보낼 이미지 객체 ()
            var _url = msg[0];
            var getQuery = sql(`SELECT bannerId, bannerSrc, bannerCategory 
                                    FROM bannerMatched AS bm 
                                        JOIN creatorInfo AS ci 
                                            ON bm.creatorId = ci.creatorId 
                                                WHERE ci.advertiseUrl = "${_url}" 
                                                    AND contractionState = 0;`)
            
            getQuery.select(function(err, data){
                if (err){
                    console.log(err)
                }
                else {
                    if(data.length == 0){ //계약된 거가 없을때 개인계약을 안한 광고주의 배너와 매칭
                        getQuery = sql(`SELECT bannerSrc, marketerId 
                                            FROM bannerRegistered 
                                                WHERE confirmState = 1;`)
                        
                        getQuery.select(function(err, data){
                            if (err){
                                console.log(err)
                            }
                            else {
                                data.forEach(function(item, index){
                                    toServer['img'+index] = {path : item.bannerSrc, name : item.marketerId}
                                });
                                socket.emit('img receive', [toServer['img0'].path, toServer['img0'].name ])
                            };
                        })
                    } else {
                        if(msg[1] == data[0].bannerCategory || data[0].bannerCategory == 'any' ){ //계약된게 있고, 카테고리가 any거나 일치할떄
                            data.forEach(function(item, index){
                                toServer['img'+index] = {path : item.bannerSrc, name : item.bannerId}
                            });
                            socket.emit('img receive', [toServer['img0'].path, toServer['img0'].name ])
                        } else{ //계약된게 있지만 카테고리가 일치하지 않을때
                            getQuery = sql(`SELECT bannerSrc, marketerId FROM bannerRegistered WHERE confirmState = 1;`)
                            getQuery.select(function(err, data){
                                if (err){
                                    console.log(err)
                                }
                                else {
                                    data.forEach(function(item, index){
                                        toServer['img'+index] = {path : item.bannerSrc, name : item.marketerId}
                                    });
                                    socket.emit('img receive', [toServer['img0'].path, toServer['img0'].name ])
                                    };
                                })
                            }
                    };
                }
            })
            /*풀 닫는부분인데 나중에 에러 날까봐 일단 안지움
                sql.pool.end(function(err){
                  if (err) console.log(err);
                  else {
                    console.log('** Finished');
                  }
                });
              });
            */
        });

        socket.on('check plz', function(msg){
            // DB에서 이름가져와서 확인
            var toServer = {}; // 클라이언트로 보낼 객체
            var _url = msg[0];
            var broadcastingBannerName = msg[2] //클라이언트에 송출 중인 배너의 id
            var getQuery = sql(`SELECT bannerId 
                                    FROM bannerMatched AS bm 
                                            JOIN creatorInfo AS ci 
                                                ON bm.creatorId = ci.creatorId 
                                                    WHERE ci.advertiseUrl = "${_url}" 
                                                        AND bm.contractionState = 0;`)
            
            getQuery.select(function(err, data){
                if (err){
                    console.log(err)
                }
                else {
                    if(data.length == 0){ //계약된 거가 없을때
                        getQuery = sql(`SELECT marketerId 
                                            FROM bannerRegistered 
                                                WHERE confirmState = 1;`)
                                    getQuery.select(function(err, data){
                                        if (err){
                                            console.log(err)
                                        }
                                        else {
                                            console.log(1)
                                            data.forEach(function(item, index){
                                                toServer['img'+index] = {name : item.bannerId}
                                            })
                                                if(toServer['img0'].name == broadcastingBannerName){
                                                    //pass
                                                    console.log('넘어가는 편이야')
                                                } else{
                                                var getQuery = sql(`SELECT bannerSrc, marketerId 
                                                                        FROM bannerRegistered 
                                                                            WHERE confirmState = 1;`)
                                                getQuery.select(function(err, data){
                                                    if (err){
                                                        console.log(err)
                                                    }
                                                    else {
                                                        console.log('1여깁니다')
                                                        data.forEach(function(item, index){
                                                            toServer['img'+index] = {path : item.bannerSrc, name : item.marketerId}
                                                        });
                                                        socket.emit('img receive', [toServer['img0'].path, toServer['img0'].name ])
                                                    };
                                                })
                                            };
                                        };
                                    })
                    } else{
                        getQuery = sql(`SELECT bannerCategory 
                                            FROM bannerMatched AS bm 
                                                    JOIN creatorInfo AS ci 
                                                        ON bm.creatorId = ci.creatorId 
                                                            WHERE ci.advertiseUrl = "${_url}" 
                                                                AND bm.contractionState = 0;`) //계약 된게 있을때
                        getQuery.select(function(err, data){
                            if (err){
                                console.log(err)
                            }
                            else {
                                if(msg[1] == data[0].bannerCategory || data[0].bannerCategory == 'any' ){ //계약된게 있고, 카테고리가 any거나 일치할떄
                                    getQuery.select(function(err, data){
                                        if (err){
                                            console.log(err)
                                        }
                                        else {
                                            console.log(2)
                                            data.forEach(function(item, index){
                                                toServer['img'+index] = {name : item.bannerId}
                                            })
                                            if(toServer['img0'].name == broadcastingBannerName){
                                                //pass
                                                console.log('넘어가는 편이야')
                                            } else{
                                                var getQuery = sql(`SELECT bannerId, bannerSrc 
                                                                        FROM bannerMatched AS bm 
                                                                                JOIN creatorInfo AS ci 
                                                                                    ON bm.creatorId = ci.creatorId 
                                                                                        WHERE ci.advertiseUrl = "${_url}" 
                                                                                            AND bm.contractionState = 0;`)
                                                getQuery.select(function(err, data){
                                                    if (err){
                                                        console.log(err)
                                                    }
                                                    else {
                                                        console.log('2여깁니다')
                                                        data.forEach(function(item, index){
                                                            toServer['img'+index] = {path : item.bannerSrc, name : item.bannerId}
                                                        });
                                                        socket.emit('img receive', [data[0].bannerSrc, data[0].bannerId])
                                                    };
                                                });
                                            }
                                        };
                                    })
                                } else{ //계약된게 있지만 카테고리가 일치하지 않을때
                                    getQuery = sql(`SELECT bannerSrc, marketerId FROM bannerRegistered WHERE confirmState = 1;`)
                                    getQuery.select(function(err, data){
                                        if (err){
                                            console.log(err)
                                        }
                                        else {
                                            console.log(3)
                                            data.forEach(function(item, index){
                                                toServer['img'+index] = {path : item.bannerSrc, name : item.marketerId}
                                            });
                                            if(toServer['img0'].name == broadcastingBannerName){
                                                //pass
                                                console.log('넘어가는 편이야')
                                            } else{
                                                var getQuery = sql(`SELECT bannerSrc, marketerId FROM bannerRegistered WHERE confirmState = 1;`)
                                                getQuery.select(function(err, data){
                                                    if (err){
                                                        console.log(err)
                                                    }
                                                    else {
                                                        console.log('3여깁니다')
                                                        data.forEach(function(item, index){
                                                            toServer['img'+index] = {path : item.bannerSrc, name : item.marketerId}
                                                        });
                                                        socket.emit('img receive', [toServer['img0'].path, toServer['img0'].name ])
                                                    };
                                                });
                                            }
                                        };
                                    })
                                }
                            };
                        });
                    };
                }
            }) 
        });
    })
})();

http.listen(3002, function(){
    console.log('connected!');
});
