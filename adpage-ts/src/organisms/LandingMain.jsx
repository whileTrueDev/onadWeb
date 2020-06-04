import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  isBrowser, isTablet, isSmartTV, isMobile,
  osName, osVersion, mobileModel, mobileVendor
} from 'mobile-device-detect';
import Grid from '@material-ui/core/Grid';

// sub components
import LandingHero from './Landing/LandingHero';
import LandingImagesLoading from './Landing/LandingImagesLoading';
import LandingImages from './Landing/LandingImages';
import LandingNoAd from './Landing/LandingNoAd';
import LandingHeroLoading from './Landing/LandingHeroLoading';
// from my own hooks
import useFetchData from '../utils/lib/hook/useDataFetch';
import usePostData from '../utils/lib/hook/usePostData';
import apiHOST from '../config/host';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('lg')]: {
      backgroundImage: 'url(\'/images/background-whale.jpg\')',
    },
  },
  container: {
    backgroundColor: theme.palette.background.paper,
    margin: '0 auto 0px',
    padding: '40px 20px',
    minHeight: '80vh',
    [theme.breakpoints.up('lg')]: {
      marginBottom: theme.spacing(20),
      marginTop: theme.spacing(20),
    },
    [theme.breakpoints.down('md')]: {
      minHeight: '100vh',
      marginTop: theme.spacing(5),
      padding: theme.spacing(1),
    },
  },
  belt: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: 'auto',
    alignItems: 'center',
    flexDirection: 'column',
    color: 'white',
    fontColor: '#fff'
  }
}));

