import React, { useEffect } from 'react';
import shortid from 'shortid';
import { Redirect } from 'react-router-dom';
import axios from '../../../utils/axios';
import HOST from '../../../config';

const Admin = (props) => {
  const [waiting, setWaiting] = React.useState([['', '', '', '']]);
  const [check, setCheck] = React.useState('');

  function refreshPage() {
    window.location.reload();
  }

  function onClickButton(index) {
    console.log(index);
    axios.post(`${HOST}/api/admin/pay`, { index })
      .then(refreshPage())
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    axios.get(`${HOST}/admin`, {}).then((res) => {
      if (res.data === 'wrong') {
        setCheck(res.data);
      } else if (res.data) {
        setWaiting(res.data);
      } else {
        console.log('실패');
      }
    })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (check === 'wrong') {
    return (<Redirect to="/" />);
  }
  return (
    <React.Fragment>
      <table>
        <thead>
          <tr>
            <th>index</th>
            <th>크리에이터</th>
            <th>신청금액</th>
            <th>신청날짜</th>
            <th>승인여부</th>
          </tr>
        </thead>
        <tbody>
          {/* // 신청내역 불러와서 표로 띄워주는 부분 */}
          {waiting.map(listValue => (
            <tr key={shortid.generate()}>
              <td>{listValue[0]}</td>
              <td>{listValue[1]}</td>
              <td>{listValue[2]}</td>
              <td>{listValue[3]}</td>
              <td>
                {
                    listValue[4] === 0
                      ? (
                        <input
                          type="button"
                          id={listValue[0]}
                          onClick={() => onClickButton(listValue[0])}
                          value="입금하기"
                        />
                      ) : '입금완료'
                  }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default Admin;
