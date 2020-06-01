import React from 'react';

const useSearch = () => {
  const [searchText, setSearchText] = React.useState(null);

  function handleSearchChange(evt) {
    setSearchText(evt.target.value.toLowerCase());
  }

  return { searchText, handleSearchChange };
};

export default useSearch;
