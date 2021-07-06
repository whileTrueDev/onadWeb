import { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';

import axios from '../../../../../utils/axios';
import SignOutDialog from './SignOutDialog';
import HOST, { REACT_HOST } from '../../../../../config';
import { MarketerInfo } from '../../../../../utils/hooks/query/useMarketerProfile';

const SignOut = (props: { userData: MarketerInfo }): JSX.Element => {
  const { userData } = props;
  const [open, openState] = useState(false);
  const [marketerId, setMarketerId] = useState<string>('');

  function handleOpen(): void {
    openState(!open);
  }

  function doSignOut(): void {
    axios
      .delete<null, boolean[]>(`${HOST}/marketer`)
      .then(() => {
        alert('탈퇴가 완료되었습니다.');
        window.location.href = REACT_HOST!;
      })
      .catch(() => {
        alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      });
  }

  useEffect(() => {
    setMarketerId(userData.marketerId);
  }, [userData.marketerId]);

  return (
    <div style={{ display: 'flex', margin: '5px', border: '5px' }}>
      <Typography variant="body2" color="textPrimary">
        더 이상 온애드를 사용하시지 않나요?
      </Typography>
      <Typography
        color="textPrimary"
        style={{ cursor: 'pointer', textDecoration: 'underline' }}
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
