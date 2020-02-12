import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Tooltip, Typography, Button
} from '@material-ui/core';
import { Star } from '@material-ui/icons';
import Dialog from '../../../atoms/Dialog/Dialog';
import '../Inventory/upload.css';
import MaterialTable from '../../../atoms/Table/MaterialTable';

import GreenCheckbox from '../../../atoms/GreenCheckBox';

const dialogStyle = theme => ({
  formRoot: {
    margin: theme.spacing(2),
    padding: theme.spacing(1),
  },
});

const LandingUrlInventoryDialog = (props) => {
  const {
    open, onClose, landingUrlData, dispatch,
  } = props;
  const [indexId, setindexId] = React.useState('');
  const [tmpMainUrl, setTmpMainUrl] = React.useState('');
  const [tmpSub1Url, setTmpSub1Url] = React.useState('');
  const [tmpSub2Url, setTmpSub2Url] = React.useState('');
  const [tmpMainUrlName, setTmpMainUrlName] = React.useState('');
  const [tmpSub1UrlName, setTmpSub1UrlName] = React.useState('');
  const [tmpSub2UrlName, setTmpSub2UrlName] = React.useState('');

  const handleCheck = (event, rowData) => {
    setindexId(event.target.id);
    setTmpMainUrl(rowData.links[0].linkTo);
    if (rowData.links[1]) {
      setTmpSub1Url(rowData.links[1].linkTo);
    }
    if (rowData.links[2]) {
      setTmpSub2Url(rowData.links[2].linkTo);
    }
    setTmpMainUrlName(rowData.links[0].linkName);
    if (rowData.links[1]) {
      setTmpSub1UrlName(rowData.links[1].linkName);
    }
    if (rowData.links[2]) {
      setTmpSub2UrlName(rowData.links[2].linkName);
    }
  };

  const handleClose = (click) => {
    if (click === 'click') {
      dispatch({ key: 'mainLandingUrl', value: tmpMainUrl });
      if (tmpSub1Url) { dispatch({ key: 'sub1LandingUrl', value: tmpSub1Url }); }
      if (tmpSub2Url) { dispatch({ key: 'sub2LandingUrl', value: tmpSub2Url }); }
      dispatch({ key: 'mainLandingUrlName', value: tmpMainUrlName });
      if (tmpSub1UrlName) { dispatch({ key: 'sub1LandingUrlName', value: tmpSub1UrlName }); }
      if (tmpSub2UrlName) { dispatch({ key: 'sub2LandingUrlName', value: tmpSub2UrlName }); }
    }
    setindexId('');
    setTmpMainUrl('');
    setTmpSub1Url('');
    setTmpSub2Url('');
    setTmpMainUrlName('');
    setTmpSub1UrlName('');
    setTmpSub2UrlName('');
    onClose();
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
    {
      title: '선택',
      render: rowData => (
        <div>
          <GreenCheckbox
            fontSize="large"
            id={rowData.linkId}
            checked={indexId === rowData.linkId}
            onClick={(event) => { handleCheck(event, rowData.links); }}
          />
        </div>
      ),
    }
  ];

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="md"
      fullWidth
      title="URL 선택"
      buttons={(
        <div style={{ margin: '5px' }}>
          <Button
            variant="contained"
            onClick={handleClose}
          >
              닫기
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => { handleClose('click'); }}
          >
              확인
          </Button>
        </div>
)}
    >
      <div>
        {!landingUrlData.loading && landingUrlData.error && (<span>Error</span>)}
        {!landingUrlData.loading && landingUrlData.payload && (
        <MaterialTable
          style={{ boxShadow: 'none' }}
          title={null}
          columns={columns}
          data={landingUrlData.payload === 'nourldata' ? [] : landingUrlData.payload}
          isLoading={landingUrlData.loading}
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

    </Dialog>
  );
};


LandingUrlInventoryDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

// QontoStepIcon.propTypes = {
//   active: PropTypes.bool.isRequired,
//   completed: PropTypes.bool.isRequired,
// };

export default withStyles(dialogStyle)(LandingUrlInventoryDialog);
