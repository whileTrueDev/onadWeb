/* eslint-disable react/display-name */
/* eslint-disable max-len */
import { useRef, useState } from 'react';

import * as React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Typography, Avatar, Grid, makeStyles, TextField, Button } from '@material-ui/core';
import Poll from '@material-ui/icons/Poll';
import MaterialTable from '../../../../../atoms/Table/MaterialTable';
import StyledSelectText from '../../../../../atoms/StyledItemText';
import useGetRequest from '../../../../../utils/hooks/useGetRequest';
import ContentsPie from '../../shared/ContentsPie';
import TimeChart from '../../shared/TimeChart';
import { CreatorDetailDataInterface } from '../interfaces';

const SearchTextField = ({ searchText, setSearchText }: any) => {
  const searchTextRef = useRef<HTMLInputElement>(null);
  const handleSearchClick = (): void => {
    if (searchTextRef.current) {
      setSearchText(searchTextRef.current.value);
    }
  };

  const handleSearchReset = (): void => {
    setSearchText('');
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleSearchClick();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
      <TextField
        variant="outlined"
        style={{ width: 300, marginRight: 8 }}
        placeholder="이름으로 검색"
        inputRef={searchTextRef}
        onKeyDown={handleEnterKey}
      />
      <Button color="primary" variant="contained" onClick={handleSearchClick}>
        검색
      </Button>
      {searchText && (
        <Button variant="contained" onClick={handleSearchReset} style={{ marginLeft: 8 }}>
          검색제거
        </Button>
      )}
    </div>
  );
};

const BANNER_MAX_WIDTH = 48;
const BANNER_MAX_HEIGHT = 48;

