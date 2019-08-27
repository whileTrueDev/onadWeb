const express = require('express');
const axios = require('axios');

const router = express.Router();
const kakaoApiKey = '6327979cb3a091bb71d12cc7a669af18';

// 결제 요청
router.post('/', function(req, res, next) {
  const data = {
      cid: 'TC0ONETIME',
      partner_order_id: 'partner_order_id', // 가맹점 코드 (발급 필요)
      partner_user_id: 'partner_user_id', // 가맹점 회원 아이디
      item_name: '온애드 광고 캐시', // 상품명
      quantity: 1, // 상품 수량, int
      total_amount: 2200, // 상품 총액, int
      vat_amount: 0, // 상품 부가세 금액, int
      tax_free_amount: 0, // 비과세 상품 금액, int
      approval_url: 'http://localhost:3000/api/pay/kakao/approval',
      cancle_url: 'http://localhost:3000/api/pay/kakao/cancle',
      fail_url: 'http://localhost:3000/api/pay/kakao/fail',
      install_month: 0, // 카드 할부 개월 수, int
    };
  const axiosConfig = {headers : {
    Authorization: `KakaoAK ${kakaoApiKey}`,
    'Context-type': 'application/x-www-form-urlencoded;charset=utf-8',
  }}

  axios.post('https://kapi.kakao.com/v1/payment/ready', data, axiosConfig)
    .then((res) => {
      if (res) {
        console.log('res');
        /** 카카오 페이 결제 프로세스
         * 응답이 오면 요청한 결제와 TID를 매핑하여 저장하고 추후 결제승인 API 및 대사작업을 할 때 사용합니다.
         * TID는 보안을 위하여 사용자에게 노출되어선 안됩니다.
         * 응답 바디로 받은 next_redirect_pc_url(결제대기 화면)을 Popup 혹은 Layer 방식으로 직접 띄워줍니다.
         * ******************************************************************
         * 사용자정보 입력 화면에서 사용자는 전화번호와 생년월일을 입력합니다.
         * 카카오톡으로 결제요청 메시지가 전송되고 사용자정보 입력 화면은 결제대기 화면으로 변경됩니다.
         * 결제요청 메시지에서 결제창으로 이동하여 결제수단을 선택합니다.
         * ******************************************************************
         * 결제대기 화면은 approval_url로 redirect됩니다.
         * 사용자가 결제를 취소하는 경우, cancel_url로 redirect됩니다.
         * cancel_url에서는 보안을 위해 주문상세조회 API를 호출하여 상태값이 QUIT_PAYMENT(사용자가 결제를 중단한 상태)인 것을 확인하고 결제 중단 처리를 해야 합니다.
         * 결제 유효시간이 지난 경우, fail_url로 redirect됩니다.
         * ******************************************************************
         * 결제승인 API를 호출합니다.
         * 응답을 받아 결제 결과를 저장하고 사용자에게 결제완료 화면을 보여줍니다.
         * 사용자에게 결제완료 메시지가 발송됩니다.
         */
      }
    })
    .catch((reason) => {
      console.log(reason.response.data);
      console.log(reason.response);
    })
  res.send('data recieved')
})

// 결제 승인
router.post('/approval', function(req, res, next) {

});

// 결제 실패
router.post('/fail', function(req, res, next) {

});

// 결제 취소
router.post('/cancle', function(req, res, next) {

});

module.exports = router;