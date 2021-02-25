import { Handlers } from '../interfaces/handler.interface';


// Called when client join channel
const onJoinHandler: Handlers['onJoinHandler'] = (
  channel, username, self
): void => {
  if (self) { // join event from the onad bot
    const channelName = channel.replace('#', '');
    console.log(`[${new Date().toLocaleString()}] join channel: ${channelName}`);
    // this.joinedChannels.push(channelName);
  }
};

export default onJoinHandler;
