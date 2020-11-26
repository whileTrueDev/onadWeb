import moment from 'moment';
import { Paper, Typography } from '@material-ui/core';
import React from 'react';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';

interface LevelRes { creatorId: string; level: number; exp: number }
interface ClicksRes { adpanel: number; adchat: number }
export interface AdClickCardProps {
  clicksData: UseGetRequestObject<ClicksRes>;
  levelData: UseGetRequestObject<LevelRes>;
}
export default function AdClickCard({
  clicksData,
  levelData,
}: AdClickCardProps): JSX.Element {
  return (
    <Paper style={{
      height: 200, padding: 32, marginBottom: 16,
    }}
    >
      <div style={{ display: 'flex', }}>
        <div>
          <Typography style={{ fontWeight: 'bold' }}>광고 클릭 정보</Typography>

          {!levelData.loading && levelData.data && (
            <div>
              <Typography>
                레벨:
                {' '}
                {levelData.data.level}
              </Typography>
              <Typography>
                경험치:
                {' '}
                {levelData.data.exp}
              </Typography>
            </div>
          )}

          {!clicksData.loading && clicksData.data && (
          <div>
            <Typography>
              클릭광고 클릭 수:
              {' '}
              {clicksData.data.adpanel || 0}
            </Typography>
            <Typography>
              채팅광고 클릭 수:
              {' '}
              {clicksData.data.adchat || 0}
            </Typography>
          </div>
          )}

        </div>

        <div style={{ marginLeft: 16, overflowX: 'hidden', }}>
          <Typography style={{ fontWeight: 'bold', marginBottom: 16 }}>최근 광고 클릭</Typography>
          <Typography variant="body2" style={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>동안미비누 - asdfasdf - </Typography>
          <Typography variant="body2" style={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{`인제떡방 ${moment(new Date()).format('YYYY년 MM월 DD일 HH시 mm분')}`}</Typography>
          <Typography variant="body2" style={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>동안미비누 - asdfasdf - </Typography>
          <Typography variant="body2" style={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>동안미비누 - asdfasdf - </Typography>
          <Typography variant="body2" style={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>모지랑이</Typography>
          <Typography variant="body2" style={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>모지랑이</Typography>
          <Typography variant="body2" style={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{`인제떡방 ${moment(new Date()).format('YYYY년 MM월 DD일 HH시 mm분')}`}</Typography>
        </div>
      </div>
    </Paper>
  );
}
