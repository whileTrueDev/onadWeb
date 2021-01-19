import React, { useState } from 'react';
import classnames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import styled, { keyframes } from 'styled-components';

const shivering = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`

const useStyles = makeStyles((theme) => ({
  bibble: {
    transition: 'transform .1s linear',
 },
  shiver: {
    animation: '$shiver 1s infinite',
    '&:hover': {
      animationPlayState: 'paused',
    },
  },
  notshiver: {
    '&:hover': {
      transform: 'rotate(45deg)',
    },
  },
  '@keyframes shiver': {
    "10%, 90%": {
      transform: 'translate3d(-0.5px, 0, 0)'
    },
    "20%, 80%": {
      transform: 'translate3d(0.5px, 0, 0)'
    },
    "30%, 50%, 70%": {
      transform: 'translate3d(-1px, 0, 0)'
    },
    "40%, 60%": {
      transform: 'translate3d(1px, 0, 0)',
    }
  },
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
            className={classnames(
              classes.bibble,
              Math.random() < 0.3 ? classes.shiver : classes.notshiver
            )}
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