// material-UI
import { Typography, withStyles } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
// 내부 소스
// 프로젝트 내부 모듈
import * as React from 'react';
import { nanoid } from 'nanoid';
import textSource from '../../../source/introductionSource';
// 컴포넌트
// util 계열
// 스타일
import Styles from '../../../styles/mainpage/introduction/question.style';

function Question({ MainUserType }: { MainUserType: string }): JSX.Element {
  const classes = Styles();

  let ansData;
  if (MainUserType === 'marketer') {
    ansData = textSource.answerMarketer;
  } else {
    ansData = textSource.answerCreator;
  }

  let source;
  if (MainUserType === 'marketer') {
    source = textSource.questionMarketer;
  } else {
    source = textSource.questionCreator;
  }

  const Accordion = withStyles(() => ({
    root: {
      borderTop: MainUserType === 'marketer' ? '3px solid #007af4' : '3px solid #33c2a3',
      borderBottom: MainUserType === 'marketer' ? '3px solid #007af4' : '3px solid #33c2a3',
      boxShadow: 'none',
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '&:before': {
        display: 'none',
      },
      '&$expanded': {
        margin: 'auto',
      },
    },
    expanded: {},
  }))(MuiAccordion);

  const AccordionSummary = withStyles(() => ({
    root: {
      borderBottom: '1px solid #c6c6c6',
      marginBottom: -1,
      minHeight: 70,
      '&$expanded': {
        minHeight: 70,
      },
    },
    content: {
      '&$expanded': {
        margin: '12px 0',
      },
    },
    expanded: {},
  }))(MuiAccordionSummary);

  const AccordionDetails = withStyles(theme => ({
    root: {
      padding: theme.spacing(2),
      backgroundColor: '#f8f8f8',
    },
  }))(MuiAccordionDetails);

  function QnAAccordion({ source: _source, ansData: _ansData }: any): JSX.Element {
    const [expanded, setExpanded] = React.useState<string | false>('one');

    const handleChange = (row: any) => (event: React.ChangeEvent<any>, newExpanded: boolean) => {
      setExpanded(newExpanded ? row.id : false);
    };

    return (
      <div>
        {_source.map((row: any, index: number) => (
          <Accordion
            square
            expanded={expanded === row.id}
            onChange={handleChange(row)}
            key={nanoid()}
          >
            <AccordionSummary aria-controls={`${row.id}d-content`} id={`${row.id}d-header`}>
              <div className={classes.titleWrapper}>
                <div className={classes.ansTitle}>{row.text}</div>
                {MainUserType === 'marketer' ? (
                  <img src="/introduction/arrow.svg" alt="arrow" className={classes.arrow} />
                ) : (
                  <img src="/introduction/arrowCreator.svg" alt="arrow" className={classes.arrow} />
                )}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.ansWrapper}>
                {_ansData[index].split('\n').map((ans: string) => (
                  <Typography key={nanoid()} className={classes.color}>
                    {`${ans}`}
                  </Typography>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Typography
        variant="h3"
        className={MainUserType === 'marketer' ? classes.title : classes.title2}
      >
        FAQ
      </Typography>
      <QnAAccordion source={source} ansData={ansData} />
    </div>
  );
}

export default Question;
