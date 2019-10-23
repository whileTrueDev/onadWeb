import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function UserProfile({ marketerProfileData }) {
  return (
    <div>
      <div>
        {!marketerProfileData.loading && marketerProfileData.payload && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
              {marketerProfileData.payload.marketerName}
            </Typography>
            <Typography variant="body1">&emsp;님</Typography>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1">계정 유형 :&emsp;</Typography>
        {!marketerProfileData.loading && marketerProfileData.payload && (
          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
            {marketerProfileData.payload.marketerUserType === 0 ? '개인' : '사업체'}
          </Typography>
        )}
      </div>
    </div>
  );
}
