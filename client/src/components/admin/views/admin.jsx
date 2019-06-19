import React, { component, useState, useEffect } from 'react';
import axios from 'axios';



const Admin = (props) => {
  const [waiting, setWaiting] = React.useState([['', '', '', '']]);

  function refreshPage(){
    window.location.reload()
  }

  function onClickButton(index){
    console.log(index)
    axios.post('/admin/pay', {index})
    .then(refreshPage())
    .catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    axios.get('/admin', {}).then((res) => {
      if (res.data) {
        setWaiting(res.data);
      } else {
        console.log('실패');
      }
    }).catch((err) => {
      console.log(err);
    });
  }, []);

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
      {waiting.map(( listValue, index ) => { // 신청내역 불러와서 표로 띄워주는 부분
          return (
            <tr key={index}>
              <td>{listValue[0]}</td>
              <td>{listValue[1]}</td> 
              <td>{listValue[2]}</td> 
              <td>{listValue[3]}</td>
              <td>{
                    listValue[4] == 0 ? <input type="button" id={listValue[0]} onClick={() => onClickButton(listValue[0])} value="입금하기"/>  : "입금완료"
                  }
              </td>
            </tr>
          );
        })}
      </tbody>
       
    </table>
    </React.Fragment>
  )
}

export default Admin;