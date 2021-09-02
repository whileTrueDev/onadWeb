import GridContainer from '../../../../atoms/grid/gridContainer';
import GridItem from '../../../../atoms/grid/gridItem';
import CampaignManage from '../../../../components/mypage/marketer/adManage/campaignManage';
import DashboardLayout from '../../../../components/mypage/layouts/marketerDashboardLayout';

const Campaign = (): JSX.Element => {
  return (
    <GridContainer>
      <GridItem xs={12}>
        <CampaignManage />
      </GridItem>
    </GridContainer>
  );
};

export default Campaign;

Campaign.layout = DashboardLayout;
