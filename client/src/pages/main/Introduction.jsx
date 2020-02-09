import React from 'react';
import withRoot from '../../organisms/main/Main/withRoot';
import useLoginValue from '../../utils/lib/hooks/useLoginValue';
import Introduce from '../../organisms/main/Introduction/Introduce';

// this is layout compoent
export default withRoot((props) => {
  const { history } = props;
  const { isLogin, logout } = useLoginValue(history);

  // if Link here, set the scroll to top of the page
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Introduce
        isLogin={isLogin}
        logout={logout}
      />
    </div>
  );
});
