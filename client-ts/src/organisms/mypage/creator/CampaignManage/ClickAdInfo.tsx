import classnames from 'classnames';
import {
  Button,
  Divider,
  Hidden,
  makeStyles,
  Paper,
  Popover,
  TextField,
  Typography,
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { Link } from 'react-router-dom';
import { useAnchorEl, useGetRequest } from '../../../../utils/hooks';
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';
import { ProfileDataType } from '../../../../utils/hooks/query/useCreatorProfile';

const useStyles = makeStyles(theme => ({
  bold: { fontWeight: theme.typography.fontWeightBold },
  highlight: { color: theme.palette.primary.main },
  container: {
    height: 200,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  overlayUrl: { marginTop: theme.spacing(2), textAlign: 'center' },
  overlayUrlInput: { color: theme.palette.primary.main },
  popoverContents: { padding: theme.spacing(4), maxWidth: 350, width: '100%' },
  popoverimg: { height: 350, maxWidth: '100%', textAlign: 'center' },
  alignCenter: { textAlign: 'center' },
  divider: { marginTop: theme.spacing(3), marginBottom: theme.spacing(3) },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  bannerImg: {
    width: '100%',
    border: `1px solid ${theme.palette.divider}`,
  },
  horizontal: { maxWidth: 320 },
  vertical: { maxWidth: 80 },
}));

export interface ClickAdInfoProps {
  profileData: UseGetRequestObject<ProfileDataType>;
}
export default function ClickAdInfo({ profileData }: ClickAdInfoProps): JSX.Element {
  const classes = useStyles();
  const descAnchor = useAnchorEl();

  // Landing url
  const landingUrlGet = useGetRequest('/creator/landing-url', { type: 'twitch' });
  // afreeca Landing url
  const afreecaLandingUrlGet = useGetRequest('/creator/landing-url', { type: 'afreeca' });

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
          이 링크 클릭으로 수익이 창출됩니다.
        </Typography>

        {landingUrlGet.loading || afreecaLandingUrlGet.loading ? (
          <CircularProgress />
        ) : (
          <div>
            {landingUrlGet.data && (
              <TextField
                label="트위치 링크"
                className={classes.overlayUrl}
                fullWidth
                id="ad-page-url"
                value={landingUrlGet.data ? landingUrlGet.data.url : ''}
                disabled={landingUrlGet.loading || !landingUrlGet.data}
                inputProps={{
                  readOnly: true,
                  className: landingUrlGet.data ? classes.overlayUrlInput : undefined,
                }}
              />
            )}
            {afreecaLandingUrlGet.data && (
              <TextField
                label="아프리카TV 링크"
                className={classes.overlayUrl}
                fullWidth
                id="ad-page-url"
                value={afreecaLandingUrlGet.data ? afreecaLandingUrlGet.data.url : ''}
                disabled={afreecaLandingUrlGet.loading || !afreecaLandingUrlGet.data}
                inputProps={{
                  readOnly: true,
                  className: afreecaLandingUrlGet.data ? classes.overlayUrlInput : undefined,
                }}
              />
            )}

            {!landingUrlGet.data && !afreecaLandingUrlGet.data && (
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <Typography variant="body2" color="textSecondary">
                  플랫폼 연동이 필요합니다!
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/mypage/creator/user"
                >
                  연동하러가기
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      {descAnchor.open && (
        <Popover
          disableScrollLock
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
            <div className={classes.imageContainer}>
              <img
                src="/pngs/dashboard/clickad_panel_example.png"
                alt="panel_example"
                className={classes.popoverimg}
              />
            </div>
            <Typography variant="body2">
              내 클릭광고 링크는 고유하게 부여된 클릭 가능한 링크입니다. 시청자가 이 링크를
              클릭하면, 현재 방송화면에 송출되고 있는 광고의 페이지로 바로 이동하게 됩니다.
            </Typography>
            <br />
            <Typography variant="body2">
              시청자의 이동은 추적되어 기록되며,{' '}
              <span className={classnames(classes.bold, classes.highlight)}>시청자의 이동 수</span>{' '}
              에 따라{' '}
              <span className={classnames(classes.bold, classes.highlight)}>광고 수익이 창출</span>
              됩니다.
            </Typography>
            <Typography variant="body2">
              자신의 채널 하단 또는 방송국 등 어디든 삽입할 수 있습니다.
            </Typography>

            <Divider className={classes.divider} />

            {!profileData.loading &&
              profileData.data &&
              (profileData.data.afreecaId || profileData.data.creatorTwitchOriginalId) && (
                <>
                  <div>
                    <Typography variant="body1" className={classes.bold}>
                      기본 이미지{' '}
                      <Typography variant="caption" color="textSecondary">
                        (사용할 이미지가 없으시면 사용해주세요.)
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      이미지 클릭시 다운로드 됩니다.
                    </Typography>
                  </div>
                  <br />
                  <div>
                    <div className={classes.imageContainer}>
                      {profileData.data.creatorTwitchOriginalId && (
                        <>
                          <a
                            href="/pngs/landing/트위치_패널배너.png"
                            download="온애드_트위치_패널배너"
                          >
                            <img
                              src="/pngs/landing/트위치_패널배너.png"
                              alt="온애드_트위치_패널배너"
                              className={classnames(classes.bannerImg, classes.horizontal)}
                            />
                          </a>
                          <Typography variant="body2">트위치 패널에 등록하세요!</Typography>
                        </>
                      )}

                      {profileData.data.afreecaId && (
                        <>
                          <br />
                          <a
                            href="/pngs/landing/아프리카_플로팅배너.png"
                            download="온애드_아프리카_플로팅"
                          >
                            <img
                              src="/pngs/landing/아프리카_플로팅배너.png"
                              alt="온애드_아프리카_플로팅"
                              className={classnames(classes.bannerImg, classes.vertical)}
                            />
                          </a>
                          <Typography variant="body2">
                            아프리카 방송국 플로팅 배너에 등록하세요!
                          </Typography>

                          <br />
                          <a
                            href="/pngs/landing/아프리카_하단배너.png"
                            download="온애드_아프리카_하단배너"
                          >
                            <img
                              src="/pngs/landing/아프리카_하단배너.png"
                              alt="온애드_아프리카_하단배너"
                              className={classnames(classes.bannerImg, classes.horizontal)}
                            />
                          </a>
                          <Typography variant="body2">
                            아프리카 방송국 하단 배너에 등록하세요!
                          </Typography>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
          </div>
        </Popover>
      )}
    </Paper>
  );
}
