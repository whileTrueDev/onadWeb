import React, {useState, useEffect} from 'react';
// layout 계열 컴포넌트
import NavTop from '../../organisms/main/layouts/NavTop'
// layout 내부 컨텐츠 계열 컴포넌트
import makeStyles from '@material-ui/core/styles/makeStyles';
import ProductHero from '../../organisms/main/main/Hero/ProductHero';
import Contact from '../../organisms/main/main/Contact/Contact';
import RePasswordDialog from '../../organisms/main/main/login/RePassword';
import sources from '../../organisms/main/main/source/sources';
import Indicator from '../../organisms/main/main/Indicators/Indicator';
import HowToUse from '../../organisms/main/main/HowToUse/HowToUse';
import Advantage from '../../organisms/main/main/Advantage/Advantage';
import Reference from '../../organisms/main/main/Reference/Reference';
// utill 계열 컴포넌트
import useLoginValue from '../../utils/hooks/useLoginValue';
import history from '../../history';
import withRoot from './withRoot';
import ParallaxScroll from './sub/ParallaxScroll'
import axios from '../../utils/axios';
import HOST from '../../config';
interface NowBroadcastData {
  nowBroadcast: number;
}

const useStyles = makeStyles((theme) => ({
  parallax: {
    width: '100%',
    height: ' 100vh'
  },
}));

export default withRoot(() => {
  const classes = useStyles();
  const {
    isLogin, repasswordOpen, logout, setRepassword,
  } = useLoginValue();

  const [psIndex, setPsIndex] = useState(0)
  const [nowBroadcast, setNowBroadcast] = useState(50)
  const [loading, setLoading] = useState(false)

  const MainUserType = (history.location.pathname === '/marketer' ? true : false);

  useEffect(() => {
    axios.get(`${HOST}/creators/broadcast`)
      .then((res) => {
        if (res.data) {
          setNowBroadcast(res.data[0].nowBroadcast)
          setLoading(true)
        }
      });
  }, [])

  return (
    <div>
      {MainUserType ? (
        <div>
          <NavTop isLogin={isLogin} logout={logout} MainUserType={MainUserType} />
          <ParallaxScroll
            isLogin={isLogin}
            setPsIndex={setPsIndex}
            psIndex={psIndex}
            loading={loading}
            bgfixedRange={[0,3]}
          >
            <div className={classes.parallax} data-parallax="0">
              { psIndex === 0 && (
                <ProductHero
                  source={sources.hero}
                  isLogin={isLogin}
                  MainUserType={MainUserType}
                  logout={logout}
                />
              )}
            </div>

            <div className={classes.parallax} data-parallax="1">
              { psIndex === 1 && loading &&(
                <Indicator psIndex={psIndex} nowBroadcast={nowBroadcast}/>
              )}
            </div>

            <div className={classes.parallax} data-parallax="2">
              { psIndex === 2 && (
                <HowToUse
                  source={sources.howTo}
                  MainUserType={MainUserType}
                />
              )}
            </div>

            <div className={classes.parallax} data-parallax="3">
              { psIndex === 3 && (
                <Advantage 
                  source={sources.advantage}
                  MainUserType={MainUserType}
                />
              )}
            </div>

            <div className={classes.parallax} data-parallax="4">
              { psIndex === 4 && (
                <Reference />
              )}
            </div>

            <div className={classes.parallax} data-parallax="5">
              { psIndex === 5 && (
                <Contact source={sources.howitworks} MainUserType={MainUserType} />
              )}
            </div>
          </ParallaxScroll>
          <RePasswordDialog
            repasswordOpen={repasswordOpen}
            setRepassword={setRepassword}
            logout={logout}
          />
        </div>
      )
        : (
          <div>
            {/* <NavTop isLogin={isLogin} logout={logout} MainUserType={MainUserType} />
            <ParallaxScroll
            >
              <ProductHero
                source={sources.hero}
                MainUserType={MainUserType}
                logout={logout}
              />
              <Indicator />
              <HowToUse
                source={sources.howTo}
                MainUserType={MainUserType}
              />
              <Advantage source={sources.advantage} MainUserType={MainUserType}/>
              <Reference />
              <Contact source={sources.howitworks} MainUserType={MainUserType} />
            </ParallaxScroll>
            <RePasswordDialog
              repasswordOpen={repasswordOpen}
              setRepassword={setRepassword}
              logout={logout}
            /> */}
          </div>
        )}
    </div>
  );
});
