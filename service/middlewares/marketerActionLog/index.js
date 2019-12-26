const doQuery = require('../../model/doQuery');

module.exports = function marketerActionLogging(queryArray) {
  const actionLogQuery = `
  INSERT INTO marketerActionLog
  (marketerId, type, detail)
  VALUES (?, ?, ?)`;

  if (!(queryArray instanceof Array)) {
    throw Error('queryArray must be Array');
  }
  return doQuery(actionLogQuery, queryArray);
};
