import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Typography, Avatar, Grid,
} from '@material-ui/core';
import Poll from '@material-ui/icons/Poll';
import MaterialTable from '../../../../../atoms/Table/MaterialTable';
import useGetRequest from '../../../../../utils/hooks/useGetRequest';
import GreenCheckBox from '../../../../../atoms/GreenCheckBox';
import ContentsPie from '../../shared/ContentsPie';
import TimeChart from '../../shared/TimeChart';
import StyledSelectText from '../../../../../atoms/StyledItemText';
import { ArrayAction } from '../campaignReducer';
import { CreatorDetailDataInterface } from '../interfaces';

const BANNER_MAX_WIDTH = 48;
const BANNER_MAX_HEIGHT = 48;

const useStyles = makeStyles((theme) => ({
  name: {
    fontWeight: 700,
    fontSize: '12px',
  },
  image: {
    width: 48,
    height: 48,
    marginRight: theme.spacing(3),
    backgroundColor: theme.palette.grey[300],
    [theme.breakpoints.only('lg')]: {
      width: 48,
      height: 48
    }
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  unit: {
    fontWeight: 700,
    marginLeft: '2px'
  },
  table: {
    boxShadow: 'none',
    overflow: 'hidden'
  },
  left: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left'
  },
}));

interface CreatorTableProps {
  checkedCreators: string[];
  checkedCreatorsDispatch: React.Dispatch<ArrayAction>;
  creatorNamesDispatch: React.Dispatch<{ type: string; value: string }>;
}
export default function CreatorTable(props: CreatorTableProps): JSX.Element {
  const classes = useStyles();
  const theme = useTheme();
  const {
    checkedCreators, checkedCreatorsDispatch, creatorNamesDispatch
  } = props;
  const fetchData = useGetRequest<null, CreatorDetailDataInterface[]>('/creators/analysis/detail');
  const getChecked = (creatorId: string): boolean => checkedCreators.includes(creatorId);

  const handleChecked = (rowData: CreatorDetailDataInterface) => (): void => {
    const { creatorId, creatorName } = rowData;
    if (getChecked(creatorId)) {
      // 체크 된 걸 다시 체크할 때
      checkedCreatorsDispatch({ type: 'delete', value: creatorId });
      creatorNamesDispatch({ type: 'delete', value: creatorName });
    } else {
      // 체크 됐을 때
      checkedCreatorsDispatch({ type: 'push', value: creatorId });
      creatorNamesDispatch({ type: 'push', value: creatorName });
    }
  };

  const makeValueComponent = ({
    value, unit
  }: { value: string | number; unit: string }): JSX.Element => (
    <div>
      <Grid container direction="row" className={classes.left}>
        <Grid item>
          <Typography gutterBottom variant="h6">
            {value}
          </Typography>
        </Grid>
        <Grid item className={classes.flex}>
          <Typography variant="body2" gutterBottom className={classes.unit}>{unit}</Typography>
        </Grid>
      </Grid>
    </div>
  );


  const makeCenterComponent = ({
    value, unit
  }: { value: string | number; unit: string }): JSX.Element => (
    <div>
      <Grid container direction="row" className={classes.flex}>
        <Grid item>
          <Typography gutterBottom variant="h6">
            {value}
          </Typography>
        </Grid>
        <Grid item className={classes.flex}>
          <Typography variant="body2" gutterBottom className={classes.unit}>{unit}</Typography>
        </Grid>
      </Grid>
    </div>
  );

  const makeChartComponent = ({ value }: { value: string }): JSX.Element => (
    <div className={classes.left}>
      <Typography gutterBottom style={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </div>
  );

  const columns = [
    {
      title: '',
      field: 'creatorName',
      render: (rowData: CreatorDetailDataInterface): JSX.Element => (
        <Grid container direction="row" onClick={handleChecked(rowData)} style={{ cursor: 'pointer' }}>
          <Grid item>
            <Avatar variant="rounded" className={classes.image}>
              <img
                src={rowData.creatorLogo}
                alt={rowData.creatorName}
                style={{ maxHeight: BANNER_MAX_HEIGHT, maxWidth: BANNER_MAX_WIDTH }}
              />
            </Avatar>
          </Grid>
          <Grid item className={classes.flex}>
            <Typography className={classes.name}>{rowData.creatorName}</Typography>
          </Grid>
        </Grid>
      )
    },
    {
      title: '팔로워 수',
      field: 'followers',
      render: (rowData: CreatorDetailDataInterface): JSX.Element => (
        makeValueComponent({ value: rowData.followers, unit: '명' })
      )
    },
    {
      title: '평균 시청자 수',
      field: 'viewer',
      render: (rowData: CreatorDetailDataInterface): JSX.Element => (
        makeValueComponent({ value: rowData.viewer, unit: '명' })
      )
    },
    {
      title: '평균 방송 시간',
      field: 'airtime',
      render: (rowData: CreatorDetailDataInterface): JSX.Element => (
        makeValueComponent({ value: rowData.airtime, unit: '시간' })
      )
    },
    {
      title: '방송당 평균 노출량',
      field: 'impression',
      render: (rowData: CreatorDetailDataInterface): JSX.Element => (
        makeCenterComponent({ value: rowData.impression, unit: '회' })
      )
    },
    {
      title: '시간당 예상 노출 비용',
      field: 'cost',
      render: (rowData: CreatorDetailDataInterface): JSX.Element => (
        makeCenterComponent({ value: rowData.cost, unit: '원' })
      )
    },
    {
      title: '일간 평균 클릭 수',
      field: 'ctr',
      render: (rowData: CreatorDetailDataInterface): JSX.Element => (
        makeCenterComponent({ value: Math.round(rowData.ctr), unit: '회' })
      )
    },
    {
      title: '주 컨텐츠',
      field: 'content',
      render: (rowData: CreatorDetailDataInterface): JSX.Element => (
        makeChartComponent({ value: rowData.content })
      )
    },
    {
      title: '주 방송시간대',
      field: 'openHour',
      render: (rowData: CreatorDetailDataInterface): JSX.Element => (
        makeChartComponent({ value: rowData.openHour })
      )
    },
    {
      title: '',
      render: (rowData: CreatorDetailDataInterface): JSX.Element => (
        <GreenCheckBox
          checked={getChecked(rowData.creatorId)}
          style={{ fontSize: '20px', padding: 0 }}
          onClick={handleChecked(rowData)}
          name={rowData.creatorId}
        />
      ),
    }
  ];

  return (
    <div>
      {fetchData.loading && (<MaterialTable columns={columns} data={[]} isLoading />)}
      {!fetchData.loading && fetchData.error && (<span>Error</span>)}
      {!fetchData.loading && fetchData.data && (
        <MaterialTable
          style={{ boxShadow: 'none', overflow: 'hidden' }}
          // className={classes.table}
          title=""
          columns={columns}
          cellWidth={90}
          data={fetchData.data.filter((creator) => !(creator.creatorId === '472147060'))} // 지나가언젠가 제거
          detailPanel={[
            {
              icon: (): JSX.Element => (
                <Poll
                  color="disabled"
                />
              ),
              tooltip: '그래프보기',
              render: (rowData: CreatorDetailDataInterface): JSX.Element => (
                <Grid container direction="row" justify="center" style={{ marginTop: 10 }}>
                  <Grid item xs={5}>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <StyledSelectText
                          primary="컨텐츠 분포도"
                        />
                      </Grid>
                      <Grid item lg={12}>
                        <ContentsPie selectedChartData={JSON.parse(rowData.contentsGraphData)} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={5}>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <StyledSelectText primary="시간대별 방송시간" />
                      </Grid>
                      <Grid item>
                        <TimeChart selectedChartData={JSON.parse(rowData.timeGraphData)} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ),
            }
          ]}
          options={{
            actionsColumnIndex: -1,
            pageSize: 10,
            detailPanelColumnAlignment: 'right',
            rowStyle: (rowData: CreatorDetailDataInterface): React.CSSProperties => ({
              backgroundColor: getChecked(rowData.creatorId)
                ? theme.palette.action.selected : theme.palette.background.paper
            })
          }}
          localization={{
            body: {
              emptyDataSourceMessage: '등록된 배너가 없습니다.'
            },
            header: {
              actions: ''
            },
          }}
        />
      )}
    </div>
  );
}
