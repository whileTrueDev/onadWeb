import React from 'react';
import shortid from 'shortid';
import useStyles from './style/PolicyPrivacy.style';
import terms from './source/PolicySource';


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
