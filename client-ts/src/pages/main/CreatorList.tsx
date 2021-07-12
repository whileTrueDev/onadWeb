/* eslint-disable react/display-name */
import { TablePagination, Typography, useMediaQuery } from '@material-ui/core';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import Table from '../../atoms/Table/MaterialTable';
import AppFooter from '../../organisms/main/layouts/AppFooter';
import NavTop from '../../organisms/main/layouts/NavTop';
import RePasswordDialog from '../../organisms/main/main/login/RePassword';
import { useCreators } from '../../utils/hooks/query/useCreators';
import { useCreatorsLive } from '../../utils/hooks/query/useCreatorsLive';
import useLoginValue from '../../utils/hooks/useLoginValue';
import useStyles from './style/CreatorList.style';

export interface ContractedCreatorListData<T> {
  creatorId: T;
  creatorName: T;
  creatorLogo: T;
  followers: number;
  content: T;
  openHour: T;
  creatorTwitchId: T;
}

const COLORS = [
  ['#00b9fd', '#4459fc', '#0f7cfc'],
  ['#00ddcc', '#00ad93', '#00d57b'],
  ['#ffe34a', '#ff7f00', '#fcaa0f'],
  ['#e000fd', '#4459fc', '#8f0ffc'],
];

export default function CreatorList(): JSX.Element {
  const { isLogin, repasswordOpen, logout, setRepassword } = useLoginValue();
  const classes = useStyles();
  const [LiveCreator, setLiveCreator] = useState<null | ContractedCreatorListData<string>[]>();
  const ContractedCreatorList = useCreators();
  const LiveCreatorList = useCreatorsLive();
  const isSmWidth = useMediaQuery('(max-width:960px)');
  const isXsWidth = useMediaQuery('(max-width:600px)');

  function getRandomColors(array: any): string {
    const RandomColor = array[Math.floor(Math.random() * array.length)];
    return `linear-gradient(to bottom, ${RandomColor[0]},${RandomColor[1]}, ${RandomColor[2]}`;
  }

  useEffect(() => {
    if (
      !ContractedCreatorList.isLoading &&
      ContractedCreatorList.data &&
      !LiveCreatorList.isLoading &&
      LiveCreatorList.data
    ) {
      setLiveCreator(
        ContractedCreatorList.data!.filter(row => LiveCreatorList.data!.includes(row.creatorId)),
      );
    }
  }, [
    ContractedCreatorList.data,
    ContractedCreatorList.isLoading,
    LiveCreatorList.data,
    LiveCreatorList.isLoading,
  ]);

  const Columns = [
    {
      title: '방송인명',
      field: 'creatorName',
      render: (rowData: any): JSX.Element => (
        <div className={classes.columnWrapper}>
          <div
            className={classes.creatorLogoWrapper}
            key={nanoid()}
            style={{ backgroundImage: `${getRandomColors(COLORS)}` }}
          >
            <img
              src={rowData.creatorLogo}
              alt="creatorLogo"
              className={classes.creatorLogo}
              onError={e => {
                e.currentTarget.src = '/logo/noBgIconLogo.png';
              }}
            />
          </div>
          <Typography variant="subtitle1" className={classes.columnText}>
            {rowData.creatorName}
          </Typography>
        </div>
      ),
    },
    {
      title: '팔로워수',
      field: 'followers',
      render: (rowData: any): JSX.Element => (
        <Typography variant="subtitle1" align="center" className={classes.columnText}>
          {rowData.followers}
        </Typography>
      ),
    },
    {
      title: '컨텐츠',
      field: 'content',
      render: (rowData: any): JSX.Element => (
        <Typography variant="subtitle1" align="center" className={classes.columnText}>
          {rowData.content}
        </Typography>
      ),
    },
    {
      title: '주방송시간',
      field: 'openHour',
      render: (rowData: any): JSX.Element => (
        <Typography variant="subtitle1" align="center" className={classes.columnText}>
          {rowData.openHour}
        </Typography>
      ),
    },
  ];

  return (
    <div>
      <NavTop isLogin={isLogin} logout={logout} MainUserType />
      <div className={classes.root}>
        <div className={classes.containerWrap}>
          <img src="/creatorList/creatorList.svg" alt="creatorList" className={classes.mainImage} />
        </div>
        <div className={classes.wrapper}>
          <Typography variant="h3" className={classes.title}>
            LIVE STREAMING
          </Typography>
          {/* 라이브 스트리밍 리스트 */}
          <div className={classes.liveContainer}>
            {!ContractedCreatorList.isLoading &&
              ContractedCreatorList.data &&
              !LiveCreatorList.isLoading &&
              LiveCreatorList.data &&
              LiveCreator?.map(row => (
                <div
                  className={classes.liveCreatorWrapper}
                  key={nanoid()}
                  style={{ backgroundImage: `${getRandomColors(COLORS)}` }}
                >
                  <a
                    href={`https://www.twitch.tv/${row.creatorTwitchId}`}
                    className={classes.liveCreator}
                  >
                    <img
                      src={row.creatorLogo}
                      alt="creatorLogo"
                      className={classes.liveCreator}
                      onError={e => {
                        e.currentTarget.src = '/logo/noBgIconLogo.png';
                      }}
                    />
                  </a>
                </div>
              ))}
            <div />
          </div>

          {/* 전체 크리에이터 리스트 */}
          <div>
            <Table
              columns={
                // eslint-disable-next-line no-nested-ternary
                !isSmWidth ? Columns : !isXsWidth ? Columns.slice(0, 3) : Columns.slice(0, 1)
              }
              data={ContractedCreatorList.data || []}
              isLoading={ContractedCreatorList.isLoading || false}
              components={{
                Pagination: props => <TablePagination {...props} />,
              }}
              options={{
                search: true,
                pageSize: 7,
                pageSizeOptions: [],
                searchFieldAlignment: 'right',
                headerStyle: { textAlign: 'center', fontWeight: 700, fontSize: 25 },
                draggable: false,
                paginationType: 'stepped',
                showTitle: false,
                toolbar: true,
                loadingType: 'linear',
                searchFieldStyle: { borderRadius: 8, backgroundColor: '#f4f4f4' },
              }}
              style={{
                boxShadow: 'none',
              }}
            />
          </div>
        </div>
        <AppFooter />
      </div>
      <RePasswordDialog
        repasswordOpen={repasswordOpen}
        setRepassword={setRepassword}
        logout={logout}
      />
    </div>
  );
}
