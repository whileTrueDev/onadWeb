const getCashesCalculatedForLiveCommerce = ({ orderPrice, creatorCommission, onadCommission }) => {
  const cashToCreator = Math.round(orderPrice * creatorCommission);
  const cashToOnad = Math.round(orderPrice * onadCommission);
  const salesIncomeToMarketer = orderPrice - cashToCreator - cashToOnad;
  return { cashToCreator, salesIncomeToMarketer };
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
  totalOrderPrice, isCreatorExists, creatorCommission, onadCommission
}) => {
  if (isCreatorExists) { // 1 번의 경우
    const cashToCreator = Math.round(totalOrderPrice * creatorCommission);
    const cashToOnad = Math.round(totalOrderPrice * onadCommission);
    const salesIncomeToMarketer = totalOrderPrice - cashToCreator - cashToOnad;
    return { cashToCreator, salesIncomeToMarketer };
  }
  const cashToCreator = 0;
  const cashToOnad = Math.round(totalOrderPrice * onadCommission);
  const salesIncomeToMarketer = totalOrderPrice - cashToOnad;
  return { cashToCreator, salesIncomeToMarketer };
};

module.exports = {
  getCashesCalculatedForLiveCommerce,
  getCashesCalculated,
};
