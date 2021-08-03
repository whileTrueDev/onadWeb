// material-UI
// 내부 소스
// 프로젝트 내부 모듈
import { useState } from 'react';
// 컴포넌트
import TabBar from './tabBar';
import PolicyMarketer from './policyMarketer';
import PolicyCreator from './policyCreator';
// util 계열
// 스타일
import useStyles from '../../styles/policy/policy.style';

function Policy(): JSX.Element {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  return (
    <div className={classes.root}>
      <TabBar tabValue={value} handleTabChange={setValue} />

      {value === 0 ? (
        // 마케터
        <PolicyMarketer />
      ) : (
        <PolicyCreator />
      )}
    </div>
  );
}

export default Policy;
