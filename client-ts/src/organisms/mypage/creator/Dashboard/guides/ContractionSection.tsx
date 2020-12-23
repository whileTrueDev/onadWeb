import React, { useState } from 'react';
import classnames from 'classnames';
import {
  makeStyles,
  Paper, Typography,
} from '@material-ui/core';
import {
  Done, Clear, CheckCircleOutline
} from '@material-ui/icons';
import Button from '../../../../../atoms/CustomButtons/Button';
import terms from '../source/contractTerms';
import SuccessTypo from '../../../../../atoms/Typography/Success';
import DangerTypo from '../../../../../atoms/Typography/Danger';
import { useDialog, usePatchRequest } from '../../../../../utils/hooks';
import ContractionTextDialog from './sub/ContractionTextDialog';
import { ContractionDataType } from '../../../../../pages/mypage/creator/CPAManage';

const useStyles = makeStyles((theme) => ({
  container: { textAlign: 'center' },
  bold: { fontWeight: 'bold' },
  red: { color: theme.palette.error.main },
  termItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    margin: `${theme.spacing(2)}px 0px`
  },
  termButton: { display: 'flex', alignItems: 'center' },
  textRightSpace: { marginRight: theme.spacing(1) },
  section: { margin: `${theme.spacing(2)}px 0px` },
}));
export interface ContractionSectionProps {
  doContractionDataRequest: () => void;
  contractionData: ContractionDataType;
  handleSuccess: () => void;
}
export default function ContractionSection({
  doContractionDataRequest,
  contractionData,
  handleSuccess,
}: ContractionSectionProps): JSX.Element {
  const classes = useStyles();
  // ****************************************
  // 계약 정보 업데이트 요청
  const contractionPatch = usePatchRequest('/creator', // 계약정보 업데이트
    () => {
      doContractionDataRequest();
      // 성공 스낵 오픈
      handleSuccess();
    });

  // ****************************************
  // 계약 정보 창
  const contractionTextDialog = useDialog(); // 계약정보 창을 위해
  // 현재 클릭한 계약 동의 내용 상태값
  const [activeContractionIndex, setActiveContractionIndex] = useState<number>(0);

  // 모든 계약의 동의 상태값 배열
  const [contractionList, setContractionList] = useState([false, false]);

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
    <div>
      {/* 약관 동의 설명 */}
      <div className={classes.container}>
        <Typography>온애드 서비스를 정상적으로 이용하기 위해서는 이용 동의가 필요합니다.</Typography>
        <Typography>아래의 약관들에 대해서 동의한 이후, [이용동의완료] 버튼을 클릭해 완료해주세요.</Typography>
        <Typography variant="body2" color="textSecondary">약관보기를 클릭한 이후 하단에서 약관을 동의할 수 있습니다.</Typography>
      </div>

      {contractionData.creatorContractionAgreement === 1 ? (
        <div className={classnames(classes.container, classes.section)}>
          <CheckCircleOutline style={{ fontSize: 48 * 2 }} color="primary" />
          <Typography className={classes.bold}>이용 동의가 완료된 상태입니다!</Typography>
        </div>
      ) : (
        <>
          {terms.map((term, index) => (
            <Paper
              key={term.state}
              elevation={1}
              className={classes.termItem}
            >
              <Typography>
                {term.title}
              </Typography>
              <div className={classes.termButton}>
                <Button
                  size="small"
                  onClick={(): void => {
                    contractionTextDialog.handleOpen();
                    setActiveContractionIndex(index);
                  }}
                >
                  약관보기
                </Button>
                {contractionList[index]
                  ? (<SuccessTypo><Done /></SuccessTypo>)
                  : (<DangerTypo><Clear /></DangerTypo>)}
              </div>
            </Paper>
          ))}

          <div className={classes.container}>
            <Button
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
              이용동의완료
            </Button>

            <Typography>완료하셨다면 [다음] 버튼을 눌러, 배너 오버레이를 설정해보세요!</Typography>
          </div>
        </>
      )}

      {/* 계약 내용 보기 다이얼로그 */}
      {!contractionData.creatorContractionAgreement && (
      <ContractionTextDialog
        open={contractionTextDialog.open}
        onClose={contractionTextDialog.handleClose}
        onAgree={handleContractionAgree}
        activeTermIndex={activeContractionIndex}
        title={terms[activeContractionIndex].title}
      />
      )}

    </div>
  );
}
