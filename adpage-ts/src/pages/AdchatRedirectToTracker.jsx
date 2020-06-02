import React, { useEffect } from 'react';


export default function AdchatRedirectToTracker(props) {
  const { match } = props;
  useEffect(() => {
    window.location.href = `https://t.onad.io/adchat/${match.params.name}`;
  });
  return (
    <div />
  );
}
