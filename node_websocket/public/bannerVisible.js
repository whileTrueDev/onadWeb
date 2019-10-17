exports.modules = pool.getConnection((err, conn) => {
  if (err) return err;
  const sql = 'INSERT INTO bannerVisible (contractionId, visibleState) VALUES (?, ?);';
  console.log('arrived');
  conn.query(sql, [bannerName, state], (err, result, fields) => {
    conn.release();
    if (err) return err;
  });
});
