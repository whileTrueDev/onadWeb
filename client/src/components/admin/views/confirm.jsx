import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from '../../../utils/axios';

import Table from '../components/Table/Table';
import HOST from '../../../config';

const AdminConfirm = () => {
  const [data, setData] = React.useState([['', '', '', '', '']]);
  const [check, setCheck] = React.useState('');

  function refreshPage() {
    window.location.reload();
  }

  function confirmClickButton(e) {
    const bannerId = e.target.id;
    axios.post(`${HOST}/api/admin/confirmState`, { bannerId })
      .then(refreshPage())
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSeleted(e) {
    const bannerId = e.target.name;
    const denialReason = e.target.value;
    axios.post(`${HOST}/api/admin/rejectBanner`, { denialReason, bannerId })
      .then(refreshPage())
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    axios.get(`${HOST}/admin/confirm`, {}).then((res) => {
      if (res.data === 'wrong') {
        setCheck(res.data);
      } else if (res.data) {
        setData(res.data);
      } else {
        console.log('실패');
      }
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  if (check === 'wrong') {
    return (<Redirect to="/" />);
  }
  return (
    <React.Fragment>

      <Table
        tableHeaderColor="primary"
        tableHead={['이미지', '배너이름', '광고주', '카테고리', '승인하기']}
        tableData={data}
        confirmClickEvent={confirmClickButton}
        handleSeleted={handleSeleted}
      />

    </React.Fragment>

  );
};
export default AdminConfirm;
