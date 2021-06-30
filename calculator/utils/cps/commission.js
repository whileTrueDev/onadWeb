/**
 * * 주문별 정산 정보 계산
 * 1. 일반수수료 : 온애드와 방송인의 수익금 합
 * 2. 부가세 : 일반수수료 * 10%
 * 3. 실지급액 : 정산대상액 - 일반수수료 - 부가세 + 배송비 - 전자결제 수단별 수수료
 */
const getCommissionInfo = ({
  cashToCreator,
  cashToOnad,
  orderPrice,
  paymentCommissionAmount,
  deliveryFee,
}) => {
  // 일반수수료 : 온애드와 방송인의 수익금 합
  const commissionAmount = Math.floor(cashToCreator + cashToOnad);
  // 부가세 : 일반수수료 * 10%
  const VAT = Math.floor(commissionAmount * 0.1);
  // 실지급액 : 정산대상액 - 일반수수료 - 부가세 + 배송비 - 전자결제 수단별 수수료
  const actualSendedAmount =
    orderPrice + deliveryFee - commissionAmount - VAT - paymentCommissionAmount;

  return {
    commissionAmount,
    VAT,
    actualSendedAmount,
  };
};

/**
 * 각 유저별 계산 대금을 구합니다. 리뷰/자랑하기/응원하기 글의 대상인 방송인이 있는 지 여부를 기준으로
 * 계산 대금은 다르게 계산됩니다.
 * @author hwasurr
 * @param { number } orderPrice 계산이 필요한 판매 대금
 * @param { boolean } isCreatorExists 리뷰/자랑하기/응원하기 글의 대상인 방송인이 있는지 여부
 * 1. 방송인 A로부터 유입된 시청자가 구입 + 인증(리뷰or자랑하기)**글을 남기고** 구매완료 시
 *    - **⇒ 광고주 70 %, 방송인 A 20 %, 온애드 10 %**
 *
 * 2. 방송인 A로부터 유입된 시청자가 구입 + 인증(리뷰or자랑하기)**글을 남기지 않고** 구매완료 시
 *    - **⇒ 광고주 90 %, 온애드 10 %**
 */
const getCashesCalculated = ({
  orderPrice,
  isCreatorExists,
  creatorCommission,
  onadCommission,
  deliveryFee,
  paymentCommissionAmount,
}) => {
  if (isCreatorExists) {
    // 1 번의 경우
    const cashToCreator = Math.floor(orderPrice * creatorCommission);
    const cashToOnad = Math.floor(orderPrice * onadCommission);
    const salesIncomeToMarketer = orderPrice - cashToCreator - cashToOnad;

    // * 주문별 정산 정보
    const { commissionAmount, VAT, actualSendedAmount } = getCommissionInfo({
      cashToCreator,
      orderPrice,
      cashToOnad,
      paymentCommissionAmount,
      deliveryFee,
    });
    return {
      cashToCreator,
      salesIncomeToMarketer,
      cashToOnad,
      commissionAmount,
      VAT,
      actualSendedAmount,
    };
  }
  const cashToCreator = 0;
  const cashToOnad = Math.floor(orderPrice * onadCommission);
  const salesIncomeToMarketer = orderPrice - cashToOnad;

  // * 주문별 정산 정보
  const { commissionAmount, VAT, actualSendedAmount } = getCommissionInfo({
    cashToCreator,
    orderPrice,
    cashToOnad,
    paymentCommissionAmount,
    deliveryFee,
  });

  return {
    cashToCreator,
    salesIncomeToMarketer,
    cashToOnad,
    commissionAmount,
    VAT,
    actualSendedAmount,
  };
};

// CPS 계산 타겟들의 수수료 계산
const getFeeCalculatedTargets = _targets =>
  _targets.map(target => {
    const calculated = getCashesCalculated({
      orderPrice: target.orderPrice,
      isCreatorExists: !!target.targetCreatorId,
      creatorCommission: target.creatorCommission,
      onadCommission: target.onadCommission,
      deliveryFee: target.deliveryFee,
      paymentCommissionAmount: target.paymentCommissionAmount,
    });
    return { ...target, ...calculated };
  });

module.exports = {
  getCashesCalculated,
  getFeeCalculatedTargets,
};
