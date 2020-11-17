import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Input, Paper, Typography
} from '@material-ui/core';
import { InsertLinkOutlined } from '@material-ui/icons';
// components
import Button from '../../../../atoms/CustomButtons/Button';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: { marginRight: theme.spacing(1), fontWeight: 'bold' },
  textField: { maxWidth: 300, marginRight: theme.spacing(2) },
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
  helperText = '[이용 동의 필요] 시작가이드를 활용해주세요.'
}: UrlCardProps): JSX.Element {
  const classes = useStyles();

  // 오버레이 주소 10초간만 보여주기 위한 기본값
  const DEFAULT_OVERLAY_URL = '';
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
          ? overlayUrlValue
          : helperText}
        readOnly
        fullWidth
        disabled={!overlayUrlValue}
      />

      <div>
        <Button
          color="primary"
          disabled={!overlayUrlData.creatorContractionAgreement}
          onClick={(): void => {
            if (!(overlayUrlData.advertiseUrl === overlayUrlValue)) {
              handleShowOverlayUrl();
            }
          }}
          size="small"
        >
          <InsertLinkOutlined />
          주소 복사
        </Button>
      </div>
    </Paper>
  );
}

export default UrlCard;
