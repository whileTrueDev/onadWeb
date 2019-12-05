import React from 'react';
import { Paper, Typography, FormControlLabel } from '@material-ui/core';
import IOSSwitch from '../../../../../atoms/Switch/IOSSwitch';

export default function OnOffSwitch() {
  const [switchCheck, setSwitchCheck] = React.useState(false);

  return (
    <Paper style={{ maxheight: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
        <Typography variant="h6">
          광고 On/Off
        </Typography>
        <FormControlLabel
          control={(
            <IOSSwitch
              checked={switchCheck}
              onChange={() => { setSwitchCheck(!switchCheck); }}
            />
          )}
        />
      </div>
    </Paper>
  );
}
