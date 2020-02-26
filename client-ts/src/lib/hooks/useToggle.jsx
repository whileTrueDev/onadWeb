import React from 'react';


export default function useToggle(defaultToggle = false) {
  const [toggle, setToggle] = React.useState(defaultToggle);
  function handleToggle() {
    setToggle(!toggle);
  }
  return { toggle, handleToggle };
}
