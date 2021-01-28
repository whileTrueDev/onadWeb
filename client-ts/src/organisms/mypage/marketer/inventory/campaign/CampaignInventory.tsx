import React, { useState } from 'react';
import moment from 'moment';
import {
  Switch,
  Tooltip,
  Typography
} from '@material-ui/core';
import { OpenInNew } from '@material-ui/icons';
import CustomDataGrid from '../../../../../atoms/Table/CustomDataGrid';
import { CampaignInterface, CampaignTargetCreator } from '../../dashboard/interfaces';
import { UsePaginatedGetRequestObject } from '../../../../../utils/hooks/usePaginatedGetRequest';
import { useAnchorEl, useDialog } from '../../../../../utils/hooks';
import renderPriorityType from '../../../../../utils/render_funcs/renderPriorityType';
import renderOptionType from '../../../../../utils/render_funcs/renderOptionType';
import handleCampaignOnOff from '../../../../../utils/func/handleCampaignOnOff';
import Snackbar from '../../../../../atoms/Snackbar/Snackbar';
import BannerInfoPopover from './BannerInfoPopover';
import CampaignInventoryMenuPopover from './CampaignInventoryMenuPopover';
import CampaignDeleteConfirmDialog from '../../dashboard/CampaignDeleteConfirmDialog';
import CampaignUpdateDialog from '../../dashboard/CampaignUpdateDialog';
import CampaignAnalysisDialogV2 from '../../dashboard/CampaignAnalysisDialogV2';
import CampaignAnalysisDialog from '../../dashboard/CampaignAnalysisDialog';
import OnadBanner from '../../../../../atoms/Banner/OnadBanner';
import { UrlLink } from '../interface';

const V2_TIME = '2020-04-21';
export interface CampaignInventoryProps {
  pageOffset: number;
  campaignData: UsePaginatedGetRequestObject<CampaignInterface>;
  pageLength: number;
}
export default function CampaignInventory({
  pageOffset,
  campaignData,
  pageLength,
}: CampaignInventoryProps): JSX.Element {
  // ******************************************
  // 캠페인 On/Off 변경 요청 성공 핸들러
  function onOnOffSuccess(): void {
    campaignData.requestWithoutConcat();
  }
  // 캠페인 On/Off 변경 요청 실패 핸들러
  const failSnack = useDialog();
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
      .map((creator: CampaignTargetCreator) => `${creator.afreecaName || creator.creatorName}`)
      .join(',');
  }

  // 캠페인 메뉴 다이얼로그
  const campaignUpdateDialog = useDialog(); // 캠페인 편집
  const campaignDeleteDialog = useDialog(); // 캠페인 삭제
  const campaignReportDialog = useDialog(); // 캠페인 분석

  return (
    <div style={{ height: 400, width: '100%' }}>
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
        columns={[
          {
            field: 'onOff',
            headerName: 'On/Off',
            renderCell: (data): React.ReactElement => (
              <Switch
                size="small"
                id="onoff-switch"
                color="primary"
                checked={Boolean(data.row.onOff)}
                onChange={handleCampaignOnOff({
                  onoffState: !data.row.onOff,
                  campaignId: data.row.campaignId,
                  onSuccess: onOnOffSuccess,
                  onFail: onOnOffFail,
                })}
              />
            ),
          },
          {
            field: 'campaignName',
            headerName: '캠페인 명',
            width: 200,
            renderCell: (data): React.ReactElement => (
              <Typography
                noWrap
                variant="body2"
                color="primary"
                style={{ cursor: 'pointer' }}
                onClick={(e): void => handleCampaignNameClick(e, data.row as CampaignInterface)}
              >
                {data.row.campaignName}
              </Typography>
            )
          },
          {
            headerName: '배너',
            field: 'bannerSrc',
            sortable: false,
            filterable: false,
            renderCell: (data): React.ReactElement => (
              <OnadBanner
                src={data.row.bannerSrc}
                onClick={(e): void => handleBannerClick(e, data.row as CampaignInterface)}
                style={{ cursor: 'zoom-in' }}
                width="50"
                height="30"
              />
            )
          },
          {
            headerName: 'URL',
            field: 'linkId',
            sortable: false,
            filterable: false,
            width: 150,
            renderCell: (data): React.ReactElement => (
              <Typography
                onClick={(): void => {
                  const targetUrl = data.row.linkData.links.find((link: UrlLink) => !!link.primary);
                  window.open(targetUrl.linkTo, '_blank');
                }}
                style={{ cursor: 'pointer' }}
                color="primary"
                variant="body2"
                noWrap
              >
                <OpenInNew style={{ fontSize: 16 }} />
                {data.row.linkId}
              </Typography>
            )
          },
          {
            field: 'optionType',
            headerName: '타입',
            width: 150,
            renderCell: (data): React.ReactElement => (
              <Typography noWrap variant="body2">{renderOptionType(data.row.optionType)}</Typography>
            )
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
        rows={campaignData.data || []}
        loading={campaignData.loading}
      />

      {/* 캠페인 메뉴 (분석, 수정, 삭제) */}
      {selected && menuAnchor.open && menuAnchor.anchorEl && (
      <CampaignInventoryMenuPopover
        open={menuAnchor.open}
        anchorEl={menuAnchor.anchorEl}
        onClose={menuAnchor.handleAnchorClose}
        handleAnaylsisDialogOpen={campaignReportDialog.handleOpen}
        handleDeleteDialogOpen={campaignDeleteDialog.handleOpen}
        handleUpdateDialogOpen={campaignUpdateDialog.handleOpen}
      />
      )}

      {/* 4월 21일 이전 (광고페이지 있는 경우의) 캠페인 분석 다이얼로그 (full screen) */}
      {selected && (selected.regiDate < V2_TIME) && campaignReportDialog.open && (
      <CampaignAnalysisDialog
        SLIDE_TIMEOUT={500} // 슬라이드 트랜지션 타임아웃
        open={campaignReportDialog.open}
        selectedCampaign={selected}
        handleClose={(): void => {
          campaignReportDialog.handleClose();
          setTimeout(() => {
            setSelected(undefined);
            // 트랜지션 만큼 뒤에 실행. (먼저 실행하면 트랜지션 발동 안됨)
          }, 500);
        }}
      />
      )}


      {/* 4월 21일 이후 캠페인 분석 다이얼로그 (full screen) */}
      {campaignReportDialog.open && selected
        && (selected.regiDate >= V2_TIME)
        && selected.optionType === 1 && ( // "생방송 배너 광고" 캠페인
          <CampaignAnalysisDialogV2
            SLIDE_TIMEOUT={500} // 슬라이드 트랜지션 타임아웃
            open={campaignReportDialog.open}
            selectedCampaign={selected}
            handleClose={(): void => {
              campaignReportDialog.handleClose();
              setTimeout(() => {
                setSelected(undefined);
                // 트랜지션 만큼 뒤에 실행. (먼저 실행하면 트랜지션 발동 안됨)
              }, 500);
            }}
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
          message="캠페인 상태를 변경하는 데에 실패했습니다. 잠시 후 다시 시도해주세요."
          color="error"
        />
      )}
    </div>
  );
}
