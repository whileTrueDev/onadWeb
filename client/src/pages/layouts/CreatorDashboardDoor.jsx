import { Component } from 'react';
import history from '../../history';

export default class CreatorDashboardDoor extends Component {
  constructor(props) {
    super(props);
    history.push('/dashboard/creator/main', { userType: 'creator' });
  }

  render() {
    return ('잠시만 기다려주세요.');
  }
}
