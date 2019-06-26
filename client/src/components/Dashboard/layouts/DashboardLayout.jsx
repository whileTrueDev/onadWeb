/* eslint-disable */
import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Navbar from "../components/Navbars/Navbar";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";
// logo and sidebar image
import logo from "../assets/img/main_logo.png";
// import css or style
import dashboardStyle from "../assets/jss/onad/layouts/dashboardStyle";
import '../assets/css/onad.css';
// import dashboard tab route array
import allRoutes from "../routes";
import axios from "axios";

// content 화면 라우팅 컴포넌트 생성 함수
const switchRoutes = (routes, session, history) => (
  <Switch> 
    {routes.map((prop, key) => {
      if (prop.layout === "/dashboard") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={() => <prop.component session={session} history={history} />}
            key={key}
          />
        )}
    })}
  </Switch>
);

const Dashboard = ({ classes, history, ...rest }) => {
  const [session, setSession] = useState({});
  
  useEffect(()=>{
    axios.get('/dashboard/checkUserType')
    .then((res)=>{
      if(res.data){
        setSession(res.data);
      }else{
        document.location.href = '/';
      }
    })
  },[])

  const routes = session.userType === "creator"
  ? allRoutes.creator
  : allRoutes.marketer

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"OnAD"}
        logo={logo}
        {...rest}
      />
      <div className={classes.mainPanel}>
      {/* ref="mainPanel" */}
        <Navbar
          routes={routes}          
          {...rest}
        />
        <div className={classes.content}>
          <div className={classes.container}>
          <Switch>
            {routes.map((prop, key) => {
              if (prop.layout === "/dashboard") {
                return (
                  <Route
                    path={prop.layout + prop.path}
                    component={() => <prop.component session={session} history={history} />}
                    key={key}
                  />
                )}
            })}
          </Switch>
          </div>
        </div>
        <Footer /> 
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);