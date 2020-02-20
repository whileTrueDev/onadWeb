import React, { useState } from 'react';
import PropTypes from 'prop-types';
// core ../../../atoms
import { makeStyles } from '@material-ui/core/styles';
import Grow from '@material-ui/core/Grow';
import Hidden from '@material-ui/core/Hidden';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
// material-ui
import GridContainer from '../../atoms/Grid/GridContainer';
import GridItem from '../../atoms/Grid/GridItem';
import Fab from '../../atoms/Fab/Fab';

import ManualSelect from '../../organisms/marketer/Manual/ManualSelect';
import ManualDetail from '../../organisms/marketer/Manual/ManualDetail';
import sources from '../../organisms/marketer/Manual/sources';

const useStyles = makeStyles(theme => ({
  upwardButton: {
    right: 25,
    bottom: 20,
    position: 'fixed',
    margin: theme.spacing(1),
    color: '#fff',
    zIndex: 1000,
  },
}));

const MarketerManual = (props) => {
  const { pannelRef } = props;
  const classes = useStyles();
  const [manual, setManual] = useState(null);

  const handleButton = (num) => {
    setManual(num);
    if (window.innerWidth > 900) {
      // pc 화면의 경우 맨 위로 스크롤
      pannelRef.current.scrollTop = 0;
    } else {
      // 모바일 및 태블릿 화면의 경우 적당한 위치로 스크롤
      pannelRef.current.scrollTop = 580;
    }
  };

  function handleUpward() {
    pannelRef.current.scrollTop = 0;
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={6} lg={4} xl={2}>
        <ManualSelect
          handleButton={handleButton}
          activeStep={manual}
          sources={sources.selectComponent}
        />
      </GridItem>

      {/* { Boolean(selectedSource) && ( */}
      <Grow in={Boolean(manual)}>
        <GridItem xs={12} sm={12} md={6} lg={8} xl={6}>
          {(() => {
            if (manual === 1) { return (<ManualDetail source={sources.bannerRegist} />); }
            if (manual === 2) { return (<ManualDetail source={sources.bannerUpload} />); }
            if (manual === 3) { return (<ManualDetail source={sources.campaignStart} />); }
            if (manual === 4) { return (<ManualDetail source={sources.seeChart} />); }
            if (manual === 5) { return (<ManualDetail source={sources.cash} />); }
            if (manual === 6) { return (<ManualDetail source={sources.business} />); }
            return null;
          })()}
        </GridItem>
      </Grow>
      {/* )} */}
      <Hidden xlUp>
        <Fab color="info" size="medium" className={classes.upwardButton} onClick={handleUpward}>
          <ArrowUpward />
        </Fab>
      </Hidden>
    </GridContainer>
  );
};

MarketerManual.propTypes = {
  pannelRef: PropTypes.object.isRequired,
};

export default MarketerManual;
