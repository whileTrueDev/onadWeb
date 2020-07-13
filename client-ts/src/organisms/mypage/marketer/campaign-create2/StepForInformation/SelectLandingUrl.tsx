import React from 'react';
import {
  Grid, List, ListItem, ListItemText, ListItemIcon,
  ListItemSecondaryAction, Typography, Tooltip
} from '@material-ui/core';

import GreenCheckbox from '../../../../../atoms/GreenCheckBox';
import StyledItemText from '../../../../../atoms/StyledItemText';
import Button from '../../../../../atoms/CustomButtons/Button';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import {
  StepForInformationInterface, StepForInformationAction,
} from '../reducers/campaignCreate.reducer';
import { LandingUrlData } from '../interfaces';
import useStyles from './SelectLandingUrl.style';

interface SelectLandingUrlProps {
  handleDialogOpen: () => void;
  state: StepForInformationInterface;
  dispatch: React.Dispatch<StepForInformationAction>;
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

  return (
    <Grid container direction="column" spacing={3} style={{ marginBottom: 20 }}>
      <Grid item>
        <StyledItemText
          primary="랜딩페이지 URL 선택하기"
          secondary="선택된 URL링크는 패널, 채팅광고를 클릭시 이동될 링크입니다."
          className={classes.label}
        />
      </Grid>
      <Grid item>
        {!landingUrlData.loading && landingUrlData.data && (
        <List className={classes.landinglist}>
          {landingUrlData.data
            .filter((l) => l.confirmState !== 2) // 2는 거절된 url을 나타낸다.
            .sort((a, b) => b.regiDate.localeCompare(a.regiDate))
            .map((ll) => (
              <ListItem
                key={ll.linkId}
                button
                selected={ll.linkId === state.selectedLandingUrl}
                onClick={(): void => {
                  dispatch({ type: 'SET_LANDING_URL', value: ll.linkId });
                }}
              >
                {ll.confirmState === 0 && (
                <Tooltip title="승인 대기중인 URL">
                  <ListItemIcon>
                    <span style={{ fontSize: 24 }} role="img" aria-label="url-waiting-for-confirm">⏰</span>
                  </ListItemIcon>
                </Tooltip>
                )}
                {ll.confirmState === 1 && (
                <Tooltip title="승인된 URL">
                  <ListItemIcon>
                    <span style={{ fontSize: 24 }} role="img" aria-label="url-confirmed">👌</span>
                  </ListItemIcon>
                </Tooltip>
                )}
                <ListItemText
                  primary={(
                    <>
                      <Typography variant="body1">
                        {ll.links.links.find((link) => link.primary)?.linkName}
                        {' '}
                        {ll.links.links.find((link) => link.primary)?.linkTo}
                      </Typography>
                      <Typography variant="body2">
                        {ll.links.links.filter((link) => !link.primary)?.map((lll) => lll.linkName)}
                        {' '}
                        {ll.links.links.filter((link) => !link.primary)?.map((lll) => lll.linkTo)}
                      </Typography>
                    </>
                )}
                  secondary={`등록일: ${ll.regiDate}`}
                />
                <ListItemSecondaryAction>
                  <GreenCheckbox
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
