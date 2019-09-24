import React from 'react';

export default function useEventTargetValue(defaultValue = '') {
  const [value, setValue] = React.useState(defaultValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  return { value, handleChange };
}
