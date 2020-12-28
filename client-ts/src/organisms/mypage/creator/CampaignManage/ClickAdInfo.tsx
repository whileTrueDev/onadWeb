import classnames from 'classnames';
import {
  Divider,
  Hidden,
  Input, makeStyles, Paper, Popover, Typography
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import React from 'react';
import { useAnchorEl } from '../../../../utils/hooks';

const useStyles = makeStyles((theme) => ({
  bold: { fontWeight: theme.typography.fontWeightBold },
  highlight: { color: theme.palette.primary.main },
  container: {
    height: 200,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      height: 125,
    }
  },
  overlayUrl: { marginTop: theme.spacing(4), textAlign: 'center' },
  overlayUrlInput: { color: theme.palette.primary.main, },
  popover: { maxWidth: 450 },
  popoverContents: { padding: theme.spacing(4), },
  popoverimg: { height: 350, maxWidth: '100%' },
  alignCenter: { textAlign: 'center' },
  divider: { marginTop: theme.spacing(3), marginBottom: theme.spacing(3), }
}));

export interface ClickAdInfoProps {
  creatorUrl: string;
}
export default function ClickAdInfo({
  creatorUrl,
}: ClickAdInfoProps): JSX.Element {
  const classes = useStyles();
  const descAnchor = useAnchorEl();
  return (
    <Paper className={classes.container}>
      <div style={{ height: '100%' }}>
        <Typography className={classes.bold}>
          내 클릭광고 링크
          <Hidden smDown>
            <Typography
              aria-owns={descAnchor.open ? 'mouse-over-popover' : undefined}
              component="span"
              aria-haspopup="true"
              style={{ cursor: 'pointer' }}
              onClick={descAnchor.handleAnchorOpen}
            >
              <HelpIcon fontSize="small" />
            </Typography>
          </Hidden>

        </Typography>
        <Typography variant="caption" color="textSecondary">
          이 링크 클릭으로  수익이 창출됩니다.
        </Typography>
        <Input
          className={classes.overlayUrl}
          fullWidth
          id="ad-page-url"
          value={creatorUrl || '이용동의가 필요합니다.'}
          disabled={!creatorUrl}
          inputProps={{
            readOnly: true,
            className: creatorUrl
              ? classes.overlayUrlInput : undefined
          }}
        />
      </div>
      {descAnchor.open && (
        <Popover
          disableScrollLock
          className={classes.popover}
          id="mouse-over-popover"
          open={descAnchor.open}
          anchorEl={descAnchor.anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={descAnchor.handleAnchorClose}
          disableRestoreFocus
        >
          <div className={classes.popoverContents}>
            <img
              src="/pngs/dashboard/clickad_panel_example.png"
              alt="panel_example"
              className={classes.popoverimg}
            />
            <Typography variant="body2">
              내 클릭광고 링크는 고유하게 부여된 클릭 가능한 링크입니다.
              시청자가 이 링크를 클릭하면, 현재 방송화면에 송출되고 있는 광고의 페이지로 바로 이동하게 됩니다.
            </Typography>
            <br />
            <Typography variant="body2">
              시청자의 이동은 추적되어 기록되며,
              {' '}
              <span className={classnames(classes.bold, classes.highlight)}>
                시청자의 이동 수
              </span>
              {' '}
              에 따라
              {' '}
              <span className={classnames(classes.bold, classes.highlight)}>
                광고 수익이 창출
              </span>
              됩니다.
            </Typography>
            <Typography variant="body2">
              자신의 채널 하단 또는 방송국 등 어디든 삽입할 수 있습니다.
            </Typography>

            <Divider className={classes.divider} />
            <div>
              <Typography variant="body1" className={classes.bold}>
                기본 이미지
                {' '}
                <Typography variant="caption" color="textSecondary">
                  (사용할 이미지가 없으시면 사용해주세요.)
                </Typography>
              </Typography>
            </div>
            <br />
            <div>
              <a href="/pngs/landing/온애드패널바로가기.png" download="onad_panel_banner_default">
                <img src="/pngs/landing/온애드패널바로가기.png" alt="패널기본배너1" />
              </a>
              <Typography variant="body2" color="textSecondary">
                이미지 클릭시 다운로드 됩니다.
              </Typography>
            </div>
          </div>

        </Popover>
      )}
    </Paper>
  );
}
