import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import useStyles from '../style/IntroService.style';


function Indicator(): JSX.Element {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);

  function handleClick(): void {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>
        서비스에 대해 자세히 알아보세요
      </h2>
      <h3 className={classes.subtitle}>
        지금, 소개자료를 다운받을 수 있습니다.
      </h3>
      <div className={classes.wrapper}>
        <Button
          className={classes.button}
          disabled={loading}
          onClick={(): void => { handleClick(); }}
        >
          <a href="IntroService/ONAD서비스소개서.pdf" download="ONAD서비스소개서" className={classes.down}>소개자료 다운로드</a>
          {loading && (
            <CircularProgress
              disableShrink
              size={16}
              thickness={5}
              variant="indeterminate"
            />
          )}
        </Button>
        <Button
          className={classes.button}
          component={Link}
          to="/introduce/marketer"
        >
          서비스소개 페이지
        </Button>
      </div>
    </div>
  );
}

export default Indicator;
