import React from 'react';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import CPAAgreement from '../../../organisms/mypage/creator/CPAManage/CPAAgreement';

export default function CPAManage(): JSX.Element {
  return (
    <div>
      <GridContainer>
        <GridItem sm={12} md={10}>
          <CPAAgreement />
        </GridItem>
      </GridContainer>

      {/* 밑에는 Dan의 캠페인 설정 컴포넌트 들어감 */}
    </div>
  );
}
