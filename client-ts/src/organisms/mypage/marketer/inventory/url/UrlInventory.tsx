import React from 'react';
import moment from 'moment';
import {
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Delete, OpenInNew } from '@material-ui/icons';
import { UrlDataInterface, UrlLink } from '../interface';
import UrlDeleteDialog from './UrlDeleteDialog';
import { useDialog } from '../../../../../utils/hooks';
import CustomDataGrid from '../../../../../atoms/Table/CustomDataGrid';
import { UsePaginatedGetRequestObject } from '../../../../../utils/hooks/usePaginatedGetRequest';
import renderUrlConfirmState from '../../../../../utils/render_funcs/renderUrlConfirmState';
import Snackbar from '../../../../../atoms/Snackbar/Snackbar';

const useStyles = makeStyles((theme) => ({
  clickableText: {
    cursor: 'pointer', alignItems: 'center'
  },
  openInNew: {
    fontSize: theme.spacing(2)
  },
}));
interface UrlTableProps {
  urlData: UsePaginatedGetRequestObject<UrlDataInterface>;
  pageOffset: number;
  totalPageLength: number;
}

export default function UrlTable(props: UrlTableProps): JSX.Element {
  const classes = useStyles();
  const {
    urlData,
    pageOffset,
    totalPageLength,
  } = props;

  const urlDeleteDialog = useDialog();
  const [selectedUrl, setUrl] = React.useState<UrlDataInterface | null>(null);
  function handleUrlSelect(url: UrlDataInterface): void {
    setUrl(url);
  }

  // 삭제 성공 알림
  const successSnack = useDialog();

  return (
    <div>

      <div style={{ height: 400, width: '100%' }}>
        <CustomDataGrid
          pagination
          paginationMode="server"
          rowsPerPageOptions={[5]}
          onPageChange={(param): void => {
            // 페이지 수정 => 해당 페이지 데이터 로드
            // page 가 1부터 시작되므로 1 줄인다.
            urlData.handlePage(param.page - 1);
          }}
          pageSize={pageOffset}
          rowCount={totalPageLength}
          disableSelectionOnClick
          rows={urlData.data || []}
          columns={[
            { field: 'linkId', headerName: '링크 이름', width: 150, },
            {
              headerName: '심의 결과',
              field: 'confirmState',
              width: 150,
              renderCell: (data): React.ReactElement => (
                <Typography variant="body2" color={data.row.confirmState === 2 ? 'error' : 'textPrimary'}>
                  {renderUrlConfirmState(data.row.confirmState)}
                  <br />
                  {data.row.confirmState === 2 && (
                  // 거절됨의 경우 사유 렌더링
                  <Typography noWrap component="span" variant="caption" color="error">
                    {data.row.denialReason}
                  </Typography>
                  )}
                </Typography>
              )
            },
            {
              field: 'links',
              headerName: '링크 명',
              width: 300,
              renderCell: (data): React.ReactElement => (
                <div style={{ overflow: 'hidden' }}>
                  {data.row.links.links.map((link: UrlLink): JSX.Element | null => (
                    <Typography
                      noWrap
                      key={link.linkTo}
                      variant="body2"
                      color="textPrimary"
                      component="div"
                    >
                      {link.linkName || ''}
                      {link.linkName && (<br />)}
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
                          <OpenInNew className={classes.openInNew} />
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
                  {moment(data.row.regiDate).format('YYYY/MM/DD HH:mm:ss')}
                </Typography>
              )
            },
            {
              field: '',
              width: 80,
              headerName: '삭제',
              renderCell: (data): React.ReactElement => (
                <IconButton onClick={(): void => {
                  handleUrlSelect(data.row as UrlDataInterface);
                  urlDeleteDialog.handleOpen();
                }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              )
            }
          ]}
        />
      </div>

      {urlDeleteDialog.open && selectedUrl && (
      <UrlDeleteDialog
        open={urlDeleteDialog.open}
        selectedUrl={selectedUrl}
        handleClose={urlDeleteDialog.handleClose}
        recallRequest={(): void => {
          urlData.requestWithoutConcat();
          successSnack.handleOpen();
        }}
      />
      )}

      <Snackbar message="올바르게 삭제되었습니다." open={successSnack.open} onClose={successSnack.handleClose} />
    </div>
  );
}
