import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '../../../../../atoms/CustomButtons/Button';

const useStyles = makeStyles((theme) => ({
  expansionPanel: {
    padding: theme.spacing(4),
    borderColor: theme.palette.primary.light,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: '0px 0px 15px 15px',
  },
  expansionElement: { display: 'flex', justifyContent: 'center', padding: theme.spacing(2) },
}));

interface AdDescriptionSelectProps {
  primary: string;
  materials: { name: string; description: string; lastDesc: string }[];
  handleMaterialClick: () => void;
}
export default function AdDescriptionSelect({
  primary, materials, handleMaterialClick
}: AdDescriptionSelectProps): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.expansionPanel}>
      <div className={classes.expansionElement}>
        {`${primary}의 ${materials.length} 가지 구성을 확인해보세요!`}
      </div>
      <div className={classes.expansionElement}>
        {materials.map((item) => (
          <Button
            style={{ margin: 8 }}
            key={item.name}
            onClick={handleMaterialClick}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
