import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import CampaignManage from '../../../../organisms/mypage/marketer/adManage/CampaignManage';
import useMypageScrollToTop from '../../../../utils/hooks/useMypageScrollToTop';

const Campaign = (): JSX.Element => {
  useMypageScrollToTop();

  return (
    <GridContainer>
      <GridItem xs={12}>
        <CampaignManage />
      </GridItem>
    </GridContainer>
  );
};

export default Campaign;
