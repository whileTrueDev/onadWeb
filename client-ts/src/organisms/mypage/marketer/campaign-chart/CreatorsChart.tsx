/* eslint-disable react/display-name */
import dayjs from 'dayjs';
import * as React from 'react';
import { Grid, Typography, CircularProgress, Avatar } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
// import Skeleton from '@material-ui/lab/Skeleton';
import Error from '@material-ui/icons/Error';

// usehook
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import { CreatorDataPerMarketerInterface } from '../dashboard/interfaces';
import CustomDataGrid from '../../../../atoms/Table/CustomDataGrid';

const useStyles = makeStyles(theme => ({
  chip: {
    margin: theme.spacing(0.5),
  },
  chipImg: { margin: theme.spacing(0, 0.5) },
  loading: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  statement: {
    fontSize: 15,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '3px',
  },
  sub: {
    fontSize: 13,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  name: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: theme.spacing(4), height: theme.spacing(4), marginRight: theme.spacing(1) },
  platform: { height: 20, width: 20, marginRight: theme.spacing(1) },
}));

export default function CustomPieChart(): JSX.Element {
  const classes = useStyles();
  const creatorsData = useGetRequest<null, CreatorDataPerMarketerInterface[]>(
    '/marketer/campaign/analysis/creator-data',
  );

  return (
    <Grid container>
      {creatorsData.loading && (
        <Grid item xs={12} className={classes.loading}>
          <Typography className={classes.statement}>
            송출 방송인 데이터를 로드하고 있습니다.
          </Typography>
          <Typography className={classes.sub} color="textSecondary">
            접속환경에 따라 수 분이 걸릴 수 있습니다.
          </Typography>
          <div style={{ textAlign: 'center' }}>
            <CircularProgress />
          </div>
        </Grid>
      )}

      {/* 광고 송출하지 않은 경우 */}
      {!creatorsData.loading && creatorsData.data && creatorsData.data.length === 0 && (
        <Grid
          item
          xs={12}
          style={{
            height: 350,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'absolute' }}>
            <Error style={{ fontSize: 128, opacity: 0.6, zIndex: 0 }} color="secondary" />
          </div>
          <div>
            <Grid container direction="column" justify="center" alignItems="center">
              <Typography style={{ zIndex: 1 }}>
                최근 한달간 광고를 송출한 방송인이 없어요.
              </Typography>
              <Typography style={{ zIndex: 1 }}>
                배너와 캠페인을 등록해 광고를 집행해보세요.
              </Typography>
            </Grid>
          </div>
        </Grid>
      )}

      {!creatorsData.loading && creatorsData.data && creatorsData.data.length > 0 && (
        <>
          <Grid item xs={12} style={{ height: 350 }}>
            <CustomDataGrid
              hideFooter
              disableSelectionOnClick
              loading={creatorsData.loading}
              rows={creatorsData.data}
              columns={[
                {
                  headerName: '방송인',
                  headerAlign: 'center',
                  align: 'center',
                  field: 'creatorId',
                  flex: 2,
                  renderCell: (rowData): JSX.Element => (
                    <div className={classes.name}>
                      <Avatar
                        variant="circular"
                        className={classes.avatar}
                        src={rowData.row.creatorLogo || rowData.row.afreecaLogo}
                      />
                      {rowData.row.creatorId && (
                        <img
                          alt=""
                          className={classes.platform}
                          src="/pngs/logo/twitch/TwitchGlitchPurple.png"
                        />
                      )}
                      {rowData.row.afreecaId && (
                        <img
                          alt=""
                          className={classes.platform}
                          src="/pngs/logo/afreeca/onlyFace.png"
                        />
                      )}
                      <Typography variant="body2" noWrap>
                        {rowData.row.creatorTwitchName || rowData.row.afreecaName}
                      </Typography>
                    </div>
                  ),
                },
                {
                  headerName: '지난 30일 총 노출량',
                  headerAlign: 'center',
                  align: 'center',
                  field: 'total_ad_exposure_amount',
                  flex: 2,
                  renderCell: (data): React.ReactElement => (
                    <Typography variant="body2" align="center">
                      {data.row.total_ad_exposure_amount
                        ? data.row.total_ad_exposure_amount.toLocaleString()
                        : 0}
                    </Typography>
                  ),
                },
                {
                  headerName: '최근 방송 날짜',
                  headerAlign: 'center',
                  field: 'recentDate',
                  flex: 1,
                  renderCell: (data): React.ReactElement => (
                    <Typography variant="body2" align="center">
                      {dayjs(data.row.recentDate).format('YYYY/MM/DD')}
                    </Typography>
                  ),
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: 8 }}>
            <Typography variant="body2" color="textSecondary">
              * 목록은 최근 한달간의 광고 송출량 상위 100위를 보여줍니다.
            </Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
}
