import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid } from '@material-ui/core';
import { RemoveRedEyeOutlined, InsertLinkOutlined, Fingerprint } from '@material-ui/icons';
// components
import CustomCard from '../../../../atoms/CustomCard';
import StyledItemText from '../../../../atoms/StyledItemText';
import StyledInput from '../../../../atoms/StyledInput';
import Button from '../../../../atoms/CustomButtons/Button';

const useStyles = makeStyles((theme) => ({
  urlSection: { padding: theme.spacing(2) },
  textField: { maxWidth: theme.breakpoints.width('lg') },
  line: { alignItems: 'center' }
}));

export interface OverlayUrlRes {
  advertiseUrl: string;
  creatorContractionAgreement: number;
}

interface UrlCardProps {
  overlayUrlData: OverlayUrlRes;
  handleSnackOpen: () => void;
}
function UrlCard({
  overlayUrlData,
  handleSnackOpen
}: UrlCardProps): JSX.Element {
  const classes = useStyles();

  // 오버레이 주소 10초간만 보여주기 위한 기본값
  const DEFAULT_OVERLAY_URL = '주소보기 버튼을 누르세요!';
  const [overlayUrlValue, setOverlayUrlValue] = useState<string>(DEFAULT_OVERLAY_URL);

  // 10초간 overlayUrl을 보여주는 함수
  const handleShowOverlayUrl = (): void => {
    setOverlayUrlValue(overlayUrlData.advertiseUrl);

    setTimeout(() => {
      setOverlayUrlValue(DEFAULT_OVERLAY_URL);
    }, 8 * 1000);
  };

  // 클립보드에 카피 함수 get this from stackoverflow
  function copyToClipboard(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    const overlayUrl = document.getElementById('overlayUrl') as HTMLInputElement;
    if (overlayUrl) {
      overlayUrl.select();
      document.execCommand('copy');

      // 스낵바 오픈
      handleSnackOpen();
    }
  }

  return (
    <CustomCard iconComponent={<Fingerprint />}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <StyledItemText primary="배너 오버레이 URL" secondary="광고 송출용 URL을 보여줍니다. 방송 도구에 등록하세요." />
        </Grid>
        <Grid item>
          <div className={classes.urlSection}>
            <StyledInput
              className={classes.textField}
              id="overlayUrl"
              value={overlayUrlData.creatorContractionAgreement
                ? overlayUrlValue
                : '계약을 먼저 진행해주세요.'}
              readOnly
            />
            <Button
              color="secondary"
              onClick={!(overlayUrlData.advertiseUrl === overlayUrlValue)
                ? handleShowOverlayUrl
                : undefined}
              size="small"
            >
              <RemoveRedEyeOutlined />
              주소보기
            </Button>
            <Button
              disabled={!(overlayUrlData.advertiseUrl === overlayUrlValue)}
              onClick={copyToClipboard}
              size="small"
              color="primary"
            >
              <InsertLinkOutlined />
              복사
            </Button>
          </div>
        </Grid>
      </Grid>
    </CustomCard>
  );
}

export default UrlCard;
