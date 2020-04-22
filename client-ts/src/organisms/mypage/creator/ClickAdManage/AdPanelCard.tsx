import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Divider, Tooltip } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Card from '../../../../atoms/Card/Card';
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

interface AdPanelCardProps {
  creatorUrl: string;
}
export default function AdPanelCard(props: AdPanelCardProps): JSX.Element {
  const { creatorUrl } = props;
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
          <div style={{ textAlign: 'center' }}>
            <img
              src="/pngs/dashboard/clickad_panel_example.png"
              alt="panel_example"
              style={{ maxWidth: '100%', height: 350 }}
            />
          </div>
          <Typography variant="body2">
            패널광고는 자신의 채널 하단의 패널에 삽입할 수 있는 배너 광고입니다.
          </Typography>
          <Typography variant="body2">
            시청자가 클릭시 현재 방송화면에 송출되고 있는 광고의 페이지로 바로 이동하게 됩니다.
          </Typography>
          <Typography variant="body2">
            시청자의 이동 수에 따라 광고 수익이 창출됩니다.
          </Typography>
          <br />
          <Alert severity="warning">
            <Typography variant="body2">
              전달 사항
            </Typography>
            <Typography variant="caption">
              기존 패널 링크
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>(https://l.onad.io/~)</span>
              는
              <span style={{ fontWeight: 'bold' }}>{` ${'2020년 5월 6일'}`}</span>
              이후로 광고주 페이지로 연결되지 않으니,
              <br />
            </Typography>
            <Typography variant="caption">
              해당 기간안에 광고 패널 주소를
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>(https://t.onad.io/~)</span>
              와 같이 꼭 변경해주시길 바랍니다.
              <br />
            </Typography>
          </Alert>
        </div>

        <Divider />

        <div className={classes.body}>
          <div style={{ marginBottom: 30 }}>
            <Typography variant="h6">
              패널 링크
            </Typography>
            <Tooltip title="클릭시 클립보드에 복사됩니다.">
              <div>
                <StyledInput
                  className={classes.site}
                  id="ad-page-url"
                  value={creatorUrl}
                  inputProps={{ readOnly: true, style: { cursor: 'pointer' } }}
                  onClick={(e): void => {
                    copyToClipboard(e, 'ad-page-url', () => {
                      snack.handleOpen();
                    });
                  }}
                />
              </div>
            </Tooltip>
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
            <Tooltip title="클릭시 다운로드 됩니다.">
              <div>
                <a href="/pngs/landing/온애드패널바로가기.png" download="onad_panel_banner_default">
                  <img src="/pngs/landing/온애드패널바로가기.png" alt="패널기본배너1" className={classes.image} />
                </a>
              </div>
            </Tooltip>
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
