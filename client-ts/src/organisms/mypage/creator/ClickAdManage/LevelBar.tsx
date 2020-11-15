import React from 'react';
import Typography from '@material-ui/core/Typography';
import PrettoSlider from '../../../../atoms/AdLevelSlider';

interface LevelBarProps {
  level: number;
  exp: number;
}
export default function LevelBar({
  level = 1,
  exp = 0
}: LevelBarProps): JSX.Element {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16
      }}
      >
        <Typography variant="body2">
          {'Lv. '}
        </Typography>
        <Typography variant="h4">
          {level}
        </Typography>
      </div>
      <PrettoSlider
        style={{ cursor: 'default', width: '90%' }}
        max={500}
        valueLabelDisplay="on"
        aria-label="pretto slider creator-ad-level"
        value={exp}
      />
    </div>
  );
}
