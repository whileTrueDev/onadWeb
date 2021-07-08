import { FormControlLabel, Paper, Switch, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useMarketerAdOnOffMutation } from '../../../../utils/hooks/mutation/useMarketerAdOnOffMutation';
import { useMarketerAdOnOff } from '../../../../utils/hooks/query/useMarketerAdOnOff';

const useStyles = makeStyles(() => ({
  paper: { maxheight: 100 },
  div: { display: 'flex', justifyContent: 'space-between', padding: 16 },
}));

interface OnOffSwitchProps {
  title?: string;
}

export default function OnOffSwitch({ title = '광고 On/Off' }: OnOffSwitchProps): JSX.Element {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // ********************************************
  // 광고주 캠페인 On/Off
  const queryClient = useQueryClient();
  const onOffData = useMarketerAdOnOff();
  const [viewState, setView] = useState<boolean>(false);

  useEffect(() => {
    if (!onOffData.isLoading && onOffData.data) {
      setView(onOffData.data.onOffState);
    }
  }, [onOffData]);

  const onOffMutation = useMarketerAdOnOffMutation();
  const handleSwitch = () => {
    onOffMutation
      .mutateAsync({
        onOffState: onOffData.data ? !onOffData.data.onOffState : false,
      })
      .then(res => {
        if (!res.data[0]) {
          alert(res.data[1]);
        } else {
          queryClient.invalidateQueries('marketerAdOnOff');
        }
      })
      .catch(err => {
        enqueueSnackbar(
          '광고 On/Off 도중에 문제가 발생했습니다. 잠시 후 다시 시도해주세요. 지속적으로 문제가 발견되면 support@onad.io로 문의 바랍니다.',
          { variant: 'error' },
        );
        console.error(err);
      });
  };

  return (
    <Paper className={classes.paper}>
      <div className={classes.div}>
        <Typography variant="h6">{title}</Typography>
        <FormControlLabel
          label=""
          control={
            <Switch
              disabled={onOffMutation.isLoading}
              color="secondary"
              checked={viewState}
              onChange={(): void => {
                handleSwitch();
              }}
            />
          }
        />
      </div>
    </Paper>
  );
}
