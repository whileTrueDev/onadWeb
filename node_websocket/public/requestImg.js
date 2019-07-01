module.exports = function(sql, socket, msg){
  var toServer = {}; //서버로 보낼 이미지 객체 ()
  var _url = msg[0];
  var bannerCategory = msg[1]
  var getQuery = sql(`SELECT bannerSrc, contractionId, bannerCategory
                      FROM bannerMatched AS bm 
                      JOIN marketerInfo AS mi 
                      ON bm.contractionId 
                      LIKE CONCAT(mi.marketerId, '%')
                      JOIN bannerRegistered AS br 
                      ON bm.contractionId 
                      LIKE CONCAT('%', br.bannerId, '%')
                      WHERE bm.contractionId 
                      LIKE CONCAT('%',(SELECT creatorId FROM creatorInfo WHERE advertiseUrl = "${_url}")) 
                      AND bm.contractionState = 1
                      AND mi.marketerContraction = 1
                      ORDER BY bm.contractionTime ASC LIMIT 1;`) //일단 계약된 배너가 있는 지 확인해서 불러옴
  
  getQuery.select(function(err, data){
      if (err){
          console.log(err)
      }
      else {
          if(data.length == 0){ //계약된 배너가 없을때 개인계약을 안한 광고주의 배너와 매칭 (현재는 bannerRegistered의 제일 오래된 배너랑 매칭)
              getQuery = sql(`SELECT bannerSrc, bannerId 
                              FROM bannerRegistered AS br
                              JOIN marketerInfo AS mi
                              ON br.bannerId LIKE CONCAT(mi.marketerId, '%')
                              WHERE br.confirmState = 1 
                              AND mi.marketerContraction = 1
                              ORDER BY br.date ASC LIMIT 1;`)
              
              getQuery.select(function(err, data){
                  if (err){
                      console.log(err)
                  }
                  else {
                      console.log('계약된 배너가 없어서 bannerRegistered의 가장 오래된 광고와 매칭')
                      toServer['img'] = {path : data[0].bannerSrc, name : data[0].bannerId}
                      
                      socket.emit('img receive', [toServer['img'].path, toServer['img'].name ])
                  };
              })
          } else {
              if(bannerCategory == data[0].bannerCategory || data[0].bannerCategory == 'any' ){ //계약된게 있고, 카테고리가 any거나 일치할떄
                 
                      console.log('계약된게 있고, 카테고리가 일치하여 정확히 매칭')
                      toServer['img'] = {path : data[0].bannerSrc, name : data[0].contractionId}
                  
                  socket.emit('img receive', [toServer['img'].path, toServer['img'].name ])
              } else{ //계약된게 있지만 카테고리가 일치하지 않을때
                  getQuery = sql(`SELECT bannerSrc, bannerId 
                                  FROM bannerRegistered AS br
                                  JOIN marketerInfo AS mi
                                  ON br.bannerId LIKE CONCAT(mi.marketerId, '%')
                                  WHERE br.confirmState = 1 
                                  AND mi.marketerContraction = 1
                                  ORDER BY br.date ASC LIMIT 1;`)
                  getQuery.select(function(err, data){
                      if (err){
                          console.log(err)
                      }
                      else {
                          console.log('계약된게 있지만, 카테고리가 일치하지 않아 bannerRegistered의 가장 오래된 광고와 매칭')  
                          toServer['img'+index] = {path : data[0].bannerSrc, name : data[0].bannerId}
                          socket.emit('img receive', [toServer['img'].path, toServer['img'].name ])
                          };
                      })
                  }
          };
      }
  })
}