import React from 'react';
import MuiMaterialTable, { MaterialTableProps, Column } from 'material-table';
import ArrowUpward from '@material-ui/icons/ArrowUpwardRounded';
import Check from '@material-ui/icons/CheckRounded';
import Clear from '@material-ui/icons/ClearRounded';
import ChevronLeft from '@material-ui/icons/ChevronLeftRounded';
import ChevronRight from '@material-ui/icons/ChevronRightRounded';
import FilterList from '@material-ui/icons/FilterListRounded';
import FirstPage from '@material-ui/icons/FirstPageRounded';
import LastPage from '@material-ui/icons/LastPageRounded';
import Delete from '@material-ui/icons/Delete';
import Search from '@material-ui/icons/Search';

const tableIcons = {
  Check: React.forwardRef<SVGSVGElement>((props, ref) => <Check {...props} ref={ref} />),
  Clear: React.forwardRef<SVGSVGElement>((props, ref) => <Clear {...props} ref={ref} />),
  ResetSearch: React.forwardRef<SVGSVGElement>((props, ref) => <Clear {...props} ref={ref} />),
  Delete: React.forwardRef<SVGSVGElement>((props, ref) => <Delete {...props} ref={ref} />),
  Filter: React.forwardRef<SVGSVGElement>((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: React.forwardRef<SVGSVGElement>((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: React.forwardRef<SVGSVGElement>((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: React.forwardRef<SVGSVGElement>((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: React.forwardRef<SVGSVGElement>(
    (props, ref) => <ChevronLeft {...props} ref={ref} />
  ),
  SortArrow: React.forwardRef<SVGSVGElement>((props, ref) => <ArrowUpward {...props} ref={ref} />),
  Search: React.forwardRef<SVGSVGElement>((props, ref) => <Search {...props} ref={ref} />),
};
const localization = {
  body: {
    deleteTooltip: '캠페인 삭제',
    emptyDataSourceMessage: '해당하는 데이터가 없습니다.'
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
  },
  toolbar: {
    searchTooltip: '',
    searchPlaceholder: '검색어를 입력하세요..'
  }
};

interface CustomMaterialTable<T extends object> extends MaterialTableProps<T> {
  cellWidth?: number;
  style?: React.CSSProperties;
}

export default function MaterialTable<RowDataType extends object>(
  props: CustomMaterialTable<RowDataType>
): JSX.Element {
  const { columns, cellWidth, ...rest } = props;

  function styleColumn(_columns: Column<RowDataType>[], minWidth = 100): Column<RowDataType>[] {
    _columns.map((col) => {
      const column = col;
      column.cellStyle = { minWidth, ...column };
      return column;
    });
    return _columns;
  }

  return (
    <MuiMaterialTable
      icons={tableIcons}
      localization={localization}
      columns={styleColumn(columns, cellWidth)}
      {...rest}
    />
  );
}
