import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '../components/Card/Card';
import CardIcon from '../components/Card/CardIcon';
import CardHeader from '../components/Card/CardHeader';
import CardBody from '../components/Card/CardBody';

const useStyles = makeStyles(() => ({
  buttonWrapper: {
    display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', padding: 5
  }
}));

export default function CustomCard(props) {
  const classes = useStyles();
  const { iconComponent, buttonComponent, children } = props;
  return (
    <Card>
      <CardHeader color="blueGray" stats icon>
        <CardIcon color="blueGray">
          <iconComponent />
        </CardIcon>
        { buttonComponent && (<buttonComponent />)}
      </CardHeader>

      <CardBody>
        {...children}
      </CardBody>
    </Card>
  );
}
