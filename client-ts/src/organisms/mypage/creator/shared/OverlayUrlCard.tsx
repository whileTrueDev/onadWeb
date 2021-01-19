import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Input, Paper, Typography, Button
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: { marginRight: theme.spacing(1), fontWeight: 'bold' },
  textField: {
    maxWidth: 200,
    marginRight: theme.spacing(2),
    fontSize: theme.typography.body2.fontSize
  },
  line: { alignItems: 'center' },
}));

export interface OverlayUrlRes {
  advertiseUrl: string;
  creatorContractionAgreement: number;
}

interface UrlCardProps {
  overlayUrlData: OverlayUrlRes;
  handleSnackOpen: () => void;
  helperText?: string;
}
function UrlCard({
  overlayUrlData,
  handleSnackOpen,
  helperText = '이용 동의가 필요합니다.'
}: UrlCardProps): JSX.Element {
  const classes = useStyles();

  // 오버레이 주소 10초간만 보여주기 위한 기본값
  const DEFAULT_OVERLAY_URL = '[URL복사] 버튼을 눌러주세요.';
  const [overlayUrlValue, setOverlayUrlValue] = useState<string>(DEFAULT_OVERLAY_URL);

  // 10초간 overlayUrl을 보여주는 함수
  const handleShowOverlayUrl = (): void => {
    setOverlayUrlValue(overlayUrlData.advertiseUrl);

    // 클립보드 복사
    navigator.clipboard.writeText(overlayUrlData.advertiseUrl);

    // 스낵바 오픈
    handleSnackOpen();

    setTimeout(() => {
      setOverlayUrlValue(DEFAULT_OVERLAY_URL);
    }, 8 * 1000);
  };

  return (
    <Paper className={classes.container}>
      <Typography className={classes.title}>배너 오버레이 URL</Typography>
      <Input
        className={classes.textField}
        id="overlayUrl"
        value={overlayUrlData.creatorContractionAgreement
          ? overlayUrlValue : helperText}
        readOnly
        fullWidth
        disabled={!overlayUrlValue}
      />

      <div>
        <Button
          color="primary"
          variant="contained"
          disabled={!overlayUrlData.creatorContractionAgreement}
          onClick={(): void => {
            if (!(overlayUrlData.advertiseUrl === overlayUrlValue)) {
              handleShowOverlayUrl();
            }
          }}
        >
          URL복사
        </Button>
      </div>
    </Paper>
  );
}

export default UrlCard;
