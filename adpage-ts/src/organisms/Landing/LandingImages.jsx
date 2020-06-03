import React from 'react';
import PropTypes from 'prop-types';
// material-ui
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// icons
// own handler
// own functions
import CPACampaigns from '../Campaigns/CPACampaignList';

const useStyles = makeStyles(theme => ({
  root: {
    borderTop: '0.5px solid',
    marginTop: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
    },
    borderColor: 'rgba(0, 0, 0, 0.12)'
  },
  imageSection: {
    marginTop: theme.spacing(5)
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(5)
    }
  },
  imageButton: {
    cursor: 'pointer',
    marginTop: 27,
    marginLeft: 15,
    marginRight: 15,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginRight: 0,
    },
    '&:hover $imageDesc': {
      display: 'flex',
      zIndex: 1,
    },
    '&:hover $imageBackdrop': {
      display: 'block',
    },
  },
  imageDesc: {
    opacity: 1,
    display: 'none',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  imageBackdrop: {
    opacity: 0.3,
    display: 'none',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
  },
  image: {
    maxHeight: 293,
    width: 293,
    [theme.breakpoints.down('sm')]: {
      width: 'calc( 100% - 5px )',
    },
    [theme.breakpoints.down('xs')]: {
      width: 'calc( 100% - 5px )',
    },
  },
  iconOnImage: {
    width: 60,
    fontSize: 30,
    fontWeight: 'bold'
  }
}));

const useTabValue = () => {
  const [value, setValue] = React.useState(0);

  function handleTabChange(e, newValue) {
    setValue(newValue);
  }

  return { value, handleTabChange };
};

export default function LandingImages(props) {
  const { campaignData, isDesktopWidth, name, isAndroid } = props;
  const classes = useStyles();
  const { value, handleTabChange } = useTabValue();
  return (
    <Grid container className={classes.root}>
      {/* Tabs */}
      <Grid item xs={12}>
        <Tabs
          centered
          value={value}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          aria-label="icon tabs example"
        >
          <Tab aria-label="favorite" label="광고목록" />
          {/* <Tab aria-label="plus" label="plus++" disabled /> */}
        </Tabs>
      </Grid>
      

      {/* Image section */}
      <CPACampaigns campaigns={campaignData.data} isDesktopWidth={isDesktopWidth} name={name} isAndroid={isAndroid}/>
    </Grid>
  );
}

LandingImages.propTypes = {
  isDesktopWidth: PropTypes.bool.isRequired,
  campaignData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired
};


