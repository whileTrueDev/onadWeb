import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';

import axios from '../../../../utils/axios';
import SignOutDialog from './SignOutDialog';
import HOST from '../../../../utils/config';

const SignOut = (props) => {
  const { classes, userData } = props;
  const [open, openState] = useState(false);
  const [marketerId, setMarketerId] = useState();
  const myClass = {
    buttonWrapper: {
      display: 'flex',
      flexDirection: 'row-reverse',
      alignItems: 'center',
    },
  };

  function handleOpen() {
    openState(!open);
  }

  function doSignOut() {
    axios.post(`${HOST}/api/dashboard/marketer/profile/signout`)
      .then(() => {
        alert('탈퇴가 완료되었습니다.');
        window.location.href = 'https://onad.io';
      }).catch(() => { alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.'); });
  }

  useEffect(() => {
    setMarketerId(userData.marketerId);
  }, [userData.marketerId]);

  return (

    <div style={{ display: 'flex' }}>
      <Typography variant="body2" style={{ margin: '5px', border: '5px' }}>
        더 이상 온애드를 사용하시지 않나요?
      </Typography>
      <Typography
        style={{
          margin: '5px', border: '5px', cursor: 'pointer', textDecoration: 'underline'
        }}
        variant="button"
        onClick={handleOpen}
      >
        회원탈퇴
      </Typography>

      <SignOutDialog
        handleOpen={handleOpen}
        open={open}
        marketerId={marketerId}
        signOutFunc={doSignOut}
      />
    </div>
  );
};

export default SignOut;
