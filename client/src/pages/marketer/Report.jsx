import React from 'react';
import MarketerReportCampaign from '../../organisms/marketer/Report/MarketerReportCampaign';
import MarketerReport from '../../organisms/marketer/Report/MarketerReport';

export default function Report(props) {
  const { match } = props;

  return (
    <div>
      {match && match.param ? (
        <MarketerReportCampaign match={match} />
      ) : (
        <MarketerReport />
      )}
    </div>
  );
}
