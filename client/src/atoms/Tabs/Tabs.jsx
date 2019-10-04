import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Box from '@material-ui/core/Box';
import MuiTabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      maxWidth: 40,
      width: '100%',
      // backgroundColor: '#635ee7',
      backgroundColor: '#00acc1'
    },
  },
})(props => <MuiTabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  pannel: {
    width: 350
  }
}));


function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function useTabValue() {
  const [value, setValue] = React.useState(0);
  function handleChange(e, newValue) {
    setValue(newValue);
  }
  return { value, handleChange };
}


function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function Tabs(props) {
  const { labels, tabComponents } = props;
  const { value, handleChange } = useTabValue();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <StyledTabs
        className={classes.tabs}
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="Vertical-tabs-cashcard"
      >
        {labels.map((label, index) => (
          <Tab key={shortid.generate()} label={label} {...a11yProps(index)} />
        ))}
      </StyledTabs>
      {tabComponents.map((Component, index) => (
        <TabPanel key={shortid.generate()} value={value} index={index}>
          {Component}
        </TabPanel>
      ))}
    </div>
  );
}
