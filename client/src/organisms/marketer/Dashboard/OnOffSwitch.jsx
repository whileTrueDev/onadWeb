import React from 'react';
import {
  Paper, Typography, FormControlLabel, Switch
} from '@material-ui/core';
import useUpdateData from '../../../utils/lib/hooks/useUpdateData';


export default function OnOffSwitch(props) {
  const { onOffData } = props;
  const { handleUpdateRequest } = useUpdateData(
    '/api/dashboard/marketer/onoff', onOffData.callUrl
  );

  return (
    <Paper style={{ maxheight: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
        <Typography variant="h6">
          광고 On/Off
        </Typography>
        {!onOffData.loading && onOffData.payload && (
        <FormControlLabel
          control={(
            <Switch
              color="secondary"
              checked={onOffData.payload.onOffState}
              onChange={() => {
                handleUpdateRequest({
                  onOffState: !onOffData.payload.onOffState
                });
              }
              }
            />
          )}
        />
        )}
      </div>
    </Paper>
  );
}
