import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Done from '@material-ui/icons/Done';
import {InputLabel} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '../CustomButtons/Button';

// custom table component
import CustomTableFooter from './TableFooter';

// core components
import tableStyle from '../../assets/jss/onad/components/tableStyle';


function CustomTable({ ...props }) {
  const {
    classes, tableHead, tableData, tableHeaderColor, pagination,
    handleChangeTablePage, handleChangeTableRowsPerPage,
    emptyRows, rowsPerPage, page, loading, confirmClickEvent,
    handleSeleted
  } = props;

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
            <TableRow>
              {tableHead.map((value, index) => (
                <TableCell
                  className={`${classes.tableCell} ${classes.tableHeadCell}`}
                  key={index}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        ) : null}

        {pagination !== false ? (
          <TableBody>
            {/** 페이지네이션 있는 경우 */}
            {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(prop => (
              <TableRow key={prop}>
                {prop.map(value => (
                  value.indexOf('data:image/') === -1 // 없는 경우
                    ? (
                      <TableCell className={classes.tableCell} key={value}>
                        {value === '완료됨'
                          ? (
                            <span>
                              {value}
                              <Done color="secondary" />
                            </span>
                          )
                          : value}
                      </TableCell>
                    ) : (
                      <TableCell className={classes.tableCell} key={value}>
                        <img src={value} alt="banner" height="50%" />
                      </TableCell>
                    )
                ))}
              </TableRow>
            ))}

            {emptyRows > 0 && (
            <TableRow style={{ height: 48 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
            )}
 
          </TableBody>
        ) : (
          <TableBody>
            {/** 페이지네이션 없는경우 */}
            {tableData.map((prop, key) => (
              <TableRow key={prop}>
                {prop.map(value => (
                  // <TableCell className={classes.tableCell} key={value}>
                  //   {value}
                  // </TableCell>
                  String(value).indexOf('data:image/') === -1 // 없는 경우
                  ? 
                  value == '0'
                  ?
                  (
                   <TableCell className={classes.tableCell} key={value}>
                    <p><Button id={prop[1]} onClick={confirmClickEvent}> 승인하기 </Button> </p>
                   
                    <FormControl className={classes.formControl}>
                      <InputLabel> 거절하기 </InputLabel>
                      <Select
                        onChange={handleSeleted}
                        input={(
                          <OutlinedInput
                            name={prop[1]}
                            id={prop[1]}
                            value={value}
                          />
                        )}
                      >
                        <MenuItem value={'불법 베팅관련'}>불법 베팅관련</MenuItem>
                        <MenuItem value={'선정적'}>선정적</MenuItem>
                        <MenuItem value={'저작권 침해 우려'}>저작권 침해 우려</MenuItem>
                        <MenuItem value={'잔인함'}>잔인함</MenuItem>
                        <MenuItem value={'기타 : 고객센터 문의'}>기타 : 고객센터 문의</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  )
                  :((
                    <TableCell className={classes.tableCell} key={value}>
                      {value}
                    </TableCell>
                  ))
                  :(
                    <TableCell className={classes.tableCell} key={value}>
                      <img src={value} alt="banner" height="50%" />
                    </TableCell>
                  ) 
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}

        {pagination !== false ? (
          <CustomTableFooter
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangeTablePage={handleChangeTablePage}
            handleChangeTableRowsPerPage={handleChangeTableRowsPerPage}
          />
        )
          : null}
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: 'gray',
  pagination: false,
  paginationOps: {
    tableDataLength: 10,
    rowsPerPage: 5,
    page: 0,
  },
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
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  pagination: PropTypes.bool,
  paginationOps: PropTypes.object,
};


export default withStyles(tableStyle)(CustomTable);
