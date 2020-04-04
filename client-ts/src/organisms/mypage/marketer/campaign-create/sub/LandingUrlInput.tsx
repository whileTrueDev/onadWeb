import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid, List, ListItem, ListItemText,
  ListItemSecondaryAction, Typography
} from '@material-ui/core';

import GreenCheckbox from '../../../../../atoms/GreenCheckBox';
import StyledItemText from '../../../../../atoms/StyledItemText';
import Button from '../../../../../atoms/CustomButtons/Button';
import { Step3Interface, Action } from '../campaignReducer';
import { LandingUrlData } from '../interfaces';

import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';

const useStyle = makeStyles((theme: Theme) => ({
  input: {
    fontSize: '14px',
    fontWeight: 700,
    color: theme.palette.text.primary,
    margin: '4px'
  },
  inputName: {
    fontSize: '14px',
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
  label: {
    fontSize: '20px',
    fontWeight: 700,
    color: theme.palette.primary.light,
    margin: '3px',
  },
  landinglist: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: theme.palette.background.paper,
    maxHeight: 300,
    overflow: 'auto',
  },
}));

interface LandingUrlInputProps {
  handleDialogOpen: () => void;
  dispatch: React.Dispatch<Action>;
  state: Step3Interface;
  landingUrlData: UseGetRequestObject<LandingUrlData[]>;
}

const LandingUrlInput = (props: LandingUrlInputProps): JSX.Element => {
  const {
    handleDialogOpen, dispatch, state, landingUrlData
  } = props;
  const classes = useStyle();
  const [checked, setChecked] = React.useState(0);
  const handleToggle = (value: number) => (): void => {
    setChecked(value);
  };


  const handleUrlName = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): boolean => {
    switch (event.target.id) {
      case 'main-url-name':
      {
        dispatch({ key: 'mainLandingUrlName', value: event.target.value.replace(/ /gi, '') });
        return false;
      }
      case 'sub-url1-name':
      {
        dispatch({ key: 'sub1LandingUrlName', value: event.target.value.replace(/ /gi, '') });
        return false;
      }
      case 'sub-url2-name':
      {
        dispatch({ key: 'sub2LandingUrlName', value: event.target.value.replace(/ /gi, '') });
        return false;
      }
      default:
      { return false; }
    }
  };

  const handleUrlChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): boolean => {
    switch (event.target.id) {
      case 'main-url':
      {
        dispatch({ key: 'mainLandingUrl', value: event.target.value.replace(/ /gi, '') });
        return false;
      }
      case 'sub-url1':
      {
        dispatch({ key: 'sub1LandingUrl', value: event.target.value.replace(/ /gi, '') });
        return false;
      }
      case 'sub-url2':
      {
        dispatch({ key: 'sub2LandingUrl', value: event.target.value.replace(/ /gi, '') });
        return false;
      }
      default:
      { return false; }
    }
  };


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
          {landingUrlData.data.filter(
            (l) => l.confirmState === 1
          ).sort((a, b) => b.regiDate.localeCompare(a.regiDate)).map((ll, index) => (
            <ListItem
              key={ll.linkId}
              button
              selected={checked === index}
              onClick={handleToggle(index)}
            >
              <ListItemText
                primary={(
                  <>
                    <Typography variant="body1">{ll.links.links.find((link) => link.primary)?.linkTo}</Typography>
                    <Typography variant="body2">{ll.links.links.filter((link) => !link.primary)?.map((lll) => lll.linkTo)}</Typography>
                  </>
                )}
                secondary={`등록일: ${ll.regiDate}`}
              />
              <ListItemSecondaryAction>
                <GreenCheckbox
                  edge="end"
                  onChange={handleToggle(index)}
                  checked={index === checked}
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
};

/**
 * @description
 해당 캠페인의 landingUrl을 변경하기 위한 컴포넌트

 * @param {*} state ? landingUrl을 저장하기 위한 object
 * @param {*} dispatch ? landingUrl을 변경하는 func
 * @param {*} handleDialogOpen ? landingUrl을 기존에 저장되어있는 URL을 선택하기 위한 state
 * @param {*} classes ? style

 * @author 박찬우
 */


export default LandingUrlInput;
