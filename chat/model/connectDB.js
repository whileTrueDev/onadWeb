const doQuery = require('../lib/doQuery'); // For data insert
const createChatInsertQueryValues = require('../lib/createChatInsertQueryValues'); // For Query

// 계약된 모든 크리에이터 가져오기.
function getContratedCreators() {
  const getContractedChannelsQuery = `
  SELECT creatorTwitchId FROM creatorInfo WHERE creatorContractionAgreement = 1`;
  return new Promise((resolve, reject) => {
    let creators;
    doQuery(getContractedChannelsQuery)
      .then((row) => {
        if (row.error) {
          reject(Error(`get contracted creator - ${row.error}`));
        } else {
          creators = row.result;
          resolve(creators);
        }
      })
      .catch((err) => {
        reject(Error(`get contracted creator - ${err}`));
      });
  });
}

module.exports = {
  getContratedCreators
};
