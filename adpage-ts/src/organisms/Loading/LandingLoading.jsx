import React from 'react';
import CircularProgress from '../../atoms/CircularProgress/CircularProgress';

export default function LandingLoading() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '80vh',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}
    >
      <CircularProgress size={150} disableShrink />
      <h4>Loading... please wait a seconds..</h4>
    </div>
  );
}
