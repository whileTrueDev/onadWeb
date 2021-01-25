import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: { marginBottom: theme.spacing(1) },
}));
export default function CampaignButtons(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Button
        variant="outlined"
        color="primary"
        component={Link}
        to="/mypage/marketer/campaigncreate?to=inventory"
      >
        + 캠페인 생성
      </Button>
    </div>
  );
}
