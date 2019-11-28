require('dotenv').config();
const TwitchChatCollector = require('./model/TwitchChatCollector');

const onad = new TwitchChatCollector();

onad.start();
