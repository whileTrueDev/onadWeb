import React, { useState } from 'react';
import moment from 'moment';
import {
  Badge,
  IconButton,
  makeStyles,
  Tooltip,
  Typography
} from '@material-ui/core';
import { MoreVert, OpenInNew } from '@material-ui/icons';
import CustomDataGrid from '../../../../../atoms/Table/CustomDataGrid';
import { CampaignInterface, CampaignTargetCreator } from '../../dashboard/interfaces';
import { UsePaginatedGetRequestObject } from '../../../../../utils/hooks/usePaginatedGetRequest';
import { useAnchorEl, useDialog } from '../../../../../utils/hooks';
import renderPriorityType from '../../../../../utils/render_funcs/renderPriorityType';
import renderOptionType from '../../../../../utils/render_funcs/renderOptionType';
import Snackbar from '../../../../../atoms/Snackbar/Snackbar';
import BannerInfoPopover from './BannerInfoPopover';
import CampaignInventoryMenuPopover from './CampaignInventoryMenuPopover';
import CampaignDeleteConfirmDialog from '../../dashboard/CampaignDeleteConfirmDialog';
import CampaignUpdateDialog from '../../dashboard/CampaignUpdateDialog';
import OnadBanner from '../../../../../atoms/Banner/OnadBanner';
import { UrlLink } from '../interface';
import { CONFIRM_STATE_CONFIRMED, CONFIRM_STATE_REJECTED } from '../../../../../utils/render_funcs/renderUrlConfirmState';
import CampaignOnOffSwitch from '../../../../../atoms/Switch/CampaignOnOffSwitch';

