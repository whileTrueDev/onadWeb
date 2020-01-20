import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Typography, Button, CircularProgress, Tooltip,
} from '@material-ui/core';
import jsPdfGenerate from '../../../../../utils/lib/PdfGenerator';

const useStyles = makeStyles(theme => ({
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function MakePdfButton() {
  const classes = useStyles();
  const [inProgress, setInProgress] = React.useState(false);

  return (
    <div data-html2canvas-ignore="true">

      <Tooltip

        title={(
          <Typography variant="body2">
          1440 x 800 해상도 이상에서 올바르게 작동합니다.
          </Typography>
      )}
      >
        <div>
          <Button
            variant="contained"
            color="primary"
            disabled={inProgress}
            onClick={() => {
              setInProgress(true);
              jsPdfGenerate(setInProgress);
            }}
          >
          PDF로 다운로드
            {inProgress && (
            <CircularProgress
              disableShrink
              size={16}
              thickness={5}
              variant="indeterminate"
              className={classes.buttonProgress}
            />
            )}
          </Button>
        </div>

      </Tooltip>
    </div>
  );
}
