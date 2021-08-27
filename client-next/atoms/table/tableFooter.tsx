import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TableRow, TableFooter, TablePagination, IconButton } from '@material-ui/core';
import { LastPage, FirstPage, KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';
// jss file import
import useTableStyles from './table.style';

// Style for footer
const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));

// Action buttons component - 테이블 페이지네이션 버튼들
interface TablePagenationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (e: React.MouseEvent<HTMLButtonElement>, page: number) => void;
}
function TablePaginationActions(props: TablePagenationActionsProps): JSX.Element {
  const classes = useStyles();
  const { count, page, rowsPerPage, onChangePage } = props;

  // 처음 페이지로
  function handleFirstPageButtonClick(event: React.MouseEvent<HTMLButtonElement>): void {
    onChangePage(event, 0);
  }

  // 이전 페이지로
  function handleBackButtonClick(event: React.MouseEvent<HTMLButtonElement>): void {
    onChangePage(event, page - 1);
  }

  // 다음 페이지로
  function handleNextButtonClick(event: React.MouseEvent<HTMLButtonElement>): void {
    onChangePage(event, page + 1);
  }

  // 마지막 페이지로
  function handleLastPageButtonClick(event: React.MouseEvent<HTMLButtonElement>): void {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  }

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="First Page"
      >
        <FirstPage />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Next Page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Last Page"
      >
        <LastPage />
      </IconButton>
    </div>
  );
}

// 테이블 페이지네이션 footer 컴포넌트
interface CustomTableFooterProps {
  handleChangeTablePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  handleChangeTableRowsPerPage?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  page: number;
  rowsPerPage: number;
  count: number;
}

function CustomTableFooter({
  count = 0,
  rowsPerPage = 5,
  page = 0,
  handleChangeTablePage,
  handleChangeTableRowsPerPage,
}: CustomTableFooterProps): JSX.Element {
  const classes = useTableStyles();

  return (
    <TableFooter component="tfoot" className={classes.tableFooter}>
      <TableRow>
        <TablePagination
          style={{ paddingTop: 0, paddingBottom: 0 }}
          className={classes.tableFooterPagination}
          rowsPerPageOptions={[3, 5, 10, 15]}
          labelRowsPerPage="페이지 당 행:"
          SelectProps={{ native: true }}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangeTablePage}
          onRowsPerPageChange={handleChangeTableRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </TableRow>
    </TableFooter>
  );
}

export default CustomTableFooter;