const LandingMain = (props) => {
  const classes = useStyles();
  const {
    match, isDesktopWidth, userData
  } = props;

  // title 설정
  document.title = `${userData.creatorName} - 온애드`;

  const getScreen = () => {
    if (isTablet || isMobile) {
      return '1';
    }
    if (isBrowser) {
      return '3';
    }
    if (isSmartTV) {
      return '4';
    }
    return '5';
  };
  const getOsIndex = () => (osName === 'iOS' ? '2' : '3');

  const clickData = useFetchData('/cpapage/clicks', { name: match.params.name });
  const campaignData = useFetchData('/cpapage/campaigns' , {name: match.params.name });

  // 방문처리.
  usePostData('/cpapage/visit', { name: match.params.name });

  const params = {
    e_version: '2',
    a_publisher: '1543',
    a_media: '32014',
    a_section: '804388',
    i_response_format: 'json',
    i_rich_flag: '1',
    d_used_type: 'api',
    d_screen: getScreen(),
    d_os_index: getOsIndex(),
    d_osv: osVersion,
    d_maker: mobileVendor,
    d_model: mobileModel,
    d_os: osName
  };

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(false);

  const setState = ({ load, err, data }) => {
    setLoading(load);
    setErrorState(err);
    setData(data);
  };

  useEffect(() => {
    setLoading(true);
    if (getScreen() === '1') {
      axios.get('https://mtag.mman.kr/get_ad.mezzo/', { params })
        .then((row) => {
          if (row.data === null) {
            console.log('BANNER API IS NOT FOUND');
            setState({ load: false, err: true, data: {} });
            return;
          }
          const { adsinfo } = row.data;
          const { error_code, use_ssp, ad_type } = adsinfo;
          // SSP 요청조건 - (광고 성공 + 하우스 광고, 광고 없음 ) + SSP 사용
          if (((error_code === '0' && ad_type === '4') || error_code === '5') && use_ssp === '1') {
            axios.get('https://ssp.meba.kr/ssp.mezzo/', { params: { ...params, i_banner_w: '320', i_banner_h: '50' } })
              .then((inrow) => {
                const ssp_error_code = inrow.data.error_code;

                // AD 광고가 존재하지만 SSP는 존재하지 않을 때
                if (ssp_error_code === '5' && error_code === '0') {
                  console.log('SSP API IS NOT FOUND');
                  if (adsinfo.ad[0].hasOwnProperty('html')) {
                    console.log('HOUSE API CALL');
                    const {
                      click_tracking_api, html
                    } = adsinfo.ad[0];
                    setState({
                      load: false,
                      err: false,
                      data: {
                        click_tracking_api, html, isSSP: false
                      }
                    });
                    axios.post(`${apiHOST}/cpapage/manplus/impression`, { name: match.params.name });
                  } else {
                    setState({ load: false, err: true, data: {} });
                  }
                } else if (ssp_error_code === '0') {
                  // SSP가 존재하는 경우
                  if (inrow.data.hasOwnProperty('adm')) {
                    console.log('SSP API CALL');
                    const {
                      adm, ssp_imp, ssp_click
                    } = inrow.data;
                    setState({
                      load: false,
                      err: false,
                      data: {
                        html: adm, click_tracking_api: ssp_click, isSSP: true
                      }
                    });
                    axios.post(`${apiHOST}/cpapage/manplus/impression`, { name: match.params.name });
                    // 노출 API가 null일경우 회피하기위한 에러핸들링
                    if (ssp_imp !== null || ssp_imp !== undefined || ssp_imp !== '' || ssp_imp !== 'null') {
                      if (ssp_imp.length !== 0) {
                        console.log('SSP IMPRESSION API CALL');
                        axios.get(ssp_imp);
                      }
                    }
                  } else {
                    setState({ load: false, err: true, data: {} });
                  }
                } else {
                  // SSP가 존재하지 않고 여러가지 에러가 존재할 때,
                  if (error_code === '5') {
                    console.log('AD API EMPTY');
                  } else {
                    console.log('SSP API ERROR');
                  }
                  setState({ load: false, err: true, data: {} });
                }
              });
          } else if (error_code === '5') {
            // 광고 없음일 때
            console.log('AD API EMPTY');
            setState({ load: false, err: true, data: {} });
          } else if (error_code !== '5' && error_code !== '0') {
            console.log('SSP API ERROR');
            setState({ load: false, err: true, data: {} });
          } else if (error_code === '0' && ad_type === '4') {
            console.log('HOUSE API CALL');
            const {
              click_tracking_api, html
            } = adsinfo.ad[0];
            setState({
              load: false,
              err: false,
              data: {
                click_tracking_api, html, isSSP: false
              }
            });
            axios.post(`${apiHOST}/cpapage/manplus/impression`, { name: match.params.name });
          } else {
            console.log('AD API CALL');
            const {
              click_tracking_api, html
            } = adsinfo.ad[0];
            setState({
              load: false,
              err: false,
              data: {
                click_tracking_api, html, isSSP: false
              }
            });
            axios.post(`${apiHOST}/cpapage/manplus/impression`, { name: match.params.name });
          }
        });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Grid
      container
      justify="center"
      style={
        userData.creatorBackgroundImage && userData.creatorBackgroundImage !== '/pngs/landing/background-whale.jpg'
          ? {
            backgroundImage: `url(${userData.creatorBackgroundImage})`,
            backgroundSize: 'contain'
          }
          : { backgroundImage: 'url(\'/pngs/landing/background-whale.jpg\')' }
      }
    >
      <Grid item xs={12} sm={12} md={12} lg={8} xl={6} className={classes.container}>
      {clickData.loading && (<LandingHeroLoading isDesktopWidth={isDesktopWidth} />)}
      {!clickData.loading && clickData.data && (
          <LandingHero
            userTheme={userData.userTheme}
            user={userData.creatorName}
            userLogo={userData.creatorLogo}
            userDesc={userData.creatorDesc}
            // bannerCount={clickData.loading ? '-' : clickData.data.bannerCount}
            bannerCount = {(campaignData.loading && !campaignData.data) ? '-': campaignData.data.length}
            totalClickCount={clickData.loading ? '-' : clickData.data.totalClickCount}
            levelData={userData}
            isDesktopWidth={isDesktopWidth}
            mezzoData={{ data, loading, errorState }}
            name={match.params.name}
          />
      )}
     
        {campaignData.loading && (<LandingImagesLoading isDesktopWidth={isDesktopWidth} />)}
        {!campaignData.loading && campaignData.data && (
          <LandingImages campaignData = {campaignData} isMobile={Number(getScreen() === '1')} os={osName} isDesktopWidth={isDesktopWidth} name={match.params.name} />
        )}
        {!campaignData.loading && campaignData.data  && campaignData.data.length === 0 && (<LandingNoAd />)}
      </Grid>
    </Grid>
  );
};

export default LandingMain;

LandingMain.propTypes = {
  match: PropTypes.object.isRequired,
  isDesktopWidth: PropTypes.bool.isRequired,
  userData: PropTypes.object,
  searchText: PropTypes.string
};

LandingMain.defaultProps = {
  userData: {
    creatorName: '',
    creatorLogo: '/images/logo/onad_logo_vertical_small.png'
  },
  searchText: null
};
