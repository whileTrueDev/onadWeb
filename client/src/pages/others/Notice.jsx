import React from 'react';

import GridItem from '../../atoms/Grid/GridItem';
import GridContainer from '../../atoms/Grid/GridContainer';
import NoticeTable from './NoticeTable';

import AppAppBar from '../../organisms/main/layout/AppAppBar';
import AppFooter from '../../organisms/main/layout/AppFooter';

export default function PublicNotification() {
  return (
    <div>
      <AppAppBar />

      <div style={{ marginTop: 70 }}>

        <div style={{
          width: 980, margin: '150px auto', minHeight: 1080
        }}
        >
          <GridContainer>
            <GridItem xs={12}>
              <NoticeTable />
            </GridItem>
          </GridContainer>
        </div>

        <div>
          <AppFooter />
        </div>
      </div>
    </div>
  );
}
