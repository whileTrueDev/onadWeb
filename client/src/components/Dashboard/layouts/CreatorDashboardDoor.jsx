import React, { Component } from 'react';

export default class CreatorDashboardDoor extends Component {
  constructor(props) {
    super(props);
    const { history } = props;
    history.push('/dashboard/creator/main', { userType: 'creator' });
  }

  render() {
    return ('잠시만 기다려주세요.');
  }
}
