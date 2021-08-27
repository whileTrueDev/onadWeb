import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { MarketerInfoContextProvider } from '../../../context/marketerInfo.context';
import Footer from './footer/footer';
import Navbar from './navbars/navbar';
import ResponsiveDrawer from './sidebar/responsiveDrawer';
import { useMypageStore } from '../../../store/mypageStore';
import useLoginValue from '../../../utils/hooks/useLoginValue';
import allRoutes from '../routes';
// css
import useLayoutStyles from './layout.style';

const MarketerDashboard = ({ children }: any): JSX.Element => {
  const classes = useLayoutStyles();
  const { userType } = useLoginValue();
  const router = useRouter();
  if (userType === 'creator') {
    router.push('/');
  }
  const isDrawerOpen = useMypageStore(s => s.isDrawerOpen);
  const toggleDrawer = useMypageStore(s => s.toggleDrawer);

  // main ref
  const mainPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return (): void => {
      if (router.pathname === window.location.pathname) {
        if (isDrawerOpen) {
          toggleDrawer(false);
        }
      }
    };
  }, [isDrawerOpen, toggleDrawer]);

  return (
    <div className={classes.wrapper}>
      <ResponsiveDrawer routes={allRoutes.marketer.filter(r => !r.noTab)} />
      <MarketerInfoContextProvider>
        <div className={classes.mainPanel} ref={mainPanel} id="onad-main-panel">
          <Navbar type="marketer" routes={allRoutes.marketer} />
          <div className={classes.content}>
            <div className={classes.container}>{children}</div>
          </div>
          <Footer />
        </div>
      </MarketerInfoContextProvider>
    </div>
  );
};

export default MarketerDashboard;
