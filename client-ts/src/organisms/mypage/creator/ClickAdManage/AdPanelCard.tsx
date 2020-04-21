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
            패널 광고 설정 (추후 추가 예정)
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
          <Alert>
            <Typography variant="body2">
              전달 사항
            </Typography>
            <Typography variant="caption">
              1. 4월 21일 이후 패널 광고를 사용할 수 있습니다.
              <br />
            </Typography>
            <Typography variant="caption">
              2. 기존 트위치 채널 패널에 &quot;광고페이지&quot;를 설정을 하셨다면 링크 주소를 바꿀 필요 없이 자동으로 변경 사항이 적용됩니다.
              즉, 기존 크리에이터 광고페이지 주소는 4월 21일 이후 패널 광고의 주소로 사용됩니다.
              <br />
            </Typography>
            <Typography variant="caption">
              3. 기존의 &quot;광고페이지&quot;는 &quot;참여형 광고페이지(CPA)&quot;로 변경되어 운영될 예정입니다.
              5월 중으로 &quot;참여형 광고페이지&quot;라는 이름으로 새로운 주소를 발급해드릴 예정이며
              해당 주소로 패널을 추가 설정하면 추가적인 광고 수익을 창출할 수 있습니다.
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
