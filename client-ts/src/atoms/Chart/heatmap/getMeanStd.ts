/**
 * 숫자로 구성된 배열을 인자로 넣으면, 평균과 표준편차를 반환하는 함수.
 * @param {array} dataArray 평균과 표준편차를 구할 리스트
 * @return { mean: float, stddev: float }
 */
function getMeanStd(dataArray: number[]): {
  mean: number;
  stddev: number;
} {
  let allCounts = 0;
  dataArray.map((d) => {
    allCounts += d;
    return null;
  });

  const avgCounts = allCounts / dataArray.length;

  let total = 0;
  for (let i = 0; i < dataArray.length; i += 1) {
    const deviation = dataArray[i] - avgCounts;

    total += deviation * deviation;
  }
  const stddev = Math.floor(Math.sqrt(total / (dataArray.length - 1)));

  return {
    mean: avgCounts,
    stddev
  };
}

export default getMeanStd;
