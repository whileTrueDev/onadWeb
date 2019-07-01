import React, { useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table/Table';

const AdminConfirm = (props) => {
  const [data, setData] = React.useState([['', '', '', '', '']]);

  function refreshPage() {
    window.location.reload();
  }

  function confirmClickButton(e) {
    const bannerId = e.target.id;
    axios.post('/admin/confirmState', { bannerId })
      .then(refreshPage())
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSeleted(e) {
    const bannerId = e.target.name;
    const denialReason = e.target.value;
    axios.post('/admin/rejectBanner', { denialReason, bannerId })
      .then(refreshPage())
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    axios.get('/admin/confirm', {}).then((res) => {
      if (res.data) {
        setData(res.data);
      } else {
        console.log('실패');
      }
    }).catch((err) => {
      console.log(err);
    });
  }, []);

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
