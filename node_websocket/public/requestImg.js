module.exports = function(sql, socket, msg, activeState){
  var toServer = {}; //서버로 보낼 이미지 객체 ()
  var fullUrl = msg;
  var cutUrl = '/' + fullUrl.split('/')[4]
  var getQuery = sql(`SELECT contractionId, bannerSrc 
                      FROM bannerMatched AS bm 
                      JOIN marketerInfo as mi
                      ON bm.contractionId 
                      LIKE CONCAT(mi.marketerId, '%')
                      JOIN bannerRegistered AS br 
                      ON bm.contractionId LIKE CONCAT(br.bannerId, '%') 
                      AND bm.contractionId 
                      LIKE CONCAT('%',(SELECT creatorId FROM creatorInfo WHERE advertiseUrl = "${cutUrl}"), '%') 
                      AND bm.contractionId NOT LIKE CONCAT("onad6309", '%')
                      AND bm.contractionState = 0
                      AND mi.marketerContraction = 1
                      AND br.confirmState = 3
                      ORDER BY bm.contractionTime ASC LIMIT 1;`) //일단 계약된 배너가 있는 지 확인해서 불러옴
  
  getQuery.select(function(err, data){
      if (err){
        console.log(err)
      }
      else {
        if(data.length == 0){ //계약된 배너가 없을때 개인계약을 안한 광고주의 배너와 매칭 (현재는 bannerRegistered의 제일 오래된 배너랑 매칭)
          console.log('No Contraction')
          var getQuery = sql(`SELECT contractionId, bannerSrc 
                              FROM bannerMatched AS bm 
                              JOIN marketerInfo as mi
                              ON bm.contractionId 
                              LIKE CONCAT(mi.marketerId, '%')
                              JOIN bannerRegistered AS br 
                              ON bm.contractionId LIKE CONCAT(br.bannerId, '%') 
                              AND bm.contractionId 
                              LIKE CONCAT('%',(SELECT creatorId FROM creatorInfo WHERE advertiseUrl = "${cutUrl}"), '%') 
                              AND bm.contractionId LIKE CONCAT("onad6309", '%')
                              AND bm.contractionState = 0
                              AND mi.marketerContraction = 1
                              AND br.confirmState = 3
                              ORDER BY bm.contractionTime ASC LIMIT 1;`)

        getQuery.select(function(err, data){
          if (err){
            console.log(err)
          } else if(data.length > 0) {
          console.log('ONADLOGO Start shooting')
          toServer['img'] = {path : data[0].bannerSrc, name : data[0].contractionId}
          if(activeState){
            socket.emit('pageActive handler', [toServer['img'].name, 1])
          }
          socket.emit('img receive', [toServer['img'].path, toServer['img'].name ])
            } else{
              socket.emit('error page', [])
            }
          }) 
        } else {
          toServer['img'] = {path : data[0].bannerSrc, name : data[0].contractionId}
          if(activeState){
            socket.emit('pageActive handler', [toServer['img'].name, 1])
          }
          socket.emit('img receive', [toServer['img'].path, toServer['img'].name ])
          console.log(` ${toServer['img'].name} BANNER Start shooting` )
        };
    }
  })
}