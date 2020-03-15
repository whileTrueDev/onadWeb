import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import shortid from 'shortid';
import terms from './PolicySource';


const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 70
  },
  content: {
    marginTop: 20,
    fontFamily: 'Noto Sans KR',
  },
  text: {
    marginTop: 30,
  },
  policyWrapper: {
    marginTop: theme.spacing(8)
  }
}));

interface Terms {
  title: string;
  text: string;
}

function PolicyPrivacy(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2>개인정보 처리방침</h2>
      <h4>{terms[3]}</h4>
      <div className={classes.content}>
        {terms[2].map((term: Terms) => (
          <div key={shortid.generate()} className={classes.policyWrapper}>
            <h3 key={shortid.generate()}>{term.title}</h3>
            <div key={shortid.generate()} className={classes.text}>
              {term.text.split('\n').map((sentence) => (
                <p key={shortid.generate()}>{sentence}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PolicyPrivacy;
