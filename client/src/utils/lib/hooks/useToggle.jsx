import React from 'react';


export default function useToggle() {
  const [toggle, setToggle] = React.useState(false);
  function handleToggle() {
    setToggle(!toggle);
  }
  return { toggle, handleToggle };
}