const useStyles = makeStyles(() => ({
  link: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    }
  },
  datagrid: { height: 400, width: '100%' },
  campaignName: {
    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  zoomin: { cursor: 'zoom-in' },
}));
export interface CampaignInventoryProps {
  pageOffset: number;
  campaignData: UsePaginatedGetRequestObject<CampaignInterface>;
  pageLength: number;
  handleCampaignSelect: (campaignId: string | undefined) => void;
}
export default function CampaignInventory({
  pageOffset,
  campaignData,
  pageLength,
  handleCampaignSelect,
}: CampaignInventoryProps): JSX.Element {
  const classes = useStyles();
  // ******************************************
  // 캠페인 On/Off 변경 요청 성공 핸들러
  const [failSnackMessage, setFailSnackMessage] = useState<string>('캠페인 상태를 변경하는 데에 실패했습니다. 잠시 후 다시 시도해주세요.');
  const failSnack = useDialog();
  function onOnOffSuccess(resData: any): void {
    // on/off 변경에 실패한 경우 (캠페인의 url / banner 중 하나라도 심의 통과하지 못한 경우)
    if (!resData[0]) {
      failSnack.handleOpen();
      setFailSnackMessage(resData[1]);
    } else {
      handleCampaignSelect(undefined);
      campaignData.requestWithoutConcat();
    }
  }
  // 캠페인 On/Off 변경 요청 실패 핸들러
  function onOnOffFail(): void {
    failSnack.handleOpen();
  }

  // *****************************************
  // 캠페인 클릭 핸들러
  const anchor = useAnchorEl();
  const [selected, setSelected] = useState<CampaignInterface>();
  function handleBannerClick(e: React.MouseEvent<HTMLElement>, cam: CampaignInterface): void {
    setSelected(cam);
    anchor.handleAnchorOpen(e);
  }

  // *************************************
  // 캠페인 메뉴
  const menuAnchor = useAnchorEl();
  function handleCampaignNameClick(
    e: React.MouseEvent<HTMLSpanElement>, cam: CampaignInterface
  ): void {
    setSelected(cam);
    menuAnchor.handleAnchorOpen(e);
  }

  // *************************************
  // 캠페인 타겟 스트리머 목록 렌더링
  function renderTargetCreators(creators: CampaignTargetCreator[]): string {
    return creators
      .map((creator: CampaignTargetCreator) => {
        if (creator.afreecaName && creator.creatorName) return `${creator.creatorName}(${creator.afreecaName})`;
        return `${creator.afreecaName || creator.creatorName}`;
      })
      .join(', ');
  }

  // 캠페인 메뉴 다이얼로그
  const campaignUpdateDialog = useDialog(); // 캠페인 편집
  const campaignDeleteDialog = useDialog(); // 캠페인 삭제

  return (
    <div className={classes.datagrid}>
      <CustomDataGrid
        pagination
        paginationMode="server"
        pageSize={pageOffset}
        rowCount={pageLength || undefined}
        rowsPerPageOptions={[5]}
        onPageChange={(param): void => {
          // 페이지 수정 => 해당 페이지 데이터 로드
          // page 가 1부터 시작되므로 1 줄인다.
          campaignData.handlePage(param.page - 1);
        }}
        disableSelectionOnClick
        rows={campaignData.data || []}
        loading={campaignData.loading}
        columns={[
          {
            field: 'onOff',
            headerName: 'On/Off',
            renderCell: (data): React.ReactElement => (
              <CampaignOnOffSwitch
                campaign={data.row as CampaignInterface}
                onSuccess={onOnOffSuccess}
                onFail={onOnOffFail}
                inventoryLoading={campaignData.loading}
              />
            )
          },
          {
            field: 'campaignName',
            headerName: '캠페인 명',
            width: 220,
            renderCell: (data): React.ReactElement => (
              <div className={classes.campaignName}>
                <Typography
                  noWrap
                  variant="body2"
                  color="primary"
                  className={classes.link}
                  onClick={(): void => handleCampaignSelect(data.row.campaignId as string)}
                >
                  {data.row.campaignName}
                </Typography>
                <IconButton size="small" onClick={(e): void => handleCampaignNameClick(e, data.row as CampaignInterface)}><MoreVert /></IconButton>
              </div>
            )
          },
          {
            field: 'optionType',
            headerName: '타입',
            width: 160,
            renderCell: (data): React.ReactElement => (
              <Typography noWrap variant="body2">{renderOptionType(data.row.optionType)}</Typography>
            )
          },
          {
            headerName: '배너',
            field: 'bannerSrc',
            sortable: false,
            filterable: false,
            renderCell: (data): React.ReactElement => (
              <Badge
                color={data.row.confirmState === CONFIRM_STATE_CONFIRMED ? 'primary' : 'secondary'}
                badgeContent={data.row.confirmState === CONFIRM_STATE_CONFIRMED ? '승인' : '거절'}
                onClick={(e): void => handleBannerClick(e, data.row as CampaignInterface)}
                className={classes.zoomin}
              >
                <OnadBanner
                  src={data.row.bannerSrc}
                  onClick={(e): void => handleBannerClick(e, data.row as CampaignInterface)}
                  className={classes.zoomin}
                  width="50"
                  height="30"
                />
              </Badge>
            )
          },
          {
            headerName: '랜딩URL',
            field: 'linkId',
            sortable: false,
            filterable: false,
            width: 150,
            renderCell: (data): React.ReactElement => {
              if (!data.row.linkId) return <Typography variant="body2">온애드샵</Typography>;
              return (
                <Tooltip title={data.row.linkId}>
                  <Typography
                    onClick={(): void => {
                      const targetUrl = data.row.linkData.links.find(
                        (link: UrlLink) => !!link.primary
                      );
                      window.open(targetUrl.linkTo, '_blank');
                    }}
                    className={classes.link}
                    color={data.row.linkConfirmState === CONFIRM_STATE_REJECTED ? 'error' : 'primary'}
                    variant="body2"
                    noWrap
                  >
                    <OpenInNew fontSize="small" style={{ verticalAlign: 'middle' }} />
                    {data.row.linkId}
                  </Typography>
                </Tooltip>
              );
            }
          },
          {
            field: 'merchandiseId',
            headerName: '상품',
            width: 120,
            filterable: false,
            sortable: false,
            renderCell: (data): React.ReactElement => {
              if (!data.row.merchandiseId) return <Typography variant="body2">없음</Typography>;
              return (
                <Tooltip title={data.row.merchandiseName}>
                  <Typography variant="body2" noWrap>
                    {data.row.merchandiseName}
                  </Typography>
                </Tooltip>
              );
            }
          },
          {
            field: 'priorityType',
            headerName: '송출 우선순위',
            width: 150,
            renderCell: (data): React.ReactElement => (
              <Typography noWrap variant="body2">{renderPriorityType(data.row.priorityType)}</Typography>
            )
          },
          {
            field: 'dailyLimit',
            headerName: '일일 예산',
            width: 120,
            align: 'center',
            renderCell: (data): React.ReactElement => (
              <Typography noWrap variant="body2">
                {data.row.dailyLimit !== -1 ? data.row.dailyLimit.toLocaleString() : '없음'}
              </Typography>
            )
          },
          {
            field: 'campaignDescription',
            headerName: '홍보 문구',
            width: 200,
            renderCell: (data): React.ReactElement => (
              <Tooltip title={data.row.campaignDescription} placement="bottom-start">
                <Typography noWrap variant="body2">
                  {data.row.campaignDescription}
                </Typography>
              </Tooltip>
            )
          },
          {
            field: 'selectedTime',
            headerName: '송출 시간',
            width: 150,
            renderCell: (data): React.ReactElement => (
              <Tooltip title={data.row.selectedTime.join(',')} placement="bottom-start">
                <Typography noWrap variant="body2">
                  {data.row.selectedTime.join(',')}
                </Typography>
              </Tooltip>
            )
          },
          {
            field: 'targetList',
            headerName: '타겟 목록',
            width: 150,
            renderCell: (data): React.ReactElement => (
              <>
                {data.row.priorityType === 0 && data.row.targetCreators ? ( // 크리에이터 우선형의 경우
                  <Tooltip title={renderTargetCreators(data.row.targetCreators)} placement="bottom-start">
                    <Typography noWrap variant="body2">
                      {renderTargetCreators(data.row.targetCreators)}
                    </Typography>
                  </Tooltip>
                ) : (
                  <Tooltip title={data.row.targetList.join(',')} placement="bottom-start">
                    <Typography noWrap variant="body2">
                      {data.row.targetList.join(',')}
                    </Typography>
                  </Tooltip>
                )}
              </>
            )
          },
          {
            field: 'regiDate',
            headerName: '캠페인 생성일',
            width: 200,
            renderCell: (data): React.ReactElement => (
              <Typography noWrap variant="body2">{moment(data.row.regiDate).format('YYYY/MM/DD HH:mm:ss')}</Typography>
            ),
          },
        ]}
      />

      {/* 캠페인 메뉴 (분석, 수정, 삭제) */}
      {selected && menuAnchor.open && menuAnchor.anchorEl && (
      <CampaignInventoryMenuPopover
        open={menuAnchor.open}
        anchorEl={menuAnchor.anchorEl}
        onClose={menuAnchor.handleAnchorClose}
        handleDeleteDialogOpen={campaignDeleteDialog.handleOpen}
        handleUpdateDialogOpen={campaignUpdateDialog.handleOpen}
      />
      )}

      {/* 캠페인 업데이트 다이얼로그 */}
      {campaignUpdateDialog.open && selected && (
      <CampaignUpdateDialog
        open={campaignUpdateDialog.open}
        selectedCampaign={selected}
        doGetRequest={campaignData.requestWithoutConcat}
        handleClose={(): void => {
          setSelected(undefined);
          campaignUpdateDialog.handleClose();
        }}
      />
      )}

      {/* 캠페인 삭제 클릭시 다이얼로그 */}
      {campaignDeleteDialog.open && selected && (
      <CampaignDeleteConfirmDialog
        open={campaignDeleteDialog.open}
        selectedCampaign={selected}
        doGetRequest={campaignData.requestWithoutConcat}
        handleClose={(): void => {
          setSelected(undefined);
          campaignDeleteDialog.handleClose();
        }}
      />
      )}

      {/* 배너 자세히 보기 popper */}
      {selected && anchor.open && anchor.anchorEl && (
        <BannerInfoPopover
          selectedCampaign={selected}
          open={anchor.open}
          anchorEl={anchor.anchorEl}
          onClose={anchor.handleAnchorClose}
        />
      )}

      {failSnack.open && (
        <Snackbar
          open={failSnack.open}
          onClose={failSnack.handleClose}
          message={failSnackMessage}
          color="error"
        />
      )}
    </div>
  );
}
