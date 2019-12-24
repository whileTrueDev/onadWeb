require('dotenv').config();
// const TwitchChatCollector = require('./model/TwitchChatCollector');
const TwitchChatCollectorV2 = require('./model/collector');

const onad = new TwitchChatCollectorV2();

onad.run();
