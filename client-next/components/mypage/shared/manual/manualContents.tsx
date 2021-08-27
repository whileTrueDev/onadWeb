import { Chip, CircularProgress, makeStyles, Paper, Typography } from '@material-ui/core';
import classnames from 'classnames';
import { useState, useEffect, useMemo } from 'react';
import Markdown from 'react-markdown/with-html';
import { useManual } from '../../../../utils/hooks/query/useManual';

const useStyles = makeStyles(theme => ({
  tabs: { padding: theme.spacing(1, 0), borderBottom: `2px solid ${theme.palette.divider}` },
  chip: { margin: theme.spacing(1, 1) },
  container: { padding: theme.spacing(4) },
  contents: { margin: theme.spacing(4, 0) },
  markdown: {
    fontWeight: theme.typography.body1.fontWeight,
  },
}));

interface ManualContentsProps {
  type: 'creator' | 'marketer';
}
export default function ManualContents({ type }: ManualContentsProps): JSX.Element {
  const classes = useStyles();
  const manuals = useManual(type);

  const [tabValue, setTabValue] = useState<string>();
  function handleTabChange(newValue: string): void {
    setTabValue(newValue);
  }

  // 현재 선택된 매뉴얼
  const currentManual = useMemo(() => {
    if (manuals.data) {
      return manuals.data.find((d: any) => d.title === tabValue);
    }
    return undefined;
  }, [manuals.data, tabValue]);

  useEffect(() => {
    if (manuals.data && manuals.data.length > 0) {
      setTabValue(manuals.data[0].title);
    }
  }, [manuals.data]);

  return (
    <Paper>
      {manuals.isLoading && (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress />
        </div>
      )}

      <div className={classes.tabs}>
        {!manuals.isLoading &&
          manuals.data &&
          manuals.data.map((eachManual: any) => (
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

      {!manuals.isLoading && manuals.data && (
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
