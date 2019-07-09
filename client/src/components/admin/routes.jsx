import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import shortid from 'shortid';
import Dashboard from '@material-ui/icons/Dashboard';
import Admin from './views/admin';
import AdminConfirm from './views/confirm';

const adminRoute = {
  admin: [
    {
      path: '/',
      name: '관리자홈',
      icon: Dashboard,
      component: Admin,
      layout: '/admin',
    },
    {
      path: '/confirm',
      name: '배너승인',
      icon: Dashboard,
      component: AdminConfirm,
      layout: '/admin',
    },

  ],
};


const adminRoutes = props => (
  <Switch>
    {adminRoute.admin.map((prop, key) => (
      <Route
        exact
        path={prop.layout + prop.path}
        component={() => <prop.component />}
        key={shortid.generate()}
      />
    ))}
  </Switch>
);

export default adminRoutes;
