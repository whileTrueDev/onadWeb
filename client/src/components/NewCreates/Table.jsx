import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/core/styles';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Table, TableHead, TableRow, TableBody, TableCell, Grid
} from '@material-ui/core';
import Done from '@material-ui/icons/Done';
// custom table component
import Help from '@material-ui/icons/Help';
import CustomTableFooter from './TableFooter';
import GreenCheckbox from './GreenCheckBox';
// core components
import tableStyle from '../../assets/jss/onad/components/tableStyle';

const useStyles = makeStyles({
  tableHeadCell: {
    fontSize: '15px',
    fontWeight: '700',
    textAlign: 'center',
  }
});

function CustomTable({ ...props }) {
  const {
    classes, tableHead, tableData, tableHeaderColor, paginationOps, banner, checkBox
  } = props;
  const {
    rowsPerPage,
    page,
  } = paginationOps;

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
          {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(prop => (
            <TableRow key={shortid.generate()}>
              {banner
              && (
              <TableCell key={shortid.generate()}>
                <img src="/pngs/logo/onad_logo.png" alt="banner" style={{ width: '100%', height: 'auto', maxWidth: '50px' }} key={shortid.generate()} />
              </TableCell>
              )
              }
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
              )
              }
            </TableRow>
          ))}
        </TableBody>
        {/* <CustomTableFooter
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangeTablePage={handleChangeTablePage}
          handleChangeTableRowsPerPage={handleChangeTableRowsPerPage}
        /> */}

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
