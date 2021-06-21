import { Chip, CircularProgress, makeStyles, Paper, Typography } from '@material-ui/core';
import classnames from 'classnames';
import React, { useEffect, useMemo } from 'react';
import Markdown from 'react-markdown/with-html';
import { UseGetRequestObject } from '../../../utils/hooks/useGetRequest';

const useStyles = makeStyles(theme => ({
  tabs: { padding: theme.spacing(1, 0), borderBottom: `2px solid ${theme.palette.divider}` },
  chip: { margin: theme.spacing(1, 1) },
  container: { padding: theme.spacing(4) },
  contents: { margin: theme.spacing(4, 0) },
  markdown: {
    fontWeight: theme.typography.body1.fontWeight,
  },
}));

export interface Manual {
  title: string;
  subTitle: string;
  contents: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}
export type ManualRes = Array<Manual>;
export interface ManualProps {
  manualGet: UseGetRequestObject<ManualRes>;
}

export default function ManualContents({ manualGet }: ManualProps): JSX.Element {
  const classes = useStyles();

  const [tabValue, setTabValue] = React.useState<string>();
  function handleTabChange(newValue: string): void {
    setTabValue(newValue);
  }

  // 현재 선택된 매뉴얼
  const currentManual = useMemo(() => {
    if (manualGet.data) {
      return manualGet.data.find((d: any) => d.title === tabValue);
    }
    return undefined;
  }, [manualGet.data, tabValue]);

  useEffect(() => {
    if (manualGet.data && manualGet.data.length > 0) {
      setTabValue(manualGet.data[0].title);
    }
  }, [manualGet.data]);

  return (
    <Paper>
      {manualGet.loading && (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress />
        </div>
      )}

      <div className={classes.tabs}>
        {!manualGet.loading &&
          manualGet.data &&
          manualGet.data.map((eachManual: any) => (
            <Chip
              onClick={() => {
                handleTabChange(eachManual.title);
              }}
              className={classes.chip}
              size="medium"
              key={eachManual.title}
              label={eachManual.title}
              variant={eachManual.title === tabValue ? 'default' : 'outlined'}
              color={eachManual.title === tabValue ? 'primary' : 'default'}
            />
          ))}
      </div>

      {!manualGet.loading && manualGet.data && (
        <div>
          {currentManual && (
            <div className={classes.container}>
              <div>
                <Typography color="primary" variant="h6">
                  {currentManual.title}
                </Typography>
                <Typography color="primary" variant="body2">
                  {currentManual.subTitle}
                </Typography>
              </div>

              <div className={classes.contents}>
                <Markdown
                  source={currentManual.contents}
                  escapeHtml={false}
                  className={classnames(classes.markdown, 'react-markdown')}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </Paper>
  );
}
