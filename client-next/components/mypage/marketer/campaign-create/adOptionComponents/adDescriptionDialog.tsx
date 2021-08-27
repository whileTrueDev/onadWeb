import classnames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import AdDescriptionSelect from './adDescriptionSelect';
import { OptionInterface, AdMaterial } from '../interface';

const useStyles = makeStyles(theme => ({
  select: { marginTop: theme.spacing(2), marginBottom: theme.spacing(2) },
  itmeTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 100,
    backgroundColor: theme.palette.success.main,
    padding: 32,
    color: theme.palette.getContrastText(theme.palette.success.dark),
  },
  itemName: { padding: 16, fontWeight: 700 },
  close: { position: 'relative', top: 0, right: 0 },
  imageSection: { padding: 16, textAlign: 'center' },
  section: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 32,
  },
  last: { marginBottom: 32 },
}));

interface AdDescriptionDialogProps {
  open: boolean;
  onClose: () => void;
  selectedOption: OptionInterface;
  selectedMaterial: AdMaterial;
  handleSelectedMaterial: (material: AdMaterial) => void;
}
export default function AdDescriptionDialog(props: AdDescriptionDialogProps): JSX.Element {
  const { open, onClose, selectedOption, selectedMaterial, handleSelectedMaterial } = props;
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <div className={classes.close}>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </div>

      {/* 광고 상품 이름 및 광고 구성 선택  */}
      <div className={classes.select}>
        <AdDescriptionSelect
          selectedMaterialName={selectedMaterial.name}
          primary={selectedOption.primaryText}
          opt={selectedOption}
          handleMaterialClick={(material: AdMaterial): void => {
            handleSelectedMaterial(material);
          }}
        />
      </div>

      {/* 선택된 구성 타이틀 */}
      <div className={classes.itmeTitle}>
        <Typography variant="h5" align="center" className={classes.itemName}>
          {selectedMaterial.name}
        </Typography>
        {selectedMaterial.desc.split('\n').map(desc => (
          <Typography key={desc} variant="body1" align="center">
            {desc}
          </Typography>
        ))}
      </div>

      {/* 이미지 및 설명 */}
      <div className={classes.section}>
        {selectedMaterial.images.map(image => (
          <div key={image.desc} className={classes.imageSection}>
            {image.desc.split('\n').map(d => (
              <Typography key={d} variant="h6">
                {d}
              </Typography>
            ))}
            <img height={500} src={image.src} alt="logo" />
          </div>
        ))}
      </div>

      <div className={classnames(classes.section, classes.last)}>
        <Typography variant="h6" style={{ textTransform: 'none' }}>
          과금유형: {selectedMaterial.billingType}
        </Typography>
        {selectedMaterial.lastDesc.split('\n').map(ldesc => (
          <Typography key={ldesc} variant="body1">
            {ldesc}
          </Typography>
        ))}
      </div>
    </Dialog>
  );
}
