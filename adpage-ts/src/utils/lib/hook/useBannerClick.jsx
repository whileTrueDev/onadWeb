import React from 'react';
import axios from 'axios';
import apiHOST from '../../../config/host';

const useBannerClick = (bannerList) => {
  /**
   * @author hwasurr
   * @function_description 배너 클릭 hook 으로, 중복클릭을 방지하기 위해
   * 배너 컴포넌트 생성 당 클릭 한번으로 제한한다.
   * @return { clickedList:Array, handleClick:function, handleTransferClick:function }
   * @return_description 배너 정보를 담고 있는 배열, 클릭 핸들러 함수
   */

  // 배너 수만큼 false 값(클릭 했는지 안했는지, 이동 했는지 안했는지의 상태)을 가지는 배열 생성
  const mockedBannerList = [...bannerList];
  mockedBannerList.forEach((bannerData, index) => {
    mockedBannerList[index].clicked = false;
    mockedBannerList[index].clickSuccess = false;
    mockedBannerList[index].clickError = false;
    mockedBannerList[index].dialogOpen = false;
    mockedBannerList[index].isTransfered = false;
    mockedBannerList[index].transferSuccess = false;
    mockedBannerList[index].transferError = false;
  });

  // 해당 배열을 state로 생성
  const [clickedList, setClickedList] = React.useState(mockedBannerList);

  // 배너 클릭 핸들러
  const handleClick = (targetIndex) => {
    const newClickedList = [...clickedList];

    // **최초 클릭 시**, DB에 클릭값을 넣는 요청 함수 정의
    const postRequest = async function call(targetObject) {
      try {
        const res = await axios.post(`${apiHOST}/api/banner/click`, {
          name: window.location.pathname.replace('/', ''),
          creatorId: clickedList[targetIndex].creatorId,
          campaignId: clickedList[targetIndex].campaignId,
        });
        const { data } = res;
        let processedObject;

        if (!data.error) {
          if (data.result !== 'fail') {
            processedObject = {
              ...targetObject,
              clickSuccess: true,
              clickCount: targetObject.clickCount + 1
            };
            // console.log(`정상적으로 입력됨 - click,${targetObject.campaignId}`);
          } else {
            // ip 존재하여 클릭 체크 안함.
            // console.log('이미 1시간 이내에 <조회>한 IP 이므로 체크 안됨.');
            processedObject = { ...targetObject };
          }
          return processedObject;
        }
        const errorState = new Error('bannerClickhandlerError - in db things');
        clickedList[targetIndex].clickError = errorState;
        throw errorState;
      } catch {
        const errorState = new Error('bannerClickhandlerError - in axios');
        clickedList[targetIndex].clickError = errorState;
        throw errorState;
      }
    };

    /** 실행 ************************************ */
    // 1. 지금 해당 배너 찾기
    let targetObject = newClickedList[targetIndex];

    // 2. 해당 배너 state 값 수정 요청하기
    if (targetObject.clicked === false) {
      // componenet 생성 이후 첫번째 클릭
      // console.log('첫번째 <이동> 클릭');

      // 이벤트
      targetObject = {
        ...targetObject,
        clicked: true,
        dialogOpen: true
      };
      // 클릭 적재 요청 + ip check 요청
      // console.log('클릭 적재 요청 전', targetObject);
      postRequest(targetObject).then((processedObject) => {
        // 해당 배너의 state 값 변경하여, newClickedList 수정
        newClickedList[targetIndex] = processedObject;
        // 전체 스테이트인 clickedList 수정.
        setClickedList(newClickedList);
      });
    } else {
      // componenet 생성 이후 두번째 클릭
      // console.log('두번째 이상 <이동> 클릭');

      // 이벤트
      newClickedList[targetIndex] = {
        ...targetObject,
        dialogOpen: true
      };
      setClickedList(newClickedList);
    }
  };

  // 배너 <이동> 클릭 핸들러
  const handleTransferClick = (targetIndex, linkTo) => { // linkIndex 0 : primaryLink
    // 불변성을 지키기 위해 복제된 어레이 생성. (복제된 어레이의 값을 바꾼 이후 setFunction으로 한번만 바꾼다.)
    const newClickedList = [...clickedList];

    const transferPostRequest = async function call(targetObject) {
      /**
       * @author hwasurr
       * @description 해당 IP가 1시간 이내에 최초 클릭인지 판단하는 및 해당 IP가 1시간 이내에 최초 클릭 시,
       * @description DB에 transfer 값 넣는 요청 함수, ip check는 api 서버에서.
       * */
      try {
        const res = await axios.post(`${apiHOST}/api/banner/transfer`, {
          name: window.location.pathname.replace('/', ''),
          creatorId: clickedList[targetIndex].creatorId,
          campaignId: clickedList[targetIndex].campaignId,
        });
        const { data } = res;
        let processedObject;
        if (!data.error) {
          if (data.result !== 'fail') {
            processedObject = {
              ...targetObject,
              transferSuccess: true,
              transferCount: targetObject.transferCount + 1
            };
            // console.log(`정상적으로 입력됨 - transfer,${processedObject.campaignId}`);
          } else {
            // ip 존재하여 클릭 체크 안함.
            // console.log('이미 1시간 이내에 <이동>한 IP 이므로 체크 안됨.');
            processedObject = { ...targetObject };
          }
          return processedObject;
        }
        const errorState = new Error('bannerTransferClickhandlerError - in db things');
        clickedList[targetIndex].transferError = errorState;
        throw errorState;
      } catch {
        const errorState = new Error('bannerTransferClickhandlerError - in axios');
        clickedList[targetIndex].transferError = errorState;
        throw errorState;
      }
    };

    /** 실행 ************************************ */
    // 1. 지금 해당 배너 찾기
    const targetObject = newClickedList[targetIndex];

    // 3. 해당 배너 state 값 수정 요청하기
    if (targetObject.isTransfered === false) {
      // componenet 생성 이후 첫번째 클릭
      // console.log('첫번째 <이동> 클릭');
      targetObject.isTransfered = true;

      // 클릭 적재 요청 + ip check 요청
      // console.log('클릭 적재 요청 전', targetObject);
      transferPostRequest(targetObject).then((processedObject) => {
        // 해당 배너의 state 값 변경하여, newClickedList 수정
        newClickedList[targetIndex] = processedObject;
        // 전체 스테이트인 clickedList 수정.
        setClickedList(newClickedList);
      });

      // 이벤트
      window.open(linkTo);
    } else {
      // componenet 생성 이후 두번째 클릭
      // 버튼 이동 이벤트
      window.open(linkTo);
    }
  };
  return { clickedList, handleClick, handleTransferClick };
};

export default useBannerClick;
