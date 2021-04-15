import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Chip, Collapse, Typography } from '@material-ui/core';
import CampaignCreateStepLayout from './shared/StepLayout';
import OptionSelectPaper from './shared/SelectPaper';
import ButtonSet from './shared/ButtonSet';
import AdDescriptionSelect from './AdOptionComponents/AdDescriptionSelect';
import AdDescriptionDialog from './AdOptionComponents/AdDescriptionDialog';
import options from './AdOptionComponents/optionSources';
import { OptionInterface, AdMaterial } from './interfaces';
import { CampaignCreateInterface, CampaignCreateAction } from './reducers/campaignCreate.reducer';

import useDialog from '../../../../utils/hooks/useDialog';

const useStyles = makeStyles((theme) => ({
  expansionPanel: {
    padding: theme.spacing(4),
    borderColor: theme.palette.primary.light,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: '0px 0px 15px 15px',
  },
  optionImages: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  optionPanel: { margin: theme.spacing(2, 0, 0) }
}));

// 추후에 인터페이스 통합
interface OptionPaperProps {
  state: CampaignCreateInterface;
  dispatch: React.Dispatch<CampaignCreateAction>; // 우선형 타입 선택
  step: number;
  handleNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleBack: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
/**
 * @description
  해당 캠페인의 송출옵션을 선택한다.
  0: CPM
  1: CPM + CPC
  2: CPC
 * @param {*} state 송출옵션을 저장하는 object
 * @param {*} dispatch 송출옵션을 변경하는 func
 * @param {*} step 현재의 회원가입 진행상태, 다음 step으로 진행될 때, 선택된 옵션에 대한 렌더링을 위함.
 *
 * @author 박찬우
 */
const OptionPaper = (props: OptionPaperProps): JSX.Element => {
  const classes = useStyles();
  const {
    state, dispatch, step, // for '다음' 버튼 관리
    handleNext, handleBack
  } = props;

  // option을 선택하였을 때 event listener
  const handleChange = (id: string) => (): void => {
    dispatch({ type: 'SET_OPTION', value: id });
  };

  // 광고 유형 선택 - 광고 구성 설명 다이얼로그
  const adDescriptionDialog = useDialog();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedMaterial, setSelectedMaterial] = React.useState<AdMaterial>();
  function handleSelectedMaterial(material: AdMaterial): void {
    setSelectedMaterial(material);
  }

  const getInnerPaperChildren = (optionType: string): React.ReactElement | null => {
    switch (optionType) {
      case 'option1': return (
        <div>
          <div className={classes.optionImages}>
            <img
              height={22}
              alt="a"
              src="/pngs/logo/twitch/TwitchExtrudedWordmarkPurple.png"
              style={{ filter: 'grayscale(0%)', padding: 8 }}
            />
            <img
              height={20}
              alt="a"
              src="/pngs/logo/afreeca/blue01.png"
              style={{ filter: 'grayscale(0%)', padding: 8 }}
            />
          </div>
          <Typography variant="body2">(유튜브 향후 지원 예정)</Typography>
        </div>
      );
      case 'option3': return (
        <div className={classes.optionPanel}>
          <Chip label="Beta" color="primary" size="small" />
        </div>
      );
      default: return null;
    }
  };

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
              checked={state.selectedOption === opt.id}
              disabled={opt.deprecated}
              primaryText={opt.primaryText}
              secondaryText={opt.secondaryText}
              handleSelect={handleChange(opt.id)}
              innerPaperChildren={getInnerPaperChildren(opt.id)}
            >
              {opt.materials && (
              <Collapse in={state.selectedOption === opt.id}>
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
          <ButtonSet
            type="button"
            handleNext={handleNext}
            handleBack={handleBack}
            nextButtonOpen
          />
        </div>
      )}

      {/* optionType 선택된 이후 */}
      {step > 0 && (
        <div>
          {options
            .filter((opt) => state.selectedOption === opt.id)
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

export default OptionPaper;
