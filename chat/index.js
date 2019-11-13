require('dotenv').config();
const TwitchChatCollector = require('./model/TwitchChatCollector');

const onad = new TwitchChatCollector();

onad.start();

// 채팅로그 수집 서버 시작시, OnAD와 계약된 모든 크리에이터에 대한 채팅로그를 수집.

// 온애드와 계약된 모든 크리에이터 조회

// 크리에이터들을 적당한 크기의 군집 [리스트] 으로 할당
// 하나의 클라이언트에는 크리에이터 총 5명 / 10명 ? 아니면 어떠한 기준이 필요함.

// 군집별로 채팅로그 수집 클라이언트 생성.

// 스케쥴러 이용하여 매일 자정, 새로운 크리에이터가 있는 경우에만 새로운 클라이언트 생성.
// 추가해야하는 크리에이터twitchId를 담은 리스트를 받고,
// 해당 리스트를 타겟으로하는 클라이언트를 생성
