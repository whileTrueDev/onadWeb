import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Tooltip, Divider, makeStyles
} from '@material-ui/core';
import { Delete, Star } from '@material-ui/icons';
import MaterialTable from '../../../atoms/Table/MaterialTable';
import useFetchData from '../../../utils/lib/hooks/useFetchData';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 'bold'
  },
  url: {
    overflow: 'hidden', textOverflow: 'ellipsis', width: '200px'
  },
}));

export default function UrlTable(props) {
  const { handleDeleteOpen } = props;
  const classes = useStyles();
  const fetchData = useFetchData('/api/dashboard/marketer/inventory/landingurl/all');
  const titleArray = ['MAIN', 'SUB1', 'SUB2'];
  const columns = [
    {
      title: '심의 결과',
      field: 'confirmState',
      render: (rowData) => {
        switch (rowData.confirmState) {
          case 0: return '승인대기⏰';
          case 1: return '승인됨👌';
          case 2: return (
            <Tooltip
              title={<Typography variant="body2">{`사유: ${rowData.bannerDenialReason}`}</Typography>}
            >
              <Typography style={{ color: 'red' }}>거절됨</Typography>
            </Tooltip>
          );
          default: throw new Error('you need confirmState for table');
        }
      },
    },
    {
      title: '링크 이름',
      render: rowData => (
        <div>
          {rowData.links.links.map((link, index) => {
            if (link) {
              return (
                <div key={titleArray[index] + link.linkName}>
                  <p className={classes.title}>
                    {titleArray[index]}
                  </p>
                  {link.linkName}
                  <Divider />
                </div>
              );
            }
            return null;
          })}
        </div>
      ),
    },
    {
      title: '링크 주소',
      render: rowData => (
        <div>
          {rowData.links.links.map((link, index) => {
            if (link) {
              return (
                <div key={titleArray[index] + link.linkTo} className={classes.url}>
                  <p className={classes.title}>
                    {titleArray[index]}
                    {link.primary && (
                    <Tooltip title={(
                      <Typography>
                      기본 링크로, 배너이미지 클릭시 곧바로 연결되는 링크입니다.
                      </Typography>
                  )}
                    >
                      <Star color="secondary" />
                    </Tooltip>
                    )}
                  </p>
                  <a
                    href={link.linkTo}
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(link.linkTo);
                    }}
                  >
                    {link.linkTo}
                  </a>

                  <Divider />
                </div>
              );
            }
            return null;
          })}
        </div>
      ),
    },
    { title: '링크 등록 일자', render: rowData => (<span>{rowData.regiDate}</span>) },
  ];

  return (
    <div>
      {fetchData.loading && (<MaterialTable columns={columns} isLoading />)}
      {!fetchData.loading && fetchData.error && (<span>Error</span>)}
      {!fetchData.loading && fetchData.payload && (
        <MaterialTable
          title={null}
          columns={columns}
          data={fetchData.payload === 'nourldata' ? [] : fetchData.payload}
          actions={[
            {
              icon: () => (<Delete />),
              tooltip: '링크 삭제',
              onClick: (e, rowData) => { handleDeleteOpen(rowData); }
            }
          ]}
          options={{
            actionsColumnIndex: -1,
            search: false
          }}
          localization={{
            body: {
              emptyDataSourceMessage: '등록된 랜딩페이지 URL이 없습니다.'
            },
            header: {
              actions: '삭제'
            }
          }}
        />
      )}

    </div>
  );
}

UrlTable.propTypes = {
  handleDeleteOpen: PropTypes.func.isRequired
};
