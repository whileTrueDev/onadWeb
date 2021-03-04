
import React, { useState, useEffect, useRef } from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from '../../../organisms/mypage/layouts/Navbars/Navbar';
import Footer from '../../../organisms/mypage/layouts/Footer/Footer';
import allRoutes from '../routes';
import history from '../../../history';
import useLoginValue from '../../../utils/hooks/useLoginValue';
// css
import useLayoutStyles from './Layout.style';
import '../../../assets/onad.css';
import ResponsiveDrawer from '../../../organisms/mypage/layouts/Sidebar/ResponsiveDrawer';

const CreatorDashboard = (): JSX.Element => {
  const classes = useLayoutStyles();
  const { userType } = useLoginValue();
  if (userType === 'marketer') {
    history.push('/');
  }

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  // main ref
  const mainPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = '온애드 | 마이페이지';
    if (mainPanel && mainPanel.current) {
      mainPanel.current.scroll({ top: 0, behavior: 'smooth' });
    }

    return (): void => {
      if (history.location.pathname === window.location.pathname) {
        if (mobileOpen) {
          setMobileOpen(false);
        }
      }
    };
  }, [mobileOpen]);

  return (
    <div className={classes.wrapper}>
      <ResponsiveDrawer
        routes={allRoutes.creator.filter((r) => !r.noTab)}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <div className={classes.mainPanel} ref={mainPanel} id="onad-main-panel">
        <Navbar
          type="creator"
          handleDrawerToggle={handleDrawerToggle}
          routes={allRoutes.creator}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            <Switch>
              {allRoutes.creator.map((prop) => {
                if (prop.hasSubRoutes && prop.subRoutes) {
                  return (
                    <React.Fragment key={prop.name + prop.layout + prop.path}>
                      {prop.subRoutes.map((subroute) => (
                        <Route
                          path={prop.layout + prop.path + subroute.path}
                          component={subroute.component}
                          key={prop.name + subroute.name}
                        />
                      ))}
                    </React.Fragment>
                  );
                }
                return (
                  <Route
                    path={prop.layout + prop.path}
                    component={prop.component}
                    key={prop.name}
                  />
                );
              })}
            </Switch>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default CreatorDashboard;
