import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Typography, Avatar, Grid,
} from '@material-ui/core';
import Poll from '@material-ui/icons/Poll';
import MaterialTable from '../../../../atoms/Table/MaterialTable_2';
import useFetchData from '../../../../utils/lib/hooks/useFetchData';
import GreenCheckBox from '../../../../atoms/GreenCheckBox';
import ContentsPie from './ContentsPie';
import TimeChart from './TimeChart';
import StyledSelectText from '../../../../atoms/StyledItemText';

const BANNER_MAX_WIDTH = 48;
const BANNER_MAX_HEIGHT = 48;

const useStyles = makeStyles(theme => ({
  name: {
    fontWeight: '700',
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
    fontWeight: '700',
    marginLeft: '2px'
  },

}));

export default function CreatorTable(props) {
  const classes = useStyles();
  const {
    checkedCreators, checkedCreatorsDispatch, creatorNamesDispatch
  } = props;
  const fetchData = useFetchData('/api/dashboard/marketer/creatordetail');
  const getChecked = creatorId => checkedCreators.includes(creatorId);

  const handleChecked = rowData => () => {
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

  const makeValueComponent = ({ value, unit }) => (
    <div className={classes.flex}>
      <Typography gutterBottom variant="h6">
        {value}
      </Typography>
      <Typography variant="body2" gutterBottom className={classes.unit}>{unit}</Typography>
    </div>
  );

  const makeChartComponent = ({ value }) => (
    <div className={classes.flex}>
      <Typography gutterBottom variant="body1" style={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </div>
  );

  const columns = [
    {
      title: '',
      field: 'creatorName',
      render: rowData => (
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
      title: '팔로워',
      field: 'followers',
      render: rowData => (
        makeValueComponent({ value: rowData.followers, unit: '명' })
      )
    },
    {
      title: '평균 시청자수',
      field: 'viewer',
      render: rowData => (
        makeValueComponent({ value: rowData.viewer, unit: '명' })
      )
    },
    {
      title: '평균 방송시간',
      field: 'airtime',
      render: rowData => (
        makeValueComponent({ value: rowData.airtime, unit: '분' })
      )
    },
    {
      title: '평균 노출량',
      field: 'impression',
      render: rowData => (
        makeValueComponent({ value: rowData.impression, unit: '명' })
      )
    },
    {
      title: '평균 노출비용',
      field: 'cost',
      render: rowData => (
        makeValueComponent({ value: rowData.cost, unit: '원' })
      )
    },
    {
      title: '배너 클릭률',
      field: 'ctr',
      render: rowData => (
        makeValueComponent({ value: rowData.ctr, unit: '%' })
      )
    },
    {
      title: '주 컨텐츠',
      field: 'content',
      render: rowData => (
        makeChartComponent({ value: rowData.content })
      )
    },
    {
      title: '주 방송시간대',
      field: 'openHour',
      render: rowData => (
        makeChartComponent({ value: rowData.openHour })
      )
    },
    {
      title: '',
      render: rowData => (
        <GreenCheckBox
          checked={getChecked(rowData.creatorId)}
          fontSize="large"
          style={{ fontSize: '20px', padding: 0 }}
          onClick={handleChecked(rowData)}
          name={rowData.creatorId}
        />
      ),
    }
  ];

  return (
    <div>
      {fetchData.loading && (<MaterialTable columns={columns} isLoading />)}
      {!fetchData.loading && fetchData.error && (<span>Error</span>)}
      {!fetchData.loading && fetchData.payload && (
        <MaterialTable
          style={{ boxShadow: 'none', overflow: 'hidden' }}
          title=""
          columns={columns}
          data={fetchData.payload}
          detailPanel={[
            {
              icon: () => (
                <Poll
                  color="disabled"
                />
              ),
              tooltip: '그래프보기',
              render: rowData => (
                <Grid container direction="row" justify="center" style={{ marginTop: 10 }}>
                  <Grid item xs={5}>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <StyledSelectText
                          primary="컨텐츠 분포도"
                          className={classes.label}
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
                        <StyledSelectText primary="시간대별 방송시간" className={classes.label} />
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
            rowStyle: rowData => ({
              backgroundColor: getChecked(rowData.creatorId) ? '#EEE' : '#FFF'
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
