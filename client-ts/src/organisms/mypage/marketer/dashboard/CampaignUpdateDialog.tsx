import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Grid, Checkbox, FormControlLabel, Divider, Snackbar, IconButton } from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme } from '@material-ui/core/styles';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import Dialog from '../../../../atoms/Dialog/Dialog';
import Button from '../../../../atoms/CustomButtons/Button';
import StyledInput from '../../../../atoms/StyledInput';
import DangerTypography from '../../../../atoms/Typography/Danger';
import Success from '../../../../atoms/Typography/Success';
import useDialog from '../../../../utils/hooks/useDialog';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';
import { CampaignInterface } from './interfaces';

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: theme.spacing(2),
    minHeight: '90px',
  },
  input: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      fontSize: '12px',
      margin: 0,
    },
  },
  campaign: { fontSize: '16px', fontWeight: 700, color: theme.palette.text.primary },
  contents: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
  },
}));

type Action =
  | { key: 'noBudget' }
  | { key: 'reset' }
  | { key: 'campaignName'; value: string }
  | { key: 'budget'; value: string };

interface StateInterface {
  noBudget: boolean;
  budget: string;
  campaignName: string;
}

const reducer = (state: StateInterface, action: Action): StateInterface => {
  switch (action.key) {
    case 'campaignName':
      return { ...state, campaignName: action.value };
    case 'noBudget': {
      return {
        ...state,
        noBudget: !state.noBudget,
        budget: !state.noBudget === true ? '' : state.budget,
      };
    }
    case 'budget': {
      return { ...state, budget: action.value };
    }
    case 'reset': {
      return {
        noBudget: false,
        budget: '',
        campaignName: '',
      };
    }
    default: {
      return state;
    }
  }
};

