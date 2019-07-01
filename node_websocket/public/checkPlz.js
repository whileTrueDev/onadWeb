module.exports = function(sql, socket, msg){
  // DB에서 이름가져와서 확인
  //msg0 : url msg1 : category msg2 : broadcasting banner name
  var toServer = {}; // 클라이언트로 보낼 객체
  var _url = msg[0];
  var broadcastingBannerName = msg[2] //클라이언트에 송출 중인 배너의 id
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
                        AND bm.contractionState = 0
                        AND mi.marketerContraction = 1
                        AND br.confirmState = 3
                        ORDER BY bm.contractionTime ASC LIMIT 1;`
  
  getQuery.select(function(err, data){
      if (err){
          console.log(err)
      }
      else {
          if(data.length == 0){ //계약된 거가 없을때
              getQuery = sql(`SELECT bannerId 
                              FROM bannerRegistered AS br
                              JOIN marketerInfo AS mi
                              ON br.bannerId LIKE CONCAT(mi.marketerId, '%')
                              WHERE br.confirmState = 3
                              AND mi.marketerContraction = 1
                              ORDER BY br.date ASC LIMIT 1;`)
                          getQuery.select(function(err, data){
                              if (err){
                                  console.log(err)
                              }
                              else {
                                  console.log(1)
                                 
                                      toServer['img'] = {name : data[0].bannerId}
                                  
                                      if(toServer['img'].name == broadcastingBannerName){
                                          //pass
                                          console.log('계약된게 없고, 가장 최하위 banner도 그대로라서 이미지 호출안하고 넘어감')
                                      } else{
                                      var getQuery = sql(`SELECT bannerSrc,bannerId 
                                                          FROM bannerRegistered AS br
                                                          JOIN marketerInfo AS mi
                                                          ON br.bannerId LIKE CONCAT(mi.marketerId, '%')
                                                          WHERE br.confirmState = 3
                                                          AND mi.marketerContraction = 1
                                                          ORDER BY br.date ASC LIMIT 1;`)
                                      getQuery.select(function(err, data){
                                          if (err){
                                              console.log(err)
                                          }
                                          else {
                                              console.log('계약된게 없지만, 최하위 banner가 바뀌어서 이미지 재호출 or 계약되있던 이전 배너의 state가 바뀌어서 새 이미지 호출')
                                              
                                              toServer['img'] = {path : data[0].bannerSrc, name : data[0].bannerId}
                                              socket.emit('img receive', [toServer['img'].path, toServer['img'].name ])
                                          };
                                      })
                                  };
                              };
                          })
          } else{
              
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
                                  toServer['img'] = {name : data[0].contractionId}
                                  if(toServer['img'].name == broadcastingBannerName){
                                      //pass
                                      console.log('계약된게 있고, 카테고리가 any거나 일치하고, contractionState도 바뀌지 않음')
                                  } else{
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
                                      AND bm.contractionState = 0
                                      AND mi.marketerContraction = 1
                                      AND br.confirmState = 3
                                      ORDER BY bm.contractionTime ASC LIMIT 1;`)
                                      getQuery.select(function(err, data){
                                          if (err){
                                              console.log(err)
                                          }
                                          else {
                                              console.log('계약된게 있고, 카테고리도 맞지만, 기존광고의 contractionstate가 바뀌어 최신배너 호출')
                                              toServer['img'] = {path : data[0].bannerSrc, name : data[0].contractionId}
                                              socket.emit('img receive', [data[0].bannerSrc, data[0].contractionId])
                                          };
                                      });
                                  }
                              };
                          })
                      } else{ //계약된게 있지만 카테고리가 일치하지 않을때
                          getQuery = sql(`SELECT bannerId 
                                          FROM bannerRegistered AS br
                                          JOIN marketerInfo AS mi
                                          ON br.bannerId LIKE CONCAT(mi.marketerId, '%')
                                          WHERE br.confirmState = 3
                                          AND mi.marketerContraction = 1
                                          ORDER BY br.date ASC LIMIT 1;`)
                          getQuery.select(function(err, data){
                              if (err){
                                  console.log(err)
                              }
                              else {
                                  console.log(3)
                                      toServer['img'] = {path : data[0].bannerSrc, name : data[0].bannerId}
                                  if(toServer['img'].name == broadcastingBannerName){
                                      //pass
                                      console.log('계약된게있지만, 카테고리가 일치하지 않음. 그 전에 송출중인 배너가 bannerId가 같아 재호출안함')
                                  } else{
                                      var getQuery = sql(`SELECT bannerSrc, bannerId 
                                                          FROM bannerRegistered AS br
                                                          JOIN marketerInfo AS mi
                                                          ON br.bannerId LIKE CONCAT(mi.marketerId, '%')
                                                          WHERE br.confirmState = 3
                                                          AND mi.marketerContraction = 1
                                                          ORDER BY br.date ASC LIMIT 1;`)
                                      getQuery.select(function(err, data){
                                          if (err){
                                              console.log(err)
                                          }
                                          else {
                                              console.log('계약된게있지만, 카테고리가 일치하지 않음. 그 전에 송출중인 배너가 bannerId가 달라 재호출')
                                              toServer['img'] = {path : data[0].bannerSrc, name : data[0].bannerId}
                                              socket.emit('img receive', [toServer['img'].path, toServer['img'].name ])
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
}