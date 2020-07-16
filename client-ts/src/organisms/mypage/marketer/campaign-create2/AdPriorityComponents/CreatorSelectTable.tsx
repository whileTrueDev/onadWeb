import React from 'react';
import classnames from 'classnames';
import { useTheme } from '@material-ui/core/styles';
import {
  Typography, Avatar, Grid,
} from '@material-ui/core';
import Poll from '@material-ui/icons/Poll';
import MaterialTable from '../../../../../atoms/Table/MaterialTable';
import GreenCheckBox from '../../../../../atoms/Checkbox/GreenCheckBox';
import StyledSelectText from '../../../../../atoms/StyledItemText';
import useGetRequest from '../../../../../utils/hooks/useGetRequest';
import ContentsPie from '../../shared/ContentsPie';
import TimeChart from '../../shared/TimeChart';
import { CampaignCreateAction } from '../reducers/campaignCreate.reducer';
import { CreatorDetailDataInterface } from '../interfaces';
import useStyles from './CreatorSelectTable.style';

const BANNER_MAX_WIDTH = 48;
const BANNER_MAX_HEIGHT = 48;

interface CreatorTableProps {
  checkedCreators: string[];
  dispatch: React.Dispatch<CampaignCreateAction>;
  tableRef: any;
}

export default function CreatorTable(props: CreatorTableProps): JSX.Element {
  const classes = useStyles();
  const theme = useTheme();

  const { checkedCreators, dispatch, tableRef } = props;

  // **********************************************************
  // 데이터 요청
  const fetchData = useGetRequest<null, CreatorDetailDataInterface[]>('/creators/analysis/detail');

  // **********************************************************
  // 크리에이터 선택 관련
  const getChecked = (creatorId: string): boolean => checkedCreators.includes(creatorId);

  const handleCreatorSelect = (
    rowData?: CreatorDetailDataInterface
  ): void => {
    if (rowData) {
      const { creatorId, creatorName } = rowData;
      if (getChecked(creatorId)) {
        // 체크 된 걸 다시 체크할 때
        dispatch({ type: 'DELETE_SELECTED_CREATORS', value: creatorId });
        dispatch({ type: 'DELETE_SELECTED_CREATOR_NAMES', value: creatorName });
      } else {
        // 체크 됐을 때
        dispatch({ type: 'SET_SELECTED_CREATORS', value: creatorId });
        dispatch({ type: 'SET_SELECTED_CREATOR_NAMES', value: creatorName });
      }
    }
  };

  // **********************************************************
  // 테이블 생성 관련 함수
  const makeValueComponent = ({
    value, unit, textCenter,
  }: { value: string | number; unit: string; textCenter?: boolean }): JSX.Element => (
    <div>
      <Grid
        container
        direction="row"
        className={classnames({ [classes.left]: !textCenter, [classes.flex]: textCenter })}
      >
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
      width: '20px',
      render: (rowData: CreatorDetailDataInterface): JSX.Element => (
        <GreenCheckBox
          checked={getChecked(rowData.creatorId)}
          style={{ fontSize: '20px', padding: 0 }}
          name={rowData.creatorId}
        />
      ),
    },
    {
      title: '',
      field: 'creatorName',
      render: (rowData: CreatorDetailDataInterface): JSX.Element => (
        <Grid container direction="row" style={{ cursor: 'pointer' }}>
          <Grid item>
            <Avatar variant="rounded" className={classes.image}>
              <img
                src={rowData.creatorLogo}
                alt={rowData.creatorName}
                style={{ maxHeight: BANNER_MAX_HEIGHT, maxWidth: BANNER_MAX_WIDTH }}
                draggable={false}
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
        makeValueComponent({ value: rowData.impression, unit: '회', textCenter: true })
      )
    },
    {
      title: '시간당 예상 노출 비용',
      field: 'cost',
      render: (rowData: CreatorDetailDataInterface): JSX.Element => (
        makeValueComponent({ value: rowData.cost, unit: '원', textCenter: true })
      )
    },
    {
      title: '일간 평균 클릭 수',
      field: 'ctr',
      render: (rowData: CreatorDetailDataInterface): JSX.Element => (
        makeValueComponent({ value: Math.round(rowData.ctr), unit: '회', textCenter: true })
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
  ];

  return (
    <div>
      {fetchData.loading && (<MaterialTable columns={columns} data={[]} isLoading title="" />)}
      {!fetchData.loading && fetchData.error && (<span>Error</span>)}
      {!fetchData.loading && fetchData.data && (
        <MaterialTable
          tableRef={tableRef}
          style={{ boxShadow: 'none', overflow: 'hidden' }}
          onRowClick={(e, rowData): void => {
            handleCreatorSelect(rowData);
          }}
          title=""
          columns={columns}
          cellWidth={90}
          data={fetchData.data.filter((creator) => !(creator.creatorId === '472147060'))} // 지나가언젠가 제거
          detailPanel={[
            {
              icon: (): JSX.Element => (<Poll color="disabled" />),
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
            padding: 'dense',
            actionsColumnIndex: -1,
            pageSize: 10,
            detailPanelColumnAlignment: 'right',
            rowStyle: (rowData: CreatorDetailDataInterface): React.CSSProperties => ({
              backgroundColor: getChecked(rowData.creatorId)
                ? theme.palette.action.selected : theme.palette.background.paper
            }),
          }}
          localization={{
            body: { emptyDataSourceMessage: '등록된 배너가 없습니다.' },
            header: { actions: '' },
          }}
        />
      )}
    </div>
  );
}
