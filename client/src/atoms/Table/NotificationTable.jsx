import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Table, TableHead, TableRow, TableBody, TableCell,
} from '@material-ui/core';
// custom table component
import CustomTableFooter from './TableFooter';

// core components
import tableStyle from './Table.style';

function CustomTable({ ...props }) {
  const {
    classes, tableHead, tableData, tableHeaderColor, pagination,
  } = props;

  const [page, setPage] = React.useState(0); // 테이블 페이지
  const [rowsPerPage, setRowsPerPage] = React.useState(5); // 테이블 페이지당 행
  const emptyRows = rowsPerPage - Math.min(
    rowsPerPage, tableData.length - page * rowsPerPage,
  );
  // page handler
  function handleChangeTablePage(event, newPage) {
    setPage(newPage);
  }
  // page per row handler
  function handleChangeTableRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
  }

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
            <TableRow>
              {tableHead.map((value) => (
                <TableCell
                  className={`${classes.tableCell} ${classes.tableHeadCell}`}
                  key={shortid.generate()}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        ) : null}
        {pagination ? (
          <TableBody>
            {/** 페이지네이션 있는 경우 */}
            {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((prop) => (
              <TableRow hover key={shortid.generate()}>
                {prop.map((value) => (

                  <TableCell className={classes.tableCell} key={shortid.generate()}>
                    {value}
                  </TableCell>

                ))}
              </TableRow>
            ))}

            {emptyRows > 0 && (
            <TableRow style={{ height: 48 * emptyRows }} key={shortid.generate()}>
              <TableCell colSpan={6} />
            </TableRow>
            )}

          </TableBody>
        ) : (
          <TableBody>
            {/** 페이지네이션 없는경우 */}
            {tableData.map((prop) => (
              <TableRow hover key={shortid.generate()}>
                {prop.map((value, i) => (
                  typeof (value) === 'string'
                  && (value.indexOf('data:image/') >= 0
                    || value.indexOf('http') === 0)// 사진데이터 또는 사진 url 인 경우
                    ? (
                      <TableCell className={classes.imgCellNoPage} key={shortid.generate()}>
                        <img src={value} alt="banner" style={{ width: '100%', height: 'auto' }} key={shortid.generate()} />
                      </TableCell>
                    ) : (
                      <TableCell className={classes.tableCell} key={shortid.generate()}>
                        {value}
                      </TableCell>
                    )
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}

        {pagination !== false && (
          <CustomTableFooter
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangeTablePage={handleChangeTablePage}
            handleChangeTableRowsPerPage={handleChangeTableRowsPerPage}
          />
        )}
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: 'gray',
  pagination: false,
};

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    'warning',
    'primary',
    'danger',
    'success',
    'info',
    'rose',
    'gray',
    'blueGray',
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  )).isRequired,
  pagination: PropTypes.bool,
};


export default withStyles(tableStyle)(CustomTable);
