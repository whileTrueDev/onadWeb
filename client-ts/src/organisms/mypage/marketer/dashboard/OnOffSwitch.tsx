import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Paper, Typography, FormControlLabel, Switch
} from '@material-ui/core';

import usePostRequest from '../../../../utils/hooks/usePostRequest';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';
import { OnOffInterface } from './interfaces';

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
  const { doPostRequest } = usePostRequest(
    '/marketer/ad/on-off', onOffData.doGetRequest
  );

  return (
    <Paper className={classes.paper}>
      <div className={classes.div}>
        <Typography variant="h6">
          광고 On/Off
        </Typography>
        {!onOffData.loading && onOffData.data && (
          <FormControlLabel
            label=""
            control={(
              <Switch
                color="secondary"
                checked={onOffData.data.onOffState}
                onChange={(): void => {
                  doPostRequest({
                    onOffState: onOffData.data ? !onOffData.data.onOffState : false
                  });
                }}
              />
            )}
          />
        )}
      </div>
    </Paper>
  );
}
