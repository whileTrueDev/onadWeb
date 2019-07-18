import React, { useState } from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Link from '@material-ui/core/Link';
import tableStyle from '../../../assets/jss/onad/components/tableStyle';
import CreatorInfoDialog from './CreatorInfoDialog';

function useDialog() {
  const [DialogOpen, setDialogOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState('');

  function handleDialogOpen(name) {
    setSelectedCreator(name);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  return {
    DialogOpen, handleDialogOpen, handleDialogClose, selectedCreator,
  };
}

function CustomTable({ ...props }) {
  const {
    classes, tableHead, tableData, tableHeaderColor,
  } = props;

  const {
    DialogOpen, handleDialogOpen, handleDialogClose, selectedCreator,
  } = useDialog();


  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
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
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {/** 페이지네이션 없는경우 */}
          {tableData.map(prop => (
            <TableRow
              hover
              key={shortid.generate()}
            >
              {prop.map((value, index) => (
                index === 0 ? (
                  <TableCell
                    className={classes.tableCell}
                    key={shortid.generate()}
                  >
                    <Link
                      href="/dashboard/main"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDialogOpen(e.target.innerText);
                      }}
                    >
                      {value}
                    </Link>
                  </TableCell>

                ) : (
                  <TableCell
                    className={classes.tableCell}
                    key={shortid.generate()}
                  >
                    {value}
                  </TableCell>
                )

              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CreatorInfoDialog
        open={DialogOpen}
        handleDialogClose={handleDialogClose}
        creatorName={selectedCreator}
        tableData={tableData}
      />
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: 'gray',
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
  tableHead: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableData: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ).isRequired,
};


export default withStyles(tableStyle)(CustomTable);
