import Typography from '@material-ui/core/Typography';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLogoutMutation } from '../../../../../utils/hooks/mutation/useLogoutMutation';
import { useMarketerSignoutMutation } from '../../../../../utils/hooks/mutation/useMarketerSignoutMutation';
import { MarketerInfo } from '../../../../../utils/hooks/query/useMarketerProfile';
import SignOutDialog from './signOutDialog';

const SignOut = (props: { userData: MarketerInfo }): JSX.Element => {
  const { userData } = props;
  const [marketerId, setMarketerId] = useState<string>('');
  const router = useRouter();

  const [open, openState] = useState(false);
  function handleOpen(): void {
    openState(!open);
  }

  const logoutMutation = useLogoutMutation();
  const signoutMutation = useMarketerSignoutMutation();
  function doSignOut(): void {
    signoutMutation
      .mutateAsync()
      .then(() => {
        alert('탈퇴가 완료되었습니다.');
        logoutMutation.mutate();
        router.push('/');
      })
      .catch(() => {
        alert('회원 탈퇴 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
