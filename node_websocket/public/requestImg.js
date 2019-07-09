module.exports = function(sql, socket, msg){
  var toServer = {}; //서버로 보낼 이미지 객체 ()
  var _url = msg;
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
                      ORDER BY bm.contractionTime ASC LIMIT 1;`) //일단 계약된 배너가 있는 지 확인해서 불러옴
  
  getQuery.select(function(err, data){
      if (err){
          console.log(err)
      }
      else {
          if(data.length == 0){ //계약된 배너가 없을때 개인계약을 안한 광고주의 배너와 매칭 (현재는 bannerRegistered의 제일 오래된 배너랑 매칭)
            console.log('No Contraction')
          } else {
            console.log('Start shooting')
            toServer['img'] = {path : data[0].bannerSrc, name : data[0].contractionId}
            socket.emit('img receive', [toServer['img'].path, toServer['img'].name ])
          };
      }
  })
}