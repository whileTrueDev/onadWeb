import React from 'react';
import { Grid, Divider } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import StyledItemText from '../../../atoms/StyledItemText';
import OptionSelectPaper from './component/OptionSelectPaper';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: '0px',
    alignItem: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
    '& .MuiGrid-container': {
      flexWrap: 'nowrap',
    }
  },
  item: {
    marginBottom: '15px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
      padding: 0,
    },
  },
}));

const options = [
  {
    id: 'option1',
    primaryText: '1. 배너 광고 + 클릭 광고',
    secondaryText: '상품, 브랜드 홍보 뿐 아니라 구매 전환까지 하고 싶어요.',
  },
  {
    id: 'option0',
    primaryText: '2. 배너 광고',
    secondaryText: '상품, 브랜드 홍보만 하고싶어요.',
  },
  {
    id: 'option2',
    primaryText: '3. 클릭 광고',
    secondaryText: '구매 전환을 하고 싶어요.',
  },
];

const OptionPaper = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const {
    state, dispatch,
    setStepComplete, step, // for '다음' 버튼 관리
  } = props;

  // option을 선택하였을 때 event listener
  const handleChange = (event) => {
    // optionType 값 변경을 위해.
    dispatch({ key: event.currentTarget.name });
    // for '다음' 버튼
    setStepComplete(true);
  };

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      {/* 옵션 선택 paper 제목 */}
      <Grid item className={classes.item}>
        <StyledItemText primary="첫째, &nbsp;&nbsp; 광고 유형 선택" secondary="해당 광고 캠페인의 유형을 선택하세요." />
        <Divider component="hr" style={{ height: '2px' }} />
      </Grid>

      {/* optionType 선택 이전 */}
      {step === 0 && (
        <Grid item className={classes.item} xs={12} lg={6}>
          {options.map(opt => (
            <OptionSelectPaper
              key={opt.id}
              name={opt.id}
              primaryText={opt.primaryText}
              secondaryText={opt.secondaryText}
              handleOptionSelect={handleChange}
              checked={state.option === opt.id}
              elevation={state.option === opt.id ? 1 : 4}
              fontColor={state.option === opt.id
                ? theme.palette.common.white : 'inherit'}
              style={{
                backgroundColor: state.option === opt.id
                  ? theme.palette.primary.light : 'inherit',
              }}
            />
          ))}

        </Grid>
      )}

      {/* optionType 선택된 이후 */}
      {step > 0 && (
        <Grid item className={classes.item}>
          {options
            .filter(opt => state.option === opt.id)
            .map(selectedOption => (
              <OptionSelectPaper
                key={selectedOption.id}
                name={selectedOption.id}
                primaryText={selectedOption.primaryText}
                secondaryText={selectedOption.secondaryText}
                checked
                fontColor={theme.palette.common.white}
                handleOptionSelect={handleChange}
                style={{ backgroundColor: theme.palette.primary.light }}
              />
            ))}
        </Grid>
      )}
    </Grid>
  );
};

export default OptionPaper;
