import React from 'react';
import shortid from 'shortid';
import useStyles from './style/PolicyMarketer.style';
import terms from './source/PolicySource';

interface Terms {
  title: string;
  text: string;
}

function PolicyMarketer(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2>마케터 서비스 이용약관</h2>
      <div className={classes.content}>
        {terms[1].map((term: Terms) => (
          <div key={shortid.generate()} className={classes.policyWrapper}>
            <h3 key={shortid.generate()}>{term.title}</h3>
            <div key={shortid.generate()} className={classes.text}>
              {term.text.split('\n').map(sentence => (
                <p key={shortid.generate()}>{sentence}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PolicyMarketer;
