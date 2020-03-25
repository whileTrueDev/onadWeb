import React from 'react';
import Typography from '@material-ui/core/Typography';
import {
  Grid, Divider, Snackbar, IconButton, TextField, InputAdornment, MenuItem, Hidden
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme } from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import Button from '../../../../../atoms/CustomButtons/Button';
import StyledInput from '../../../../../atoms/StyledInput';
import useDialog from '../../../../../utils/hooks/useDialog';
import usePatchRequest from '../../../../../utils/hooks/usePatchRequest';
import { UserInterface } from '../interface';


const useStyles = makeStyles((theme: Theme) => ({
  item: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textField: {
    [theme.breakpoints.down('xs')]: {
      minWidth: '200px',
      marginRight: 0,
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: '300px',
      marginRight: '10px',
    },
  },
  emailField: {
    width: '100%'
  },
  text: {
    marginTop: theme.spacing(2),
    minHeight: '90px'
  },
  input: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      fontSize: '12px',
      margin: 0,
    },
  },
  campaign: {
    fontSize: '16px',
    fontWeight: 700,
    color: theme.palette.text.primary
  },
  contents: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.action.hover
  }
}));

const initialState = {
  passwordValue: '',
  password: false,
  repasswd: false,
  email: '',
  phoneNum: '',
  domain: '',
  name: ''
};

const domains = [
  { value: 'naver.com' },
  { value: 'daum.net' },
  { value: 'nate.com' },
  { value: 'gmail.com' },
  { value: 'hotmail.com' },
  { value: 'yahoo.co.kr' },
  { value: '직접입력' },
];


interface StateInterface {
  passwordValue: string;
  password: boolean;
  repasswd: boolean;
  email: string;
  phoneNum: string;
  domain: string;
  name: string;
}

interface Action {
  type: string;
  value: string;
}

const reducer = (state: StateInterface, action: Action): StateInterface => {
  switch (action.type) {
    case 'name': {
      return { ...state, name: action.value };
    }
    case 'password': {
      const regx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
      if (regx.test(action.value)) {
        return { ...state, passwordValue: action.value, password: false };
      }
      return { ...state, passwordValue: action.value, password: true };
    }
    // repasswd는 패스워드와 동일한지 여부를 체크하는 action
    case 'repasswd': {
      if (state.passwordValue === action.value) {
        return { ...state, repasswd: false };
      }
      return { ...state, repasswd: true };
    }
    case 'email': {
      return { ...state, email: action.value };
    }
    case 'phoneNum': {
      return { ...state, phoneNum: action.value };
    }
    case 'domain': {
      return { ...state, domain: action.value };
    }
    case 'reset': {
      console.log('모든 State를 reset합니다');
      return initialState;
    }
    default: {
      return state;
    }
  }
};


interface UserDataUpdateDialogProps {
  open: boolean;
  handleClose: () => void;
  userData: UserInterface;
  doGetRequest: () => void;
}

