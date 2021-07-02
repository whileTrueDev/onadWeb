import { useSnackbar } from 'notistack';
import classnames from 'classnames';
import { CircularProgress, Input, makeStyles, Paper, Typography } from '@material-ui/core';
import { InsertLinkOutlined } from '@material-ui/icons';
import Button from '../../../../../atoms/CustomButtons/Button';
import copyToClipboard from '../../../../../utils/copyToClipboard';
import { useGetRequest } from '../../../../../utils/hooks';
import { useCreatorProfile } from '../../../../../utils/hooks/query/useCreatorProfile';

const useStyles = makeStyles(theme => ({
  bannerImg: {
    width: '100%',
    border: `1px solid ${theme.palette.divider}`,
  },
  horizontal: { maxWidth: 320 },
  vertical: { maxWidth: 80 },
}));

export default function SetClickAdSection(): JSX.Element {
  const classes = useStyles();
  const profile = useCreatorProfile();
  const { enqueueSnackbar } = useSnackbar();
  // Landing url
  const landingUrlGet = useGetRequest('/creator/landing-url', { type: 'twitch' });
  const afreecaLandingUrlGet = useGetRequest('/creator/landing-url', { type: 'afreeca' });

  return (
    <div>
      <div style={{ paddingTop: 16, textAlign: 'center' }}>
        <Typography>클릭광고는 온애드의 두번째 광고 수익 창출 방법입니다.</Typography>
        <Typography>클릭광고의 수익은 시청자의 클릭 및 실제 구매 수에 비례합니다.</Typography>

        <br />
        <Typography>클릭광고는 클릭할 수 있는 패널의 형태입니다.</Typography>
        <Typography style={{ fontWeight: 'bold' }}>
          아프리카TV의 경우 방송국 내 플로팅배너에, 트위치의 경우 방송화면 하단 패널에 설정합니다.
        </Typography>

        <br />
        <Typography>방송국/채널에 패널을 생성한 뒤,</Typography>
        <Typography>아래의 링크를 복사하여 해당 패널에 링크해 주세요.</Typography>

        {/* 트위치 클릭광고 주소 */}
        {profile.data?.creatorTwitchOriginalId && (
          <div style={{ margin: 32 }}>
            <Paper
              style={{
                padding: 16,
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography style={{ marginRight: 8, fontWeight: 'bold' }}>
                <img
                  alt=""
                  height={25}
                  src="/pngs/logo/twitch/TwitchGlitchPurple.png"
                  style={{ marginRight: 8 }}
                />
                트위치 클릭광고 URL
              </Typography>
              {landingUrlGet.loading && <CircularProgress />}
              {!landingUrlGet.loading && landingUrlGet.data && (
                <Input
                  style={{ maxWidth: 300, marginRight: 16 }}
                  id="ad-page-url"
                  value={
                    profile.data?.creatorContractionAgreement === 1
                      ? landingUrlGet.data.url
                      : '[온애드 이용 동의] 가 필요합니다.'
                  }
                  disabled={!profile.data?.creatorContractionAgreement}
                  readOnly
                  fullWidth
                />
              )}
              <div>
                <Button
                  color="primary"
                  onClick={(e): void => {
                    copyToClipboard(e, 'ad-page-url', () => {
                      // 스낵바 오픈
                      enqueueSnackbar(
                        '트위치 클릭광고 URL이 클립보드에 복사되었습니다. 방송도구에 등록해주세요',
                        {
                          variant: 'success',
                        },
                      );
                    });
                  }}
                  disabled={profile.data?.creatorContractionAgreement !== 1}
                  size="small"
                >
                  <InsertLinkOutlined />
                  주소 복사
                </Button>
              </div>
            </Paper>
          </div>
        )}

        {/* 아프리카 클릭광고 주소 */}
        {profile.data?.afreecaId && (
          <div style={{ margin: 32 }}>
            <Paper
              style={{
                padding: 16,
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography style={{ marginRight: 8, fontWeight: 'bold' }}>
                <img
                  alt=""
                  height={25}
                  src="/pngs/logo/afreeca/onlyFace.png"
                  style={{ marginRight: 8 }}
                />
                아프리카TV 클릭광고 URL
              </Typography>
              {afreecaLandingUrlGet.loading && <CircularProgress />}
              {!afreecaLandingUrlGet.loading && afreecaLandingUrlGet.data && (
                <Input
                  style={{ maxWidth: 300, marginRight: 16 }}
                  id="ad-page-afreeca-url"
                  value={
                    profile.data?.creatorContractionAgreement === 1
                      ? afreecaLandingUrlGet.data.url
                      : '[온애드 이용 동의] 가 필요합니다.'
                  }
                  disabled={!profile.data?.creatorContractionAgreement}
                  readOnly
                  fullWidth
                />
              )}
              <div>
                <Button
                  color="primary"
                  onClick={(e): void => {
                    copyToClipboard(e, 'ad-page-afreeca-url', () => {
                      enqueueSnackbar(
                        '아프리카 TV 클릭광고 URL이 클립보드에 복사되었습니다. 방송도구에 등록해주세요',
                        {
                          variant: 'success',
                        },
                      );
                    });
                  }}
                  size="small"
                >
                  <InsertLinkOutlined />
                  주소 복사
                </Button>
              </div>
            </Paper>
          </div>
        )}

        {(profile.data?.creatorTwitchOriginalId || profile.data?.afreecaId) && (
          <>
            <Typography>
              온애드에서는 기본으로 다음과 같은 패널 이미지를 제공해 드립니다.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              *이미지는 클릭시 곧바로 다운로드됩니다.
            </Typography>
            <div
              style={{
                margin: 32,
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {profile.data?.creatorTwitchOriginalId && (
                <>
                  <a href="/pngs/landing/트위치_패널배너.png" download="온애드_트위치_패널배너">
                    <img
                      src="/pngs/landing/트위치_패널배너.png"
                      alt="온애드_트위치_패널배너"
                      className={classnames(classes.bannerImg, classes.horizontal)}
                    />
                  </a>
                  <Typography variant="body2">트위치 패널에 등록하세요!</Typography>
                </>
              )}

              {profile.data?.afreecaId && (
                <>
                  <br />
                  <a
                    href="/pngs/landing/아프리카_플로팅배너.png"
                    download="온애드_아프리카_플로팅배너"
                  >
                    <img
                      src="/pngs/landing/아프리카_플로팅배너.png"
                      alt="온애드_아프리카_플로팅배너"
                      className={classnames(classes.bannerImg, classes.vertical)}
                    />
                  </a>
                  <Typography variant="body2">아프리카 방송국 플로팅 배너에 등록하세요!</Typography>

                  <br />
                  <a href="/pngs/landing/아프리카_하단배너.png" download="온애드_아프리카_하단배너">
                    <img
                      src="/pngs/landing/아프리카_하단배너.png"
                      alt="온애드_아프리카_하단배너"
                      className={classnames(classes.bannerImg, classes.horizontal)}
                    />
                  </a>
                  <Typography variant="body2">아프리카 방송국 하단 배너에 등록하세요!</Typography>
                </>
              )}
            </div>
            <Typography>제공받은 기본 이미지를 사용하지 않으셔도 됩니다.</Typography>
            <Typography>광고임을 나타내는 이미지라면 어떤것이든 괜찮습니다.</Typography>
          </>
        )}
      </div>
    </div>
  );
}
