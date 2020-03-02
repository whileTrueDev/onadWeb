import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Table, TableHead, TableRow, TableBody, TableCell, Grid, Hidden,
} from '@material-ui/core';
// custom table component
import CustomTableFooter from './TableFooter';

// core components
import tableStyle from './Table.style';
import CustomButton from '../CustomButtons/Button';

function CustomTable({ ...props }) {
  const {
    classes, tableHead, tableData, tableHeaderColor, pagination,
    buttonSet, handleDescDialog, handleDeleteOpen, bannerId
  } = props;


  const [page, setPage] = React.useState(0); // 테이블 페이지
  const [rowsPerPage, setRowsPerPage] = React.useState(3); // 테이블 당 행

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
        <Hidden smDown key={shortid.generate()}>
          {tableHead !== undefined ? (
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
                {buttonSet && (
                <TableCell
                  className={`${classes.tableCell} ${classes.tableHeadCell}`}
                  key={shortid.generate()}
                />
                )}
              </TableRow>
            </TableHead>
          ) : null}
        </Hidden>
        {pagination !== false ? (
          <TableBody>
            {/** 페이지네이션 있는 경우 */}
            {tableData.slice(
              page * rowsPerPage, page * rowsPerPage + rowsPerPage
            ).map((prop, i) => (
              <TableRow key={shortid.generate()} id={bannerId[i]}>
                {prop.map(value => (
                  value === null || value.indexOf('data:image/') === -1// 없는 경우
                    ? (
                      <Hidden smDown key={shortid.generate()}>
                        <TableCell className={classes.tableCell} key={shortid.generate()}>
                          {value === null
                            ? (
                              <span>
                                {'등록된 캠페인이 없습니다.'}
                              </span>
                            )
                            : value}
                        </TableCell>
                      </Hidden>
                    ) : (
                      <TableCell className={classes.imgCell} key={shortid.generate()}>
                        <img src={value} alt="banner" style={{ width: '100%', height: 'auto' }} />
                      </TableCell>
                    )
                ))}
                {buttonSet && (
                <TableCell className={classes.ButtonCell} key={shortid.generate()}>
                  <Grid container direction="column">
                    <Grid item>
                      <CustomButton
                        variant="contained"
                        color="success"
                        size="sm"
                        className={classes.tableButton}
                        onClick={handleDescDialog}
                      >
                        상세정보
                      </CustomButton>
                    </Grid>
                    <Grid item>
                      <CustomButton
                        variant="contained"
                        color="danger"
                        size="sm"
                        className={classes.tableButton}
                        onClick={() => {
                          handleDeleteOpen(bannerId[i]);
                        }}
                      >
                        배너삭제
                      </CustomButton>
                    </Grid>
                  </Grid>
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
        ) : (
          <TableBody>
            {/** 페이지네이션 없는경우 */}
            {tableData.map(prop => (
              <TableRow key={shortid.generate()}>
                {prop.map((value, i) => (
                  typeof (value) === 'string'
                  && (value.indexOf('data:image/') >= 0
                    || value.indexOf('http') === 0)// 사진데이터 또는 사진 url 인 경우
                    ? (
                      <TableCell className={classes.imgCellNoPage} key={shortid.generate()}>
                        <img src={value} alt="banner" style={{ width: '100%', height: 'auto' }} key={shortid.generate()} />
                      </TableCell>
                    ) : (
                      <Hidden smDown key={shortid.generate()}>
                        <TableCell className={classes.tableCell}>
                          {value}
                        </TableCell>
                      </Hidden>
                    )
                ))}
                {buttonSet && (
                  <TableCell className={classes.ButtonCell} key={shortid.generate()}>
                    <Grid container direction="column">
                      <Grid item>
                        <CustomButton
                          variant="contained"
                          color="success"
                          size="sm"
                          className={classes.tableButton}
                          onClick={handleDescDialog}
                        >
                        상세정보
                        </CustomButton>
                      </Grid>
                      <Grid item>
                        <CustomButton
                          variant="contained"
                          color="danger"
                          size="sm"
                          className={classes.tableButton}
                          onClick={handleDeleteOpen}
                        >
                        배너삭제
                        </CustomButton>
                      </Grid>
                    </Grid>
                  </TableCell>
                )}
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
  buttonSet: false,
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
    'blueGray',
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  )).isRequired,
  pagination: PropTypes.bool,
  paginationOps: PropTypes.object,
  buttonSet: PropTypes.bool,
};


export default withStyles(tableStyle)(CustomTable);
