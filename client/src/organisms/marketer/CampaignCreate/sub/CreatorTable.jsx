import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PropTypes from 'prop-types';
import {
  Typography, Avatar, Grid
} from '@material-ui/core';
import Poll from '@material-ui/icons/Poll';
import MaterialTable from '../../../../atoms/Table/MaterialTable_2';
import useFetchData from '../../../../utils/lib/hooks/useFetchData';
import ChartPopover from './ChartPopover';
import GreenCheckBox from '../../../../atoms/GreenCheckBox';

const BANNER_MAX_WIDTH = 48;
const BANNER_MAX_HEIGHT = 48;

const useStyles = makeStyles(theme => ({
  name: {
    fontWeight: '700',
    fontSize: '12px'
  },
  image: {
    width: 48,
    height: 48,
    marginRight: theme.spacing(3),
    backgroundColor: theme.palette.grey[100],
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
    marginLeft: '3px'
  },

}));

export default function CreatorTable(props) {
  const classes = useStyles();
  const {
    checkedCreators, checkedCreatorsDispatch
  } = props;
  const fetchData = useFetchData('/api/dashboard/marketer/creatordetail');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedChartData, setChartData] = React.useState({});
  const [selectedType, setType] = React.useState('');
  const open = Boolean(anchorEl);

  const getChecked = creatorId => checkedCreators.includes(creatorId);

  const handleChecked = rowData => () => {
    const { creatorId } = rowData;
    if (getChecked(creatorId)) {
      // 체크 된 걸 다시 체크할 때
      checkedCreatorsDispatch({ type: 'delete', value: creatorId });
    } else {
      // 체크 됐을 때
      checkedCreatorsDispatch({ type: 'push', value: creatorId });
    }
  };


  const handlePopoverOpen = data => (event) => {
    const { chartData, type } = data;
    // chartData는 파싱하기전 text형태이므로 parse를 진행한다.
    const jsonChartData = JSON.parse(chartData);
    // console.log(chartData);
    setChartData(jsonChartData);
    setType(type);
    setAnchorEl(event.currentTarget);
  };


  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const makeValueComponent = ({ value, unit }) => (
    <div className={classes.flex}>
      <Typography gutterBottom variant="h5">
        {value}
      </Typography>
      <Typography variant="body2" gutterBottom className={classes.unit}>{unit}</Typography>
    </div>
  );

  const makeChartComponent = ({ value, chartData, type }) => (
    <div className={classes.flex}>
      <Typography gutterBottom variant="body2">
        {value}
      </Typography>
      <Poll
        style={{ marginLeft: '3px' }}
        fontSize="large"
        onMouseEnter={handlePopoverOpen({ chartData, type })}
        onMouseLeave={handlePopoverClose}
        aria-owns={anchorEl ? 'send-desc-popover' : undefined}
        aria-haspopup="true"
        color="disabled"
      />
    </div>
  );

  const columns = [
    {
      title: '크리에이터',
      render: rowData => (
        <Grid container direction="row">
          <Grid item>
            <Avatar variant="round" className={classes.image}>
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
        makeChartComponent({ value: rowData.content, chartData: rowData.contentsGraphData, type: 'donut' })
      )
    },
    {
      title: '주 방송시간대',
      field: 'openHour',
      render: rowData => (
        makeChartComponent({ value: rowData.openHour, chartData: rowData.timeGraphData, type: 'bar' })
      )
    },
    {
      title: '',
      render: rowData => (
        <GreenCheckBox
          checked={getChecked(rowData.creatorId)}
          fontSize="large"
          style={{ padding: '3px', fontSize: '20px' }}
          onClick={handleChecked(rowData)}
          name={rowData.creatorId}
        />
      )
    }
  ];

  return (
    <div>
      {fetchData.loading && (<MaterialTable columns={columns} isLoading />)}
      {!fetchData.loading && fetchData.error && (<span>Error</span>)}
      {!fetchData.loading && fetchData.payload && (
        <MaterialTable
          title=""
          columns={columns}
          data={fetchData.payload}
          // actions={[
          //   {
          //     icon: () => (
          //       <GreenCheckBox
          //         checked={getChecked(rowData.creatorId)}
          //         fontSize="large"
          //         style={{ padding: '3px', fontSize: '20px' }}
          //         onClick={handleChecked}
          //       />
          //     ),
          //     tooltip: '크리에이터 선택',
          //     onClick: (e, rowData) => { handleChecked(rowData); }
          //   }
          // ]}
          options={{
            actionsColumnIndex: -1,
            pageSize: 10
          }}
          localization={{
            body: {
              emptyDataSourceMessage: '등록된 배너가 없습니다.'
            },
            header: {
              actions: '기타'
            }
          }}

        />
      )}
      <ChartPopover open={open} anchorEl={anchorEl} handlePopoverClose={handlePopoverClose} selectedChartData={selectedChartData} type={selectedType} />
    </div>
  );
}
