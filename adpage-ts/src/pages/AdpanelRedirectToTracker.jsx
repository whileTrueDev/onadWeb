import React, { useEffect } from 'react';


export default function AdpanelRedirectToTracker(props) {
  const { match } = props;
  useEffect(() => {
    window.location.href = `https://t.onad.io/${match.params.name}`;
  });
  return (
    <div />
  );
}
