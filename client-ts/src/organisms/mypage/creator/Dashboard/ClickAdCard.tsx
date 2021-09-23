import { Box, Divider, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import classnames from 'classnames';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import history from '../../../../history';
import { useCreatorClicks } from '../../../../utils/hooks/query/useCreatorClicks';
// utils
import numFormatter from '../../../../utils/numFormatter';

const useStyles = makeStyles(theme => ({
  flex: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  container: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    height: 280,
    overflowY: 'auto',
  },
  right: { textAlign: 'right' },
  slider: { cursor: 'default', maxWidth: 250 },
  bold: { fontWeight: 'bold' },
  text: { textTransform: 'none' },
  moreButton: {
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' },
  },
}));
export interface LevelRes {
  creatorId: string;
  level: number;
  exp: number;
}

const ClickAdCard = (): JSX.Element => {
  const classes = useStyles();
  const clicks = useCreatorClicks();

  return (
    <Paper className={classes.container}>
      {/* 제목 */}
      <div>
        <Typography className={classes.bold}>클릭광고 현황</Typography>
        <Typography variant="caption">내 광고관리 탭에서 자세히 확인할 수 있습니다.</Typography>
      </div>

      <Grid container direction="column" justify="center">
        {clicks.isLoading ? (
          <CenterLoading />
        ) : (
          <>
            {/* 채팅광고 챗봇 정지로 인한 처리 210923 dan(hwasurr) */}
            {/* <Grid item>
              <Box className={classes.flex} mt={2}>
                <Typography gutterBottom variant="body1">
                  채팅광고 클릭
                </Typography>
              </Box>
              <div className={classes.flex}>
                <Typography
                  gutterBottom
                  variant="h5"
                  className={classnames(classes.text, classes.bold)}
                >
                  {`${numFormatter(clicks.data?.adchat ? clicks.data.adchat : 0)} 회`}
                </Typography>
              </div>
            </Grid> */}

            <Grid item>
              <Divider component="hr" orientation="vertical" />
            </Grid>

            <Grid item>
              <Box className={classes.flex} mt={4}>
                <Grid item>
                  <Typography gutterBottom variant="body1">
                    패널광고 클릭
                  </Typography>
                </Grid>
              </Box>
              <div className={classes.flex}>
                <Typography
                  gutterBottom
                  variant="h5"
                  className={classnames(classes.text, classes.bold)}
                >
                  {`${numFormatter(clicks.data?.adpanel ? clicks.data.adpanel : 0)} 회`}
                </Typography>
              </div>
            </Grid>
          </>
        )}
      </Grid>

      <div className={classes.right}>
        <Typography
          className={classes.moreButton}
          variant="caption"
          color="textSecondary"
          onClick={(): void => {
            history.push('/mypage/creator/ad/campaigns');
          }}
        >
          자세히 보기
        </Typography>
      </div>
    </Paper>
  );
};

export default ClickAdCard;
