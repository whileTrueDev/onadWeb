import {
  Divider,
  Hidden,
  IconButton,
  Input, Paper, Popover, Popper, Typography
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useAnchorEl } from '../../../../utils/hooks';

export default function PanelInfo(): JSX.Element {
  const descAnchor = useAnchorEl();
  return (
    <>
      <Paper style={{
        height: 200, padding: 32, marginBottom: 16,
      }}
      >
        <div style={{ height: '100%' }}>
          <Typography style={{ fontWeight: 'bold' }}>
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
          <div style={{ marginTop: 16 }}>
            <Input
              style={{ color: 'red' }}
              fullWidth
              id="ad-page-url"
              value="https://t.onad.io/iamsupermazinga"
              disabled
              inputProps={{ readOnly: true, style: { cursor: 'pointer' } }}
            />
          </div>
        </div>
        {descAnchor.open && (
        <Popover
          disableScrollLock
          style={{ maxWidth: 400 }}
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
          <div style={{ padding: 32, textAlign: 'center' }}>
            <img
              src="/pngs/dashboard/clickad_panel_example.png"
              alt="panel_example"
              style={{ height: 350, maxWidth: '100%' }}
            />
            <Typography variant="body2">
              내 클릭광고 링크는 고유하게 부여된 클릭 가능한 링크입니다.
              시청자가 이 링크를 클릭하면, 현재 방송화면에 송출되고 있는 광고의 페이지로 바로 이동하게 됩니다.
            </Typography>
            <Typography variant="body2">
              시청자의 이동은 추적되어 기록되며, 시청자의 이동 수에 따라 광고 수익이 창출됩니다.
            </Typography>
            <Typography variant="body2">
              자신의 채널 하단 또는 방송국 등 어디든 삽입할 수 있습니다.
            </Typography>

            <Divider style={{ marginTop: 24, marginBottom: 24 }} />
            <div>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                기본 이미지
                {' '}
                <Typography variant="caption" color="textSecondary">
                  (사용할 이미지가 없으시면 사용해주세요.)
                </Typography>
              </Typography>
            </div>

            <div style={{ marginTop: 8 }}>
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
    </>
  );
}
