import React from 'react';
import PropTypes from 'prop-types';
import green from '@material-ui/core/colors/green';
import { Redirect } from 'react-router-dom';
import {
  Paper,
  Typography,
  withStyles,
  FormControlLabel,
  Checkbox,
  Divider,
  Button
} from '@material-ui/core';

const terms = [
  {
    title : 'While:true 이용 약관', 
    state : 'checkedA',
    text : '' 
  },
  {
    title : '개인정보 수집 및 이용 동의', 
    state : 'checkedB',
    text : ''
  },
  {
    title : '서비스 및 관련광고 수신 동의', 
    state : 'checkedC',
    text : ''
  },
]

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  checked: {},
  checkboxRoot : {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  divider: {
    width: 2,
    height: 28,
    margin: 10,
  },
  container : {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop : theme.spacing(2),
    display : 'flex',
    backgroundColor : '#f2f2f2',
    flex : 1,
    flexDirection : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize : 13
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
});


class PaperSheet extends React.Component {
  state = {
    checkedA: false,
    checkedB: false,
    checkedC: false,
    checkedAll : false
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  getChange = name => {
    return this.state.name;
  }

  finishReg = event => {
    if(this.state.checkedA && this.state.checkedB && this.state.checkedC){
      this.props.handleUserSubmit();
    }else{
      alert('모든 약관에 동의하지 않으면 회원가입이 완료되지 않습니다.');
    }
  }
  
  render() {
    const { classes, handleNext, handleReset } = this.props;
    return (
      <div>
          <Paper className={classes.root} elevation={1}>
          <Typography variant="h6" component="h6" style={{textAlign : 'center'}}>
            While:True
          </Typography>
          {terms.map((term, index) => (
          <Paper className={classes.container} elevation={1} key = {term.state}>
            <Typography component="p" style = {{flex : 8, fontSize : 13}}>
              {term.title}
            </Typography>
            <Button style = {{flex : 1, backgroundColor : '#d6d6d6' , height : '70%', fontSize : 13}}>약관보기</Button>
            <Divider className={classes.divider} />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.getChange(term.state)}
                  onChange={this.handleChange(term.state)}
                  value= {term.state}
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked,
                  }}
                />
              }
              label="동의"
              style = {{flex : 2, marginRight : 0}}
            />
          </Paper>
        
        ))}
          {/* <FormControlLabel
            control={
              <Checkbox
                checked={this.state.checkedAll}
                value="checkedAll"
                classes={{
                  root: classes.checkboxRoot,
                  checked: classes.checked,
                }}
              />
            }
            label="모든 약관 및 선택 정보에 동의 합니다."
            style={{marginTop :10}}
          /> */}
        </Paper>
        <div className={classes.actionsContainer}>  
          <div>
            <Button
            onClick={handleReset}
            className={classes.button}
            >
            다시입력
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.finishReg}
              className={classes.button}
            >
            가입완료
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaperSheet);
