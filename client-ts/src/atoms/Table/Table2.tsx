import * as React from 'react';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/core/styles';
// @material-ui/core components
import { Table, TableHead, TableRow, TableBody, TableCell, Grid } from '@material-ui/core';
// custom table component
import Help from '@material-ui/icons/Help';
import GreenCheckbox from '../Checkbox/GreenCheckBox';
import TableFooter from './TableFooter';
// core components
import useTableStyles from './Table.style';

const useSecondStyles = makeStyles({
  tableHeadCell: {
    fontSize: '15px',
    fontWeight: 700,
    textAlign: 'center',
    color: 'theme.palette.info.main',
  },
});

interface CustomTableProps {
  tableHead: { label: string; desc: string }[];
  tableData: Array<string[]>;
  banner?: boolean;
  checkBox?: boolean;
  pagination?: boolean;
}

function CustomTable({
  tableHead,
  tableData,
  banner = false,
  checkBox = false,
  pagination = false,
}: CustomTableProps): JSX.Element {
  // style classes
  const classes = useTableStyles();
  const myClasses = useSecondStyles();

  const [page, setPage] = React.useState(0); // 테이블 페이지
  const [rowsPerPage, setRowsPerPage] = React.useState(5); // 테이블 페이지당 행
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, tableData.length - page * rowsPerPage);
  // page handler
  function handleChangeTablePage(
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void {
    setPage(newPage);
  }
  // page per row handler
  function handleChangeTableRowsPerPage(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void {
    setRowsPerPage(parseInt(event.target.value, 10));
  }

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead>
            <TableRow>
              {banner && <TableCell />}
              {tableHead.map((column, index) => (
                <TableCell className={myClasses.tableHeadCell} key={shortid.generate()}>
                  <Grid container direction="row">
                    <Grid item>
                      <div>{column.label}</div>
                    </Grid>
                    {/* 각 변수에 대한 설명 Dialog를 추가하는 영역 */}
                    {column.desc !== '' && (
                      <Grid item>
                        <Help fontSize="small" color="disabled" />
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
              {banner && (
                <TableCell key={shortid.generate()}>
                  <img
                    src="/pngs/logo/onad_logo.png"
                    alt="banner"
                    style={{ width: '100%', height: 'auto', maxWidth: '50px' }}
                    key={shortid.generate()}
                  />
                </TableCell>
              )}
              {prop.map((value, i) => (
                <TableCell className={classes.tableCell} key={shortid.generate()}>
                  {value}
                </TableCell>
              ))}
              {checkBox && (
                <TableCell className={classes.tableCell}>
                  <GreenCheckbox size="small" checked />
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

export default CustomTable;
