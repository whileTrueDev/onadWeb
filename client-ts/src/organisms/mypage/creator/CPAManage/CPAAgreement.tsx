import { useState } from 'react';
// components
import {
  Grid,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Button,
  Divider,
} from '@material-ui/core';
import shortid from 'shortid';
import CustomCard from '../../../../atoms/CustomCard';
import StyledItemText from '../../../../atoms/StyledItemText';
// hook
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';
// source
import textsource from './source/AgreementText';
import useStyle from './CPAAgreement.style';

interface CPAAgreementProps {
  callback: () => void;
}
const CPAAgreement = ({ callback }: CPAAgreementProps): JSX.Element => {
  const classes = useStyle();
  const [check, setCheck] = useState(false);
  const [checkConfirm, setCheckConfirm] = useState(false);
  const CAPAgreementPatch = usePatchRequest('/creator', () => {
    // 동의하기 누를시에 다시 리렌더링 되도록 로직 추가
    callback();
  });

  function handleChange(): void {
    if (checkConfirm) {
      setCheck(!check);
      // 서버쪽 creatorInfo 업데이트하기
      CAPAgreementPatch.doPatchRequest({ type: 'CPAAgreement' });
    } else {
      alert('유의사항을 모두 읽고 하단의 동의 버튼을 눌러주세요.');
    }
  }

  return (
    <CustomCard iconComponent={<StyledItemText primary="유의사항" color="white" />} backgroundColor>
      <Grid container direction="row" className={classes.stepExplain} justify="center">
        {CAPAgreementPatch.loading ? (
          <CircularProgress />
        ) : (
          <>
            <Grid item className={classes.text} xs={12} md={8} sm={8}>
              <div className={classes.agreementWrap}>
                {textsource.agreementText.split('\n').map(sentence => (
                  <p key={shortid.generate()}>{sentence}</p>
                ))}
                <Divider />
                <div className={classes.endButton}>
                  {!checkConfirm && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={(): void => setCheckConfirm(true)}
                    >
                      동의
                    </Button>
                  )}
                </div>
              </div>
            </Grid>
            <Grid item className={classes.box} xs={12} md={4} sm={4}>
              <FormControlLabel
                control={<Checkbox checked={check} onChange={handleChange} color="primary" />}
                label="참여형 광고의 유의사항 읽고 동의하였습니다"
                labelPlacement="end"
              />
            </Grid>
          </>
        )}
      </Grid>
    </CustomCard>
  );
};

export default CPAAgreement;
