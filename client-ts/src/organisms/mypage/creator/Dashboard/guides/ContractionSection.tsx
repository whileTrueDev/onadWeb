import React, { useState } from 'react';
import {
  Paper, Typography,
} from '@material-ui/core';
import { Done, Clear } from '@material-ui/icons';
import Button from '../../../../../atoms/CustomButtons/Button';
import terms from '../source/contractTerms';
import SuccessTypo from '../../../../../atoms/Typography/Success';
import DangerTypo from '../../../../../atoms/Typography/Danger';
import { useDialog, useGetRequest, usePatchRequest } from '../../../../../utils/hooks';
import ContractionTextDialog from './sub/ContractionTextDialog';

export interface ContractionSectionProps {
  doContractionDataRequest: () => void;
  handleSuccess: () => void;
}
export default function ContractionSection({
  doContractionDataRequest,
  handleSuccess,
}: ContractionSectionProps): JSX.Element {
  // 팔로워 수 정보조회
  const getFollower = useGetRequest<number>('/creator/follower');
  // 계약 정보 업데이트 요청
  const contractionPatch = usePatchRequest('/creator', // 계약정보 업데이트
    () => {
      doContractionDataRequest();
      // 성공 스낵 오픈
      handleSuccess();
    });


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
      <div style={{ textAlign: 'center' }}>
        <Typography>온애드 서비스를 정상적으로 이용하기 위해서는 이용 동의가 필요합니다.</Typography>
        <Typography>아래의 약관들에 대해서 동의한 이후, [이용동의완료] 버튼을 클릭해 완료해주세요.</Typography>
        <Typography variant="body2" color="textSecondary">약관보기를 클릭한 이후 하단에서 약관을 동의할 수 있습니다.</Typography>
        <br />
        <Typography>온애드에서는 시청자와 크리에이터를 구분하기 위한 최소한의 제한사항으로</Typography>
        <Typography>
          최소 팔로워수가
          {' '}
          <span style={{ color: 'red', fontWeight: 'bold' }}>300</span>
          {' '}
          명 이상인 크리에이터만 사용 가능합니다. (현재
          {' '}
          <span style={{ color: 'red', fontWeight: 'bold' }}>{getFollower.data}</span>
          {' '}
          명)
        </Typography>
      </div>

      {terms.map((term, index) => (
        <Paper
          key={term.state}
          elevation={1}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, margin: '16px 0px'
          }}
        >
          <Typography>
            {term.title}
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
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

      <div style={{ textAlign: 'right' }}>
        {!getFollower.loading && getFollower.data < 300 && (
        <Typography variant="caption" color="error" style={{ marginRight: 8 }}>
          {`죄송합니다. 팔로워 수가 부족합니다 (${getFollower.data}명)`}
        </Typography>
        )}
        <Button
          size="small"
          color="primary"
          onClick={(): void => {
            if (contractionList.every((row) => row === true)) {
              // 크리에이터 계약정보 patch 요청
              contractionPatch.doPatchRequest({ type: 'contraction' });
            }
          }}
          disabled={!(contractionList.every((row) => row === true))
                || Boolean(contractionPatch.loading)
                || getFollower.data < 300}
        >
          이용동의완료
        </Button>
      </div>

      {/* 계약 내용 보기 다이얼로그 */}
      <ContractionTextDialog
        open={contractionTextDialog.open}
        onClose={contractionTextDialog.handleClose}
        onAgree={handleContractionAgree}
        activeTermIndex={activeContractionIndex}
        title={terms[activeContractionIndex].title}
      />

    </div>
  );
}
