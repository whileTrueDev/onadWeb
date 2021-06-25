import React from 'react';
import { DataGrid, DataGridProps } from '@material-ui/data-grid';
import { dataGridLocale } from './dataGridLocale.kr';

export default function CustomDataGrid(props: DataGridProps): JSX.Element {
  return <DataGrid localeText={dataGridLocale} {...props} />;
}