const UserDataUpdateDialog = (props: UserDataUpdateDialogProps): JSX.Element => {
  const classes = useStyles();
  const {
    open, handleClose, userData, doGetRequest
  } = props;
  const snack = useDialog();
  const [marketerCustomDomain, setCustomDomain] = React.useState<string>('');
  const [formattedPhone, setFomattedPhone] = React.useState<string>('');
  const [inputPhoneNum, setPhoneNum] = React.useState<string>('');
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { doPatchRequest } = usePatchRequest<{ type: string; value: string | number }, any[]>('/marketer', doGetRequest);


  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    dispatch({ type: name, value: event.target.value });
  };

  const handleCustom = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setCustomDomain(event.target.value);
  };

  const handlePhoneNum = (value: { value: string; formattedValue: string }): void => {
    setPhoneNum(value.value);
    setFomattedPhone(value.formattedValue);
  };

  const handleSubmit = (type: string): void => {
    const getValue = (intype: string): string => {
      switch (intype) {
        case 'password':
          return state.passwordValue;
        case 'phone':
          return formattedPhone;
        case 'mail':
          return `${state.email}@${state.domain}`;
        case 'name':
          return state.name;
        default:
          return '';
      }
    };
    const value = getValue(type);
    doPatchRequest({ type, value });
    snack.handleOpen();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      title="내 정보 변경"
    >
      <Grid container direction="column">
        {(userData.platformType === 0)
          && (
            <Grid item className={classes.contents}>
              <Grid container direction="row" justify="space-evenly" style={{ minHeight: '180px' }}>
                <Grid item container direction="row" justify="space-evenly" xs={12} sm={2}>
                  <Grid item className={classes.item}>
                    <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
                      비밀번호 변경
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Hidden smDown>
                      <Divider orientation="vertical" variant="fullWidth" />
                    </Hidden>
                    <Hidden mdUp>
                      <Divider orientation="horizontal" variant="fullWidth" />
                    </Hidden>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={10}>
                  <Grid container direction="row" justify="space-evenly">
                    <Grid item xs={5} className={classes.item}>
                      <Grid item className={classes.text}>
                        <TextField
                          required
                          label="PASSWORD"
                          type="password"
                          id="password"
                          placeholder="변경할 비밀번호를 입력하세요."
                          onChange={handleChange('password')}
                          helperText={state.password ? '특수문자를 포함한 영문/숫자 혼합 8자리 이상입니다.' : ' '}
                          error={state.password}
                          className={classes.textField}
                          margin="normal"
                          autoFocus
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={5}>
                      <Grid container direction="column">
                        <Grid item className={classes.text}>
                          <Grid container direction="column" spacing={1} className={classes.item}>
                            <Grid item>
                              <TextField
                                required
                                label="RE-PASSWORD"
                                type="password"
                                placeholder="변경할 비밀번호를 재입력하세요."
                                helperText={state.repasswd ? '비밀번호가 동일하지 않습니다.' : ' '}
                                error={state.repasswd}
                                className={classes.textField}
                                onChange={handleChange('repasswd')}
                                margin="normal"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item container direction="row" justify="flex-end">
                    <Grid item>
                      <Button
                        color="primary"
                        size="small"
                        onClick={(): void => {
                          // state체크 및 error 분기화
                          if (!(state.password || state.repasswd) && state.passwordValue !== '') {
                            handleSubmit('password');
                          } else {
                            alert('입력이 올바르지 않습니다.');
                          }
                        }}
                      >
                        변경
                      </Button>
                      <Button size="small" onClick={handleClose}>
                        취소
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Divider orientation="horizontal" />
              </Grid>
            </Grid>
          )}

        <Grid item className={classes.contents}>
          <Grid container direction="row" justify="space-evenly" style={{ minHeight: '100px' }}>
            <Grid item container direction="row" justify="space-evenly" xs={2}>
              <Grid item className={classes.item}>
                <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
                  이름 변경
                </Typography>
              </Grid>
              <Grid item>
                <Divider orientation="vertical" variant="fullWidth" />
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Grid container direction="column">
                <Grid item className={classes.item}>
                  <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
                    현재 마케터의 이름
                  </Typography>
                </Grid>
                <Grid item>
                  <Divider orientation="horizontal" variant="middle" />
                </Grid>
                <Grid item className={classes.text}>
                  <Typography align="center" className={classes.campaign}>
                    {userData.marketerName || ''}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Grid container direction="column">
                <Grid item className={classes.item}>
                  <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
                    변경할 이름
                  </Typography>
                </Grid>
                <Grid item>
                  <Divider orientation="horizontal" variant="middle" />
                </Grid>
                <Grid item className={classes.text}>
                  <Grid container direction="column" spacing={1} className={classes.item}>
                    <Grid item>
                      <StyledInput onChange={handleChange('name')} style={{ width: '200px' }} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item container direction="row" justify="flex-end">
                  <Grid item>
                    <Button
                      color="primary"
                      size="small"
                      onClick={(): void => {
                        // state체크 및 error 분기화
                        if (state.name !== '' && state.name !== null) {
                          handleSubmit('name');
                        } else {
                          alert('입력이 올바르지 않습니다.');
                        }
                      }}
                    >
                      변경
                    </Button>
                    <Button size="small" onClick={handleClose}>
                      취소
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Divider orientation="horizontal" />
          </Grid>
        </Grid>

        {(userData.platformType === 0)
          && (
            <Grid item container className={classes.contents} direction="row" justify="space-evenly" style={{ minHeight: '100px' }}>
              <Grid item container direction="row" justify="space-evenly" xs={2}>
                <Grid item className={classes.item}>
                  <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
                    이메일 변경
                  </Typography>
                </Grid>
                <Grid item>
                  <Divider orientation="vertical" variant="fullWidth" />
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Grid container direction="column">
                  <Grid item className={classes.item}>
                    <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
                      현재 이메일
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Divider orientation="horizontal" variant="middle" />
                  </Grid>
                  <Grid item style={{ marginTop: '16px' }}>
                    <Typography align="center" className={classes.campaign} style={{ marginTop: '20px' }}>
                      {userData.marketerMail || ''}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={7}>
                <Grid container direction="column">
                  <Grid item className={classes.item}>
                    <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
                      변경할 이메일
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Divider orientation="horizontal" variant="middle" />
                  </Grid>
                  <Grid item className={classes.text}>
                    <Grid container direction="row" className={classes.item} spacing={1}>
                      <Grid item>
                        <TextField
                          required
                          label="EMAIL ID"
                          className={classes.emailField}
                          onChange={handleChange('email')}
                          helperText="EMAIL ID을 입력하세요."
                          margin="normal"
                          id="email"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            endAdornment: <InputAdornment position="end"><div>@</div></InputAdornment>,
                          }}
                        />
                      </Grid>
                      <Grid item>
                        {state.domain !== '직접입력' ? (
                          <TextField
                            required
                            select
                            label="Domain"
                            className={classes.emailField}
                            value={state.domain}
                            onChange={handleChange('domain')}
                            helperText="EMAIL Domain을 선택하세요."
                            InputLabelProps={{
                              shrink: true,
                            }}
                            margin="normal"
                          >
                            {domains.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.value}
                              </MenuItem>
                            ))}
                          </TextField>

                        )
                          : (
                            <TextField
                              required
                              autoFocus
                              label="Domain"
                              className={classes.emailField}
                              value={marketerCustomDomain}
                              onChange={handleCustom}
                              helperText="EMAIL Domain을 입력하세요."
                              InputLabelProps={{
                                shrink: true,
                              }}
                              margin="normal"
                            />
                          )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item container direction="row" justify="flex-end">
                    <Grid item>
                      <Button
                        color="primary"
                        size="small"
                        onClick={(): void => {
                          // state체크 및 error 분기화
                          if (state.email !== '' && state.domain !== '') {
                            handleSubmit('mail');
                          } else {
                            alert('입력이 올바르지 않습니다.');
                          }
                        }}
                      >
                        변경
                      </Button>
                      <Button size="small" onClick={handleClose}>
                        취소
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider orientation="horizontal" />
              </Grid>
            </Grid>
          )}

        <Grid item className={classes.contents}>
          <Grid container direction="row" justify="space-evenly" style={{ minHeight: '100px' }}>
            <Grid item container direction="row" justify="space-evenly" xs={2}>
              <Grid item className={classes.item}>
                <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
                  전화번호 변경
                </Typography>
              </Grid>
              <Grid item>
                <Divider orientation="vertical" variant="fullWidth" />
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Grid container direction="column">
                <Grid item className={classes.item}>
                  <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
                    현재 전화번호
                  </Typography>
                </Grid>
                <Grid item>
                  <Divider orientation="horizontal" variant="middle" />
                </Grid>
                <Grid item className={classes.text}>
                  <Typography align="center" className={classes.campaign}>
                    {userData.marketerPhoneNum || ''}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Grid container direction="column">
                <Grid item className={classes.item}>
                  <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
                    변경할 전화번호
                  </Typography>
                </Grid>
                <Grid item>
                  <Divider orientation="horizontal" variant="middle" />
                </Grid>
                <Grid item className={classes.text}>
                  <Grid container direction="column" spacing={1} className={classes.item}>
                    <Grid item>
                      <NumberFormat
                        placeholder="(___) - ____ - ____"
                        value={inputPhoneNum}
                        onValueChange={handlePhoneNum}
                        customInput={StyledInput}
                        format="(###) - #### - ####"
                        mask="_"
                        style={{ width: '150px' }}
                        allowNegative={false}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item container direction="row" justify="flex-end">
                  <Grid item>
                    <Button
                      color="primary"
                      size="small"
                      onClick={(): void => {
                        // state체크 및 error 분기화
                        if (inputPhoneNum !== '' && inputPhoneNum !== null) {
                          handleSubmit('phone');
                        } else {
                          alert('입력이 올바르지 않습니다.');
                        }
                      }}
                    >
                      변경
                    </Button>
                    <Button size="small" onClick={handleClose}>
                      취소
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Divider orientation="horizontal" />
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={snack.open}
        autoHideDuration={500}
        onClose={(): void => {
          snack.handleClose();
          handleClose();
        }}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        // variant="success"
        message={<Typography id="message-id">성공적으로 반영되었습니다.</Typography>}
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={(): void => {
              snack.handleClose();
              handleClose();
            }}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Dialog>
  );
};

export default UserDataUpdateDialog;
