import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/core/styles';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Table, TableHead, TableRow, TableBody, TableCell, Grid
} from '@material-ui/core';
// custom table component
import Help from '@material-ui/icons/Help';
import GreenCheckbox from '../GreenCheckBox';
import TableFooter from './TableFooter';
// core components
import tableStyle from './Table.style';

const useStyles = makeStyles({
  tableHeadCell: {
    fontSize: '15px',
    fontWeight: '700',
    textAlign: 'center',
    color: '#455a64'
  },
});

function CustomTable({ ...props }) {
  const {
    classes, tableHead, tableData, tableHeaderColor, banner, checkBox,
    pagination
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


  const myClasses = useStyles();
  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
            <TableRow>
              {banner
              && (
              <TableCell />
              )}
              {tableHead.map((column, index) => (
                <TableCell
                  className={myClasses.tableHeadCell}
                  key={shortid.generate()}
                >
                  <Grid container direction="row">
                    <Grid item>
                      <div>{column.label}</div>
                    </Grid>
                    {/* 각 변수에 대한 설명 Dialog를 추가하는 영역 */}
                    {column.desc !== '' && (
                    <Grid item>
                      <Help
                        fontSize="small"
                        color="disabled"
                        name={index}
                      />
                    </Grid>
                    )}
                  </Grid>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((prop) => (
            <TableRow key={shortid.generate()}>
              {banner
              && (
              <TableCell key={shortid.generate()}>
                <img src="/pngs/logo/onad_logo.png" alt="banner" style={{ width: '100%', height: 'auto', maxWidth: '50px' }} key={shortid.generate()} />
              </TableCell>
              )}
              {prop.map((value, i) => (
                <TableCell className={classes.tableCell} key={shortid.generate()}>
                  {value}
                </TableCell>
              ))}
              {checkBox
              && (
              <TableCell className={classes.tableCell}>
                <GreenCheckbox fontSize="small" checked />
              </TableCell>
              )}
            </TableRow>
          ))}

          {emptyRows > 0 && (
          <TableRow style={{ height: 48 * emptyRows }} key={shortid.generate()}>
            <TableCell colSpan={3} />
          </TableRow>
          )}
        </TableBody>

        {pagination && (
        <TableFooter
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
  buttonSet: false,
  paginationOps: {
    tableDataLength: 10,
    rowsPerPage: 5,
    page: 0,
  },
  banner: false,
  checkBox: false
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
  tableHead: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  )).isRequired,
  pagination: PropTypes.bool,
  paginationOps: PropTypes.object,
  buttonSet: PropTypes.bool,
  banner: PropTypes.bool,
  checkBox: PropTypes.bool
};


export default withStyles(tableStyle)(CustomTable);
