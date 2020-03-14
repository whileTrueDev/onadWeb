import React from 'react';

function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  // setSomeInputState(event.target.value)
}


function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  // someLogic();
}

//  useGetRequest 할 떄 <> 내부의 첫번째 인자는 param type, 두번쨰 인자는 return type
const reportData = useGetRequest<{ campaignId: string }, reportInterface>(
  '/marketer/campaign/analysis',
  { campaignId: selectedCampaign.campaignId }
);

//  children으로 할려면 ElementType으로 해야 react component로 인식됩니다.
interface propInterface {
  IconComponent: React.ElementType;
}
