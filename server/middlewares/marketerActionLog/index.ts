import doQuery from '../../model/doQuery';

module.exports = function marketerActionLogging(queryArray: any[]) {
  const actionLogQuery = `
  INSERT INTO marketerActionLog
  (marketerId, type, detail)
  VALUES (?, ?, ?)`;

  if (!(queryArray instanceof Array)) {
    throw Error('queryArray must be Array');
  }
  return doQuery(actionLogQuery, queryArray);
};
