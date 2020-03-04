function getInsertQuery(data: any) {
  let queryString = `
  INSERT INTO
  marketerTaxBill (marketerId, date, state, cashAmount)
  VALUES
  `;

  const TAX_WAIT_STATE = 0; // 발행대기 상태값 0

  const valuesString = '(?, ?, ?, ?)';
  const comma = ',\n';

  const queryArray: any = [];
  data.forEach((d: any, index: number) => {
    queryString += valuesString;
    if (index !== data.length - 1) {
      queryString += comma;
    }
    queryArray.push(d.marketerId, d.date, TAX_WAIT_STATE, d.cashAmount);
  });

  return { queryString, queryArray };
}

export default getInsertQuery
