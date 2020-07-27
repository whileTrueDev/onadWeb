import React from 'react';

export default function useEventTargetValue(defaultValue = ''): {
  value: string;
  handleChange(e: React.ChangeEvent<HTMLInputElement>): void;
  handleReset(): void;
  setValue: (value: React.SetStateAction<string>) => void;
  inputPhoneNumber(phoneNumber: string): string | undefined;
} {
  const [value, setValue] = React.useState(defaultValue);


  function inputPhoneNumber(phoneNumber: string) {
    const number = phoneNumber.replace(/[^0-9]/g, '');
    let phone = '';


    if (number.length < 4) {
      return number;
    } if (number.length < 7) {
      phone += number.substr(0, 3);
      phone += '-';
      phone += number.substr(3);
    } else if (number.length < 11) {
      phone += number.substr(0, 3);
      phone += '-';
      phone += number.substr(3, 3);
      phone += '-';
      phone += number.substr(6);
    } else {
      phone += number.substr(0, 3);
      phone += '-';
      phone += number.substr(3, 4);
      phone += '-';
      phone += number.substr(7);
    }
    return phone;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    // setValue(e.target.value);
    setValue(inputPhoneNumber(e.target.value));
  }

  function handleReset(): void {
    setValue(defaultValue);
  }


  return {
    value, handleChange, handleReset, setValue, inputPhoneNumber
  };
}
