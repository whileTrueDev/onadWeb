import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PropTypes from 'prop-types';
import {
  Typography, Tooltip, Avatar, Grid
} from '@material-ui/core';
import BarChart from '@material-ui/icons/BarChart';
import Delete from '@material-ui/icons/Delete';
import MaterialTable from '../../../../atoms/Table/MaterialTable_2';
import useFetchData from '../../../../utils/lib/hooks/useFetchData';
import ChartPopover from './ChartPopover';

const BANNER_MAX_WIDTH = 100;
const BANNER_MAX_HEIGHT = 100;

const useStyles = makeStyles(theme => ({
  name: {
    fontWeight: '700',
    fontSize: '12px'
  },
  image: {
    width: 96,
    height: 96,
    marginRight: theme.spacing(3),
    backgroundColor: theme.palette.grey[100],
    [theme.breakpoints.only('lg')]: {
      width: 72,
      height: 72
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

export default function CreatoreTable(props) {
  const classes = useStyles();
  const { handleDeleteOpen } = props;
  const fetchData = useFetchData('/api/dashboard/marketer/creatordetail');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedChartData, setChartData] = React.useState({});
  const [selectedType, setType] = React.useState('');

  const open = Boolean(anchorEl);


  const handlePopoverOpen = data => (event) => {
    const { chartData, type } = data;
    setChartData(chartData);
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
      <BarChart
        fontSize="small"
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
          actions={[
            {
              icon: () => (<Delete />),
              tooltip: '배너삭제',
              onClick: (e, rowData) => { handleDeleteOpen(rowData); }
            }
          ]}
          options={{
            actionsColumnIndex: -1
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

CreatoreTable.propTypes = {
  handleDeleteOpen: PropTypes.func.isRequired
};
