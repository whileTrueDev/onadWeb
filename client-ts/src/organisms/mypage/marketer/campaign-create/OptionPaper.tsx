import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Collapse, Typography } from '@material-ui/core';
import OptionSelectPaper from './sub/OptionSelectPaper';
import CampaignCreateStepLayout from './StepLayout';
import ButtonSet from './sub/ButtonSet';
import AdDescriptionSelect from './sub/AdDescriptionSelect';
import AdDescriptionDialog from './sub/AdDescriptionDialog';
import { Step1Interface, Action } from './campaignReducer';
import { OptionInterface, AdMaterial } from './interfaces';
import options from './options';
import useDialog from '../../../../utils/hooks/useDialog';

const useStyles = makeStyles((theme) => ({
  expansionPanel: {
    padding: theme.spacing(4),
    borderColor: theme.palette.primary.light,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: '0px 0px 15px 15px',
  }
}));

// 추후에 인터페이스 통합
interface OptionPaperProps {
  state: Step1Interface;
  dispatch: React.Dispatch<Action>; // 우선형 타입 선택
  handleBack: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
  step: number;
}
const OptionPaper = (props: OptionPaperProps): JSX.Element => {
  const classes = useStyles();
  const {
    state, dispatch, step, handleNext, handleBack, // for '다음' 버튼 관리
  } = props;

  // option을 선택하였을 때 event listener
  const handleChange = (id: string) => (): void => {
    dispatch({ key: id, value: '' });
  };

  // 광고 유형 선택 - 광고 구성 설명 다이얼로그
  const adDescriptionDialog = useDialog();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedMaterial, setSelectedMaterial] = React.useState<AdMaterial>();
  function handleSelectedMaterial(material: AdMaterial): void {
    setSelectedMaterial(material);
  }

  return (
    <CampaignCreateStepLayout
      primaryText="첫째, &nbsp;&nbsp; 광고 유형 선택"
      secondaryText="해당 광고 캠페인의 유형을 선택하세요."
    >

      {/* optionType 선택 이전 */}
      {step === 0 && (
        <div>
          {options.map((opt: OptionInterface, index) => (
            <OptionSelectPaper
              key={opt.id}
              primaryText={opt.primaryText}
              secondaryText={opt.secondaryText}
              handleSelect={handleChange(opt.id)}
              innerPaperChildren={opt.id !== 'option1' ? (null) : (
                <div>
                  <img height={50} alt="a" src="/pngs/logo/twitch.png" style={{ filter: 'grayscale(0%)', padding: 8 }} />
                  <Typography variant="body2">(유튜브, 아프리카TV 향후 지원 예정)</Typography>
                </div>
              )}
              checked={state.option === opt.id}
              disabled={opt.id !== 'option1'}
            >
              {opt.materials && (
              <Collapse in={state.option === opt.id}>
                <div className={classes.expansionPanel}>
                  <AdDescriptionSelect
                    primary={opt.primaryText}
                    opt={opt}
                    handleMaterialClick={(material: AdMaterial): void => {
                      setSelectedIndex(index);
                      setSelectedMaterial(material);
                      adDescriptionDialog.handleOpen();
                    }}
                  />
                </div>
              </Collapse>
              )}
            </OptionSelectPaper>
          ))}
          <ButtonSet handleNext={handleNext} handleBack={handleBack} set={Boolean(1)} />
        </div>
      )}

      {/* optionType 선택된 이후 */}
      {step > 0 && (
        <div>
          {options
            .filter((opt) => state.option === opt.id)
            .map((selectedOption) => (
              <OptionSelectPaper
                key={`${selectedOption.id}`}
                primaryText={selectedOption.primaryText}
                secondaryText={selectedOption.secondaryText}
                checked
                disabled
              />
            ))}
        </div>
      )}

      {adDescriptionDialog.open && options[selectedIndex].materials && selectedMaterial && (
      <AdDescriptionDialog
        open={adDescriptionDialog.open}
        onClose={adDescriptionDialog.handleClose}
        selectedOption={options[selectedIndex]}
        selectedMaterial={selectedMaterial}
        handleSelectedMaterial={handleSelectedMaterial}
      />
      )}

    </CampaignCreateStepLayout>
  );
};


/**
 * @description
  해당 캠페인의 송출옵션을 선택한다.
  0: CPM
  1: CPM + CPC
  2: CPC

 * @param {*} state ? 송출옵션을 저장하는 object
 * @param {*} dispatch ? 송출옵션을 변경하는 func
 * @param {*} handleBack ? 뒤로 버튼에 연결
 * @param {*} handleNext ? 다음 버튼에 연결
 * @param {*} step ? 현재의 회원가입 진행상태, 다음 step으로 진행될 때, 선택된 옵션에 대한 렌더링을 위함.
 *
 * @author 박찬우
 */
export default OptionPaper;
