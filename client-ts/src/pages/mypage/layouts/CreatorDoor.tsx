import { Component } from 'react';
import history from '../../../history';

export default function CreatorDashboardDoor() {
  history.push('/dashboard/creator/main', { userType: 'creator' });
}
