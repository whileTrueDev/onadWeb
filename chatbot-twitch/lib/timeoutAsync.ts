
async function wait(ms: number): Promise<any> {
  return new Promise<any>((resolve) => setTimeout(resolve, ms));
}
/**
 * 배열의 모든 요소에 대해 index * timeout 시간만큼 뒤에 비동기함수가 실행되도록하는 함수.
 * @param lst 배열
 * @param callback 개별 요소에게 적용할 함수
 * @param timeout 각 요소당 타임아웃 시간
 */
export default function timeoutAsync<T>(
  lst: T[], callback: (item: T, idx: number) => void, timeout = 1000
) {
  lst.forEach((item, idx) => {
    const anonFunc = (item1: T): void => {
      setTimeout(() => {
        callback(item1, idx);
      }, idx * timeout);
    };

    anonFunc(item);
  });
}
