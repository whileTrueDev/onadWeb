/* eslint-disable react/display-name */
// material-UI
import { Typography, TablePagination, useMediaQuery } from '@material-ui/core';
// 내부 소스
// 프로젝트 내부 모듈
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { GetServerSideProps } from 'next';
// 컴포넌트
import Image from 'next/image';
import NavTop from '../components/mainpage/layout/navTop';
import AppFooter from '../components/mainpage/layout/appFooter';
import RePasswordDialog from '../components/mainpage/login/rePassword';
import Table from '../atoms/table/materialTable';
// util 계열
import axios from '../utils/axios';
import HOST from '../config';
import useLoginValue from '../utils/hooks/useLoginValue';
// 스타일
import useStyles from '../styles/mainpage/main/creatorList/creatorList.style';

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

interface CreatorListProps {
  contractedCreatorData: ContractedCreatorListData<string>[];
  liveCreatorData: string[];
}

function getRandomColors(array: any): string {
  const RandomColor = array[Math.floor(Math.random() * array.length)];
  return `linear-gradient(to bottom, ${RandomColor[0]},${RandomColor[1]}, ${RandomColor[2]}`;
}

export default function CreatorList({
  contractedCreatorData,
  liveCreatorData,
}: CreatorListProps): JSX.Element {
  const { isLogin, repasswordOpen, logout, setRepassword } = useLoginValue();
  const classes = useStyles();
  const [LiveCreator, setLiveCreator] = useState<null | ContractedCreatorListData<string>[]>();
  const isSmWidth = useMediaQuery('(max-width:960px)');
  const isXsWidth = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    setLiveCreator(contractedCreatorData.filter(row => liveCreatorData.includes(row.creatorId)));
  }, [contractedCreatorData, liveCreatorData]);

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
            <Image
              className={classes.creatorLogo}
              src={rowData.creatorLogo}
              alt=""
              id={rowData.creatorName}
              onError={e => {
                e.currentTarget.srcset = '/logo/noBgIconLogo.png';
              }}
              width={50}
              height={50}
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
            {LiveCreator?.map((row, index: number) => (
              <div
                className={classes.liveCreatorWrapper}
                key={nanoid()}
                style={{ backgroundImage: `${getRandomColors(COLORS)}` }}
              >
                <a
                  href={`https://www.twitch.tv/${row.creatorTwitchId}`}
                  className={classes.liveCreatorAtag}
                >
                  <div>
                    <Image
                      className={classes.liveCreator}
                      src={row.creatorLogo}
                      id={`icon-${index}`}
                      alt=""
                      layout="fill"
                      onError={e => {
                        e.currentTarget.srcset = '/logo/noBgIconLogo.png';
                      }}
                    />
                  </div>
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
              data={contractedCreatorData || []}
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

export const getServerSideProps: GetServerSideProps = async () => {
  const contractedCreator = await axios.get(`${HOST}/creators`);
  const liveCreator = await axios.get(`${HOST}/creators/live`);
  const contractedCreatorData = await contractedCreator.data;
  const liveCreatorData = await liveCreator.data;

  return {
    props: {
      contractedCreatorData,
      liveCreatorData,
    },
  };
};
