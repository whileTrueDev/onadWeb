import React from 'react';
import AppFooter from '../../organisms/main/layout/AppFooter';
import withRoot from '../../organisms/main/Main/withRoot';
import useLoginValue from '../../utils/lib/hooks/useLoginValue';
import Introduce from '../../organisms/main/Introduction/Introduce';

const MARKETER_TAB_NUMBER = 0;
const CREATOR_TAB_NUMBER = 1;

// this is layout compoent
export default withRoot((props) => {
  const { history } = props;
  const { isLogin, logout, userType } = useLoginValue(history);

  // if Link here, set the scroll to top of the page
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Introduce
        isLogin={isLogin}
        logout={logout}
        userType={userType === 'marketer' ? MARKETER_TAB_NUMBER : CREATOR_TAB_NUMBER}
      />
      <AppFooter />
    </div>
  );
});
