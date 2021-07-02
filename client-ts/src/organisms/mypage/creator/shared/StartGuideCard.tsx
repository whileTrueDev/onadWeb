import { Button, makeStyles, Paper, Typography } from '@material-ui/core';
import * as React from 'react';
import { useEffect } from 'react';
import StyledTooltip from '../../../../atoms/Tooltip/StyledTooltip';
import { useCreatorProfile } from '../../../../utils/hooks/query/useCreatorProfile';
// utils
import useDialog from '../../../../utils/hooks/useDialog';
import GuideDialog from './guides/GuideDialog';

export interface ContractionDataType {
  creatorId: string;
  creatorName: string;
  loginId: string;
  creatorIp: string;
  creatorMail: string;
  creatorAccountNumber: string;
  creatorContractionAgreement: number;
  creatorTwitchId: string;
  creatorTwitchOriginalId: string;
  afreecaId: string;
  afreecaName: string;
  afreecaLogo: string;
  realName: string;
  creatorLogo: string;
  NowIp: string;
  CPAAgreement: number;
  settlementState: number;
}

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bold: { fontWeight: 'bold' },
  red: { color: theme.palette.error.main },
}));

const ContractionCard = (): JSX.Element => {
  const classes = useStyles();

  const profile = useCreatorProfile();

  const guideDialog = useDialog(); // 가이드 진행을 위해

  // 첫 사용자 도움 popper
  const tooltip = useDialog();
  useEffect(() => {
    if (!profile.data?.creatorContractionAgreement) {
      tooltip.handleOpen();
    }
  }, [tooltip, profile.data?.creatorContractionAgreement]);

  return (
    <>
      <Paper className={classes.container}>
        <Typography className={classes.bold}>
          <span className={classes.red}>[필수]</span>
          &nbsp; 온애드 시작 가이드
        </Typography>

        {/* 계약 완료 버튼 */}
        <StyledTooltip
          title={<Typography variant="body2">시작가이드와 함께 시작해보세요</Typography>}
          placement="bottom-start"
          open={!guideDialog.open && tooltip.open}
          arrow
          interactive
        >
          <div>
            <Button color="primary" variant="contained" onClick={guideDialog.handleOpen}>
              시작하기
            </Button>
          </div>
        </StyledTooltip>
      </Paper>

      <GuideDialog open={guideDialog.open} onClose={guideDialog.handleClose} />
    </>
  );
};

export default ContractionCard;
