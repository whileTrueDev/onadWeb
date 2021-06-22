/* eslint-disable react/display-name */
import React from 'react';
import {
  DataGrid,
  DataGridProps,
  GridToolbarContainer,
  GridToolbarExport,
} from '@material-ui/data-grid';
import { dataGridLocale } from './dataGridLocale.kr';

export interface CustomDataGridExportableProps {
  exportFileName: string;
}

export default function CustomDataGridExportable({
  exportFileName,
  ...props
}: DataGridProps & CustomDataGridExportableProps): JSX.Element {
  return (
    <DataGrid
      localeText={dataGridLocale}
      components={{
        Toolbar: (): React.ReactElement => (
          <GridToolbarContainer>
            <GridToolbarExport csvOptions={{ fileName: exportFileName }} />
          </GridToolbarContainer>
        ),
      }}
      {...props}
    />
  );
}
