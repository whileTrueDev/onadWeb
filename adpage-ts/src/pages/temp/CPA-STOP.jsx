import React, { useState } from 'react';
import classnames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  bibble: {
    transition: 'transform .1s linear',
  },
  binggleLeft: {
    '&:hover': {
      transform: `rotate(45deg)` 
    }},
  binggleRight: {
    '&:hover': {
    transform: `rotate(-45deg)` 
  }},
  dragged: {
    width: 300
  }
}))

export default function CpaStop() {
  const classes = useStyles();
  const [bibbles, ] = useState([
    { name: '0', dragged: false },
    { name: '1', dragged: false },
    { name: '2', dragged: false },
    { name: '3', dragged: false },
    { name: '4', dragged: false },
    { name: '5', dragged: false },
    { name: '6', dragged: false },
    { name: '7', dragged: false },
  ]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
    }}
    >
      <div style={{ padding: 40 }}>
        {bibbles.map((bibble) => (
          <img
            alt=""
            key={bibble.name}
            src="https://static-cdn.jtvnw.net/emoticons/v2/86/default/light/3.0"
            width={50}
            height={50}
            className={classnames({
              [classes.bibble]: true,
              [classes.binggleLeft]: Boolean(Math.round(Math.random())),
              [classes.binggleRight]: Boolean(Math.round(Math.random())),
            })}
          />
        ))}
      </div>
      <Typography variant="body1">
        참여형 광고 시스템에 문제가 발생해 점검중에 있습니다.
      </Typography>
      <Typography variant="body1">
        자세한 사항은
        {' '}
        <a style={{ textDecoration: 'underline' }} href="https://onad.io/notice/35">공지사항</a>
        을 확인해주시기 바랍니다.
      </Typography>

      <br></br>
      <img width={35} height={35} src="/images/logo/onad_logo_vertical.png" alt=""></img>
    </div>
  )
}