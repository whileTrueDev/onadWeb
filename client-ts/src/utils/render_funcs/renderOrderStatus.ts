// 주문상태(0=주문접수,1=상품준비중,2=출고준비, 3=출고완료,4=배송완료, 5=주문취소)

export const 주문상태_주문접수 = 0;
export const 주문상태_상품준비 = 1;
export const 주문상태_출고준비 = 2;
export const 주문상태_출고완료 = 3;
export const 주문상태_배송완료 = 4;
export const 주문상태_주문취소 = 5;
export const 주문상태_구매확정 = 6;

export const orderStatus = [
  '주문접수',
  '상품준비',
  '출고준비',
  '출고완료',
  '배송완료',
  '주문취소',
  '구매확정',
];
export default function renderOrderStatus(status: number): string {
  return orderStatus[status];
}
