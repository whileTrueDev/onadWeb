module.exports = function (sql, socket, msg) {
  // DB에서 이름가져와서 확인
  // msg0 : url msg1 : category msg2 : broadcasting banner name
  const toServer = {}; // 클라이언트로 보낼 객체
  const fullUrl = msg[0];
  const cutUrl = `/${fullUrl.split('/')[4]}`;

  const broadcastingBannerName = msg[1]; // 클라이언트에 송출 중인 배너의 id
  let getQuery = sql(`SELECT contractionId FROM bannerMatched AS bm 
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
                      ORDER BY bm.contractionTime ASC LIMIT 1;`);

  getQuery.select((err, data) => {
    if (err) {
      console.log(err);
    } else if (data.length === 0) { // 계약된 거가 없을때
      // socket.emit('img clear')
      getQuery = sql(`SELECT contractionId, bannerSrc FROM bannerMatched AS bm 
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
                                ORDER BY bm.contractionTime ASC LIMIT 1;`);

      getQuery.select((err, data) => {
        if (err) {
          console.log(err);
        } else {
          try {
            console.log(`기존 ${broadcastingBannerName} 계약 소진 // ONADLOGO Start shooting`);
            toServer.img = { path: data[0].bannerSrc, name: data[0].contractionId };
            socket.emit('img receive', [toServer.img.path, toServer.img.name]);
          } catch {
            socket.emit('error page', []);
          }
        }
      });
    } else {
      toServer.img = { name: data[0].contractionId };
      if (toServer.img.name === broadcastingBannerName) {
        // pass
        console.log('ONAD가 아닌 계약된 광고가 존재 / 기존광고는 ONAD광고가 아님 / 모든 STATE변화 없음 / 배너 변경 없이 넘어감');
      } else {
        getQuery = sql(`SELECT contractionId, bannerSrc FROM bannerMatched AS bm 
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
                                    ORDER BY bm.contractionTime ASC LIMIT 1;`);
        getQuery.select((err, data) => {
          if (err) {
            console.log(err);
          } else {
            try {
              console.log('계약된 광고 존재 / 기존광고의 STATE가 변경되었거나 기존 광고가 ONAD광고라서 최신광고로 변경');
              toServer.img = { path: data[0].bannerSrc, name: data[0].contractionId };
              socket.emit('img receive', [data[0].bannerSrc, data[0].contractionId]);
            } catch {
              socket.emit('error page', []);
            }
          }
        });
      }
    }
  });
};
