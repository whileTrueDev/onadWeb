import React from 'react';
import Typography from '@material-ui/core/Typography';

import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import Card from '../../../atoms/Card/Card';


export default function CPAManage(): JSX.Element {
  return (
    <div>
      CPAManage


      <GridContainer>
        <GridItem>
          CPAManage  참여형 광고 캠페인 목록
        </GridItem>
      </GridContainer>
      <GridContainer>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <GridItem key={item} xs={12} md={6} lg={4} xl={3}>
            <Card style={{ height: 300 }}>

              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img src="/pngs/logo/naver2.png" alt="" height="200" />
                </div>
                card
                {item}
              </div>
            </Card>
          </GridItem>
        ))}
      </GridContainer>
    </div>
  );
}
