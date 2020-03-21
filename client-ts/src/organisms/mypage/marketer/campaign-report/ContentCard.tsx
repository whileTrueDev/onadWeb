import React from 'react';
import classnames from 'classnames';
import CountUp from 'react-countup';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import CardTemplate from './CardTemplate';

const useStyles = makeStyles((theme: Theme) => ({
  flex: {
    display: 'flex', alignItems: 'center'
  },
  flexCenter: {
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  contents: {
    padding: '16px 28px', display: 'flex', justifyContent: 'space-between'
  },
  icon: {
    marginRight: '5px'
  },
  value: {
    fontWeight: 700
  },
  primaryColor: {
    color: theme.palette.primary.main
  },
  secondaryColor: {
    color: theme.palette.secondary.main
  },
}));

interface ContentCardProps {
  title: string;
  contents: { title: string; value: number; unit: string; decimalRange?: number }[];
  color: string;
  IconComponent: React.ElementType;
}

export default function ContentCard(props: ContentCardProps): JSX.Element {
  const classes = useStyles();
  const {
    title, contents, color, IconComponent
  } = props;

  const colorClass = color === 'secondary' ? classes.secondaryColor : classes.primaryColor;

  return (
    <CardTemplate title={title} color={color} IconComponent={IconComponent}>
      {/* 광고 총 비용 */}
      {contents.map((content, index) => (
        <div key={content.title}>
          <div className={classes.contents}>
            <Typography gutterBottom variant="h6">
              {content.title}
            </Typography>

            <div className={classes.flexCenter}>
              <Typography gutterBottom variant="h5" className={classes.value}>
                <CountUp
                  duration={1}
                  className={classnames([classes.value, colorClass])}
                  end={content.value}
                />
              </Typography>
              <Typography gutterBottom variant="body2">
                &emsp;
                {content.unit}
              </Typography>
            </div>
          </div>
          {!(index === contents.length - 1) && (
            <Divider />
          )}
        </div>
      ))}
    </CardTemplate>
  );
}
