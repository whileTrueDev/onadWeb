import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from './Card/Card';
import CardIcon from './Card/CardIcon';
import CardHeader from './Card/CardHeader';
import CardBody from './Card/CardBody';

const useStyles = makeStyles(theme => ({
  buttonWrapper: {
    display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', padding: 5
  },
  root: {
    width: '100%',
    heigth: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    marginBotton: '20px',
    marginTop: '20px'
  }
}));

/**
 * @param {} props iconComponent=왼쪽상단의 아이콘, buttonComponent=오른쪽 상단의 버튼
 */
export default function CustomCard(props) {
  const classes = useStyles();
  const { iconComponent, buttonComponent, children } = props;
  return (
    <Card className={classes.root}>
      <CardHeader color="blueGray" stats icon>
        <CardIcon color="blueGray">
          {iconComponent}
        </CardIcon>
        { buttonComponent && (buttonComponent)}
      </CardHeader>
      <CardBody>
        {children}
      </CardBody>
    </Card>
  );
}
