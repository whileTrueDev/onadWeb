import React from 'react';
import shortid from 'shortid';
import Styles from './style/Question.style';
import textSource from './source/textSource';


interface QandAData {
  id: string;
  text: string;
  ans?: any | '';
}

function Question({ MainUserType }: { MainUserType: string }): JSX.Element {
  const classes = Styles();

  let defaultQuestion: QandAData;
  if (MainUserType === 'marketer') {
    defaultQuestion = {
      id: 'one',
      text: '온애드에서 진행가능한 광고 유형은 무엇인가요?',
      ans: textSource.answerMarketer.one,
    };
  } else {
    defaultQuestion = {
      id: 'one',
      text: '온애드 가입 조건은 어떻게 되나요?',
      ans: textSource.answerCreator.one,
    };
  }

  let source;
  if (MainUserType === 'marketer') {
    source = textSource.questionMarketer;
  } else {
    source = textSource.questionCreator;
  }

  const [questionNum, setQuestionNum] = React.useState(defaultQuestion);


  function handleClick(row: QandAData): void {
    if (MainUserType === 'marketer') {
      setQuestionNum({ id: row.id, text: row.text, ans: textSource.answerMarketer[row.id] });
    } else {
      setQuestionNum({ id: row.id, text: row.text, ans: textSource.answerCreator[row.id] });
    }
  }

  return (
    <div className={classes.root}>
      <h1 className={classes.h1}>
        자주 묻는 질문
      </h1>
      <div className={classes.QnAWrapper}>
        <div className={classes.question}>
          {source.map((row: any) => (
            <div
              className={questionNum.id === row.id ? (classes.questionTextClicked) : (classes.questionText)}
              key={shortid.generate()}
              onClick={() => { handleClick(row); }}
            >
              <div className={classes.qicon}>Q</div>
              <div className={classes.qText}>{`${row.text}`}</div>
              <div className={classes.questionArrow}>&#62;</div>
            </div>
          ))}
        </div>
        <div className={classes.answer}>
          <div className={classes.answerTop}>
            <div className={classes.aicon}>Q.</div>
            <div className={classes.aText}>
              {questionNum.text}
            </div>
          </div>
          <div className={classes.answerBottom}>
            {questionNum.ans.split('\n').map((row: string) => (
              <p key={shortid.generate()} className={classes.answerText}>{`${row}`}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Question;
