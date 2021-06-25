import { Button, Divider, makeStyles, TextField, Typography } from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import { useState } from 'react';
import * as React from 'react';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import courierCompanies, { CourierCompany } from '../../../../../constants/courierCompanies';
import renderOrderStatus, {
  OrderStatus,
  주문상태_출고완료,
  주문상태_주문취소,
} from '../../../../../utils/render_funcs/renderOrderStatus';
import { MerchandiseOrder } from '../../adManage/interface';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(2, 0),
  },
  textfield: {
    margin: theme.spacing(1, 0),
  },
  bold: {
    fontWeight: 'bold',
  },
}));

export interface OrderCourierDTO {
  courierCompany?: CourierCompany; // 택배사
  trackingNumber?: string; // 송장번호
}

interface OrderStateChangeDialogProps {
  open: boolean;
  onClose: () => void;
  merchandiseOrder: MerchandiseOrder;
  selectedStatus: OrderStatus;
  onClick: (dto: { status: OrderStatus; dto?: OrderCourierDTO; denialReason?: string }) => void;
}

export default function OrderStateChangeDialog({
  open,
  onClose,
  merchandiseOrder,
  selectedStatus,
  onClick,
}: OrderStateChangeDialogProps): React.ReactElement {
  const classes = useStyles();

  const [dto, setDto] = useState<OrderCourierDTO>({
    courierCompany: undefined,
    trackingNumber: '',
  });

  const defaultError = { field: '', message: '' };
  const [error, setError] = useState(defaultError);
  function handleError(field: string, message: string): void {
    setError({ field, message });
  }

  const handleTrackNumChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setError(defaultError);
    setDto({ ...dto, trackingNumber: e.target.value });
  };
  const handleCourierCompChange = (e: React.ChangeEvent<any>, newValue: string | null): void => {
    const courierCompany = newValue as CourierCompany | undefined;
    setError(defaultError);
    setDto({ ...dto, courierCompany });
  };

  const [denialReason, setDenialReason] = useState('');
  function handleDenialReasonChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setError(defaultError);
    setDenialReason(e.target.value);
  }

  return (
    <CustomDialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={onClose}
      buttons={
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={(): void => {
              if (selectedStatus === 주문상태_출고완료) {
                if (!dto.courierCompany)
                  return handleError('courierCompany', '택배사를 입력해주세요.');
                if (!dto.trackingNumber)
                  return handleError('trackingNumber', '송장번호를 입력해주세요.');
                return onClick({ status: selectedStatus, dto });
              }
              if (selectedStatus === 주문상태_주문취소 && !denialReason) {
                return handleError('denialReason', '취소사유를 입력해주세요.');
              }
              return onClick({ status: selectedStatus, denialReason });
            }}
          >
            확인
          </Button>
          <Button variant="contained" onClick={onClose}>
            취소
          </Button>
        </div>
      }
    >
      <div>
        {/* 출고완료로 변경하는 경우 */}
        {selectedStatus === 주문상태_출고완료 && (
          <>
            <Autocomplete
              aria-required
              value={dto.courierCompany}
              onChange={handleCourierCompChange}
              // concat nothing to converting readonly array => mutable array
              options={courierCompanies as any} // 현재 버전에서 readonly 타입을 지원하지 않는 버그 있음.
              fullWidth
              renderInput={params => (
                <TextField
                  {...params}
                  required
                  label="택배사"
                  variant="outlined"
                  error={error.field === 'courierCompany'}
                  helperText={error.field === 'courierCompany' ? error.message : null}
                  className={classes.textfield}
                />
              )}
            />

            <TextField
              className={classes.textfield}
              required
              fullWidth
              label="송장번호"
              variant="outlined"
              value={dto.trackingNumber}
              error={error.field === 'trackingNumber'}
              helperText={error.field === 'trackingNumber' ? error.message : null}
              onChange={handleTrackNumChange}
              inputProps={{
                maxLength: 40,
              }}
            />
            <Divider className={classes.divider} />
          </>
        )}

        {/* 주문취소로 변경하는 경우 */}
        {selectedStatus === 주문상태_주문취소 && (
          <TextField
            className={classes.textfield}
            required
            fullWidth
            label="취소사유입력"
            variant="outlined"
            rows={2}
            rowsMax={5}
            multiline
            value={denialReason}
            onChange={handleDenialReasonChange}
            error={error.field === 'denialReason'}
            helperText={error.field === 'denialReason' ? error.message : null}
            inputProps={{
              maxLength: 200,
            }}
          />
        )}

        <Alert severity="info">
          <Typography>
            {`${merchandiseOrder.name}의 상태를`}
            <Typography
              component="span"
              color={selectedStatus === 주문상태_주문취소 ? 'error' : 'primary'}
              className={classes.bold}
            >
              {` ${renderOrderStatus(selectedStatus)} `}
            </Typography>
            로 변경하시겠습니까?
          </Typography>
        </Alert>
      </div>
    </CustomDialog>
  );
}
