import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '../../../../../atoms/CustomButtons/Button';
import { OptionInterface, AdMaterial } from '../interfaces';

const useStyles = makeStyles((theme) => ({
  expansionElement: { display: 'flex', justifyContent: 'center', padding: theme.spacing(2) },
}));

interface AdDescriptionSelectProps {
  selectedMaterialName?: string;
  primary: string;
  opt: OptionInterface;
  handleMaterialClick: (material: AdMaterial) => void;
}
export default function AdDescriptionSelect({
  selectedMaterialName, primary, opt, handleMaterialClick
}: AdDescriptionSelectProps): JSX.Element {
  const classes = useStyles();
  return (
    <>
      <div className={classes.expansionElement}>
        <Typography>
          {`${primary}의 ${opt.materials!.length} 가지 구성을 확인해보세요!`}
        </Typography>
      </div>
      <div className={classes.expansionElement}>
        {opt.materials!.map((item) => (
          <Button
            color={selectedMaterialName === item.name ? 'primary' : 'default'}
            style={{ margin: 8 }}
            key={item.name}
            onClick={(): void => {
              handleMaterialClick(item);
            }}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </>
  );
}
