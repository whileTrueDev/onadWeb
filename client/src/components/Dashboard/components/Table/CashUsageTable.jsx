import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Table, TableHead, TableRow, TableBody, TableCell, Tooltip
} from '@material-ui/core';
import Error from '@material-ui/icons/ErrorOutline';
// custom table component
import CustomTableFooter from './TableFooter';
import Button from '../CustomButtons/Button';
import tableStyle from '../../assets/jss/onad/components/tableStyle';
import CpcCpmTooltip from '../Tooltip/CpcCpmTooltip';

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
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
          <TableRow>
            {tableHead.map(value => (
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
              {prop.map(value => (
                <TableCell className={classes.tableCell} key={shortid.generate()}>
                  {!perMonth ? (
                    <div style={{ display: 'flex' }}>
                      <span>{value}</span>
                      {value === '미발행' && (
                        <Tooltip
                          title={(
                            <React.Fragment>
                              <span>사업자 등록증을 등록하지 않아</span>
                              <br />
                              <span>세금계산서가 미발행 되었습니다.</span>
                              <br />
                              <span>필요시 이메일을 보내주세요. support@onad.io</span>
                            </React.Fragment>
                          )}
                          placement="bottom"
                          disableFocusListener
                        >
                          <div><Error /></div>
                        </Tooltip>
                      )}
                    </div>
                  ) : (
                    <div>
                      {/* {value.indexOf(',') >= 0 ? ( // 집행 금액 컬럼의 경우
                        <CpcCpmTooltip value={value} />
                      ) : (
                      <span>{value}</span>
                      )} */}
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
                    onClick={() => { handleDialogOpen(i + 1); }}
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
  perMonth: false
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
  perMonth: PropTypes.bool
};


export default withStyles(tableStyle)(CustomTable);
