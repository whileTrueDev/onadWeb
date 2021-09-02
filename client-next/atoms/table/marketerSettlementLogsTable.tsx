import * as React from 'react';
import { nanoid } from 'nanoid';
// @material-ui/core components
import { Table, TableHead, TableRow, TableBody, TableCell, Button } from '@material-ui/core';
// custom table component
import CustomTableFooter from './tableFooter';
import useTableStyles from './table.style';
// import CpcCpmTooltip from '../Tooltip/CpcCpmTooltip';

interface MarketerSettlementLogsTableProps {
  tableHead: string[];
  tableData: string[][];
  handleDialogOpen?: (v?: any) => void;
  detailButton?: boolean;
}

export default function MarketerSettlementLogsTable({
  tableHead,
  tableData,
  handleDialogOpen,
  detailButton = false,
}: MarketerSettlementLogsTableProps): JSX.Element {
  const classes = useTableStyles();

  const [page, setPage] = React.useState(0); // 테이블 페이지
  const [rowsPerPage, setRowsPerPage] = React.useState(4); // 테이블 페이지당 행
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
    <div className={classes.tableResponsive} style={{ marginTop: 0 }}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {tableHead.map(value => (
              <TableCell className={`${classes.tableCell} ${classes.tableHeadCell}`} key={nanoid()}>
                {value}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((prop, i) => (
            <TableRow hover key={nanoid()}>
              {prop.map(value => (
                <TableCell className={classes.tableCell} key={nanoid()}>
                  <span>{value}</span>
                </TableCell>
              ))}
              {detailButton && (
                <TableCell className={classes.tableCell}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={(): void => {
                      if (handleDialogOpen) {
                        handleDialogOpen(page * rowsPerPage + i);
                      }
                    }}
                  >
                    상세보기
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 36 * emptyRows }} key={nanoid()}>
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
