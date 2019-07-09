module.exports = function(sql, socket, msg){
  // DB에서 이름가져와서 확인
  //msg0 : url msg1 : category msg2 : broadcasting banner name
  var toServer = {}; // 클라이언트로 보낼 객체
  var _url = msg[0];
  var broadcastingBannerName = msg[1] //클라이언트에 송출 중인 배너의 id
  var getQuery = sql(`SELECT bannerSrc, contractionId
                      FROM bannerMatched AS bm 
                      JOIN marketerInfo AS mi 
                      ON bm.contractionId 
                      LIKE CONCAT(mi.marketerId, '%')
                      JOIN bannerRegistered AS br 
                      ON bm.contractionId 
                      LIKE CONCAT('%', br.bannerId, '%')
                      WHERE bm.contractionId 
                      LIKE CONCAT('%',(SELECT creatorId FROM creatorInfo WHERE advertiseUrl = "${_url}"))
                      AND bm.contractionState = 0
                      AND mi.marketerContraction = 1
                      AND br.confirmState = 3
                      ORDER BY bm.contractionTime ASC LIMIT 1;`)
  
  getQuery.select(function(err, data){
      if (err){
          console.log(err)
      }
      else {
          if(data.length == 0){ //계약된 거가 없을때
            console.log('계약소진')  
            socket.emit('img clear')
          } else{
              getQuery.select(function(err, data){
                  if (err){
                      console.log(err)
                  }
                  else {
                    //계약된게 있다.
                    getQuery.select(function(err, data){
                        if (err){
                            console.log(err)
                        }
                        else {
                            console.log(2)
                            toServer['img'] = {name : data[0].contractionId}
                            if(toServer['img'].name === broadcastingBannerName){
                                //pass
                                console.log('계약된 게 있다. contractionState도 바뀌지 않음')
                            } else{
                                var getQuery = sql(`SELECT bannerSrc, contractionId
                                                    FROM bannerMatched AS bm 
                                                    JOIN marketerInfo AS mi 
                                                    ON bm.contractionId 
                                                    LIKE CONCAT(mi.marketerId, '%')
                                                    JOIN bannerRegistered AS br 
                                                    ON bm.contractionId 
                                                    LIKE CONCAT('%', br.bannerId, '%')
                                                    WHERE bm.contractionId 
                                                    LIKE CONCAT('%',(SELECT creatorId FROM creatorInfo WHERE advertiseUrl = "${_url}")) 
                                                    AND bm.contractionState = 0
                                                    AND mi.marketerContraction = 1
                                                    AND br.confirmState = 3
                                                    ORDER BY bm.contractionTime ASC LIMIT 1;`)
                                getQuery.select(function(err, data){
                                    if (err){
                                        console.log(err)
                                    }
                                    else {
                                        console.log('계약된 게 있다. 기존광고의 contractionstate가 바뀌어 최신배너 호출')
                                        toServer['img'] = {path : data[0].bannerSrc, name : data[0].contractionId}
                                        socket.emit('img receive', [data[0].bannerSrc, data[0].contractionId])
                                    };
                                });
                            }
                        };
                    })
                  };
              });
          };
      }
  }) 
}