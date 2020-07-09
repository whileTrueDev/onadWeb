import React from 'react';
import {
  Grid, CircularProgress
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import StyledItemText from '../../../../../atoms/StyledItemText';
import BannerCarousel from '../../../../../atoms/BannerCarousel';
import Button from '../../../../../atoms/CustomButtons/Button';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import { Action } from '../campaignReducer';
import useDialog from '../../../../../utils/hooks/useDialog';
import Inquire from '../../../../main/main/Inquiry/Inquiry';
import Dialog from '../../../../../atoms/Dialog/Dialog';


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    marginTop: '0px',
    alignItem: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  item: {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
      marginBottom: '30px',
      padding: 0,
    },
  },
  input: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      fontSize: '12px',
      margin: 0,
    },
  },
  label: {
    color: theme.palette.info.main,
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      marginBottom: '8px',
    },
  },
}));

interface SelectBannerProps {
  dispatch: React.Dispatch<Action>;
  handleDialogOpen: () => void;
  bannerData: UseGetRequestObject<{ bannerId: string; bannerSrc: string }[]>;
  step: number;
}

const SelectBanner = (props: SelectBannerProps): JSX.Element => {
  const {
    dispatch, handleDialogOpen, bannerData, step
  } = props;
  const classes = useStyles();
  const InquireDialog = useDialog();
  const handleBannerId = (bannerId: string): void => {
    dispatch({ key: 'bannerId', value: bannerId });
  };

  return (
    <Grid item>
      <Grid container direction="column" className={classes.item} spacing={1}>
        <Grid item>
          <StyledItemText
            primary="배너 선택하기"
            secondary="선택된 배너는 크리에이터의 방송화면에 송출됩니다."
            className={classes.label}
          />
        </Grid>
        <Grid item>
          {bannerData.loading && (
            <div style={{ padding: 72 }}>
              <CircularProgress size={100} disableShrink />
            </div>
          )}
          {!bannerData.loading && bannerData.data && bannerData.data.length > 0 ? (
            <BannerCarousel
              steps={bannerData.data}
              handleBannerId={handleBannerId}
              registStep={step}
            />
          ) : (null)}
        </Grid>
      </Grid>
      <StyledItemText>새로운 배너를 등록하고 싶으신가요?</StyledItemText>

      <Button
        onClick={(): void => { handleDialogOpen(); }}
        color="primary"
      >
        + 배너 등록하기
      </Button>
      <Button
        onClick={(): void => { InquireDialog.handleOpen(); }}
        color="primary"
      >
        배너가 없으신가요?
      </Button>
      <Dialog
        open={Boolean(InquireDialog.open)}
        onClose={InquireDialog.handleClose}
        fullWidth
        maxWidth="md"
        buttons={(
          <div>
            <Button onClick={InquireDialog.handleClose}>
              취소
            </Button>
          </div>
        )}
      >
        <Inquire confirmClose={InquireDialog.handleClose} />
      </Dialog>
    </Grid>
  );
};

/**
 * @description
 해당 캠페인의 배너를 저장하는 컴포넌트.

 * @param {*} dispatch ? bannerId를 변경하는 func
 * @param {*} handleDialogOpen ? 배너를 등록하는 Dialog를 띄우는 state
 * @param {*} bannerData ? server를 통해 fetch한 bannerList Data
 * @param {*} step ? 현재의 회원가입 진행상태, 다음 step으로 진행될 때, 선택된 옵션에 대한 렌더링을 위함.
 *
 * @author 박찬우
 */


export default SelectBanner;
