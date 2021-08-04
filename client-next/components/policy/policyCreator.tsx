// material-UI
// 내부 소스
import { nanoid } from 'nanoid';
import terms from '../../source/policySource';
// 프로젝트 내부 모듈
// 컴포넌트
// util 계열
// 스타일
import useStyles from '../../styles/policy/policyCreator.style';

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
