import React, { useState } from 'react';
import moment from 'moment';
import {
  Grid, List, ListItem, ListItemText, ListItemIcon,
  ListItemSecondaryAction, Typography, Tooltip, Link
} from '@material-ui/core';

import { Check, HourglassEmpty, OpenInNew } from '@material-ui/icons';
import GreenRadio from '../../../../../atoms/Radio/GreenRadio';
import StyledItemText from '../../../../../atoms/StyledItemText';
import Button from '../../../../../atoms/CustomButtons/Button';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import {
  CampaignCreateInterface, CampaignCreateAction,
} from '../reducers/campaignCreate.reducer';
import { LandingUrlData } from '../interfaces';
import useStyles from './SelectLandingUrl.style';

interface SelectLandingUrlProps {
  handleDialogOpen: () => void;
  state: CampaignCreateInterface;
  dispatch: React.Dispatch<CampaignCreateAction>;
  landingUrlData: UseGetRequestObject<LandingUrlData[]>;
}
/**
 * @description
 해당 캠페인의 landingUrl을 변경하기 위한 컴포넌트

 * @param {*} state ? landingUrl을 저장하기 위한 object
 * @param {*} dispatch ? landingUrl을 변경하는 func
 * @param {*} handleDialogOpen ? landingUrl을 기존에 저장되어있는 URL을 선택하기 위한 state
 * @param {*} classes ? style

 * @author 박찬우
 */
function SelectLandingUrl(props: SelectLandingUrlProps): JSX.Element {
  const {
    handleDialogOpen, dispatch, state, landingUrlData
  } = props;
  const classes = useStyles();

  const [selectedLandingUrlLinkTo, setSelectedLandingUrlLinkTo] = useState<string>();

  return (
    <Grid container direction="column" spacing={3} style={{ marginBottom: 20 }}>
      <Grid item>
        <StyledItemText
          primary="랜딩페이지 URL 선택하기"
          secondary={(
            <Typography variant="body2" color="textSecondary">
              선택된 URL링크는 패널, 채팅광고를 클릭시 이동될 링크입니다.
            </Typography>
          )}
          className={classes.label}
        />
      </Grid>

      {/* 선택된 링크 full주소 보여주기 위해 */}
      {selectedLandingUrlLinkTo && (
      <Grid item className={classes.selectedLanding}>
        <Typography variant="body2">
          선택된 링크 주소
          <OpenInNew className={classes.selectedLandingIcon} />
        </Typography>
        <Typography
          style={{ cursor: 'pointer' }}
          color="primary"
          onClick={(): void => { window.open(selectedLandingUrlLinkTo, '_blank'); }}
          variant="body2"
        >
          {selectedLandingUrlLinkTo}
        </Typography>
      </Grid>
      )}

      <Grid item>
        {!landingUrlData.loading && landingUrlData.data && (
          <List className={classes.landinglist}>
            {landingUrlData.data
              .filter((l) => l.confirmState !== 2) // 2는 거절된 url을 나타낸다.
              .map((ll) => (
                <ListItem
                  key={ll.linkId}
                  button
                  selected={ll.linkId === state.selectedLandingUrl}
                  onClick={(): void => {
                    setSelectedLandingUrlLinkTo(
                      ll.links.links.find((link) => link.primary)?.linkTo
                    );
                    dispatch({ type: 'SET_LANDING_URL', value: ll.linkId });
                  }}
                >
                  {ll.confirmState === 0 && (
                  <Tooltip title="승인 대기중인 URL">
                    <ListItemIcon>
                      <HourglassEmpty color="secondary" />
                    </ListItemIcon>
                  </Tooltip>
                  )}
                  {ll.confirmState === 1 && (
                  <Tooltip title="승인된 URL">
                    <ListItemIcon>
                      <Check color="primary" />
                    </ListItemIcon>
                  </Tooltip>
                  )}
                  <ListItemText
                    primary={(
                      <>
                        <Typography variant="body1" noWrap>
                          {ll.links.links.find((link) => link.primary)?.linkName}
                          {' '}
                          {ll.links.links.find((link) => link.primary)?.linkTo}
                        </Typography>
                        <Typography variant="body2" noWrap>
                          {ll.links.links.filter((link) => !link.primary)?.map((lll) => lll.linkName)}
                          {' '}
                          {ll.links.links.filter((link) => !link.primary)?.map((lll) => lll.linkTo)}
                        </Typography>
                      </>
                  )}
                    secondary={`등록일: ${moment(ll.regiDate).format('YYYY년 MM월 DD일 HH:mm:ss')}`}
                  />
                  <ListItemSecondaryAction>
                    <GreenRadio
                      edge="end"
                      checked={ll.linkId === state.selectedLandingUrl}
                      onChange={(): void => {
                        dispatch({ type: 'SET_LANDING_URL', value: ll.linkId });
                      }}
                      inputProps={{ 'aria-labelledby': ll.linkId }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
        )}
      </Grid>

      <Grid item>
        <StyledItemText>새로운 URL을 등록하고 싶으신가요?</StyledItemText>
        {/* url 등록 다이얼로그로 변경 */}
        <Button onClick={handleDialogOpen} color="primary">
          + URL 등록하기
        </Button>
      </Grid>
    </Grid>
  );
}

export default SelectLandingUrl;
