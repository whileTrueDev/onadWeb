// 1. Table 중, twitchStreamDetail, twitchGame, twitchStream
//2. CreatorId를 twitchStreamDetail에 확인하기 위해서
//3. 현재시각 10분전부터 끌어모아 Listup
//4. StreamerName 으로 조회하여 존재하는지 여부 확인. => 방송중이라는 의미
const schedule = require('node-schedule'); 
const pool = require('../model/connectionPool');
const logger = require('../middlewares/calculatorLogger');


const getStreamerList = () => {
  return new Promise((resolve, reject)=>{
    let streamers = [];  
    pool.getConnection(function(err, conn){
      if(err){
        conn.release();
        reject(err);
      }
      conn.query(`SELECT time FROM twitchStreamDetail ORDER BY time DESC LIMIT 1`, function(err, result, fields){
        //console.log(result[0].time.toLocaleString());
        if(err){
          conn.release(); 
          reject(err);
        } 
        let time = result[0].time;
        time.setMinutes(time.getMinutes()-5);
        conn.query(`
        SELECT B.streamerId
        FROM (SELECT * FROM twitchStreamDetail WHERE time > ?) AS A LEFT JOIN twitchStream AS B ON A.streamId = B.streamId `, [time], function(err, result, fields){
          result.map((row)=>{
            streamers.push(row.streamerId);
          })
          conn.release();
          resolve(streamers);
        })
      });
    });
  })    
}


const getCreatorList = (streamList) =>{
  return new Promise((resolve, reject)=>{
    let creators = [];
    pool.getConnection(function(err, conn){
      if(err){ 
        conn.release(); 
        reject(err);
      }
      conn.query(`SELECT creatorId FROM creatorInfo`, function(err, result, fields){
        if(err){
          conn.release(); 
          reject(err);
        } 
        result.map((row)=>{
          if(streamList.includes(row.creatorId)){
            creators.push(row.creatorId);
          }
        })
        conn.release();
        resolve(creators);
      })
    })
  })
}


const getBannerList = () =>{
  return new Promise((resolve, reject)=>{
    let contractions = [];
    pool.getConnection(function(err, conn){
      if(err){
        conn.release(); 
        reject(err);
      } 
      conn.query(`SELECT date FROM contractionTimestamp ORDER BY date DESC LIMIT 1`, function(err, result, fields){
        //console.log(result[0].date.toLocaleString());
        if(err){
          conn.release(); 
          reject(err);
        } 
        let date = result[0].date;
        date.setMinutes(date.getMinutes()-5);
        conn.query(`SELECT contractionId FROM contractionTimestamp WHERE date > ?`, [date], function(err, result, fields){
          if(err){
            conn.release(); 
            reject(err);
          }else{
            result.map((row)=>{
              const contractionId = row.contractionId;
              contractions.push(contractionId);
            })
            resolve(contractions);
            conn.release();
          }
        })
      })
    })
  })
}


const getViewer = (creatorData)=>{
  return new Promise((resolve, reject)=>{
    pool.getConnection(function(err, conn){
      if(err){
        conn.release();
        reject(err);
      } 
      conn.query(`SELECT streamId FROM twitchStream WHERE streamerId = ? ORDER BY startedAt DESC LIMIT 1`,[creatorData.creatorId], function(err, result, fields){
        if(err){
          conn.release(); 
          reject(err);
        } 
        const streamId = result[0].streamId;
        conn.query(`SELECT viewer FROM twitchStreamDetail WHERE streamId = ? ORDER BY time DESC LIMIT 1`, [streamId] , function(err, result, fields){
          if(err){
            conn.release(); 
            reject(err);
          }else{
            conn.release();
            const viewer = result[0].viewer;
            resolve(viewer);
          }
        })
      })
    })
  })
}

const getPrice = (viewdata) => {
  return new Promise((resolve, reject)=>{
    pool.getConnection(function(err, conn){
      if(err){ 
        console.log(err);
        //conn.release();
        reject(err);
      }
      const creatorId = viewdata.contractionId.split('/')[1];
      conn.query(`SELECT unitPrice FROM creatorPrice WHERE creatorId = ?`,[creatorId], function(err, result, fields){
        //Price를 정의하는 함수
        const price = result[0].unitPrice * viewdata.viewer;
        conn.release();
        resolve(price);
      })
    })
  })
}

/*
  올바른 OUTPUT의 format
    { 
      viewer: 5353,
      contractionId: 'onad6309_undefined/152596920',
      price: 160590 
    }
*/
async function getPriceList([creatorList, bannerList]){
  let viewerList = await Promise.all( 
    bannerList.map(async (row)=>{
      //(marketerId)_(contractionOrder)/(creatorId)
      const creatorId = row.split('/')[1];
      if(creatorList.includes(creatorId)){
        const creatorData = {
          creatorId : creatorId,
          contractionId : row
        }
        const viewer = await getViewer(creatorData);
        let viewdata = {
          viewer : viewer,
          contractionId : row
        }
        const price = await getPrice(viewdata);
        viewdata['price'] = price;
        return viewdata;
      }
    })
  )
  console.log(viewerList);
  return viewerList;
}

