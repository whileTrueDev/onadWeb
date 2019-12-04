import React from 'react';
import Grid from '@material-ui/core/Grid';
import DescCard from './sub/marketerSub/DescCard';
import DescCardLong from './sub/marketerSub/DescCardLong';
import CanvasForChart from './sub/marketerSub/CanvasForChart';

const dummy = [
  { title: '총 비용', value: '100,000,000', unit: '원' },
  { title: '송출크리에이터수', value: '255', unit: '명' },
  { title: '송출크리에이터수', value: '255', unit: '명' },
  { title: '송출크리에이터수', value: '255', unit: '명' },
];

const dummy2 = [
  { title: '차트', value: 'ㄴㅁㅇㄹㅁㄴㅇㄹ', unit: '명' },
  { title: '캠페인 목록', value: 'ㄴㅁㅇㄹㅁㄴㅇㄹ', unit: '명' },
];

export default function MarketerReport() {
  return (
    <div style={{ margin: '0px 160px' }}>
      <Grid container spacing={2}>
        {dummy.map(d => (
          <Grid item key={d.title} xs={12} md={6} lg={3}>
            <DescCard data={d} />
          </Grid>
        ))}

        <Grid item xs={12} lg={3}>
          <DescCardLong />

        </Grid>

        <Grid item xs={12} lg={9}>
          <CanvasForChart />
        </Grid>

      </Grid>
    </div>
  );
}
