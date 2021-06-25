/* eslint-disable react/display-name */
/* eslint-disable max-len */
import { Avatar, makeStyles, Typography } from '@material-ui/core';
import { AvatarGroup } from '@material-ui/lab';
import React from 'react';
import CustomDataGrid from '../../../../../../../atoms/Table/CustomDataGrid';
import { UseGetRequestObject } from '../../../../../../../utils/hooks/useGetRequest';
import { CreatorDataInterface } from '../../../../dashboard/interfaces';

const useStyles = makeStyles(theme => ({
  container: { maxWidth: 600, height: 300 },
  name: { display: 'flex', alignItems: 'center' },
  avatar: { width: theme.spacing(3), height: theme.spacing(3), marginRight: theme.spacing(1) },
  platform: { height: 20, width: 20, marginRight: theme.spacing(1) },
}));

interface CreatorsReportProps {
  creatorsData: UseGetRequestObject<CreatorDataInterface[]>;
  onRowClick?: (row: CreatorDataInterface) => void;
}
export default function CreatorsReport(props: CreatorsReportProps): JSX.Element {
  const { creatorsData, onRowClick } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {!creatorsData.loading && creatorsData.data && (
        <CustomDataGrid
          disableSelectionOnClick
          onRowClick={param => {
            if (onRowClick) onRowClick(param.row as CreatorDataInterface);
          }}
          loading={creatorsData.loading}
          rows={creatorsData.data}
          density="compact"
          columns={[
            {
              headerName: '방송인',
              field: 'creatorId',
              flex: 1,
              renderCell: (rowData): JSX.Element => (
                <div className={classes.name}>
                  <Avatar
                    variant="circular"
                    className={classes.avatar}
                    src={rowData.row.creatorLogo || rowData.row.afreecaLogo}
                  />
                  <AvatarGroup max={2}>
                    {rowData.row.creatorId && (
                      <Avatar
                        variant="square"
                        className={classes.platform}
                        src="/pngs/logo/twitch/TwitchGlitchPurple.png"
                      />
                    )}
                    {rowData.row.afreecaId && (
                      <Avatar
                        variant="square"
                        className={classes.platform}
                        src="/pngs/logo/afreeca/onlyFace.png"
                      />
                    )}
                  </AvatarGroup>
                  <Typography variant="body2" noWrap>
                    {rowData.row.creatorTwitchName || rowData.row.afreecaName}
                  </Typography>
                </div>
              ),
            },
            {
              headerName: '방송당 평균 노출량',
              field: 'impression',
              flex: 1,
              renderCell: (data): React.ReactElement => {
                if (!data.row.impression && !data.row.impressionAfreeca)
                  return <Typography variant="body2">0</Typography>;
                if (!data.row.impressionAfreeca)
                  return <Typography variant="body2">{data.row.impression}</Typography>;
                if (!data.row.impression)
                  return <Typography variant="body2">{data.row.impressionAfreeca}</Typography>;
                return (
                  <Typography variant="body2">
                    {(data.row.impression + data.row.impressionAfreeca).toLocaleString()}
                  </Typography>
                );
              },
            },
            {
              headerName: '일간 평균 클릭 수',
              field: 'ctr',
              flex: 1,
              renderCell: (data): React.ReactElement => {
                if (!data.row.ctr && !data.row.ctrAfreeca)
                  return <Typography variant="body2">0</Typography>;
                if (!data.row.ctrAfreeca)
                  return <Typography variant="body2">{data.row.ctr}</Typography>;
                if (!data.row.ctr)
                  return <Typography variant="body2">{data.row.ctrAfreeca}</Typography>;
                return <Typography variant="body2">{data.row.ctr.toLocaleString()}</Typography>;
              },
            },
          ]}
        />
      )}
    </div>
  );
}
