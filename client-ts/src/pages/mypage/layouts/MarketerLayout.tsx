
import React, { useState, useEffect, useRef } from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from '../../../organisms/mypage/layouts/Navbars/Navbar';
import Sidebar from '../../../organisms/mypage/layouts/Sidebar/Sidebar';
import Footer from '../../../organisms/mypage/layouts/Footer/Footer';
import allRoutes from '../routes';
import history from '../../../history';
// css
import useLayoutStyles from './Layout.style';
import '../../../assets/onad.css';

const MarketerDashboard = (): JSX.Element => {
  const classes = useLayoutStyles();

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  // main ref
  const mainPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = '온애드 | 대시보드';
    if (mainPanel && mainPanel.current) {
      mainPanel.current.scrollTop = 0;
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
      <Sidebar
        routes={allRoutes.marketer.filter((r) => !r.noTab)}
        logo="/pngs/logo/onad_logo_vertical_white.png"
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          handleDrawerToggle={handleDrawerToggle}
          routes={allRoutes.marketer}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            <Switch>
              {allRoutes.marketer.map((prop) => (
                <Route
                  path={prop.layout + prop.path}
                  component={prop.component}
                  key={prop.name}
                />
              ))}
            </Switch>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MarketerDashboard;
