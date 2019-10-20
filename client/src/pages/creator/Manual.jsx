import React, { useState } from 'react';
// core ../../../atoms
import { makeStyles } from '@material-ui/core/styles';
// material-ui
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Grow from '@material-ui/core/Grow';
import Hidden from '@material-ui/core/Hidden';
// custom container
import Fab from '../../atoms/Fab/Fab';
import GridItem from '../../atoms/Grid/GridItem';
import GridContainer from '../../atoms/Grid/GridContainer';

import ManualSelect from '../../organisms/creator/Manual/Select';
import ManualDetail from '../../organisms/creator/Manual/ManualDetail';
import sources from '../../organisms/creator/Manual/sources';

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

const CreatorManual = (props) => {
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
      pannelRef.current.scrollTop = 800;
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
            if (manual === 1) return (<ManualDetail source={sources.contract} />);
            if (manual === 2) return (<ManualDetail source={sources.programSetting} />);
            if (manual === 3) return (<ManualDetail source={sources.income} />);
            if (manual === 4) return (<ManualDetail source={sources.landing} />);
            if (manual === 5) return (<ManualDetail source={sources.bannerlist} />);
            if (manual === 6) return (<ManualDetail source={sources.withdrawal} />);
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
export default CreatorManual;
