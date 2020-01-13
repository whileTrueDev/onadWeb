function getInsertQuery(data) {
  let queryString = `
  INSERT INTO
  marketerTaxBill_copy (marketerId, date, state, cashAmount)
  VALUES
  `;

  const valuesString = '(?, ?, ?, ?)';
  const comma = ',\n';

  const queryArray = [];
  data.forEach((d, index) => {
    queryString += valuesString;
    if (index !== data.length - 1) {
      queryString += comma;
    }
    queryArray.push(d.marketerId, d.date, 0, d.cashAmount);
  });

  return { queryString, queryArray };
}
module.exports = getInsertQuery;
