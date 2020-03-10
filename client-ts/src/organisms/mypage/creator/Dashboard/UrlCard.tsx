import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid } from '@material-ui/core';
import { RemoveRedEyeOutlined, InsertLinkOutlined, Fingerprint } from '@material-ui/icons';
// components
import CustomCard from '../../../../atoms/CustomCard';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import StyledItemText from '../../../../atoms/StyledItemText';
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
import StyledInput from '../../../../atoms/StyledInput';
import Button from '../../../../atoms/CustomButtons/Button';
// utils
import useDialog from '../../../../utils/hooks/useDialog';

const useStyles = makeStyles((theme) => ({
  urlSection: { padding: theme.spacing(2) },
  textField: { width: '100%' },
  line: { alignItems: 'center' }
}));

interface OverlayUrlRes {
  advertiseUrl: string;
  creatorContractionAgreement: number;
}

const UrlCard = (): JSX.Element => {
  const classes = useStyles();
  const overlayUrlGet = useGetRequest<null, OverlayUrlRes>('/creator/banner/overlay');

  // 오버레이 주소 10초간만 보여주기 위한 기본값
  const DEFAULT_OVERLAY_URL = '주소보기 버튼을 누르세요!';
  const [overlayUrlValue, setOverlayUrlValue] = useState<string>(DEFAULT_OVERLAY_URL);

  // 10초간 overlayUrl을 보여주는 함수
  const handleShowOverlayUrl = (): void => {
    if (!overlayUrlGet.loading && overlayUrlGet.data) {
      setOverlayUrlValue(overlayUrlGet.data.advertiseUrl);

      setTimeout(() => {
        setOverlayUrlValue(DEFAULT_OVERLAY_URL);
      }, 8 * 1000);
    }
  };

  // 클립보드에 복사됨을 알릴 스낵바를 위한 hook
  const copySuccessSnack = useDialog();
  // 클립보드에 카피 함수 get this from stackoverflow
  function copyToClipboard(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    const overlayUrl = document.getElementById('overlayUrl') as HTMLInputElement;
    if (overlayUrl) {
      overlayUrl.select();
      document.execCommand('copy');

      // 스낵바 오픈
      copySuccessSnack.handleOpen();
    }
  }

  return (
    <CustomCard iconComponent={<Fingerprint />}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <StyledItemText primary="배너 오버레이 URL" secondary="광고 송출용 URL을 보여줍니다. 방송 도구에 등록하세요." />
        </Grid>
        <Grid item>
          { overlayUrlGet.loading && (<CircularProgress />)}
          { !overlayUrlGet.loading && overlayUrlGet.data && (
          <div className={classes.urlSection}>

            <Grid container direction="row" spacing={1} className={classes.line}>
              <Grid item xs={12} sm={8}>
                <StyledInput
                  className={classes.textField}
                  id="overlayUrl"
                  value={overlayUrlGet.data.creatorContractionAgreement
                    ? overlayUrlValue
                    : '계약을 먼저 진행해주세요.'}
                  readOnly
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <Button
                  disabled={!(overlayUrlGet.data.advertiseUrl === overlayUrlValue)}
                  onClick={copyToClipboard}
                  size="small"
                  color="primary"
                >
                  <InsertLinkOutlined />
                  복사
                </Button>
              </Grid>
              <Grid item xs={6} sm={2}>
                <Button
                  color="secondary"
                  onClick={!(overlayUrlGet.data.advertiseUrl === overlayUrlValue)
                    ? handleShowOverlayUrl
                    : undefined}
                  size="small"
                >
                  <RemoveRedEyeOutlined />
                  주소보기
                </Button>
              </Grid>

            </Grid>
          </div>
          )}
        </Grid>
      </Grid>

      <Snackbar
        color="success"
        message="클립보드에 복사되었어요! 방송도구에 등록해주세요"
        open={copySuccessSnack.open}
        onClose={copySuccessSnack.handleClose}
      />
    </CustomCard>
  );
};

export default UrlCard;
