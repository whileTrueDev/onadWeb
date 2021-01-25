import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography, Tooltip, Divider
} from '@material-ui/core';
import { Delete, Star } from '@material-ui/icons';
import MaterialTable from '../../../../../atoms/Table/MaterialTable';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import { UrlDataInterface } from '../interface';
import UrlDeleteDialog from './UrlDeleteDialog';
import { useDialog } from '../../../../../utils/hooks';

const useStyles = makeStyles(() => ({
  title: { fontWeight: 'bold' },
  url: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '240px'
  },
}));

interface UrlTableProps {
  urlData: UseGetRequestObject<UrlDataInterface[] | null>;
  handleItemSelect: (item: string) => void;
}

export default function UrlTable(props: UrlTableProps): JSX.Element {
  const {
    urlData, handleItemSelect
  } = props;

  const urlDeleteDialog = useDialog();
  const [selectedUrl, setUrl] = React.useState<UrlDataInterface | null>(null);


  const classes = useStyles();

  const titleArray = ['MAIN', 'SUB1', 'SUB2'];
  const columns = [
    {
      title: '심의 결과',
      field: 'confirmState',
      render: (rowData: UrlDataInterface): React.ReactNode => {
        switch (rowData.confirmState) {
          case 0: return '승인대기⏰';
          case 1: return '승인됨👌';
          case 2: return (
            <Tooltip
              title={<Typography variant="body2">{`사유: ${rowData.denialReason}`}</Typography>}
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
      render: (rowData: UrlDataInterface): JSX.Element | null => (
        <div>
          {rowData.links.links.map((link, index) => {
            if (link) {
              return (
                <div key={titleArray[index] + link.linkName}>
                  {link.primary ? (
                    <div>
                      <p className={classes.title}>
                        MAIN
                      </p>
                      <span>
                        {link.linkName}
                      </span>
                      <Divider />
                    </div>
                  ) : (
                    <div>
                      <p className={classes.title}>
                        SUB
                      </p>
                      <span>
                        {link.linkName}
                      </span>
                      <Divider />
                    </div>
                  )}
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
      render: (rowData: UrlDataInterface): JSX.Element => (
        <div>
          {rowData.links.links.map((link, index): JSX.Element | null => {
            if (link) {
              return (
                <div key={titleArray[index] + link.linkTo} className={classes.url}>
                  {link.primary ? (
                    <div>
                      <p className={classes.title}>
                        MAIN
                        <Tooltip title={(
                          <Typography>
                            기본 링크로, 배너이미지 클릭시 곧바로 연결되는 링크입니다.
                          </Typography>
                        )}
                        >
                          <Star color="secondary" />
                        </Tooltip>
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className={classes.title}>
                        SUB
                      </p>
                    </div>
                  )}
                  <a
                    href={link.linkTo}
                    onClick={(e): void => {
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
    { title: '링크 등록 일자', render: (rowData: UrlDataInterface): React.ReactNode => (<span>{rowData.regiDate}</span>) },
  ];

  return (
    <div>
      {urlData.loading && (<MaterialTable columns={columns} data={[]} isLoading style={{ boxShadow: 'none' }} />)}
      {!urlData.loading && urlData.error && (<span>Error</span>)}
      {!urlData.loading && urlData.data && (
        <MaterialTable
          style={{ boxShadow: 'none' }}
          title=""
          columns={columns}
          data={urlData.data ? urlData.data : []}
          actions={[
            {
              icon: (): JSX.Element => (<Delete />),
              tooltip: '링크 삭제',
              onClick: (event: React.MouseEvent<HTMLButtonElement>,
                rowData: UrlDataInterface | UrlDataInterface[]): void => {
                if (Array.isArray(rowData)) {
                  setUrl(rowData[0]);
                  handleItemSelect(rowData[0].linkId);
                } else {
                  setUrl(rowData);
                  handleItemSelect(rowData.linkId);
                }
                urlDeleteDialog.handleOpen();
              }
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

      {urlDeleteDialog.open && selectedUrl && (
      <UrlDeleteDialog
        open={urlDeleteDialog.open}
        selectedUrl={selectedUrl}
        handleClose={urlDeleteDialog.handleClose}
        recallRequest={urlData.doGetRequest}
      />
      )}
    </div>
  );
}