const MIN_BUDGET_ERR_MSG = '최소 금액(5000원) 보다 작습니다.';
const BUDGET_WARNING_MSG = `* 금일 집행한 금액이 이미 변경할 일일 예산을 초과했습니다.
* 변경시 금일 광고 진행이 중단되며 일일 예산은 내일부터 적용됩니다.`;
interface CampaignUpdateDialogProps {
  open: boolean;
  selectedCampaign: CampaignInterface;
  handleClose: () => void;
  doGetRequest: () => void;
}
const CampaignUpdateDialog = (props: CampaignUpdateDialogProps): JSX.Element => {
  const classes = useStyles();

  const { open, selectedCampaign, handleClose, doGetRequest } = props;

  const snack = useDialog();
  const [error, setError] = React.useState<string | false>(false); // budget 작성시 한도 체크용 State
  const [checkName, setCheckName] = React.useState<boolean>(false);
  const [duplicate, setDuplicate] = React.useState<boolean>(false);

  const [state, dispatch] = React.useReducer(reducer, {
    noBudget: false,
    budget: '',
    campaignName: '',
  });

  const nameData = useGetRequest<string[]>('/marketer/campaign/names');
  // {'campaignId', 'data', 'type'} 의 데이터를 전달해야 가능하다.
  const { doPatchRequest } = usePatchRequest('/marketer/campaign', doGetRequest);
  // const updateBudget = usePatchRequest('/api/dashboard/marketer/campaign', doGetRequest);

  const checkCampaignName = (value: string): void => {
    if (!nameData.loading && !nameData.error) {
      if (nameData.data.includes(value)) {
        setCheckName(false);
        dispatch({ key: 'campaignName', value: '' });
        setDuplicate(true);
      } else {
        setCheckName(true);
        dispatch({ key: 'campaignName', value });
        setDuplicate(false);
      }
    }
  };

  const handleChangeName = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    if (event.target.value.length === 0) {
      setDuplicate(false);
    }
    if (event.target.value.length >= 3) {
      checkCampaignName(event.target.value);
    } else {
      setCheckName(false);
      dispatch({ key: 'campaignName', value: '' });
    }
  };

  const handleNoBudgetChange = (): void => {
    setError(false);
    dispatch({ key: 'noBudget' });
  };

  const handleChangeBudget = (value: NumberFormatValues): void => {
    dispatch({ key: 'budget', value: value.value });
    if (Number(value.value) < 5000 && value.value !== '') {
      setError(MIN_BUDGET_ERR_MSG);
    } else if (value.value !== '' && Number(value.value) < Number(selectedCampaign.dailysum)) {
      // 변경할 예산보다 현재 집행된 금액이 큰 경우
      setError(BUDGET_WARNING_MSG);
    } else {
      setError(false);
    }
  };

  const handleNameUpdate = (): void => {
    const data = { campaignId: selectedCampaign.campaignId, type: 'name', data: state };
    doPatchRequest(data);
    dispatch({ key: 'reset' });
    snack.handleOpen();
  };

  const handleBudgetUpdate = (): void => {
    const data = { campaignId: selectedCampaign.campaignId, type: 'budget', data: state };
    doPatchRequest(data);
    dispatch({ key: 'reset' });
    snack.handleOpen();
  };

  return (
    <Dialog
      open={Boolean(open)}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      title="배너정보 변경"
    >
      <Grid container direction="column">
        <Grid item className={classes.contents}>
          <Grid container direction="row" justify="space-evenly" style={{ minHeight: '180px' }}>
            <Grid item container direction="row" justify="space-evenly" xs={2}>
              <Grid item className={classes.item}>
                <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
                  캠페인명 변경
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
                    현재 캠페인명
                  </Typography>
                </Grid>
                <Grid item>
                  <Divider orientation="horizontal" variant="middle" />
                </Grid>
                <Grid item className={classes.text}>
                  <Typography align="center" className={classes.campaign}>
                    {selectedCampaign.campaignName}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Grid container direction="column">
                <Grid item className={classes.item}>
                  <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
                    변경할 캠페인 명
                  </Typography>
                </Grid>
                <Grid item>
                  <Divider orientation="horizontal" variant="middle" />
                </Grid>
                <Grid item className={classes.text}>
                  <Grid container direction="column" spacing={1} className={classes.item}>
                    <Grid item>
                      <StyledInput
                        inputProps={{ maxLength: 50 }}
                        autoFocus
                        onChange={handleChangeName}
                        style={{ width: '200px' }}
                      />
                    </Grid>
                    <Grid item>
                      {checkName && state.campaignName !== '' && (
                        <Success>
                          <Check />
                        </Success>
                      )}
                    </Grid>
                    <Grid item>
                      <DangerTypography>
                        {duplicate && '캠페인명이 중복되었습니다.'}
                      </DangerTypography>
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
                        if (checkName && state.campaignName !== '') {
                          handleNameUpdate();
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
        <Grid item className={classes.contents}>
          <Grid container direction="row" justify="space-evenly" style={{ minHeight: '200px' }}>
            <Grid item container direction="row" justify="space-evenly" xs={2}>
              <Grid item className={classes.item}>
                <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
                  일일예산 변경
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
                    현재 일일 예산
                  </Typography>
                </Grid>
                <Grid item>
                  <Divider orientation="horizontal" variant="middle" />
                </Grid>
                <Grid item className={classes.text}>
                  {selectedCampaign.dailyLimit !== -1 ? (
                    <Typography variant="body1" align="center" style={{ fontWeight: 700 }}>
                      {new Intl.NumberFormat().format(selectedCampaign.dailyLimit)}
                    </Typography>
                  ) : (
                    <Typography variant="h4" align="center" style={{ fontWeight: 700 }}>
                      ∞
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Grid container direction="column">
                <Grid item className={classes.item}>
                  <Typography gutterBottom variant="body1" style={{ fontWeight: 700 }}>
                    변경할 일일 예산
                  </Typography>
                </Grid>
                <Grid item>
                  <Divider orientation="horizontal" variant="middle" />
                </Grid>
                <Grid item className={classes.text}>
                  <Grid container direction="column" spacing={1} className={classes.item}>
                    <Grid item>
                      <Grid container spacing={1} className={classes.item}>
                        <Grid item>
                          <NumberFormat
                            value={state.budget}
                            onValueChange={handleChangeBudget}
                            customInput={StyledInput}
                            id="formatted-numberformat-input"
                            margin="dense"
                            style={{ width: '150px' }}
                            disabled={state.noBudget}
                            thousandSeparator
                            prefix="₩ "
                            allowNegative={false}
                          />
                        </Grid>
                        <Grid item>원</Grid>
                        <Grid item>
                          <FormControlLabel
                            control={
                              <Checkbox
                                color="primary"
                                checked={state.noBudget}
                                onChange={handleNoBudgetChange}
                                size="small"
                                style={{ padding: '3px' }}
                              />
                            }
                            label="미설정"
                            labelPlacement="start"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      {!error && state.budget !== '' && (
                        <Success>
                          <Check />
                        </Success>
                      )}
                    </Grid>
                    <Grid item>
                      {error &&
                        error
                          .split('\n')
                          .map(e => <DangerTypography key={e}>{e}</DangerTypography>)}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item container direction="row" justify="flex-end">
                  <Grid item>
                    <Button
                      color="primary"
                      size="small"
                      onClick={(): void => {
                        if (
                          ((error === false || error === BUDGET_WARNING_MSG) &&
                            state.budget !== '') ||
                          state.noBudget
                        ) {
                          handleBudgetUpdate();
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
        autoHideDuration={400}
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
            // className={classes.close}
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

// CampaignUpdateDialog.propTypes = {
//   open: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
//   handleClose: PropTypes.func.isRequired,
//   selectedCampaign: PropTypes.object.isRequired,
//   callUrl: PropTypes.func.isRequired
// };
export default CampaignUpdateDialog;
