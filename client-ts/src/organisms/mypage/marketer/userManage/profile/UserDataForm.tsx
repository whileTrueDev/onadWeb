// @material-ui/core
import { Grid, makeStyles, Paper } from '@material-ui/core';
import classnames from 'classnames';
import { useSnackbar } from 'notistack';
import { useContext, useEffect } from 'react';
import EditableTextField from '../../../../../atoms/EditableInput/EditableTextField';
import MarketerInfoContext from '../../../../../context/MarketerInfo.context';
import { useEventTargetValue, usePatchRequest } from '../../../../../utils/hooks';
import { MarketerInfo } from '../../../../../utils/hooks/query/useMarketerProfile';
import EditablePasswordInput from './sub/EditablePasswordInput';
import EditablePhoneInput from './sub/EditablePhoneInput';
import EditProfileImage from './sub/EditProfileImage';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  field: { margin: theme.spacing(2, 0) },
  first: { margin: theme.spacing(0, 0, 2) },
  editable: {},
  value: { margin: theme.spacing(1, 0) },
  textField: {
    maxWidth: 320,
    margin: theme.spacing(1, 0),
  },
}));

export interface UserDataFormProps {
  userData: MarketerInfo;
}
const UserDataForm = ({ userData }: UserDataFormProps): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const marketerInfo = useContext(MarketerInfoContext);

  const nameValue = useEventTargetValue(userData.marketerName);
  const passwordValue = useEventTargetValue();
  const mailValue = useEventTargetValue(userData.marketerMail);
  const phoneValue = useEventTargetValue(userData.marketerPhoneNum);

  // 변경 이후 유저데이터를 다시 불러왔을 때 곧바로 default 값이 재수정 되도록 이펙트 설정
  useEffect(() => {
    nameValue.setValue(userData.marketerName);
    mailValue.setValue(userData.marketerMail);
    phoneValue.setValue(userData.marketerPhoneNum);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.marketerMail, userData.marketerName, userData.marketerPhoneNum]);

  const { loading, doPatchRequest } =
    usePatchRequest<{ type: string; value: string | number }, any[]>('/marketer');

  /**
   * 내 정보 수정 핸들러
   * @param type 변경할 필드
   * @param value 해당 필드의 변경할 값
   */
  function handlePatchSubmit(
    type: 'name' | 'password' | 'mail' | 'phone' | 'profileImage',
    value: string,
  ): void {
    doPatchRequest({ type, value })
      .then(() => {
        enqueueSnackbar('성공적으로 수정하였습니다.', { variant: 'success' });
        setTimeout(() => {
          marketerInfo.doGetRequest();
        }, 1000);
      })
      .catch(() => {
        enqueueSnackbar('수정중 오류가 발생했습니다. 문의바랍니다.', { variant: 'error' });
      });
  }

  return (
    <Paper className={classes.container}>
      <Grid container>
        <Grid item xs={12} className={classnames(classes.field, classes.first)}>
          <EditProfileImage
            loading={loading}
            onSubmit={(image): void => {
              handlePatchSubmit('profileImage', image);
            }}
          />
        </Grid>

        {/* 회사명/브랜드명/이름 */}
        <Grid item xs={12} className={classes.field}>
          <EditableTextField
            loading={loading}
            label="이름(회사명or브랜드명)"
            displayValue={userData.marketerName}
            value={nameValue.value}
            onChange={nameValue.handleChange}
            onSubmit={(name): void => {
              handlePatchSubmit('name', name);
            }}
            onReset={nameValue.handleReset}
            helperText="방송인과 시청자에게 해당 이름으로 보여집니다."
            inputProps={{
              maxLength: 15,
            }}
          />
        </Grid>

        <Grid item xs={12} className={classes.field}>
          <EditablePasswordInput
            loading={loading}
            label="비밀번호"
            displayValue="****"
            value={passwordValue.value}
            onChange={passwordValue.handleChange}
            onSubmit={(password): void => {
              handlePatchSubmit('password', password);
            }}
            onReset={passwordValue.handleReset}
            helperText="특수문자 !@#$%^*+=- 를 포함한 8-20 영문 또는 숫자."
          />
        </Grid>

        {/* 이메일 */}
        <Grid item xs={12} className={classes.field}>
          <EditableTextField
            loading={loading}
            label="이메일"
            displayValue={userData.marketerMail}
            value={mailValue.value}
            onChange={mailValue.handleChange}
            onSubmit={(mail): void => {
              handlePatchSubmit('mail', mail);
            }}
            onReset={mailValue.handleReset}
            helperText="연락가능한 이메일을 입력해주세요."
            textFieldProps={{
              type: 'email',
            }}
          />
        </Grid>

        {/* 휴대전화 */}
        <Grid item xs={12} className={classes.field}>
          <EditablePhoneInput
            loading={loading}
            label="휴대전화"
            displayValue={userData.marketerPhoneNum}
            value={phoneValue.value}
            onChange={(v): void => phoneValue.setValue(v.formattedValue)}
            onSubmit={(phoneNum): void => {
              handlePatchSubmit('phone', phoneNum);
            }}
            onReset={phoneValue.handleReset}
            formControlProps={{}}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserDataForm;
