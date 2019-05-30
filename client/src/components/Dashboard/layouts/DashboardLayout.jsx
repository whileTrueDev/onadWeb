/* eslint-disable */
import React from "react";
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
import FixedPlugin from "../components/FixedPlugin/FixedPlugin";
// logo and sidebar image
import sidebarImage from "../assets/img/sidebar-2.jpg";
import logo from "../assets/img/main_logo.png";
// import css or style
import dashboardStyle from "../assets/jss/onad/layouts/dashboardStyle";
import '../assets/css/onad.css';
// import dashboard tab route array
import allRoutes from "../routes";

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

// Router 정의를 위해 session의 user-type 값 요청
function getUserType(theUrl="/dashboard/checkUserType") {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    if (xmlHttp.status === 200){
      return JSON.parse(xmlHttp.responseText);
    } else {
    // 세션 정보가 없는 경우 -> 오류 처리 요망
    document.location.href = '/';}
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // Router 정의를 위해 session의 user-type 값 동기식 요청 (컴포넌트 생성 이전에 확인)
    let session = getUserType();
  
    this.state = {
      sidebarImage: sidebarImage,
      color: 'blue',
      hasImage: true,
      fixedClasses: "dropdown",
      mobileOpen: false,
      session: session,  // different router for creator or marketer
    };

    console.log(this.state.session)
  }
  handleImageClick = sidebarImage => {
    this.setState({ sidebarImage: sidebarImage });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({ fixedClasses: "dropdown show" });
    } else {
      this.setState({ fixedClasses: "dropdown" });
    }
  };
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  };

  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      const ps = new PerfectScrollbar(this.refs.mainPanel);
    }
    window.addEventListener("resize", this.resizeFunction);
  }
  componentDidUpdate(e) {
    // If located here, scroll on top
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunction);
  }
  render() {
    const { classes, history, ...rest } = this.props;
    const {session} = this.state;
    const routes = session.userType === "creator"
      ? allRoutes.creator
      : allRoutes.marketer
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={routes}
          logoText={"OnAD"}
          logo={logo}
          image={this.state.sidebarImage}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color={this.state.color}
          {...rest}
        />
        <div className={classes.mainPanel} ref="mainPanel">
          <Navbar
            routes={routes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />

          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes(routes, session, history)}</div>
          </div>

          <Footer /> 

          <FixedPlugin
            handleImageClick={this.handleImageClick}
            handleColorClick={this.handleColorClick}
            bgColor={this.state["color"]}
            bgImage={this.state["image"]}
            handleFixedClick={this.handleFixedClick}
            fixedClasses={this.state.fixedClasses}
          />
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
