import React from 'react';
import {
  Grid, Avatar, Typography
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CardTemplate from './CardTemplate';
import CreatorInfo from './CreatorInfo';
import axios, { cancelToken } from '../../../../../utils/axios';
import HOST from '../../../../../config';
import { CreatorDataInterface } from '../../dashboard/interfaces';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import useAnchorEl from '../../../../../utils/hooks/useAnchorEl';


interface BannerBroadCreatorsProps {
  creatorsData: UseGetRequestObject<CreatorDataInterface[]>;
}

export default function BannerBroadCreators(
  props: BannerBroadCreatorsProps
): JSX.Element {
  const { creatorsData, ...rest } = props;

  const anchorEl = useAnchorEl();

  const [detailData, setDetail] = React.useState<{
    loading: boolean; empty: boolean; payload: any; }>({
      loading: true,
      empty: false,
      payload: {}
    });

  const handleClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>, index: number
  ): void => {
    anchorEl.handleAnchorOpen(event);
    // creatorsData의 특정 데이터를 로드할 수 있다.
    if (creatorsData.data) {
      const { creatorId } = creatorsData.data[index];
      // 수정필요.
      axios.get(`${HOST}/creators/analysis/detail-data`, {
        params: { creatorId },
        cancelToken: cancelToken.source().token,
        withCredentials: true
      })
        .then((res) => {
          const rawDetailData = res.data;
          if (!creatorsData.data) {
            return;
          }
          console.log(rawDetailData);
          if (Object.entries(rawDetailData).length === 0 && rawDetailData.constructor === Object) {
            setDetail({
              loading: false,
              empty: true,
              payload: {
                ...creatorsData.data[index]
              }
            });
          } else {
            setDetail({
              loading: false,
              empty: false,
              payload: {
                ...rawDetailData,
                // ...creatorsData.data[index]
              }
            });
          }
        });
    }
  };

  return (
    <div {...rest}>
      {creatorsData.data && creatorsData.data.length === 0 ? (
        null
      ) : (
        <CardTemplate title="배너 송출 방송인" color="secondary" IconComponent={AccountCircle}>
          <Grid container style={{ height: 380, overflow: 'auto' }} id="broad-creators">
            <Grid item container direction="column">
              <Typography variant="caption">* 송출량 순 상위 50명까지의 방송인 목록입니다.</Typography>
              <Typography variant="caption">* 방송인 클릭 시, 상세정보를 볼 수 있습니다.</Typography>
            </Grid>
            {creatorsData.data
            && creatorsData.data.slice(0, 50).map(
              (creator: CreatorDataInterface, index: number) => (
                <Grid key={creator.creatorName} item xs={4} md={3} lg={2} style={{ padding: 8 }}>
                  <Avatar
                    src={creator.creatorLogo}
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
                      handleClick(event, index);
                    }}
                  />
                  <Typography variant="body1">{`${index + 1}. ${creator.creatorName}`}</Typography>
                </Grid>
              )
            )}

            {!detailData.loading && !detailData.empty && (
            <CreatorInfo
              creatorInfo={detailData.payload}
              anchorEl={anchorEl}
              empty={detailData.empty}
            />
            )}
          </Grid>
        </CardTemplate>
      )}
    </div>
  );
}
