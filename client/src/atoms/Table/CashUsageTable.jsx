import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Table, TableHead, TableRow, TableBody, TableCell
} from '@material-ui/core';
// custom table component
import CustomTableFooter from './TableFooter';
import Button from '../CustomButtons/Button';
import tableStyle from './Table.style';

function CustomTable({ ...props }) {
  const {
    classes, tableHead, tableData,
    tableHeaderColor, detailButton, handleDialogOpen, perMonth
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
    <div className={classes.tableResponsive} style={{ marginTop: 0 }}>
      <Table className={classes.table}>
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

        <TableBody>
          {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((prop, i) => (
            <TableRow hover key={shortid.generate()}>
              {prop.map((value) => (
                <TableCell className={classes.tableCell} key={shortid.generate()}>
                  {!perMonth ? (
                    <div style={{ display: 'flex' }}>
                      <span>{value}</span>
                    </div>
                  ) : (
                    <div>
                      <span>{value}</span>
                    </div>
                  )}
                </TableCell>
              ))}
              {detailButton && (
                <TableCell className={classes.tableCell}>
                  <Button
                    variant="contained"
                    color="success"
                    size="sm"
                    onClick={() => { handleDialogOpen((page * rowsPerPage) + i + 1); }}
                  >
                    상세보기
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 48 * emptyRows }} key={shortid.generate()}>
              <TableCell colSpan={6} />
            </TableRow>
          )}

        </TableBody>

        <CustomTableFooter
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangeTablePage={handleChangeTablePage}
          handleChangeTableRowsPerPage={handleChangeTableRowsPerPage}
        />
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: 'gray',
  perMonth: false,
  detailButton: false,
  handleDialogOpen() { }
};

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    'warning', 'primary', 'danger', 'success',
    'info', 'rose', 'gray', 'blueGray',
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableData: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.string)
  ).isRequired,
  perMonth: PropTypes.bool,
  detailButton: PropTypes.bool,
  handleDialogOpen: PropTypes.func
};


export default withStyles(tableStyle)(CustomTable);