const useStyles = makeStyles(theme => ({
  bold: { fontWeight: theme.typography.fontWeightBold },
  image: {
    width: 48,
    height: 48,
    marginRight: theme.spacing(3),
    backgroundColor: theme.palette.grey[300],
    [theme.breakpoints.only('lg')]: {
      width: 48,
      height: 48,
    },
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unit: { fontWeight: 700, marginLeft: '2px' },
  table: { boxShadow: 'none', overflow: 'hidden' },
  left: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
  },
  platformLogoWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  valueContainer: { textAlign: 'right' },
  secondText: { marginTop: theme.spacing(1) },
}));
export interface CreatorTableProps {
  onCreatorSelect: (rowData?: CreatorDetailDataInterface) => void;
  isCheckedCreator: (c: string) => boolean;
}
export default function CreatorTable(props: CreatorTableProps): JSX.Element {
  const classes = useStyles();
  const theme = useTheme();

  const { onCreatorSelect, isCheckedCreator } = props;

  // **********************************************************
  // 데이터 요청
  const fetchData = useGetRequest<null, CreatorDetailDataInterface[]>('/creators/analysis/detail');

  // 크리에이터별 상세 그래프
  const renderDetailGraph = (rowData: CreatorDetailDataInterface): JSX.Element => (
    <Grid container direction="row" justify="center">
      <Grid item xs={5}>
        <Grid direction="column" spacing={1}>
          <Grid item>
            <StyledSelectText primary="컨텐츠 분포도" />
          </Grid>
          <Grid item lg={12}>
            {rowData.creatorId && (
              <ContentsPie selectedChartData={JSON.parse(rowData.contentsGraphData)} />
            )}
            {!rowData.creatorId && rowData.creatorIdAfreeca && (
              <ContentsPie selectedChartData={JSON.parse(rowData.contentsGraphDataAfreeca)} />
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={5}>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <StyledSelectText primary="시간대별 방송시간" />
          </Grid>
          <Grid item>
            {rowData.creatorId && (
              <TimeChart selectedChartData={JSON.parse(rowData.timeGraphData)} />
            )}
            {!rowData.creatorId && rowData.creatorIdAfreeca && (
              <TimeChart selectedChartData={JSON.parse(rowData.timeGraphDataAfreeca)} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const [searchText, setSearchText] = useState('');

  return (
    <div id="creator-select-table">
      {/* 검색 컴포넌트 */}
      <SearchTextField searchText={searchText} setSearchText={setSearchText} />
      {fetchData.loading && <MaterialTable columns={[]} data={[]} isLoading title="" />}
      {!fetchData.loading && fetchData.error && <span>Error</span>}
      {!fetchData.loading && fetchData.data && (
        <MaterialTable
          columns={[
            {
              title: '',
              field: 'creatorName',
              render: (rowData: CreatorDetailDataInterface): JSX.Element => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar variant="circular" className={classes.image}>
                    <img
                      src={rowData.creatorLogo || rowData.afreecaLogo}
                      alt={rowData.creatorName || rowData.afreecaName}
                      style={{ maxHeight: BANNER_MAX_HEIGHT, maxWidth: BANNER_MAX_WIDTH }}
                      draggable={false}
                    />
                  </Avatar>
                  <Typography variant="body2" className={classes.bold}>
                    {rowData.creatorName || rowData.afreecaName}
                  </Typography>
                </div>
              ),
            },
            {
              title: '채널',
              width: '20px',
              render: (rowData: CreatorDetailDataInterface): JSX.Element => (
                <div className={classes.platformLogoWrapper}>
                  {rowData.creatorId && (
                    <img
                      height={20}
                      width={20}
                      src="/pngs/logo/twitch/TwitchGlitchPurple.png"
                      alt=""
                    />
                  )}
                  {rowData.creatorIdAfreeca && (
                    <img
                      className={classes.secondText}
                      height={20}
                      width={20}
                      src="/pngs/logo/afreeca/onlyFace.png"
                      alt=""
                    />
                  )}
                </div>
              ),
            },
            {
              searchable: false,
              title: '팔로워 수',
              field: 'followers',
              customSort: (a, b) =>
                b.followers + b.followersAfreeca - (a.followers + a.followersAfreeca),
              render: (rowData: CreatorDetailDataInterface): JSX.Element => (
                <div className={classes.valueContainer} style={{ whiteSpace: 'nowrap' }}>
                  {rowData.creatorId && (
                    <Typography>{`${rowData.followers.toLocaleString()} 명`}</Typography>
                  )}
                  {rowData.creatorIdAfreeca && (
                    <Typography className={classes.secondText}>
                      {`${rowData.followersAfreeca.toLocaleString()} 명`}
                    </Typography>
                  )}
                </div>
              ),
            },
            {
              searchable: false,
              title: '평균 시청자 수',
              field: 'viewer',
              customSort: (a, b) => b.viewer + b.viewerAfreeca - (a.viewer + a.viewerAfreeca),
              render: (rowData: CreatorDetailDataInterface): JSX.Element => (
                <div className={classes.valueContainer} style={{ whiteSpace: 'nowrap' }}>
                  {rowData.creatorId && (
                    <Typography>{`${rowData.viewer.toLocaleString()} 명`}</Typography>
                  )}
                  {rowData.creatorIdAfreeca && (
                    <Typography className={classes.secondText}>
                      {`${rowData.viewerAfreeca.toLocaleString()} 명`}
                    </Typography>
                  )}
                </div>
              ),
            },
            {
              searchable: false,
              title: '평균 방송 시간',
              field: 'airtime',
              customSort: (a, b) => b.airtime + b.airtimeAfreeca - (a.airtime + a.airtimeAfreeca),
              render: (rowData: CreatorDetailDataInterface): JSX.Element => (
                <div className={classes.valueContainer} style={{ whiteSpace: 'nowrap' }}>
                  {rowData.creatorId && (
                    <Typography>{`${rowData.airtime.toLocaleString()} 시간`}</Typography>
                  )}
                  {rowData.creatorIdAfreeca && (
                    <Typography className={classes.secondText}>
                      {`${rowData.airtimeAfreeca.toLocaleString()} 시간`}
                    </Typography>
                  )}
                </div>
              ),
            },
            {
              searchable: false,
              title: '방송당 평균 노출량',
              field: 'impression',
              customSort: (a, b) =>
                b.impression + b.impressionAfreeca - (a.impression + a.impressionAfreeca),
              render: (rowData: CreatorDetailDataInterface): JSX.Element => (
                <div className={classes.valueContainer} style={{ whiteSpace: 'nowrap' }}>
                  {rowData.creatorId && (
                    <Typography>{`${rowData.impression.toLocaleString()} 회`}</Typography>
                  )}
                  {rowData.creatorIdAfreeca && (
                    <Typography className={classes.secondText}>
                      {`${rowData.impressionAfreeca.toLocaleString()} 회`}
                    </Typography>
                  )}
                </div>
              ),
            },
            {
              searchable: false,
              title: '시간당 예상 노출 비용',
              field: 'cost',
              customSort: (a, b) => b.cost + b.costAfreeca - (a.cost + a.costAfreeca),
              render: (rowData: CreatorDetailDataInterface): JSX.Element => (
                <div className={classes.valueContainer} style={{ whiteSpace: 'nowrap' }}>
                  {rowData.creatorId && (
                    <Typography>{`${rowData.cost.toLocaleString()} 원`}</Typography>
                  )}
                  {rowData.creatorIdAfreeca && (
                    <Typography className={classes.secondText}>
                      {`${rowData.costAfreeca.toLocaleString()} 원`}
                    </Typography>
                  )}
                </div>
              ),
            },
            {
              searchable: false,
              title: '일간 평균 클릭 수',
              field: 'ctr',
              customSort: (a, b) => b.ctr + b.ctrAfreeca - (a.ctr + a.ctrAfreeca),
              render: (rowData: CreatorDetailDataInterface): JSX.Element => (
                <div className={classes.valueContainer} style={{ whiteSpace: 'nowrap' }}>
                  {rowData.creatorId && (
                    <Typography>{`${rowData.ctr.toLocaleString()} 회`}</Typography>
                  )}
                  {rowData.creatorIdAfreeca && (
                    <Typography className={classes.secondText}>
                      {`${rowData.ctrAfreeca.toLocaleString()} 회`}
                    </Typography>
                  )}
                </div>
              ),
            },
            {
              searchable: false,
              title: '주 컨텐츠',
              render: (rowData: CreatorDetailDataInterface): JSX.Element => (
                <div className={classes.valueContainer}>
                  {rowData.creatorId && <Typography>{`${rowData.content}`}</Typography>}
                  {rowData.creatorIdAfreeca && (
                    <Typography className={classes.secondText}>
                      {`${rowData.contentAfreeca}`}
                    </Typography>
                  )}
                </div>
              ),
            },
            {
              searchable: false,
              title: '주 방송시간대',
              render: (rowData: CreatorDetailDataInterface): JSX.Element => (
                <div className={classes.valueContainer} style={{ whiteSpace: 'nowrap' }}>
                  {rowData.creatorId && <Typography>{`${rowData.openHour}`}</Typography>}
                  {rowData.creatorIdAfreeca && (
                    <Typography className={classes.secondText}>
                      {`${rowData.openHourAfreeca}`}
                    </Typography>
                  )}
                </div>
              ),
            },
          ]}
          onRowClick={(e, rowData): void => {
            onCreatorSelect(rowData);
          }}
          title=""
          cellWidth={90}
          data={fetchData.data.filter(d => {
            if (d.creatorName && d.creatorName.indexOf(searchText) > -1) {
              return true;
            }
            if (d.afreecaName && d.afreecaName?.indexOf(searchText) > -1) {
              return true;
            }
            return false;
          })}
          detailPanel={[
            {
              icon: (): JSX.Element => <Poll color="disabled" />,
              tooltip: '분석 그래프 보기',
              render: renderDetailGraph,
            },
          ]}
          style={{ padding: theme.spacing(4, 2, 0, 2) }}
          options={{
            toolbar: false,
            padding: 'dense',
            pageSize: 10,
            detailPanelColumnAlignment: 'left',
            rowStyle: (rowData: CreatorDetailDataInterface): React.CSSProperties => ({
              backgroundColor: isCheckedCreator(rowData.creatorId || rowData.creatorIdAfreeca)
                ? theme.palette.action.selected
                : theme.palette.background.paper,
            }),
            headerStyle: { textAlign: 'right', flexDirection: 'row-reverse' },
          }}
          localization={{
            body: { emptyDataSourceMessage: '선택가능한 방송인이 없습니다.' },
            pagination: {
              labelRowsSelect: '행',
            },
            header: { actions: '' },
          }}
        />
      )}
    </div>
  );
}
