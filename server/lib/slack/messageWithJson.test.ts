import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import slack from './messageWithJson';


describe('slack messaging test', () => {
  // mock axios 객체 생성
  const mockAxios = new MockAdapter(axios, { delayResponse: 200 });

  // 슬랙 요청시 보내는 데이터 설정
  const sendingData = {
    summary: '텍스트 summary',
    text: '테스트 텍스트',
    fields: [
      { title: '테스트 필드1', value: '테스트 필드1 value', short: true, }
    ],
  };

  it('messageWithJson success', async () => {
    mockAxios.onPost(process.env.SLACK_ALARM_URL).reply(200); // axios mock object의 응답을 설정
    const res = await slack(sendingData); // mock axios에 요청
    expect(res).toBe(200); // res 값이 맞는지 확인
    mockAxios.reset(); // axios mock object를 reset
  });

  it('messageWithJson fail', async () => {
    mockAxios.onPost(process.env.SLACK_ALARM_URL).reply(404);
    const res = await slack(sendingData);
    expect(res).toBe('slack messaging fail');
    mockAxios.reset();
  });
});
