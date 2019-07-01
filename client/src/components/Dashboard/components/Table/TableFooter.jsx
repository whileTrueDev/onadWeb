
import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles, withStyles,
} from '@material-ui/core/styles';
import {
  TableRow, TableFooter, TablePagination, IconButton,
} from '@material-ui/core';
import {
  LastPage, FirstPage, KeyboardArrowRight, KeyboardArrowLeft,
} from '@material-ui/icons';
// jss file import
import tableStyle from '../../assets/jss/onad/components/tableStyle';

// Style for footer
const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));

// Footer component
function TablePaginationActions(props) {
  const classes = useStyles();
  const {
    count, page, rowsPerPage, onChangePage,
  } = props;

  function handleFirstPageButtonClick(event) {
    onChangePage(event, 0);
  }

  function handleBackButtonClick(event) {
    onChangePage(event, page - 1);
  }

  function handleNextButtonClick(event) {
    onChangePage(event, page + 1);
  }

  function handleLastPageButtonClick(event) {
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

// and then We use this.
function CustomTableFooter(props) {
  const {
    classes, count, rowsPerPage, page, handleChangeTablePage, handleChangeTableRowsPerPage,
  } = props;

  return (
    <TableFooter colSpan={6} component="tfoot" className={classes.tableFooter}>
      <TableRow>
        <TablePagination
        // component="tr"
          style={{ paddingTop: 0, paddingBottom: 0 }}
          className={classes.tableFooterPagination}
          rowsPerPageOptions={[5, 7, 10]}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          labelRowsPerPage="페이지 당 행:"
          SelectProps={{
            native: true,
          }}
          onChangePage={handleChangeTablePage}
          onChangeRowsPerPage={handleChangeTableRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </TableRow>
    </TableFooter>
  );
}

CustomTableFooter.propTypes = {
  classes: PropTypes.object,
  count: PropTypes.number,
  rowsPerPage: PropTypes.number,
  page: PropTypes.number,
  handleChangeTablePage: PropTypes.func,
  handleChangeTableRowsPerPage: PropTypes.func,
};

CustomTableFooter.defaultProps = {
  count: 0,
  rowsPerPage: 5,
  page: 0,
};

TablePaginationActions.defaultProps = {

};

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
};

export default withStyles(tableStyle)(CustomTableFooter);
