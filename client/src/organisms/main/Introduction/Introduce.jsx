import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import LeftCard from './components/LeftCard';
import RightCard from './components/RightCard';
import TabBar from './components/TabBar';
import AppAppBar from '../layout/AppAppBar';
import HowToUseCreator from './components/HowToUseCreator';
import HowToUseMarketer from './components/HowToUseMarketer';
import IntroduceTop from './components/IntroduceTop';
import ProductHowItWorks from '../Main/views/HowItWorks/ProductHowItWorks';
import history from '../../../history';
import textSource from './source/textSource';

const ORANGE_BACKGROUND = 'linear-gradient(45deg, #FFAA00 30%, #FF8E53 90%)';
const EMERALD_BACKGROUND = 'linear-gradient(45deg, #00DBE0 30%, #21CBF3 90%)';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block',
  },
  container: {
    marginBottom: theme.spacing(16),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mainTop: {
    display: 'flex',
    background: ORANGE_BACKGROUND,
    width: '100%',
    height: theme.spacing(32),
    marginTop: theme.spacing(9),
  },
  mainTop2: {
    display: 'flex',
    background: EMERALD_BACKGROUND,
    width: '100%',
    height: theme.spacing(32),
    marginTop: theme.spacing(9),
  },
  mainToptext: {
    alignText: 'left',
    fontFamily: 'Noto Sans Kr',
    fontSize: '30px',
    width: '60%',
    paddingTop: theme.spacing(6),
    color: 'white',
    [theme.breakpoints.down('sm')]: {
      fontSize: '22px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '15px',
      wordBreak: 'keep-all'
    },

  },
  mainTopIamge: {
    backgroundImage: 'url(/pngs/introduction/serviceCreator.png)',
    backgroundSize: 'cover',
    width: '40%',
    height: theme.spacing(27),
  },
  mainTopIamge2: {
    backgroundImage: 'url(/pngs/introduction/serviceClient.png)',
    backgroundSize: 'cover',
    width: '40%',
    height: theme.spacing(27),
  },
  topContent: {
    display: 'flex',
    flewDirection: 'row',
    // justifyContent: 'center'
  }
}));

const marketerWorks = {
  content: {
    title: '지금 바로 시작하세요',
    text: '간단한 약관만 수락해주시면 바로 해보실 수 있습니다.\n배너를 등록하시면 실시간으로 광고를 본 시청자 수에 비례해 금액이 차감됩니다.\n궁금한 사항이 있으시면 고객센터와 플러스친구에 문의주십시오.'
  },
};
const creatorWorks = {
  content: {
    title: '지금 바로 트위치 아이디로 시작하세요',
    text: '간단한 약관만 수락해주시면 바로 해보실 수 있습니다.\n간단하게 오버레이주소만 복사해서 방송송출프로그램에 붙여넣어 주시면 됩니다'
  },
};

function Introduce(props) {
  const classes = useStyles();
  const { userType, isLogin, logout } = props;

  // Grow check value, set the grow check value
  const [growCheck, setGrowCheck] = React.useState(true);

  // Tab index value, set the value tab index
  const [value, setValue] = React.useState(userType);

  // handler for Tab changes
  function handleTabChange(evt, newValue) {
    setValue(newValue);
    setGrowCheck(true);
  }

  return (
    <>
      <AppAppBar
        isLogin={isLogin}
        logout={logout}
        history={history}
        tabValue={value}
        handleTabChange={handleTabChange}
      />
      <section className={classes.root}>
        <div className={value ? (classes.mainTop) : (classes.mainTop2)}>
          <Container className={classes.topContent}>
            {value ? (
              <div className={classes.mainToptext}>
                {textSource.heroSector.marketer.text.title.split('\n').map(row => (
                  <p key={row} style={{ marginTop: 1, marginBottom: 2 }}>{`${row}`}</p>
                ))}
              </div>
            ) : (
              <div className={classes.mainToptext}>
                {textSource.heroSector.creator.text.title.split('\n').map(row => (
                  <p key={row} style={{ marginTop: 1, marginBottom: 2 }}>{`${row}`}</p>
                ))}
              </div>
            )}
            <div className={value ? (classes.mainTopIamge) : (classes.mainTopIamge2)} />
          </Container>
        </div>
        <Container className={classes.container}>

          <TabBar
            tabValue={value}
            handleTabChange={handleTabChange}
          />

          {value === 0 ? (
            // 마케터
            <React.Fragment>
              <div style={{ marginTop: 50 }} />
              <RightCard
                growCheck={growCheck}
                triggerThreshold={0}
                growTime={1000}
                slideTime={700}
                source={textSource.marketer.firstSector}
              />
            </React.Fragment>
          ) : (
            // 크리에이터
            <React.Fragment>
              <div style={{ marginTop: 50 }} />
              <LeftCard
                growCheck={growCheck}
                triggerThreshold={0}
                growTime={1000}
                slideTime={700}
                source={textSource.creator.firstSector}
              />
            </React.Fragment>
          )}
        </Container>
      </section>
      <section style={{
        background: value
          ? ORANGE_BACKGROUND
          : EMERALD_BACKGROUND,
        marginTop: 40
      }}
      >
        {value === 0 ? (
          <HowToUseMarketer source={textSource.marketer.secondSector} />
        ) : (
          <HowToUseCreator source={textSource.creator.secondSector} />
        )}
      </section>

      <IntroduceTop source={textSource.topSector} />

      {value === 0 ? (
        <ProductHowItWorks
          isLogin={isLogin}
          source={marketerWorks}
          tabValue={value}
          handleTabChange={handleTabChange}
        />
      ) : (
        <ProductHowItWorks
          isLogin={isLogin}
          source={creatorWorks}
          tabValue={value}
          handleTabChange={handleTabChange}
        />
      )}
    </>
  );
}

Introduce.propTypes = {
  userType: PropTypes.number,
};

Introduce.defaultProps = {
  userType: 0,
};

export default Introduce;
