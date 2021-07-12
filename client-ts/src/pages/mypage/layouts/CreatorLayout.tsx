import { useEffect, useRef } from 'react';
import { Route, Switch } from 'react-router-dom';
import '../../../assets/onad.css';
import history from '../../../history';
import Footer from '../../../organisms/mypage/layouts/Footer/Footer';
import Navbar from '../../../organisms/mypage/layouts/Navbars/Navbar';
import ResponsiveDrawer from '../../../organisms/mypage/layouts/Sidebar/ResponsiveDrawer';
import { useMypageStore } from '../../../store/mypageStore';
import useLoginValue from '../../../utils/hooks/useLoginValue';
import allRoutes from '../routes';
// css
import useLayoutStyles from './Layout.style';

const CreatorDashboard = (): JSX.Element => {
  const classes = useLayoutStyles();
  const { userType } = useLoginValue();
  if (userType === 'marketer') {
    history.push('/');
  }
  const isDrawerOpen = useMypageStore(s => s.isDrawerOpen);
  const toggleDrawer = useMypageStore(s => s.toggleDrawer);

  // main ref
  const mainPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = '온애드 | 마이페이지';
    if (mainPanel && mainPanel.current) {
      mainPanel.current.scroll({ top: 0, behavior: 'smooth' });
    }

    return (): void => {
      if (history.location.pathname === window.location.pathname) {
        if (isDrawerOpen) {
          toggleDrawer(false);
        }
      }
    };
  }, [isDrawerOpen, toggleDrawer]);

  return (
    <div className={classes.wrapper}>
      <ResponsiveDrawer routes={allRoutes.creator.filter(r => !r.noTab)} />
      <div className={classes.mainPanel} ref={mainPanel} id="onad-main-panel">
        <Navbar type="creator" routes={allRoutes.creator} />
        <div className={classes.content}>
          <div className={classes.container}>
            <Switch>
              {allRoutes.creator.map(prop =>
                prop.hasSubRoutes ? (
                  prop.subRoutes &&
                  prop.subRoutes.map(subRoute => (
                    <Route
                      path={prop.layout + prop.path + subRoute.path}
                      component={subRoute.component}
                      key={subRoute.name}
                    />
                  ))
                ) : (
                  <Route
                    path={prop.layout + prop.path}
                    component={prop.component}
                    key={prop.name}
                  />
                ),
              )}
            </Switch>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default CreatorDashboard;
