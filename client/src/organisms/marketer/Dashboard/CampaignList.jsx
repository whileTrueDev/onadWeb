import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Grid, Paper, Divider, Button,
  Avatar, Typography, IconButton,
  ListItem, List, Grow, FormControlLabel,
  Switch, Snackbar
} from '@material-ui/core';
import { Assessment, Delete as DeleteIcon, Build } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import IOSSwitch from '../../../atoms/Switch/IOSSwitch';

import CampaignCreateDialog from './campaign/CampaignCreateDialog';
import CampaignDeleteConfirmDialog from './campaign/CampaignDeleteConfirmDialog';
import useUpdateData from '../../../utils/lib/hooks/useUpdateData';
import useDialog from '../../../utils/lib/hooks/useDialog';
import useDeleteData from '../../../utils/lib/hooks/useDeleteData';
import useAnchorEl from '../../../utils/lib/hooks/useAnchorEl';
import CampaignPopover from './campaign/CampaignPopover';
import CampaignAnalysisDialog from './report/CampaignReportDialog';

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
    backgroundColor: theme.palette.grey[100],
    [theme.breakpoints.only('lg')]: {
      width: 72,
      height: 72
    }
  },
  img: {
    width: 240,
    height: 120,
    // marginRight: theme.spacing(3),
    margin: 'auto',
    // display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

export default function CampaignList(props) {
  const classes = useStyles();
  const { campaignData } = props;

  const optionTypeList = ['배너 광고', '배너 + 클릭 광고', '클릭 광고'];
  const priorityTypeList = ['크리에이터 우선', '카테고리 우선', '노출 우선'];

  // For campaign On/ Off
  const { handleUpdateRequest } = useUpdateData(
    '/api/dashboard/marketer/campaign/onoff',
    campaignData.callUrl
  );

  // For reaction to on/off completed
  const snack = useDialog();

  // To open campaign create dialog
  const campaignCreateDialog = useDialog();

  // To open campaign Menu
  const campaignMenuAnchor = useAnchorEl();

  // 선택된 캠페인이 무엇인지
  const [selectedCampaign, setSelectedCampaign] = React.useState(null);

  // To delete campaigns
  const campaignDeleteDialog = useDialog();
  const { handleDelete } = useDeleteData('/api/dashboard/marketer/campaign');

  // For Campaign analysis
  const CampaignReportDialog = useDialog();

  return (
    <Paper style={{ minHeight: 220 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
        <Typography variant="h6">
          캠페인 목록
        </Typography>
        <Button variant="contained" color="primary" onClick={campaignCreateDialog.handleOpen}>
          캠페인 등록하기
        </Button>
      </div>

      <Divider />
      {!campaignData.loading && campaignData.payload && (
        <List style={{ maxHeight: 380, overflowY: 'auto' }}>
          {campaignData.payload.map((detail, index) => (
            <div>
              <ListItem
                className={classes.list}
              >
                <Grid container direction="row" justify="space-between">
                  <Grid item>
                    <Grid container direction="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} spacing={3}>
                      <Grid item>
                        <FormControlLabel
                          control={(
                            <IOSSwitch
                              id="onoff-switch"
                              checked={Boolean(detail.onOff)}
                              onChange={async () => {
                              // update 요청
                                await handleUpdateRequest({
                                  onoffState: !detail.onOff,
                                  campaignId: detail.campaignId
                                });
                                snack.handleOpen();
                              }}
                            />
                          )}
                          label={detail.onOff ? (<div style={{ color: '#52d869', fontWeight: 700 }}>활성화</div>) : (<div>비활성화</div>)}
                          labelPlacement="bottom"
                        />
                      </Grid>
                      <Grid item>
                        <img className={classes.img} alt="campaign-logo" src={detail.bannerSrc} />
                      </Grid>
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
                    </Grid>
                  </Grid>
                  <Grid item>
                    <List>
                      <ListItem
                        button
                        onClick={() => {
                          setSelectedCampaign(detail);
                          CampaignReportDialog.handleOpen();
                        }}
                      >
                        <Assessment />
                        <Typography>분석</Typography>
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => {
                          campaignDeleteDialog.handleOpen(detail.campaignId);
                        }}
                      >
                        <Build color="action" />
                        <Typography color="action">수정</Typography>
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
                </Grid>
              </ListItem>
              {!(campaignData.payload.length - 1 === index) && (<Divider light />)}
            </div>
          ))}
        </List>
      )}
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
        autoHideDuration={2000}
        onClose={snack.handleClose}
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

      {/* 캠페인 생성 클릭시 다이얼로그 */}
      <CampaignCreateDialog
        open={campaignCreateDialog.open}
        handleClose={campaignCreateDialog.handleClose}
      />

      {/* 캠페인 분석 다이얼로그 (full screen) */}
      {selectedCampaign && (
      <CampaignAnalysisDialog
        SLIDE_TIMEOUT={SLIDE_TIMEOUT} // 슬라이드 트랜지션 타임아웃
        open={CampaignReportDialog.open}
        selectedCampaign={selectedCampaign}
        handleClose={() => {
          CampaignReportDialog.handleClose();
          setTimeout(() => {
            setSelectedCampaign(null);
            // 트랜지션 만큼 뒤에 실행. (먼저 실행하면 트랜지션 발동 안됨)
          }, SLIDE_TIMEOUT);
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
