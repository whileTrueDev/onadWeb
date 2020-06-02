import React from 'react';
import PropTypes from 'prop-types';
import shortId from 'shortid';
// material-ui
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

// own function
import axios from 'axios';
import setNumberFormat from '../../utils/lib/setNumberFormat';
// own component
import LevelBar from '../../atoms/LevelBar/LevelBar';
import Tooltip from '../../atoms/Tooltip/Tooltip';
import Dynamic from './Dynamic';
import apiHOST from '../../config/host';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(10),
    [theme.breakpoints.down('sm')]: {
      // marginTop: theme.spacing(8),
      marginTop: theme.spacing(5),
      fontSize: 10,
    },
  },
  bigAvatar: {
    cursor: 'pointer',
    backgroundColor: theme.palette.background.default,
    boxShadow: `0 2px 10px 1px ${theme.palette.grey}`,
    margin: 25,
    width: 200,
    height: 200,
    [theme.breakpoints.down('sm')]: {
      width: 150,
      height: 150,
    },
    [theme.breakpoints.down('xs')]: {
      width: 100,
      height: 100,
    },
    '&:hover': {
      opacity: 0.85,
    },
  },
  title: {
    textTransform: 'none',
  },
  bold: {
    fontWeight: 'bold',
  },
  logo: {
    right: '1px',
    top: '33px',
    position: 'absolute',
    textAlign: 'right',
    width: '15px',
    height: '15px'
  },
  image: {
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      width: '100% !important', // Overrides inline-style
      height: 'auto',
    },
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
}));

export default function LandingHero(props) {
  const {
    user, userLogo, userDesc, levelData,
    isDesktopWidth, bannerCount, totalClickCount, mezzoData, name
  } = props;
  const classes = useStyles();

  const handleClick = () => {
    if (!mezzoData.data.isSSP) {
      console.log('HOUSE API CLICK');
      axios.post(`${apiHOST}/api/manplus/click`, { name });
      axios.get(mezzoData.data.click_tracking_api);
    }
  };

  return (
    <Grid container className={classes.root}>
      <Hidden smUp>
        <Grid item sm={4} xs={12}>
          <Grid item>
            {!mezzoData.loading && !mezzoData.errorState && mezzoData.data && (
            <ButtonBase
              focusRipple
              className={classes.image}
              onClick={handleClick}
            >
              <Dynamic
                html={mezzoData.data.html}
                isSSP={mezzoData.data.isSSP}
                name={name}
                click_tracking_api={mezzoData.data.click_tracking_api}
              />
            </ButtonBase>
            )}
          </Grid>
        </Grid>
      </Hidden>
      {/* Avatar logo */}
      <Grid item sm={4} xs={12}>
        <Grid container justify="center">
          <Avatar
            src={userLogo}
            alt=""
            className={classes.bigAvatar}
            onClick={() => {
              window.open(`https://www.twitch.tv${window.location.pathname}`);
            }}
          />
        </Grid>
      </Grid>

      {/* My description section */}
      <Grid item sm={6} xs={12}>
        {isDesktopWidth ? (
          <Typography variant="h4" gutterBottom className={classes.title}>{`${user}`}</Typography>
        ) : (
          <Grid container>
            <Grid item xs={9}>
              <Typography variant="h4" gutterBottom className={classes.title}>{`${user}`}</Typography>
            </Grid>
{/* 
            {!levelData.loading && !levelData.errorState && levelData.data && (
            <Grid item xs={3}>
              <LevelBar
                level={levelData.data.level}
                exp={Math.ceil(levelData.data.exp / 5)}
              />
            </Grid>
            )} */}
          </Grid>
        )}
        <Grid container justify="flex-start" spacing={isDesktopWidth ? 2 : 1}>
          <Grid item>
            <Typography variant="h6" gutterBottom>
              {'진행 광고 '}
              { bannerCount === null ? (
                <span className={classes.bold}>0</span>
              ) : (
                <span className={classes.bold}>{setNumberFormat(bannerCount)}</span>
              )}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="h6" gutterBottom>
              {'광고 참여 '}
              { totalClickCount === null ? (
                <span className={classes.bold}>0</span>
              ) : (
                <span className={classes.bold}>{setNumberFormat(totalClickCount)}</span>
              )}
            </Typography>
          </Grid>
        </Grid>

        <br />
        {userDesc && userDesc.split('\n').map(row => (
          <Typography variant="body1" key={shortId.generate()}>{row}</Typography>
        ))}
      </Grid>

      {/* loyalty level visualization */}
      {/* {isDesktopWidth && !levelData.loading && !levelData.errorState && levelData.data ? (
        <Grid item sm={1} xs={3}>
          <Tooltip textArray={[`${user}님의 광고 레벨입니다.`, '광고페이지에서의 상호작용에 따라', ' 레벨이 변화합니다.']}>
            <div>
              <LevelBar
                level={levelData.data.level}
                exp={Math.ceil(levelData.data.exp / 5)}
              />
            </div>
          </Tooltip>
        </Grid>
      ) : (
        null
      )} */}

    </Grid>
  );
}

LandingHero.propTypes = {
  user: PropTypes.string,
  userLogo: PropTypes.string.isRequired,
  isDesktopWidth: PropTypes.bool.isRequired,
  userDesc: PropTypes.string,
  bannerCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  totalClickCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  totalTransferCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  levelData: PropTypes.object
};

LandingHero.defaultProps = {
  user: '',
  userDesc: '',
  bannerCount: 0,
  totalClickCount: 0,
  totalTransferCount: 0,
  levelData: { exp: 0, level: 1 }
};
