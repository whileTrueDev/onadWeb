import React from 'react';
import PropTypes from 'prop-types';
import Delete from '@material-ui/icons/DeleteRounded';
import MaterialTable from '../../../../atoms/Table/MaterialTable';
import Button from '../../../../atoms/CustomButtons/Button';
// icons
// own components
import IOSSwitch from '../../../../atoms/Switch/IOSSwitch';
import useUpdateData from '../../../../utils/lib/hooks/useUpdateData';
import useDialog from '../../../../utils/lib/hooks/useDialog';
import useDeleteData from '../../../../utils/lib/hooks/useDeleteData';
import CampaignDeleteConfirmDialog from './CampaignDeleteConfirmDialog';
import history from '../../../../history';

function CampaignTable({ ...props }) {
  const { dataSet } = props;

  const tableRef = React.useRef();
  const { handleUpdateRequest } = useUpdateData('/api/dashboard/marketer/campaign/onoff');
  const { handleDelete } = useDeleteData('/api/dashboard/marketer/campaign');
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
      render: (col) => {
        if (col.dailyLimit !== '-1') {
          return (
            <div>
              {col.dailyLimit}
            </div>
          );
        }
        return <div>설정안함</div>;
      }
      // lookup: { '-1': '설정안함' },
    },
    {
      title: '게재 우선순위',
      field: 'priorityType',
      lookup: { 0: '크리에이터 우선', 1: '카테고리 우선', 2: '노출우선' },
    },
    { title: '광고유형', field: 'optionType', lookup: { 0: 'CPM', 1: 'CPC + CPM', } },
    {
      title: '등록된 배너',
      field: 'bannerSrc',
      render: (rowData) => {
        if (rowData.bannerSrc) {
          return (<img src={rowData.bannerSrc} alt="banner" style={{ width: 'auto', maxHeight: 200 }} />);
        }
        return '배너가 없습니다.';
      },
      editable: 'never'
    },
    { title: '등록일', field: 'regiDate', editable: 'never' },
    {
      title: '효과 보고서',
      field: '보고서 버튼',
      render: rowData => (
        <Button
          color="danger"
          onClick={() => {
            const path = `/dashboard/marketer/report/${rowData.campaignId}`;
            history.push(path);
          }}
        >
        보고서
        </Button>
      )
    }
  ];

  const [state] = React.useState({ columns: [...columns], data: [...dataSet] });


  return (
    <div>
      <MaterialTable
        tableRef={tableRef}
        style={{ boxShadow: 'none' }}
        columns={state.columns}
        data={state.data}
        actions={[
          rowData => ({
            icon: () => (<Delete />),
            tooltip: '캠페인 삭제',
            onClick: () => { handleOpen(rowData.campaignId); }
          }),
          rowData => ({
            icon: () => (<IOSSwitch checked={Boolean(rowData.onOff)} />),
            tooltip: '캠페인 On/Off',
            onClick: async () => {
              await handleUpdateRequest({
                onoffState: !rowData.onOff,
                campaignId: rowData.campaignId
              });
              setTimeout(() => history.push(window.location.pathname), 300);
            }
          })
        ]}

        options={{
          toolbar: false, search: false, add: false
        }}
      />
      {}
      <CampaignDeleteConfirmDialog
        open={open}
        handleDelete={handleDelete}
        handleClose={handleClose}
      />
    </div>
  );
}

CampaignTable.defaultProps = {};

CampaignTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  dataSet: PropTypes.arrayOf(PropTypes.object),
};


export default CampaignTable;
