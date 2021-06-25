import HOST from '../../config';
import axiosInstance from '../axios';

export interface HandleCampaignOnOffParam {
  onoffState: boolean;
  campaignId: string;
  onSuccess: (data: any) => void;
  onFail: (err: any) => void;
}
// useUpdateData를 사용할 때, 전달되는 url router의 response data의 형태가 array여야함을 고려한다.
const handleCampaignOnOff = ({
  onoffState,
  campaignId,
  onSuccess,
  onFail,
}: HandleCampaignOnOffParam): void => {
  axiosInstance
    .patch(`${HOST}/marketer/campaign/on-off`, { onoffState, campaignId })
    .then(res => {
      onSuccess(res.data);
    })
    .catch(e => {
      onFail(e);
    });
};
export default handleCampaignOnOff;
