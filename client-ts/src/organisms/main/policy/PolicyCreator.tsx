import { nanoid } from 'nanoid';
import useStyles from './style/PolicyCreator.style';
import terms from './source/PolicySource';

interface Terms {
  title: string;
  text: string;
}

function PolicyCreator(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2>방송인 서비스 이용약관</h2>
      <div className={classes.content}>
        {terms[0].map((term: Terms) => (
          <div key={nanoid()} className={classes.policyWrapper}>
            <h3 key={nanoid()}>{term.title}</h3>
            <div key={nanoid()} className={classes.text}>
              {term.text.split('\n').map(sentence => (
                <p key={nanoid()}>{sentence}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PolicyCreator;
