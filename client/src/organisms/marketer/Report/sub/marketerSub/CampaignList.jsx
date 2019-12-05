import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Grid, Paper, Divider, Button,
  Avatar, Typography, ButtonBase,
  ListItem, List, Grow
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    padding: 16,
  },
  button: {
    width: '100%',
    '&:hover': {
      backgroundColor: theme.palette.grey[200]
    }
  },
  image: {
    width: 96,
    height: 96,
    marginRight: theme.spacing(3),
    backgroundColor: theme.palette.grey[100]
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

const data = [
  { value: 1, timein: 1000 },
  { value: 3, timein: 1400 },
  { value: 2, timein: 1800 },
];
export default function CampaignList(props) {
  const classes = useStyles();
  const { handleCampaignClick } = props;
  return (
    <Paper style={{ maxheight: 460 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
        <Typography variant="h6">
          캠페인 목록
        </Typography>
        <Button variant="contained" color="primary">
          캠페인 등록하기
        </Button>
      </div>

      <Divider />

      <List style={{ height: 370, overflow: 'auto' }}>
        {data.map((d, index) => (
          <Grow in timeout={{ enter: d.timein }}>
            <div>

              <ListItem>
                <Grid container spacing={2}>
                  <ButtonBase
                    className={classes.button}
                    onClick={() => {
                      handleCampaignClick();
                    }}
                  >
                    <Grid item>
                      <Avatar variant="rounded" className={classes.image}>
                        {/* 등록된 배너 */}
                        <img className={classes.img} alt="campaign-logo" src="/pngs/logo/onad_logo_vertical_black.png" />
                      </Avatar>
                    </Grid>
                    <Grid item xs={12} sm container>
                      <Grid item xs container direction="column" alignItems="flex-start" spacing={2} style={{ padding: 8 }}>
                        <Typography gutterBottom variant="subtitle1">
                      캠페인 명
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                      광고 유형
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                      게재 우선순위
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                      2019. 12. 04.
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                      On
                        </Typography>
                      </Grid>
                    </Grid>
                  </ButtonBase>
                </Grid>
              </ListItem>
              {data.length - 1 !== index && (
              <Divider light />
              )}
            </div>
          </Grow>
        ))}
      </List>
    </Paper>
  );
}
