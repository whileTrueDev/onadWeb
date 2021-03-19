// 주문상태(0=주문접수,1=결제확인,2=상품준비,3=출고준비,4=출고완료,5=배송중,6=배송완료,7=반품요청,8=구매완료대기,9=구매완료)

export const 주문상태_주문접수 = 0;
export const 주문상태_상품준비중 = 1;
export const 주문상태_출고준비완료 = 2;
export const 주문상태_주문취소 = 3;

export const orderStatus = [
  '주문접수',
  '상품준비중',
  '출고준비완료',
  '주문취소',
];
export default function renderOrderStatus(status: number): string {
  return orderStatus[status];
}
