import React from 'react';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

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
      <LinearProgress
        style={{ width: '90%', maxWidth: 300 }}
        value={exp} // 경험치 100 분위수
        variant="determinate"
      />
    </div>
  );
}
