import React from 'react';

const Video = (props) => {
  const { creatorTwitchId } = props;
  return (
    <iframe
      title="hero"
      src={`https://player.twitch.tv/?channel=${creatorTwitchId}&autoplay=false`}
      height="282"
      width="500"
      frameBorder="0"
      scrolling="no"
      allowFullScreen
    />
  );
};

export default Video;
