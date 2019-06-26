import {
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
  blueGrayCardHeader,
  grayColor,
} from '../../onad';

const cardIconStyle = {
  cardIcon: {
    '&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$primaryCardHeader,&$roseCardHeader,&$blueGrayCardHeader': {
      backgroundColor: grayColor[0],
      padding: '15px',
      marginTop: '-20px',
      marginRight: '15px',
      float: 'left',
    },
  },
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
  blueGrayCardHeader,
};

export default cardIconStyle;
