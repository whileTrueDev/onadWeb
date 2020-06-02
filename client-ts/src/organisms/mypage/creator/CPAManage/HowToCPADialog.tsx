import React from 'react';
import { useTheme } from '@material-ui/core/styles';
// icons
import Filter1Icon from '@material-ui/icons/Filter1';
import Filter2Icon from '@material-ui/icons/Filter2';
import Filter3Icon from '@material-ui/icons/Filter3';
// atoms
import { Typography, Button } from '@material-ui/core';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import Dialog from '../../../../atoms/Dialog/Dialog';
// types
import { AdPickMetrics } from './AdpickTypes';
import { ADPAGE_HOST } from '../../../../config';

interface CPAIncomeTableProps {
  open: boolean;
  handleClose: () => void;
  CPAmainData: AdPickMetrics;
}
export default function CPAIncomeTable({
  open,
  handleClose,
  CPAmainData
}: CPAIncomeTableProps): JSX.Element {
  const theme = useTheme();
  const getAdpageLink = (): string => `${ADPAGE_HOST}/${CPAmainData.creatorTwitchId}`;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="참여형 광고 시작하기"
      fullWidth
      maxWidth="md"
      buttons={(
        <Button onClick={handleClose}>확인</Button>
      )}
    >
      <GridContainer>
        <GridItem xs={12}>
          <GridItem container direction="column" alignItems="center" style={{ marginBottom: 32 }}>
            <Filter1Icon color="primary" fontSize="small" />
            <Typography style={{ fontWeight: 800 }}>트위치 패널에 등록하기</Typography>
            <Typography variant="body2">* 기존 클릭광고용 패널과는 별도이며, 추가적 등록이 필요합니다.</Typography>
            <br />
            <img src="/pngs/cpa/참여형패널설정.png" alt="" style={{ maxWidth: 700 }} />


            <br />
            <Typography>해당 패널의 링크는 다음 URL로 등록해주세요</Typography>
            <Typography style={{ color: theme.palette.primary.main, fontWeight: 800 }}>
              {getAdpageLink()}
            </Typography>
            <br />
            <Typography>제공되는 패널 링크 등록용 이미지</Typography>
            <img src="/pngs/cpa/온애드참여형광고배너1.png" alt="" />
            <img src="/pngs/cpa/온애드참여형광고배너2.png" alt="" />
            <img src="/pngs/cpa/온애드참여형광고배너3.png" alt="" />

          </GridItem>

          <GridItem container direction="column" alignItems="center" style={{ marginBottom: 32 }}>
            <Filter2Icon color="primary" fontSize="small" />
            <Typography style={{ fontWeight: 800 }}>광고페이지에 참여형 광고 등록하기</Typography>
            {/* <Typography variant="body2">기존 클릭광고용 패널과는 별도이며, 추가적 등록이 필요합니다.</Typography> */}
            <br />
          </GridItem>

          <GridItem container direction="column" alignItems="center" style={{ marginBottom: 32 }}>
            <Filter3Icon color="primary" fontSize="small" />
            <Typography style={{ fontWeight: 800 }}>시청자 참여시 수익 발생</Typography>
            {/* <Typography variant="body2">기존 클릭광고용 패널과는 별도이며, 추가적 등록이 필요합니다.</Typography> */}
            <br />
          </GridItem>


        </GridItem>
      </GridContainer>
    </Dialog>
  );
}
