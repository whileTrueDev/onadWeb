/* eslint-disable react/display-name */
import { IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Delete, OpenInNew } from '@material-ui/icons';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import CustomDataGrid from '../../../../../atoms/Table/CustomDataGrid';
import { useDialog } from '../../../../../utils/hooks';
import { useMarketerLandingUrlLength } from '../../../../../utils/hooks/query/useMarketerLandingUrlLength';
import {
  LandingUrlLink,
  MarketerLandingUrl,
  useMarketerLandingUrlList,
} from '../../../../../utils/hooks/query/useMarketerLandingUrlList';
import renderUrlConfirmState, {
  CONFIRM_STATE_REJECTED,
} from '../../../../../utils/render_funcs/renderUrlConfirmState';
import UrlDeleteDialog from './UrlDeleteDialog';

const useStyles = makeStyles(() => ({
  clickableText: {
    cursor: 'pointer',
    alignItems: 'center',
  },
  datagrid: { height: 400, width: '100%' },
}));

const FETCH_PAGE_OFFSET = 5;
export default function UrlTable(): JSX.Element {
  const queryClient = useQueryClient();
  const classes = useStyles();

  // URL 데이터
  const [page, setPage] = useState(0);
  const handlePage = (newV: number) => setPage(newV);
  const landingUrl = useMarketerLandingUrlList({ offset: FETCH_PAGE_OFFSET, page });
  const landingUrlLength = useMarketerLandingUrlLength();

  const urlDeleteDialog = useDialog();
  const [selectedUrl, setUrl] = React.useState<MarketerLandingUrl | null>(null);
  function handleUrlSelect(url: MarketerLandingUrl): void {
    setUrl(url);
  }

  // 삭제 성공 알림
  const { enqueueSnackbar } = useSnackbar();

  return (
    <div>
      <div className={classes.datagrid}>
        <CustomDataGrid
          pagination
          paginationMode="server"
          rowsPerPageOptions={[5]}
          onPageChange={(param): void => {
            // 페이지 수정 => 해당 페이지 데이터 로드
            handlePage(param.page);
          }}
          pageSize={FETCH_PAGE_OFFSET}
          rowCount={landingUrlLength.data}
          disableSelectionOnClick
          loading={landingUrl.isLoading}
          rows={landingUrl.data || []}
          columns={[
            {
              field: 'linkId',
              headerName: '링크 이름',
              width: 150,
              renderCell: (data): React.ReactElement => (
                <Tooltip title={data.row.linkId}>
                  <Typography noWrap variant="body2">
                    {data.row.linkId}
                  </Typography>
                </Tooltip>
              ),
            },
            {
              headerName: '심의 결과',
              field: 'confirmState',
              width: 150,
              renderCell: (data): React.ReactElement => (
                <Typography
                  variant="body2"
                  color={data.row.confirmState === CONFIRM_STATE_REJECTED ? 'error' : 'textPrimary'}
                >
                  {renderUrlConfirmState(data.row.confirmState)}
                  <br />
                  {data.row.confirmState === CONFIRM_STATE_REJECTED && (
                    // 거절됨의 경우 사유 렌더링
                    <Typography noWrap component="span" variant="caption" color="error">
                      {data.row.denialReason}
                    </Typography>
                  )}
                </Typography>
              ),
            },
            {
              field: 'links',
              headerName: '링크 명',
              width: 300,
              renderCell: (data): React.ReactElement => (
                <div style={{ overflow: 'hidden' }}>
                  {data.row.links.links.map((link: LandingUrlLink): JSX.Element | null => (
                    <Typography
                      noWrap
                      key={link.linkTo}
                      variant="body2"
                      color="textPrimary"
                      component="div"
                    >
                      {link.linkName || ''}
                      {link.linkName && <br />}
                      <Tooltip title={link.linkTo} placement="bottom-start">
                        <Typography
                          noWrap
                          className={classes.clickableText}
                          onClick={(e: React.MouseEvent<HTMLElement>): void => {
                            e.preventDefault();
                            window.open(link.linkTo, '_blank');
                          }}
                          variant="body2"
                          color="primary"
                          component="span"
                        >
                          <OpenInNew fontSize="small" style={{ verticalAlign: 'middle' }} />
                          {link.linkTo}
                        </Typography>
                      </Tooltip>
                    </Typography>
                  ))}
                </div>
              ),
            },
            {
              field: 'regiDate',
              width: 180,
              headerName: '링크 등록 일자',
              renderCell: (data): React.ReactElement => (
                <Typography variant="body2" noWrap>
                  {dayjs(data.row.regiDate).format('YYYY/MM/DD HH:mm:ss')}
                </Typography>
              ),
            },
            {
              field: '',
              width: 80,
              headerName: '삭제',
              renderCell: (data): React.ReactElement => (
                <IconButton
                  onClick={(): void => {
                    handleUrlSelect(data.row as MarketerLandingUrl);
                    urlDeleteDialog.handleOpen();
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              ),
            },
          ]}
        />
      </div>

      {urlDeleteDialog.open && selectedUrl && (
        <UrlDeleteDialog
          open={urlDeleteDialog.open}
          selectedUrl={selectedUrl}
          handleClose={urlDeleteDialog.handleClose}
          onSuccess={(): void => {
            queryClient.invalidateQueries('marketerLandingUrlList');
            queryClient.invalidateQueries('marketerLandingUrlListWithoutPagination');
            queryClient.invalidateQueries('marketerLandingUrlConnectedCampaigns');
            enqueueSnackbar('올바르게 삭제되었습니다.', { variant: 'success' });
          }}
        />
      )}
    </div>
  );
}
