import React, { useState } from 'react';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
import shortid from 'shortid';

// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// core components
import CardBody from '../Card/CardBody';
import CardHeader from '../Card/CardHeader';
import Card from '../Card/Card';

import customTabsStyle from '../../assets/jss/onad/components/customTabsStyle';

function CustomTabs(props) {
  const [value, setValue] = useState(0);
  const { classes, headerColor, tabs } = props;

  function handleChange(e, newValue) {
    setValue(newValue);
  }

  return (
    <Card>
      <CardHeader color={headerColor}>
        <Tabs
          value={value}
          onChange={handleChange}
          classes={{
            root: classes.tabsRoot,
            indicator: classes.displayNone,
            scrollButtons: classes.displayNone,
          }}
          variant="fullWidth"
          scrollButtons="auto"
        >
          {tabs.map((tab) => {
            let icon = {};
            if (tab.tabIcon) {
              icon = {
                icon: <tab.tabIcon />,
              };
            }
            return (
              <Tab
                classes={{
                  root: classes.tabRootButton,
                  selected: classes.tabSelected,
                  wrapper: classes.tabWrapper,
                }}
                key={shortid.generate()}
                label={tab.tabName}
                {...icon}
              />
            );
          })}
        </Tabs>
      </CardHeader>
      <CardBody>
        {tabs.map((prop, key) => {
          if (key === value) {
            return <div key={shortid.generate()}>{prop.tabContent}</div>;
          }
          return null;
        })}
      </CardBody>
    </Card>
  );
}

CustomTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  headerColor: PropTypes.oneOf([
    'warning',
    'success',
    'danger',
    'info',
    'primary',
    'blueGray',
  ]),
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tabName: PropTypes.string.isRequired,
      tabIcon: PropTypes.func,
      tabContent: PropTypes.node.isRequired,
    }),
  ).isRequired,
};

CustomTabs.defaultProps = {
  headerColor: 'primary',
};

export default withStyles(customTabsStyle)(CustomTabs);
