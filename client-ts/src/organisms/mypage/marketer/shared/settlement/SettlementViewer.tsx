import { Button, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import { useDialog } from '../../../../../utils/hooks';
import { MarketerSettlement } from '../../office/interface';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1, 0, 0),
  },
  container: {
    margin: theme.spacing(1, 0, 0),
  },
}));

export interface SettlementViewerProps {
  settlement: MarketerSettlement;
}
export default function SettlementViewer({ settlement }: SettlementViewerProps): JSX.Element {
  const classes = useStyles();

  const previewDialog = useDialog();
  const [selectedType, setSelectedType] = React.useState<'신분증' | '통장사본'>();
  function handleTypeSelect(type: '신분증' | '통장사본'): void {
    setSelectedType(type);
  }

  return (
    <div className={classes.container}>
      <Typography variant="body2">
        {`유형: ${settlement.businessmanFlag ? '사업자' : '비사업자'}`}
      </Typography>
      <Typography variant="body2">
        {settlement.businessmanFlag ? `회사명: ${settlement.name}` : `이름: ${settlement.name}`}
      </Typography>
      {settlement.businessmanFlag ? (
        <Typography variant="body2">
          {`사업자등록번호: ${settlement.identificationNumber.slice(
            0,
            3,
          )} - ${settlement.identificationNumber.slice(
            3,
            5,
          )} - ${settlement.identificationNumber.slice(5, 10)}`}
        </Typography>
      ) : (
        <Typography variant="body2">
          {`주민등록번호: ${settlement.identificationNumber.slice(0, 6)} - *******`}
        </Typography>
      )}
      <Typography variant="body2">{`은행: ${settlement.bankName}`}</Typography>
      <Typography variant="body2">{`예금주: ${settlement.bankAccountOwner}`}</Typography>
      <Typography variant="body2">
        {`계좌번호: ${settlement.bankAccountNumber.slice(0, 6)}...`}
      </Typography>

      <div>
        <Button
          className={classes.button}
          variant="outlined"
          size="small"
          onClick={(): void => {
            handleTypeSelect('신분증');
            previewDialog.handleOpen();
          }}
        >
          {`${settlement.businessmanFlag ? '사업자등록증 확인' : '신분증 확인'}`}
        </Button>
      </div>

      <div>
        <Button
          className={classes.button}
          variant="outlined"
          size="small"
          onClick={(): void => {
            handleTypeSelect('통장사본');
            previewDialog.handleOpen();
          }}
        >
          통장사본 확인
        </Button>
      </div>

      <CustomDialog
        title={`${selectedType} 확인`}
        open={previewDialog.open}
        onClose={previewDialog.handleClose}
      >
        {selectedType === '신분증' && (
          <img src={settlement.identificationImgSrc} alt="신분증이미지" width="100%" />
        )}
        {selectedType === '통장사본' && (
          <img src={settlement.bankAccountImgSrc} alt="통장사본이미지" width="100%" />
        )}
      </CustomDialog>
    </div>
  );
}
