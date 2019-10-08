import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '../../atoms/Progress/CircularProgress';

import GridItem from '../../atoms/Grid/GridItem';
import GridContainer from '../../atoms/Grid/GridContainer';
import NoticeTable from '../../organisms/main/Notice/NoticeTable';
import NoticeContents from '../../organisms/main/Notice/NoticeContents';

import AppAppBar from '../../organisms/main/layout/AppAppBar';
import AppFooter from '../../organisms/main/layout/AppFooter';

import useFetchData from '../../utils/lib/hooks/useFetchData';

const data = [
  {
    code: '15',
    topic: '시스템 점검',
    title: '[긴급 점검] 1994년 09월 15일 긴급 시스템 점검 안내',
    regiDate: new Date(2019, 9, 7),
    contents: `
    ### 공지 

    개인정보처리방침 변경
    - 사전 안내 (10/16)
    
     
    안녕하세요.
    카카오모먼트 운영자입니다.
    
    카카오모먼트를 이용해 주시는 회원 여러분께 감사드리며, 새로운 개인정보처리방침 적용에 관한 안내 말씀드립니다.
    
    새롭게 변경될 개인정보처리방침의 내용을 확인하시어 서비스 이용에 참고하시기 바랍니다.
    
    
    ### 개정 사항
    
    #### 서비스 명칭 변경

      - **카카오모먼트 서비스 → 카카오광고 통합서비스**
      - **카카오모먼트 에이전시 → 카카오광고 통합에이전시**
    
    
    ### 개정 시기

      - 변경된 개인정보처리방침은 2019년 10월 16일 자로 효력이 발생합니다.
    
    
    앞으로도 회원 여러분의 개인정보를 보다 안전하게 보호하도록 노력하며, 신뢰받는 서비스로 보답하겠습니다.
    궁금하신 점이나 소중한 의견은 언제든지 ’카카오 for비즈니스’ 카카오톡 상담톡으로 알려주시면 안내드리겠습니다. 
    
    감사합니다.`
  },
  {
    code: '14',
    topic: '시스템 점검',
    title: '[긴급 점검] 1994년 09월 15일 긴급 시스템 점검 안내',
    regiDate: new Date(2019, 9, 6),
    contents: `
    안녕하세요.
 
카카오모먼트 운영자입니다.
 
 
카카오톡(android) 릴리즈 이슈로 카카오톡 비즈보드 beta에서 광고 노출수 집계가 정상적으로 작동되지 않는 이슈가 발생되었습니다.

현재 빠르게 대응 예정이며, 아래 내용 확인 부탁드립니다.
 
 
1. **기간** : 2019년 09월 17일 11:00 ~ 현재
 
2. **대상** : 카카오톡 비즈보드 beta (디바이스 : android 8.5.5)
 
3. **현상** : 노출수 정상 수집 및 집계 불가 (노출수가 정상 집계되지 않아 CTR 증가 추세로 보임)
 
4. **원인** : 효율적인 노출 체크를 위해 개선 로직을 추가하였으나 오류 발생
 
5. **정상화 시각** : <span style="color:red">2019년 09월 19일 20시 48분 신규 카카오톡 버전 배포 완료 </span>
 
  **<span style="color:green">※ 단, 신규 버전으로 업데이트된 카카오톡 앱에서만 카카오톡 비즈보드 beta의 노출수가 정상 수집되고 있으며, </span>**
   
    <span style="color:blue">이슈 대상이었던 android 8.5.5 버전에서는 노출수가 정상 집계 되지 않습니다. </span>
      
    
      사용자의 카카오톡 신규 버전 업데이트율에 따라 노출수가 점진적으로 회복됨에 따라 이 점 양해 부탁드립니다.
 `
  },
  {
    code: '13', topic: '시스템 점검', title: '[긴급 점검] 1994년 09월 15일 긴급 시스템 점검 안내', regiDate: new Date(2019, 9, 5)
  },
  {
    code: '12', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 4)
  },
  {
    code: '11', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 3)
  },
  {
    code: '10', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 2)
  },
  {
    code: '9', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 2)
  },
  {
    code: '8', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
  },
  {
    code: '7', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
  },
  {
    code: '6', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
  },
  {
    code: '5', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
  },
  {
    code: '4', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
  },
  {
    code: '3', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
  },
  {
    code: '2', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
  },
  {
    code: '1', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
  },
];

export default function PublicNotification(props) {
  const { match } = props;
  const { code } = match.params;

  const noticeData = useFetchData('/api/dashboard/notice');
  console.log(noticeData);

  return (
    <div>
      <AppAppBar />

      <div style={{ marginTop: 70 }}>

        <div style={{ width: 980, margin: '150px auto', minHeight: 924 }}>
          <GridContainer>
            <GridItem xs={12}>
              {noticeData.loading && (<CircularProgress small />)}
              {!noticeData.loading && noticeData.payload && (
                <div>
                  {!code ? (
                    <NoticeTable data={noticeData.payload} />
                  ) : (
                    <NoticeContents
                      data={noticeData.payload.filter(
                        obj => String(obj.code) === code
                      )[0]}
                    />
                  )}
                </div>
              )}
            </GridItem>
          </GridContainer>
        </div>

        <div>
          <AppFooter />
        </div>
      </div>
    </div>
  );
}

PublicNotification.propTypes = {
  match: PropTypes.object.isRequired
};
