import React from 'react';
import classnames from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography, Divider } from '@material-ui/core';
import InsertLinkOutlined from '@material-ui/icons/InsertLinkOutlined';
import Card from '../../../../atoms/Card/Card';
import Button from '../../../../atoms/CustomButtons/Button';
import StyledInput from '../../../../atoms/StyledInput';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
import copyToClipboard from '../../../../utils/copyToClipboard';
import useDialog from '../../../../utils/hooks/useDialog';

const useStyles = makeStyles((theme) => ({
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2)
  },
  body: { padding: theme.spacing(2) },
  emphasizedText: {
    color: theme.palette.secondary.main, fontWeight: theme.typography.fontWeightBold
  },
  site: {
    color: theme.palette.primary.main,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  flex: { display: 'flex', },
  images: { flexDirection: 'column', },
  image: { width: '100%', maxWidth: 320, },
}));

export default function AdPanelCard(): JSX.Element {
  const classes = useStyles();
  const snack = useDialog(); // 복사 성공 snackbar state

  return (
    <>
      <Card>
        <div className={classes.head}>
          <Typography variant="h6">
            패널 광고 설정
            {' '}
          </Typography>
        </div>

        <Divider />

        <div className={classes.body}>
          <img
            src="/pngs/dashboard/clickad_panel_example.png"
            alt="panel_example"
            style={{ maxWidth: '100%', height: 350 }}
          />
          <div style={{ textAlign: 'center' }} />
          <Typography variant="body2">
            패널광고는 자신의 채널 하단의 패널에 삽입할 수 있는 배너 광고입니다.
          </Typography>
          <Typography variant="body2">
            클릭시 현재 방송화면에 송출되고 있는 광고의 링크로 바로 이동하게 됩니다.
          </Typography>
          <Typography variant="body2">
            시청자가 해당 광고 패널을 클릭하면 클릭당 광고 수익금을 창출할 수 있습니다.
          </Typography>
          <Typography variant="caption">
            (기존의 광고페이지는 더이상 사용되지 않습니다.)
          </Typography>
        </div>

        <Divider />

        <div className={classes.body}>
          <div style={{ marginBottom: 30 }}>
            <Typography variant="h6">
              광고페이지 링크
            </Typography>
            <div>
              <StyledInput
                className={classes.site}
                style={{ cursor: 'default' }}
                id="ad-page-url"
                value="https://l.onad.io/크리에이터아이디"
                inputProps={{ readOnly: true }}
              />
              <Button
                onClick={(e): void => {
                  copyToClipboard(e, 'ad-page-url', () => {
                    snack.handleOpen();
                  });
                }}
                size="small"
              >
                <InsertLinkOutlined />
                복사
              </Button>
            </div>
          </div>

          <div className={classes.flex}>
            <Typography variant="h6">
              기본 이미지
              {' '}
              <Typography variant="caption">
                (사용할 이미지가 없으시면 사용해주세요.)
              </Typography>
            </Typography>
          </div>

          <div className={classnames(classes.flex, classes.images)}>
            <div>
              <a href="/pngs/landing/onad_panel_banner_default.png" download="onad_panel_banner_default">
                <img src="/pngs/landing/onad_panel_banner_default.png" alt="패널기본배너1" className={classes.image} />
              </a>
            </div>
          </div>
        </div>
      </Card>

      <Snackbar
        color="success"
        message="클립보드에 복사되었어요!"
        open={snack.open}
        onClose={snack.handleClose}
      />
    </>
  );
}
