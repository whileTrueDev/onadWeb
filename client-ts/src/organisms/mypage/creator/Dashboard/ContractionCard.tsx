import React, { useState } from 'react';
import shortid from 'shortid';
import {
  Paper, Typography, Divider, Grid, Collapse
} from '@material-ui/core';
import { Done, Clear } from '@material-ui/icons';
// components
import Dialog from '../../../../atoms/Dialog/Dialog';
import SuccessTypo from '../../../../atoms/Typography/Success';
import DangerTypo from '../../../../atoms/Typography/Danger';
import Button from '../../../../atoms/CustomButtons/Button';
import CustomCard from '../../../../atoms/CustomCard';
import StyledItemText from '../../../../atoms/StyledItemText';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
// utils
import useContractionStyles from './ContractionCard.style';
import terms from './source/contractTerms';
import useDialog from '../../../../utils/hooks/useDialog';
import { usePatchRequest } from '../../../../utils/hooks';
import useGetRequest from '../../../../utils/hooks/useGetRequest';

export interface ContractionDataType {
  creatorId: string;
  creatorName: string;
  creatorIp: string;
  creatorMail: string;
  creatorAccountNumber: string;
  creatorContractionAgreement: number;
  creatorTwitchId: string;
  realName: string;
  creatorLogo: string;
  NowIp: string;
  CPAAgreement: number;
}

interface ContractionCardProps {
  contractionData: ContractionDataType;
  doContractionDataRequest: () => void;
}

const ContractionCard = ({
  contractionData, doContractionDataRequest
}: ContractionCardProps): JSX.Element => {
  const classes = useContractionStyles();
  const snack = useDialog(); // 계약완료 스낵바를 위해
  const contractionDialog = useDialog(); // 계약정보 창을 위해
  // 팔로워 수 정보조회
  const getFollower = useGetRequest<number>('/creator/follower');
  const contractionPatch = usePatchRequest('/creator', // 계약정보 업데이트
    () => {
      doContractionDataRequest();
      // 성공 스낵 오픈
      snack.handleOpen();
    });

  // 모든 계약의 동의 상태값 배열
  const [contractionList, setContractionList] = useState([false, false]);
  // 현재 클릭한 계약 동의 내용 상태값
  const [activeContractionIndex, setActiveContractionIndex] = useState<number>(0);
  // 개별 계약 동의 클릭 핸들 함수
  function handleContractionAgree(targetIndex: number): void {
    // 해당 인덱스의 값만 true 로 변환
    const newData = [...contractionList];
    newData.forEach((data, index) => {
      if (index === targetIndex) {
        newData[index] = true;
      }
    });
    setContractionList(newData);
  }

  return (
    <>
      {contractionData.creatorContractionAgreement === 0 && !getFollower.loading && (

        <CustomCard iconComponent={<StyledItemText primary="서비스  이용 및 출금 계약하기" color="white" />}>

          {terms.map((term, index) => (
            <Paper key={term.state} className={classes.container} elevation={1}>
              <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
                <Grid item>
                  <Typography className={classes.termTitle}>
                    {term.title}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container direction="row" alignItems="center">
                    <Grid item>
                      <Button
                        onClick={(): void => {
                          contractionDialog.handleOpen();
                          setActiveContractionIndex(index);
                        }}
                        disabled={getFollower.data < 300}
                      >
                        약관보기
                      </Button>
                    </Grid>
                    <Grid>
                      <Divider className={classes.divider} />
                    </Grid>
                    <Grid item>
                      {contractionList[index]
                        ? (
                          <SuccessTypo>
                            <Done />
                          </SuccessTypo>
                        )
                        : (
                          <DangerTypo>
                            <Clear />
                          </DangerTypo>
                        )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          ))}
          <Collapse in={getFollower.data < 300}>
            <Grid container style={{ marginTop: '16px' }} direction="row" justify="space-between" alignItems="center" spacing={2}>
              <Grid item>
                <Typography style={{ fontWeight: 'bold' }} variant="body1" color="secondary">
                  ※ 팔로워 수가 300명 이상이 되면 계약할 수 있습니다.
                </Typography>
                <Typography style={{ fontWeight: 'bold' }} variant="body2">
                  - 현재 팔로워는
                  {' '}
                  {getFollower.data}
                  명입니다.
                </Typography>
              </Grid>
            </Grid>
          </Collapse>
          { /* 약관 보기 Dialog */}
          <Dialog
            open={contractionDialog.open}
            onClose={contractionDialog.handleClose}
            title={terms[activeContractionIndex].title}
            maxWidth="md"
          >
            {/* 계약 내용 */}
            <div className={classes.inDialogContent}>
              {terms[activeContractionIndex].text.split('\n').map((sentence) => (
                <p key={shortid.generate()}>{sentence}</p>
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
                  <Button onClick={contractionDialog.handleClose}>
                    취소
                  </Button>
                  <Button
                    color="primary"
                    onClick={(): void => {
                      handleContractionAgree(activeContractionIndex);
                      contractionDialog.handleClose();
                    }}
                  >
                    동의
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Dialog>

          {/* 계약 완료 버튼 */}
          <div className={classes.actionsContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={(): void => {
                if (contractionList.every((row) => row === true)) {
                  // 크리에이터 계약정보 patch 요청
                  contractionPatch.doPatchRequest({ type: 'contraction' });
                }
              }}
              disabled={!(contractionList.every((row) => row === true))
                || Boolean(contractionPatch.loading)}
            >
              확인
            </Button>
          </div>
        </CustomCard>
      )}

      <Snackbar
        color="success"
        message="성공적으로 계약이 완료되었습니다."
        open={snack.open}
        onClose={snack.handleClose}
      />
    </>
  );
};

export default ContractionCard;
