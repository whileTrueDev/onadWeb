import React from 'react';
import useFetchData from '../../../utils/lib/hooks/useFetchData';

const UrlInventory = (props) => {
  const UrlData = useFetchData('/api/dashboard/marketer/campaign/geturl');
  console.log(UrlData);
  return (
    <div>
      heello
    </div>
  );
};

export default UrlInventory;
