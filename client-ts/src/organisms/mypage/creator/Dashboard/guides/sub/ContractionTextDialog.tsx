import React from 'react';
import {
  Grid, Divider, Typography, makeStyles
} from '@material-ui/core';
import Button from '../../../../../../atoms/CustomButtons/Button';
import terms from '../../source/contractTerms';
import Dialog from '../../../../../../atoms/Dialog/Dialog';

const useStyles = makeStyles((theme) => ({
  inDialogContent: {
    padding: theme.spacing(1),
    outline: 'none',
    [theme.breakpoints.down('xs')]: {
      fontWeight: 500,
      fontSize: '10px',
    },
  },
}));

export interface ContractionTextProps {
  activeTermIndex: number;
  open: boolean;
  title: string;
  onClose: () => void;
  onAgree: (index: number) => void;
}
export default function ContractionTextDialog({
  activeTermIndex,
  open,
  title,
  onClose,
  onAgree,
}: ContractionTextProps): JSX.Element {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="sm"
    >
      { /* 약관 보기 Dialog */}

      <div className={classes.inDialogContent}>
        {/* 계약 내용 */}
        {terms[activeTermIndex].text.split('\n').map((sentence) => (
          <p key={sentence}>{sentence}</p>
        ))}
        <Divider />
        <Grid container direction="row" alignContent="center" justify="center">
          <Grid item>
            <Typography variant="body2">
              위의 내용을 올바르게 이해하셨습니까? 아래 버튼을 클릭하여 약관에 동의해주세요.
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" alignContent="center" justify="center">
          <Grid item>
            <Button onClick={onClose}>취소</Button>
            <Button
              color="primary"
              onClick={(): void => {
                onAgree(activeTermIndex);
                onClose();
              }}
            >
              동의
            </Button>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
}
