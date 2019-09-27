import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
// icons
import ArrowUpward from '@material-ui/icons/ArrowUpwardRounded';
import Check from '@material-ui/icons/CheckRounded';
import Clear from '@material-ui/icons/ClearRounded';
import Delete from '@material-ui/icons/DeleteRounded';
import ChevronLeft from '@material-ui/icons/ChevronLeftRounded';
import ChevronRight from '@material-ui/icons/ChevronRightRounded';
import FilterList from '@material-ui/icons/FilterListRounded';
import FirstPage from '@material-ui/icons/FirstPageRounded';
import LastPage from '@material-ui/icons/LastPageRounded';
// own components
import { Typography } from '@material-ui/core';
import IOSSwitch from '../../../../components/Switch/IOSSwitch';
import Dialog from '../../../../components/Dialog/Dialog';
import Button from '../../../../components/CustomButtons/Button';
import useUpdateData from '../../../../lib/hooks/useUpdateData';
import useDialog from '../../../../lib/hooks/useDialog';
import useDeleteData from '../../../../lib/hooks/useDeleteData';
import history from '../../../../../../history';

const tableIcons = {
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
};

const localization = {
  body: {
    deleteTooltip: '캠페인 삭제',
  },
  pagination: {
    firstTooltip: '첫 페이지',
    previousTooltip: '이전 페이지',
    nextTooltip: '다음 페이지',
    lastTooltip: '마지막 페이지',
    labelRowsSelect: '행'
  },
  header: {
    actions: ''
  }
};

function CampaignTable({ ...props }) {
  const { dataSet } = props;

  const tableRef = React.useRef();
  const { handleSwitch } = useUpdateData('/api/dashboard/marketer/campaign/onoff');
  const {
    success, loading, error, handleDelete
  } = useDeleteData('/api/dashboard/marketer/campaign');
  const { open, handleOpen, handleClose } = useDialog();
  const snackbar = useDialog();

  React.useEffect(() => {
    snackbar.handleOpen(history.location.search === '?deleted');
  });

  const columns = [
    {
      title: '상태', field: 'onOff', lookup: { 0: 'OFF', 1: 'ON' }, editable: 'never'
    },
    { title: '캠페인명', field: 'campaignName', editable: 'never' },
    {
      title: '일예산',
      field: 'dailyLimit',
      type: 'numeric',
      lookup: { '-1': '설정안함' },
    },
    {
      title: '게재 우선순위',
      field: 'priorityType',
      lookup: { 0: '크리에이터 우선', 1: '카테고리 우선', 2: '노출우선' },
    },
    { title: '광고유형', field: 'optionType', lookup: { 0: 'CPM', 1: 'CPC + CPM', } },
    {
      title: '등록된 배너',
      field: 'bannerSrc',
      render: (rowData) => {
        if (rowData.bannerSrc) {
          return (<img src={rowData.bannerSrc} alt="banner" style={{ width: 'auto', maxHeight: 200 }} />);
        }
        return '배너가 없삽니다.';
      },
      editable: 'never'
    },
    { title: '등록일', field: 'regiDate', editable: 'never' },
  ];

  const [state] = React.useState({ columns: [...columns], data: [...dataSet] });


  return (
    <div>
      <MaterialTable
        tableRef={tableRef}
        localization={localization}
        style={{ boxShadow: 'none' }}
        icons={tableIcons}
        columns={state.columns}
        data={state.data}
        actions={[
          rowData => ({
            icon: () => (<Delete />),
            tooltip: '캠페인 삭제',
            onClick: () => { console.log('delete clicked! - ', rowData.campaignId); handleOpen(rowData.campaignId); }
          }),
          rowData => ({
            icon: () => (<IOSSwitch checked={Boolean(rowData.onOff)} />),
            tooltip: '캠페인 On/Off',
            onClick: async () => {
              await handleSwitch({ onoffState: !rowData.onOff, campaignId: rowData.campaignId });
              setTimeout(() => {
                history.push(window.location.pathname);
              }, 300);
            }
          })
        ]}

        options={{
          toolbar: false, search: false, add: false
        }}
      />
      {}
      <Dialog
        open={Boolean(open)}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        buttons={(
          <div>
            <Button
              color="info"
              onClick={() => {
                handleDelete({ campaignId: open });
                setTimeout(
                  history.push(`${window.location.pathname}`),
                  300
                );
              }}
            >
                진행
            </Button>
            <Button onClick={handleClose}>
              취소
            </Button>
          </div>
      )}
      >
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <div style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body1">
            해당 캠페인을 삭제하시겠습니까?
            </Typography>
          </div>
          <div>
            <Typography variant="body1">
            삭제시, 진행중이던 광고는 모두 중지됩니다.
            </Typography>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

CampaignTable.defaultProps = {};

CampaignTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  dataSet: PropTypes.arrayOf(PropTypes.object),
};


export default CampaignTable;