const creatorCalcuate = (priceList) =>{
  return new Promise((resolve, reject)=>{
    pool.getConnection(function(err, conn){
      if(err){
        //conn.release();
        console.log(err); 
        reject(err);
      } 
      priceList.map((row)=>{
        const creatorId = row.contractionId.split('/')[1];
        conn.query(`INSERT INTO 
        creatorIncome (creatorId, creatorTotalIncome, creatorReceivable)  
        SELECT creatorId, creatorTotalIncome + ? , creatorReceivable + ? 
        FROM creatorIncome WHERE creatorId = ? 
        ORDER BY date DESC LIMIT 1`, [row.price, row.price, creatorId], function(err, result, fields){ 
          if(err){
            console.log(err);
            //conn.release(); 
            reject(err);
          } 
          logger.info(row.price + '원을 ' + creatorId + " 에게 입금하였습니다.");
        })
      })
      conn.release();
      resolve();
    })
  })
}

const marketerCalculate = (priceList) => {
  return new Promise((resolve, reject)=>{
    pool.getConnection(function(err, conn){
      if(err){
        console.log(err);
        reject(err);
      }else{
        priceList.map((row)=>{
          const marketerId = row.contractionId.split('/')[0].split('_')[0];
          conn.query(`SELECT marketerDebit FROM marketerCost WHERE marketerId = ? `, [marketerId], function(err, result, fields){ 
            if(err){
              console.log(err);
              reject(err);
            } 
            const debit = result[0].marketerDebit;
            if(debit <= row.price){
              conn.query(`UPDATE marketerCost SET marketerDebit = 0 WHERE marketerId = ? `, [marketerId], function(err, result, fields){ 
                if(err){
                  console.log(err);
                  reject(err);
                }
                logger.info('원 금액 ' + row.price + '를 채우지 못하고 ' + debit + '원을 ' + marketerId + " 에게서 지급받았습니다.");
              })
              conn.query(`UPDATE bannerMatched SET contractionState = 1 WHERE marketerId = ? `, [marketerId], function(err, result, fields){
                if(err){
                  console.log(err);
                  reject(err);
                } 
                logger.info('계약이 모두 이행되었습니다.');
                
              })
            }else{
              conn.query(`UPDATE marketerCost SET marketerDebit = marketerDebit - ? WHERE marketerId = ? `, [row.price, marketerId], function(err, result, fields){ 
                if(err){
                  console.log(err);
                  reject(err);
                }
                logger.info(row.price + '원을 ' + marketerId + " 에게서 지급받았습니다.");
              })
            }            
          })
        })
        conn.release();
        resolve();
      } 
    })
  })
}

const contractionCalculate = (priceList) => {
  return new Promise((resolve, reject)=>{
    pool.getConnection(function(err, conn){
      if(err){
        console.log(err);
        //conn.release(); 
        reject(err);
      } 
      priceList.map((row)=>{
        conn.query(`INSERT INTO contractionValue(contractionId, contractionTotalValue) VALUES (?, ?);`, [row.contractionId, row.price], function(err, result, fields){
          if(err){
            console.log(err);
            //conn.release(); 
            reject(err);
          }else{
            logger.info(row.price + '원을 ' + row.contractionId + " 에 등록하였습니다.");
          } 
        })
      })
      resolve();
      conn.release(); 
    })
  })
}

async function calculation(){
  const [streamerList, bannerList] = await Promise.all([getStreamerList(), getBannerList()]);
  const creatorList  = await getCreatorList(streamerList);
  const priceList = await getPriceList([creatorList, bannerList]);


  // //Promise Chaining
  // console.log(`계산을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);  
  // Promise.all([getStreamerList(), getBannerList()])
  // .then( async ([streamerList, bannerList]) => {
  //   const creatorList = await getCreatorList(streamerList);
  //   return [creatorList, bannerList];
  // })
  // .then(([creatorList, bannerList])=>{
  //   return getPriceList([creatorList, bannerList]);
  // })
  // .then((priceList)=>{
  //   Promise.all([contractionCalculate(priceList), creatorCalcuate(priceList), marketerCalculate(priceList)])
  //   .then(()=>{
  //     console.log(`계산이 완료되었습니다. 종료 시각 : ${new Date().toLocaleString()}`);
  //   })
  //   .catch((err)=>{
  //     logger.error(err.sqlMessage);
  //   })
  // })
  // .catch((err)=>{
  //   logger.error(err.sqlMessage);
  // })
  
  if(priceList[0] === undefined){
    console.log('존재하지 않으므로 종료됩니다.', );
    return;
  }

  console.log(`계산을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);  
  Promise.all([contractionCalculate(priceList), creatorCalcuate(priceList), marketerCalculate(priceList)]).then(()=>{
   //console.log(`계산이 완료되었습니다. 종료 시각 : ${new Date().toLocaleString()}`);
  })
  //contractionCalculate(priceList)
  // creatorCalcuate(priceList);
  //marketerCalculate(priceList);
}

// calculation();

//5,15,25,35,45,55

var scheduler = schedule.scheduleJob('5,15,25,35,45,55 * * * *', ()=>{
  console.log('작업을 시작합니다.')
  calculation();
})

module.exports = scheduler;








