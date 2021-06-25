import { useState, useEffect } from 'react';
import * as React from 'react';
import shortid from 'shortid';
import { Paper, Typography, Divider, Grid } from '@material-ui/core';
import { Done, Clear } from '@material-ui/icons';
// components
import sources from './withdrawalSources';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import Button from '../../../../../atoms/CustomButtons/Button';
import DangerTypo from '../../../../../atoms/Typography/Danger';
import SuccessTypo from '../../../../../atoms/Typography/Success';
// styles
import useWithdrawalAgreementStyles from './Agreement.style';
// reducer
import { WithdrawlDialogAction } from '../WithdrawalDialog.reducer';

interface WithdrawalAgreement {
  setStepComplete: React.Dispatch<React.SetStateAction<boolean>>;
  checked: boolean;
  dispatch: React.Dispatch<WithdrawlDialogAction>;
}

const WithdrawalAgreement = ({
  setStepComplete,
  checked,
  dispatch,
}: WithdrawalAgreement): JSX.Element => {
  const classes = useWithdrawalAgreementStyles();
  const terms = sources.contentWithdrawal;

  const [open, setOpen] = useState(false);
  useEffect(() => {
    setStepComplete(false);
  }, [setStepComplete]);

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleChange = (): void => {
    dispatch({ key: 'checked', value: true });
    setStepComplete(true);
  };

  return (
    <div>
      <blockquote className={classes.warning}>
        <Typography variant="h6" className={classes.title}>
          &raquo; 주의사항
        </Typography>
        <p className={classes.content}>{terms.agreementSub}</p>
      </blockquote>
      <div>
        <Paper className={classes.container} elevation={2}>
          <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
            <Grid item>
              <Typography>{terms.itemTitle}</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <Button onClick={handleOpen}>전문보기</Button>
                </Grid>
                <Grid item>
                  <Divider className={classes.divider} />
                </Grid>
                <Grid item>
                  {checked ? (
                    <SuccessTypo>
                      <Done />
                    </SuccessTypo>
                  ) : (
                    <DangerTypo>
                      <Clear />
                    </DangerTypo>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        <Dialog open={open} onClose={handleClose} title={terms.itemTitle} maxWidth="md">
          {/* 계약 내용 */}
          <div className={classes.inDialogContent}>
            {terms.agreement.split('\n').map(sentence => (
              <Typography variant="body2" key={shortid.generate()} className={classes.names}>
                {sentence}
              </Typography>
            ))}

            <div style={{ textAlign: 'right' }}>
              <Button
                color="primary"
                onClick={(): void => {
                  // withdrawal agree
                  handleChange();
                  // dialog close
                  handleClose();
                }}
              >
                동의
              </Button>
              <Button onClick={handleClose}>취소</Button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default WithdrawalAgreement;
