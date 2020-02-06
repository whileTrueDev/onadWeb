import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Stepper, Step, StepLabel, StepContent, Tooltip, Typography, Button
} from '@material-ui/core';
import { Delete, Star } from '@material-ui/icons';
import classnames from 'classnames';
import Check from '@material-ui/icons/Check';
import Dialog from '../../../atoms/Dialog/Dialog';
import '../BannerManage/upload.css';
import MaterialTable from '../../../atoms/Table/MaterialTable';

import HOST from '../../../utils/config';
import axios from '../../../utils/axios';
import history from '../../../history';
import GreenCheckbox from '../../../atoms/GreenCheckBox';

const DEFAULT_IMAGE_PATH = '/pngs/dashboard/banner_upload_manual.png';

const dialogStyle = theme => ({
  formRoot: {
    margin: theme.spacing(2),
    padding: theme.spacing(1),
  },
});

const useQontoStepIconStyles = makeStyles(theme => ({
  root: {
    color: '#eaeaf0',
    display: 'flex',
  },
  active: {
    color: theme.palette.primary.main,
  },
  circle: {
    width: 11,
    height: 11,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: theme.palette.primary.main,
    zIndex: 1,
    fontSize: 18,
  },
}));

// function QontoStepIcon(props) {
//   const classes = useQontoStepIconStyles();
//   const { active, completed } = props;

//   return (
//     <div
//       className={classnames(classes.root, { [classes.active]: active })}
//     >
//       {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
//     </div>
//   );
// }

const LandingUrlInventoryDialog = (props) => {
  const {
    open, onClose, classes, createPage, getBannerList, fetchData, dispatch, state
  } = props;

  const [indexNum, setIndexNum] = React.useState('');

  const handleCheck = (index, rowData) => {
    setIndexNum(index);
    dispatch({ key: 'mainLandingUrl', value: rowData.links.links[0].linkTo });
    if (rowData.links.links[1]) { dispatch({ key: 'sub1LandingUrl', value: rowData.links.links[1].linkTo }); }
    if (rowData.links.links[2]) { dispatch({ key: 'sub2LandingUrl', value: rowData.links.links[2].linkTo }); }
  };

  const handleClose = () => {
    dispatch({ type: 'reset' });
    onClose();
  };

  // url을 제출.
  const handleSubmit = (event, value) => {
    event.preventDefault();
    dispatch({ key: 'mainLandingUrl', value: value.value });
  };

  const columns = [
    {
      title: '심의 결과',
      field: 'confirmState',
      render: (rowData) => {
        switch (rowData.confirmState) {
          case 0: return '승인대기⏰';
          case 1: return '승인됨👌';
          case 2: return (
            <Tooltip
              title={<Typography variant="body2">{`사유: ${rowData.bannerDenialReason}`}</Typography>}
            >
              <Typography style={{ color: 'red' }}>거절됨</Typography>
            </Tooltip>
          );
          default: throw new Error('you need confirmState for table');
        }
      },
    },
    {
      title: '링크이름 및 주소',
      render: rowData => (
        <div>
          {rowData.links.links.map((link) => {
            if (link) {
              return (
                <div key={link.linkTo}>
                  <a
                    href={link.linkTo}
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(link.linkTo);
                    }}
                  >
                    {link.linkName ? link.linkName : link.linkTo }
                  </a>
                  {link.primary && (
                  <Tooltip title={(
                    <Typography>
                      primary링크로, 배너이미지 클릭시 곧바로 연결되는 링크입니다.
                    </Typography>
                  )}
                  >
                    <Star color="secondary" />
                  </Tooltip>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
      ),
    },
    { title: '링크 등록 일자', render: rowData => (<span>{rowData.regiDate}</span>) },
  ];

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth
      title="URL 선택"
    >
      <Stepper orientation="vertical" style={{ padding: 0 }}>
        <Step key="0">
          <StepLabel>
            랜딩페이지 URL 선택
          </StepLabel>
          <StepContent>
            <div>
              {fetchData.loading && (<MaterialTable columns={columns} isLoading />)}
              {!fetchData.loading && fetchData.error && (<span>Error</span>)}
              {!fetchData.loading && fetchData.payload && (
              <MaterialTable
                title={null}
                columns={columns}
                data={fetchData.payload}
                actions={[
                  {
                    icon: () => (
                      <GreenCheckbox
                        fontSize="large"
                      />
                    ),
                    tooltip: '선택',
                    onClick: (e, rowData) => { handleCheck(rowData); }
                  }
                ]}
                options={{
                  actionsColumnIndex: -1,
                  search: false
                }}
                localization={{
                  body: {
                    emptyDataSourceMessage: '등록된 랜딩페이지 URL이 없습니다.'
                  },
                  header: {
                    actions: '선택'
                  }
                }}
              />
              )}

            </div>
          </StepContent>
          <Button
            color="primary"
          >
          닫기
          </Button>
          <Button
            color="primary"
            onClick={() => { console.log(state.mainLandingUrl); }}
          >
          확인
          </Button>
        </Step>

      </Stepper>
    </Dialog>
  );
};


LandingUrlInventoryDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

// QontoStepIcon.propTypes = {
//   active: PropTypes.bool.isRequired,
//   completed: PropTypes.bool.isRequired,
// };

export default withStyles(dialogStyle)(LandingUrlInventoryDialog);
