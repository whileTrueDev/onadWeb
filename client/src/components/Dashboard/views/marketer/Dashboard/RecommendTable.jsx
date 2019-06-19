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
// import Tooltip from '@material-ui/core/Tooltip';
// import IconButton from '@material-ui/core/IconButton';
// // icons
// import Close from '@material-ui/icons/Close';

// core components
// import CardAvatar from '../../../components/Card/CardAvatar';
import tableStyle from '../../../assets/jss/onad/components/tableStyle';
import CreatorInfoModal from './CreatorInfoModal';

function useModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState('');

  function handleModalOpen(name) {
    setSelectedCreator(name);
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
  }

  return {
    modalOpen, handleModalOpen, handleModalClose, selectedCreator,
  };
}

function CustomTable({ ...props }) {
  const {
    classes, tableHead, tableData, tableHeaderColor,
  } = props;

  const {
    modalOpen, handleModalOpen, handleModalClose, selectedCreator,
  } = useModal();

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
              // className={classes.tableRow}
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
                        handleModalOpen(e.target.innerText);
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
              {/* <Tooltip
                  id="tooltip-top-start"
                  title="삭제"
                  placement="top"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <IconButton
                    aria-label="Close"
                    className={classes.tableActionButton}
                  >
                    <Close
                      className={
                    `${classes.tableActionButtonIcon} ${classes.close}`
                  }
                    />
                  </IconButton>
                </Tooltip> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreatorInfoModal
        open={modalOpen}
        handleModalClose={handleModalClose}
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
