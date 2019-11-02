require('dotenv').config();
const ChatCollector = require('./model/ChatCollector');

const COLLECT_UNIT_SIZE = 100;
const onad = new ChatCollector(COLLECT_UNIT_SIZE);

// TEST \\->
const channels = ['hwasurr'];
const channels2 = ['dn0208', 'dkdkqwer'];

onad.createClient(channels);
setTimeout(() => {
  console.log('second client started!');
  onad.createClient(channels2);
}, 1000);
// \\<- TEST
