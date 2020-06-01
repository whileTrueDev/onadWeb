import React from 'react';
// components
import {
  Grid, Typography, Checkbox, FormControlLabel
} from '@material-ui/core';
import Filter1Icon from '@material-ui/icons/Filter1';
import Filter2Icon from '@material-ui/icons/Filter2';
import Filter3Icon from '@material-ui/icons/Filter3';
import shortid from 'shortid';
import CustomCard from '../../../../atoms/CustomCard';
import StyledItemText from '../../../../atoms/StyledItemText';
import Button from '../../../../atoms/CustomButtons/Button';
import AgreementContentDialog from './sub/AgreementContentDialog';
import DetailCampaignDialog from './sub/DetailCampaignDialog';
// hook
import useDialog from '../../../../utils/hooks/useDialog';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';
import { ContractionDataType } from '../Dashboard/ContractionCard';
import MainIndicatorLoading from './sub/MainIndicator.loading';
import { ADPAGE_HOST } from '../../../../config';
// source
import textsource from './source/AgreementText';
import useStyle from './CPAAgreement.style';


const CPAAgreement = (): JSX.Element => {
  const contractionGet = useGetRequest<null, ContractionDataType>('/creator');
  const CPAmainData = useGetRequest<null>('/creator/cpa/adpick/mainIndicator');
  const AgreementContent = useDialog();
  const DetailCampaign = useDialog();
  const classes = useStyle();
  const [check, setCheck] = React.useState(false);
  const CAPAgreementPatch = usePatchRequest('/creator',
    () => {
      // 동의하기 누를시에 다시 리렌더링 되도록 로직 추가
      contractionGet.doGetRequest();
    });

  function handleChange(): void {
    setCheck(!check);
    // 서버쪽 creatorInfo 업데이트하기
    CAPAgreementPatch.doPatchRequest({ type: 'CPAAgreement' });
  }

  function MainIndicator(): JSX.Element {
    if (!CPAmainData.loading && CPAmainData.data) {
      return (
        <CustomCard iconComponent={<StyledItemText primary="나의 참여형 광고" color="white" />} backgroundColor>
          <Grid container direction="row" className={classes.stepExplain} justify="center">
            <Grid item xs={12} md={4} sm={4} className={classes.box}>
              <Typography variant="h6" align="center" className={classes.stepWrap2}>
                참여형 광고 수익금 :
                {' '}
                {CPAmainData.data.totalCPAIncome}
                {' '}
                원
              </Typography>
              <Typography variant="h6" align="center">
                참여형 광고 운영수 :
                {' '}
                {CPAmainData.data.totalCPACount}
                {' '}
                건
              </Typography>
            </Grid>
            <Grid item className={classes.box} xs={12} md={8} sm={8}>
              <div className={classes.buttonWrap}>
                <Button
                  color="primary"
                  onClick={AgreementContent.handleOpen}
                >
                  유의사항 확인
                </Button>
                <Button
                  color="primary"
                  onClick={DetailCampaign.handleOpen}
                >
                  상세내역 확인
                </Button>
                <Button
                  color="secondary"
                  onClick={(): void => {
                    console.log(`${ADPAGE_HOST}`);
                    const newTap = window.open(`${ADPAGE_HOST}/${CPAmainData.data.creatorTwitchId}`, '_blank');
                    if (newTap) {
                      newTap.focus();
                    }
                  }}
                  style={{ color: 'white' }}
                >
                  내 광고페이지
                </Button>
              </div>
              <Typography variant="body1" align="center" gutterBottom className={classes.stepWrapRed}>
                참여형 광고로 인한 실적(수익금, 운영수, 상세내역) 반영에는 1~2일이 소요됩니다
              </Typography>
              <Typography variant="body1" align="center" gutterBottom className={classes.stepWrapRed}>
                모든 참여형 광고 캠페인은 광고주의 진행/중단 요청에 따라 임의로 종료될 수 있습니다
              </Typography>
            </Grid>
          </Grid>
        </CustomCard>
      );
    }
    return (<MainIndicatorLoading />);
  }

  return (
    <>
      <CustomCard iconComponent={<StyledItemText primary="참여형 광고란?" color="white" />} backgroundColor>
        <div className={classes.text}>
          {textsource.explain}
        </div>
        <Grid container direction="row" spacing={1} className={classes.stepExplain} justify="center">
          <Grid item className={classes.step} xs={12} md={4} sm={4}>
            <Typography variant="body1" align="center" gutterBottom className={classes.stepWrap}>
              <Filter1Icon color="primary" fontSize="small" className={classes.stepTitle} />
              약관 동의
            </Typography>
            <img src="/pngs/cpa/agreement.png" alt="step1" className={classes.stepIMG} />
          </Grid>
          <Grid item className={classes.step} xs={12} md={4} sm={4}>
            <Typography variant="body1" align="center" gutterBottom className={classes.stepWrap}>
              <Filter2Icon color="primary" fontSize="small" className={classes.stepTitle} />
              캠페인 설정
            </Typography>
            <img src="/pngs/cpa/campaign.png" alt="step2" className={classes.stepIMG} />
          </Grid>
          <Grid item className={classes.step} xs={12} md={4} sm={4}>
            <Typography variant="body1" align="center" gutterBottom className={classes.stepWrap}>
              <Filter3Icon color="primary" fontSize="small" className={classes.stepTitle} />
              내역 확인
            </Typography>
            <img src="/pngs/cpa/detailcampaign.png" alt="step3" className={classes.stepIMG} />
          </Grid>
        </Grid>
      </CustomCard>

      {!contractionGet.loading && contractionGet.data && (
        contractionGet.data.CPAAgreement === 0 ? (
          <CustomCard iconComponent={<StyledItemText primary="유의사항" color="white" />} backgroundColor>
            <Grid container direction="row" className={classes.stepExplain} justify="center">
              <Grid item className={classes.text} xs={12} md={8} sm={8}>
                <div className={classes.agreementWrap}>
                  {textsource.agreementText.split('\n').map((sentence) => (
                    <p key={shortid.generate()}>{sentence}</p>
                  ))}
                </div>
              </Grid>
              <Grid item className={classes.box} xs={12} md={4} sm={4}>
                <FormControlLabel
                  control={<Checkbox checked={check} onChange={handleChange} color="primary" />}
                  label="참여형 광고의 유의사항을 확인하였습니다"
                  labelPlacement="end"
                />
              </Grid>
            </Grid>
          </CustomCard>
        )
          : (
            <MainIndicator />
          )
      )}

      {/* 다이얼로그 두개(유의사항 및 상세보기 내용) 생성 */}
      <AgreementContentDialog changeHandle={AgreementContent} source={textsource} />
      <DetailCampaignDialog changeHandle={DetailCampaign} />
    </>
  );
};

export default CPAAgreement;
