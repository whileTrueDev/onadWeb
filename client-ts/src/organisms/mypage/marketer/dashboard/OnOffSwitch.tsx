import React, { useState, useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Paper, Typography, FormControlLabel, Switch
} from '@material-ui/core';
// import usePostRequest from '../../../../utils/hooks/usePostRequest';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';
import { OnOffInterface } from './interfaces';
import HOST from '../../../../utils/config';
import axios from '../../../../utils/axios';

const useStyles = makeStyles(() => ({
  paper: { maxheight: 100 },
  div: { display: 'flex', justifyContent: 'space-between', padding: 16 }
}));

interface OnOffSwitchProps {
  onOffData: UseGetRequestObject<OnOffInterface | null>;
}

export default function OnOffSwitch(props: OnOffSwitchProps): JSX.Element {
  const { onOffData } = props;
  const classes = useStyles();
  const [viewState, setView] = useState<boolean>(false);

  useEffect(() => {
    if (!onOffData.loading && onOffData.data) {
      setView(onOffData.data.onOffState);
    }
  }, [onOffData]);

  const handleSwitch = () => {
    axios.post(`${HOST}/marketer/ad/on-off`, {
      onOffState: onOffData.data ? !onOffData.data.onOffState : false
    })
      .then((res) => {
        if (!res.data[0]) {
          alert(res.data[1]);
        } else if (onOffData.doGetRequest) {
          onOffData.doGetRequest();
        }
      });
  };

  // const { doPostRequest } = usePostRequest(
  //   '/marketer/ad/on-off', onOffData.doGetRequest
  // );


  return (
    <Paper className={classes.paper}>
      <div className={classes.div}>
        <Typography variant="h6">
          광고 On/Off
        </Typography>
        <FormControlLabel
          label=""
          control={(
            <Switch
              color="secondary"
              checked={viewState}
              onChange={(): void => {
                handleSwitch();
              }}
            />
          )}
        />
      </div>
    </Paper>
  );
}
