import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import shortid from 'shortid';
import textSource from '../source/textSource';


const Styles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(12),
    backgroundColor: 'white',
    padding: '0 10%',
  },
  h1: {
    marginTop: '20px',
    marginBottom: '20px',
    fontSize: 45,
    fontWeight: 600,
    [theme.breakpoints.down('md')]: {
      fontSize: '30px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '25px',
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 20,
      fontSize: '20px',
    },
    color: '#0D93BF',
    fontFamily: 'Noto Sans KR',
  },
  QnAWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  question: {
    width: '35%',
    height: 400,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: '30px',
    [theme.breakpoints.down('md')]: {
      width: '45%',
      height: 350,
      marginRight: '20px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '45%',
      height: 300,
      marginRight: '10px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: 200,
      marginRight: '0px',
    },
  },
  questionText: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    boxShadow: '0px 0px 5px 1px rgba(0,0,0,0.2)',
    padding: '10px 25px',
    '&:hover': {
      cursor: 'pointer'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '8px 8px',
    },
  },
  questionTextClicked: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    boxShadow: '0px 0px 5px 1px rgba(0,0,0,0.2)',
    padding: '10px 25px',
    '&:hover': {
      cursor: 'pointer'
    },
    backgroundColor: '#3154EB',
    '&>*': {
      color: 'white !important'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '8px 8px',
    },
  },
  qicon: {
    width: '12%',
    fontFamily: 'S-CoreDream-8Heavy',
    fontSize: 25,
    color: '#3154EB',
    [theme.breakpoints.down('md')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 11,
    },
  },
  qText: {
    width: '86%',
    fontFamily: 'Noto Sans KR',
    fontSize: 20,
    color: 'black',
    [theme.breakpoints.down('md')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 11,
    },
  },
  questionArrow: {
    width: '12%',
    fontFamily: 'S-CoreDream-5Heavy',
    fontSize: 20,
    color: '#3154EB',
    textAlign: 'right',
    [theme.breakpoints.down('md')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 11,
    },
  },
  answer: {
    width: '65%',
    boxShadow: '0px 0px 5px 1px rgba(0,0,0,0.2)',
    height: 400,
    padding: 30,
    [theme.breakpoints.down('md')]: {
      width: '50%',
      height: 350,
      padding: 10,
    },
    [theme.breakpoints.down('sm')]: {
      width: '50%',
      height: 300,
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: 300,
      marginTop: '20px',
    },
  },
  answerTop: {
    width: '100%',
    height: 50,
    borderBottom: '1px solid rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      height: 35,
    },
  },
  answerBottom: {
    width: '100%',
    height: 350,
    paddingTop: 30,
    fontFamily: 'Noto Sans KR',
    fontSize: 25,
    color: 'black',
    [theme.breakpoints.down('md')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 17,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
    },
  },
  aicon: {
    width: 50,
    fontFamily: 'S-CoreDream-8Heavy',
    fontSize: 30,
    color: '#3154EB',
    [theme.breakpoints.down('md')]: {
      fontSize: 22,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    },
  },
  aText: {
    width: '90%',
    fontFamily: 'Noto Sans KR',
    fontWeight: 600,
    fontSize: 30,
    color: 'black',
    [theme.breakpoints.down('md')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 17,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
    },
  }

}));


const Question = () => {
  const classes = Styles();
  const defaultQuestion = {
    id: 'one',
    text: '요금에 대한 정보가 알고 싶어요.',
    ans: textSource.answer.one,
  };

  const [questionNum, setQuestionNum] = React.useState(defaultQuestion);

  function handleClick(row) {
    setQuestionNum({ id: row.id, text: row.text, ans: textSource.answer[row.id] });
  }

  return (
    <div className={classes.root}>
      <h1 className={classes.h1}>
        자주 묻는 질문
      </h1>
      <div className={classes.QnAWrapper}>
        <div className={classes.question}>
          {textSource.question.map(row => (
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
            {questionNum.ans}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
