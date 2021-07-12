import { makeStyles, Typography } from '@material-ui/core';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import BusinessRegistration from '../../../../organisms/mypage/marketer/office/business/BusinessUploadForm';
import useMypageScrollToTop from '../../../../utils/hooks/useMypageScrollToTop';

const useStyles = makeStyles(theme => ({
  container: { margin: '0 auto', maxWidth: 1430 },
  title: { marginTop: theme.spacing(2), color: theme.palette.text.primary },
}));
export default function MyOfficeTaxBill(): JSX.Element {
  const classes = useStyles();
  // 계좌 정보

  useMypageScrollToTop();
  return (
    <div className={classes.container}>
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <Typography className={classes.title} variant="h6">
              세금계산서 관리
            </Typography>
          </GridItem>
          <GridItem xs={12} lg={6}>
            <BusinessRegistration />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
