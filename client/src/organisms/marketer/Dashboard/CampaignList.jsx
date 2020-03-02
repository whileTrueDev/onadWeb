import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Grid, Paper, Divider, Button,
  Typography, IconButton,
  ListItem, List, FormControlLabel,
  Snackbar, Hidden
} from '@material-ui/core';
import Countup from 'react-countup';

import { Assessment, Delete as DeleteIcon, Build } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import IOSSwitch from '../../../atoms/Switch/IOSSwitch';

import CampaignDeleteConfirmDialog from './campaign/CampaignDeleteConfirmDialog';
import CampaignUpdateDialog from './campaign/CampaignUpdateDialog';
import CampaignAnalysisDialog from './report/CampaignReportDialog';

import useDialog from '../../../utils/lib/hooks/useDialog';
import useDeleteData from '../../../utils/lib/hooks/useDeleteData';
import useUpdateData from '../../../utils/lib/hooks/useUpdateData';

import history from '../../../history';

const SLIDE_TIMEOUT = 500;
const useStyles = makeStyles(theme => ({
  container: {
    padding: 16,
  },
  list: {
    width: '100%',
    '&:hover': {
      backgroundColor: theme.palette.grey[200]
    }
  },
  image: {
    width: 96,
    height: 96,
    marginRight: theme.spacing(3),
    backgroundColor: theme.palette.grey[300],
    [theme.breakpoints.only('lg')]: {
      width: 72,
      height: 72
    }
  },
  img: {
    width: 240,
    height: 120,
    [theme.breakpoints.down('md')]: {
      width: 120,
      height: 60
    },
    maxWidth: '100%',
  },
  contents: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

export default function CampaignList(props) {
  const classes = useStyles();
  const { campaignData } = props;

  const [selectedCampaign, setSelectedCampaign] = React.useState(null);
  const optionTypeList = ['배너 광고', '배너 + 클릭 광고', '클릭 광고'];
  const priorityTypeList = ['크리에이터 우선', '카테고리 우선', '노출 우선'];

  // To open campaign control dialog
  const campaignUpdateDialog = useDialog();
  const campaignDeleteDialog = useDialog();
  const campaignReportDialog = useDialog();
  const snack = useDialog();

  const { handleDelete } = useDeleteData('/api/dashboard/marketer/campaign', campaignData.callUrl);
  const { handleUpdateRequest } = useUpdateData('/api/dashboard/marketer/campaign/onoff', () => {
    snack.handleOpen();
    campaignData.callUrl();
  });
  // useUpdateData를 사용할 때, 전달되는 url router의 response data의 형태가 array여야함을 고려한다.

  const handleUpdateState = ({ onoffState, campaignId }) => (event) => {
    event.preventDefault();
    handleUpdateRequest({ onoffState, campaignId });
  };

  return (
    <Paper style={{ minHeight: 220 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
        <Typography variant="h6">
          캠페인 목록
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => { history.push('/dashboard/marketer/campaigncreate'); }}
        >
          캠페인 등록하기
        </Button>
      </div>

      <Divider />
      <List style={{ maxHeight: 380, overflowY: 'auto' }}>
        {campaignData.payload.map((detail, index) => (
          <div key={detail.campaignId}>
            <ListItem
              className={classes.list}
            >
              <Grid container direction="row" justify="space-between">
                <Grid item className={classes.contents}>
                  <Grid container direction="row" className={classes.contents} spacing={3}>
                    <Grid item>
                      <FormControlLabel
                        control={(
                          <IOSSwitch
                            id="onoff-switch"
                            checked={Boolean(detail.onOff)}
                            onChange={handleUpdateState({
                              onoffState: !detail.onOff,
                              campaignId: detail.campaignId
                            })}
                          />
                        )}
                        label={detail.onOff ? (<div style={{ color: '#52d869', fontWeight: 700 }}>활성화</div>) : (<div>비활성화</div>)}
                        labelPlacement="bottom"
                      />
                    </Grid>
                    <Grid item>
                      <img className={classes.img} alt="campaign-logo" src={detail.bannerSrc} />
                    </Grid>
                    <Hidden xsDown>
                      <Grid item>
                        <Grid container direction="column" spacing={2}>
                          <Typography gutterBottom variant="body2">
                            {detail.campaignName}
                          </Typography>
                          <Typography variant="caption" gutterBottom>
                            {optionTypeList[detail.optionType]}
                          </Typography>
                          <Typography variant="caption" gutterBottom>
                            {priorityTypeList[detail.priorityType]}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(detail.regiDate).toLocaleDateString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Hidden>
                  </Grid>
                </Grid>
                <Hidden xsDown>
                  <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography gutterBottom variant="body2">
                          오늘 집행된 예산
                        </Typography>
                      </Grid>
                      <Grid>
                        <Divider orientation="horizontal" />
                      </Grid>
                      <Grid item>
                        <Typography variant="h5" color="secondary" align="center">
                          <Countup duration={2} end={detail.dailysum ? detail.dailysum : 0} separator="," />
                        </Typography>
                      </Grid>
                      <Grid item>
                        {(detail.dailyLimit !== -1)
                          ? (
                            <Typography variant="body1" align="center" style={{ fontWeight: 700 }}>
                              {new Intl.NumberFormat().format(detail.dailyLimit)}
                            </Typography>
                          )
                          : (
                            <Typography variant="h4" align="center" style={{ fontWeight: 700 }}>
                              ∞
                            </Typography>
                          )
                      }
                      </Grid>
                      <Grid>
                        <Divider orientation="horizontal" />
                      </Grid>
                      <Grid item>
                        <Typography gutterBottom variant="body2" align="center">
                          일일 예산
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <List>
                      <ListItem
                        button
                        onClick={() => {
                          setSelectedCampaign(detail);
                          campaignReportDialog.handleOpen();
                        }}
                      >
                        <Assessment />
                        <Typography>분석</Typography>
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => {
                          setSelectedCampaign(detail);
                          campaignUpdateDialog.handleOpen();
                        }}
                      >
                        <Build color="action" />
                        <Typography>수정</Typography>
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => {
                          campaignDeleteDialog.handleOpen(detail.campaignId);
                        }}
                      >
                        <DeleteIcon color="error" />
                        <Typography color="error">삭제</Typography>
                      </ListItem>
                    </List>
                  </Grid>
                </Hidden>

              </Grid>

            </ListItem>
            {!(campaignData.payload.length - 1 === index) && (<Divider light />)}
          </div>
        ))}
      </List>
      {!campaignData.loading && campaignData.payload.length === 0 && (
        <Grid container justify="center" alignItems="center" direction="column" style={{ marginTop: 40 }}>
          <Typography variant="body1">생성된 캠페인이 없습니다.</Typography>
          <Typography variant="body1">새로운 캠페인을 생성해 광고를 진행하세요.</Typography>
        </Grid>
      )}

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snack.open}
        autoHideDuration={400}
        onClose={() => {
          snack.handleClose();
        }}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        variant="success"
        message={<Typography id="message-id">성공적으로 반영되었습니다.</Typography>}
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            className={classes.close}
            onClick={snack.handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />

      {/* 캠페인 분석 다이얼로그 (full screen) */}
      {selectedCampaign && (
      <CampaignAnalysisDialog
        SLIDE_TIMEOUT={SLIDE_TIMEOUT} // 슬라이드 트랜지션 타임아웃
        open={campaignReportDialog.open}
        selectedCampaign={selectedCampaign}
        handleClose={() => {
          campaignReportDialog.handleClose();
          setTimeout(() => {
            setSelectedCampaign(null);
            // 트랜지션 만큼 뒤에 실행. (먼저 실행하면 트랜지션 발동 안됨)
          }, SLIDE_TIMEOUT);
        }}
      />
      )}

      {/* 캠페인 업데이트 다이얼로그 */}
      {selectedCampaign && (
      <CampaignUpdateDialog
        open={campaignUpdateDialog.open}
        selectedCampaign={selectedCampaign}
        callUrl={campaignData.callUrl}
        handleClose={() => {
          campaignUpdateDialog.handleClose();
        }}
      />
      )}

      {/* 캠페인 삭제 클릭시 다이얼로그 */}
      <CampaignDeleteConfirmDialog
        open={campaignDeleteDialog.open}
        handleClose={() => {
          campaignDeleteDialog.handleClose();
          setSelectedCampaign(null);
        }}
        handleDelete={handleDelete}
      />
    </Paper>
  );
}
