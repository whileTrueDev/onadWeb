const getUpdateCode = (timeformat) => {
  if (timeformat) {
    const [year, month, day] = timeformat.split(' ')[0].split('-');
    const [hour, min, second] = timeformat.split(' ')[1].split(':');

    return `${year.slice(2)}년 ${month}월 ${day}일 ${hour}:${min}:${second}`;
  }
  const date = new Date();
  date.setHours(date.getHours() + 9);

  const dateString = date.toLocaleString('ko-KR', {
    timeZone: 'UTC',
    hour12: false,
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const [year, month, day, time] = dateString.split('. ');
  const [hour, min, second] = time.split(':');

  return `${year}년 ${month}월 ${day}일 ${hour}:${min}:${second}`;
};

export default getUpdateCode;
