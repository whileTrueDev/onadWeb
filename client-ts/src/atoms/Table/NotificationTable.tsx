import * as React from 'react';
import shortid from 'shortid';
// @material-ui/core components
import { Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';
// custom table component
import CustomTableFooter from './TableFooter';

// core components
import useTableStyles from './Table.style';

interface CustomTableProps {
  tableHead: string[];
  tableData: string[][];
  pagination?: boolean;
}

function CustomTable({ tableHead, tableData, pagination = false }: CustomTableProps): JSX.Element {
  const classes = useTableStyles();

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
        ) : null}
        {pagination ? (
          <TableBody>
            {/** 페이지네이션 있는 경우 */}
            {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(prop => (
              <TableRow hover key={shortid.generate()}>
                {prop.map(value => (
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
            {tableData.map(prop => (
              <TableRow hover key={shortid.generate()}>
                {prop.map((value, i) =>
                  typeof value === 'string' &&
                  (value.indexOf('data:image/') >= 0 || value.indexOf('http') === 0) ? ( // 사진데이터 또는 사진 url 인 경우
                    <TableCell className={classes.imgCellNoPage} key={shortid.generate()}>
                      <img
                        src={value}
                        alt="banner"
                        style={{ width: '100%', height: 'auto' }}
                        key={shortid.generate()}
                      />
                    </TableCell>
                  ) : (
                    <TableCell className={classes.tableCell} key={shortid.generate()}>
                      {value}
                    </TableCell>
                  ),
                )}
              </TableRow>
            ))}
          </TableBody>
        )}

        {pagination && (
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

export default CustomTable;
