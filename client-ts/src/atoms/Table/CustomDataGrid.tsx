import { DataGrid, DataGridProps, LocaleText } from '@material-ui/data-grid';
import React from 'react';

export const KOREAN_LOCALE_TEXT: LocaleText = {
  // Root
  rootGridLabel: 'grid',
  // noRowsLabel: '데이터가 없습니다',
  // errorOverlayDefaultLabel: 'An error occurred.',

  // Density selector toolbar button text
  toolbarDensity: '행 간격',
  toolbarDensityLabel: '행 간격',
  toolbarDensityCompact: '좁게',
  toolbarDensityStandard: '보통',
  toolbarDensityComfortable: '넓게',

  // Columns selector toolbar button text
  toolbarColumns: '컬럼 설정',
  toolbarColumnsLabel: '컬럼 설정 보기',

  // Filters toolbar button text
  toolbarFilters: '필터목록',
  toolbarFiltersLabel: '필터 보기',
  toolbarFiltersTooltipHide: '필터 숨김',
  toolbarFiltersTooltipShow: '필터 보기',
  toolbarFiltersTooltipActive: (count) => `${count} 필터 선택됨`,

  // Columns panel text
  columnsPanelTextFieldLabel: '컬럼 이름',
  columnsPanelTextFieldPlaceholder: '컬럼 이름',
  columnsPanelDragIconLabel: '재정렬',
  columnsPanelShowAllButton: '모두 보기',
  columnsPanelHideAllButton: '모두 숨김',

  // Filter panel text
  filterPanelAddFilter: '필터 추가',
  filterPanelDeleteIconLabel: '삭제',
  filterPanelOperators: '필터 방식',
  filterPanelOperatorAnd: 'And',
  filterPanelOperatorOr: 'Or',
  filterPanelColumns: '타겟 컬럼',

  // Column menu text
  columnMenuLabel: '메뉴',
  columnMenuShowColumns: '컬럼 설정 보기',
  columnMenuFilter: '필터',
  columnMenuHideColumn: '숨김',
  columnMenuUnsort: '정렬해제',
  columnMenuSortAsc: '오름차순 정렬', // Sort by Asc
  columnMenuSortDesc: '내림차순 정렬', // Sort by Desc

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count} 필터 선택됨`,
  columnHeaderFiltersLabel: '필터 보기',
  columnHeaderSortIconLabel: '정렬',

  // Rows selected footer text
  footerRowSelected: (count) => (count !== 1
    ? `${count.toLocaleString()} 행 선택됨`
    : `${count.toLocaleString()} 행 선택됨`),

  // Total rows footer text
  footerTotalRows: '총 행:',

  // Pagination footer text
  footerPaginationRowsPerPage: '페이지 당 행:',
};

export default function CustomDataGrid(props: DataGridProps): JSX.Element {
  return (
    <DataGrid localeText={KOREAN_LOCALE_TEXT} {...props} />
  );
}
