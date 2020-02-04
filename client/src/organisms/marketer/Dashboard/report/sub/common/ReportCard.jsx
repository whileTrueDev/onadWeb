import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CountUp from 'react-countup';
import { Grid, Typography } from '@material-ui/core';
import Help from '@material-ui/icons/Help';
import Card from '../../../../../../atoms/Card/Card';
import CardBody from '../../../../../../atoms/Card/CardBody';
import Tooltip from '../../../../../../atoms/DescPopover';
import useTooltip from '../../../../../../utils/lib/hooks/useTooltip';

const useStyles = makeStyles(theme => ({
  container: {
    padding: '28px 0px',
  },
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
  title: {
    fontWeight: 700,
    [theme.breakpoints.only('md')]: {
      fontSize: 16
    }
  },
  value: {
    color: '#00acc1', fontWeight: 700
  }
}));

const ReportCard = (props) => {
  const { data, ...rest } = props;

  const {
    tooltipIndex, anchorEl, handleTooltipOpen, handleTooltipClose
  } = useTooltip();

  const classes = useStyles();

  return (
    <Grid container spacing={3} className={classes.container} {...rest}>

      {data.map((content, index) => (
        <Grid key={content.title} item xs={12} sm={6} lg={3}>
          <Card className={classes.card}>
            <CardBody>
              <div className={classes.titleSection}>

                <Typography variant="body1" className={classes.title}>
                  {content.title}
                </Typography>
                {/*
                <Help
                  fontSize="small"
                  color="disabled"
                  onMouseEnter={(evt) => {
                    if (!(content.value === '')) { handleTooltipOpen(evt, index); }
                  }}
                  onMouseLeave={handleTooltipClose}
                  aria-owns={anchorEl ? 'send-desc-popover' : undefined}
                  aria-haspopup="true"
                /> */}

              </div>

              <div style={{ display: 'flex' }}>

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

                <Typography gutterBottom variant="body2">
                  {content.unit}
                </Typography>

              </div>
            </CardBody>
          </Card>
        </Grid>
      ))}

      <Tooltip
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handlePopoverClose={handleTooltipClose}
        descIndex={tooltipIndex}
        contentType="reportCardTooltip"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      />
    </Grid>
  );
};

export default ReportCard;

ReportCard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object)
};
