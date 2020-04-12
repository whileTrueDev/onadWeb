import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CountUp from 'react-countup';
import { Grid, Typography } from '@material-ui/core';
import Card from '../../../../../atoms/Card/Card';
import CardBody from '../../../../../atoms/Card/CardBody';

const useStyles = makeStyles((theme: Theme) => ({
  container: { padding: '28px 0px' },
  card: {
    margin: 0,
    padding: 0,
    backgroundColor: theme.palette.background.paper
  },
  titleSection: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      marginBottom: 65
    },
  },
  value: { color: theme.palette.primary.light, fontWeight: 700 }
}));

interface DataInterface {
  title: string; value: number | string;
  unit: string; decimalRange?: number; percent?: number | string;
}

const ReportCard = (props: { data: DataInterface[] }): JSX.Element => {
  const { data, ...rest } = props;

  const classes = useStyles();

  return (
    <Grid container spacing={3} className={classes.container} {...rest}>
      {data.map((content) => (
        <Grid key={content.title} item xs={12} md={4}>
          <Card className={classes.card}>
            <CardBody>
              <div className={classes.titleSection}>

                <Typography variant="h5">{content.title}</Typography>

              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                <Typography gutterBottom variant="h5" className={classes.value}>
                  {content.value === '-' ? (
                    <span>{content.value}</span>
                  ) : (
                    <CountUp
                      duration={1}
                      end={Number(content.value)}
                      decimals={content.decimalRange}
                    />
                  )}
                </Typography>

                {content.percent && (
                  <Typography gutterBottom variant="body2">
                    {`(${content.percent}%)`}
                  </Typography>
                )}

                <Typography gutterBottom variant="body2">
                  {content.unit}
                </Typography>

              </div>
            </CardBody>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ReportCard;
