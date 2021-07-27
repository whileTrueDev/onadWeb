import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '../../../../../atoms/Dialog/Dialog';

const useStyles = makeStyles(theme => ({
  imgInput: {
    [theme.breakpoints.down('xs')]: {
      margin: '2px',
    },
    marginTop: '4px',
    fontSize: '15px',
  },
  imgPreview: {
    width: '100%',
    height: 'auto',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '200px',
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: '600px',
      maxHeight: '550px',
    },
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

interface BusinessRegiUploadDialogProps {
  open: boolean;
  handleClose: () => void;
  businessRegiImage: string;
}

const BusinessViewDialog = (props: BusinessRegiUploadDialogProps): JSX.Element => {
  const { open, handleClose, businessRegiImage } = props;
  const classes = useStyles();
  let defaultImage = '/pngs/logo/renewal/2x/logo_onad_y_b_2.png';
  let isPdf = false;
  if (typeof businessRegiImage === 'string') {
    if (businessRegiImage.indexOf('data:application/pdf;') === -1) {
      defaultImage = businessRegiImage;
    } else {
      isPdf = true;
    }
  }
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth title="사업자 등록증">
      <div>
        <img
          className={classes.imgPreview}
          id="preview"
          src={defaultImage}
          alt="business-registration-preview"
        />
        {isPdf && <span>PDF파일은 미리보기를 지원하지 않습니다.</span>}
      </div>
    </Dialog>
  );
};

export default BusinessViewDialog;
