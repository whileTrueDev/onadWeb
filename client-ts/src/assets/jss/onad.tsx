const hexToRgb = (paramInput: string): string => {
  let input = paramInput;
  input += '';
  input = input.replace('#', '');
  const hexRegex = /[0-9A-Fa-f]/g;
  if (!hexRegex.test(input) || (input.length !== 3 && input.length !== 6)) {
    throw new Error('input is not a valid hex color.');
  }
  if (input.length === 3) {
    const first = input[0];
    const second = input[1];
    const last = input[2];
    input = first + first + second + second + last + last;
  }
  input = input.toUpperCase();
  const first = input[0] + input[1];
  const second = input[2] + input[3];
  const last = input[4] + input[5];
  return (
    `${parseInt(first, 16)
    }, ${
      parseInt(second, 16)
    }, ${
      parseInt(last, 16)}`
  );
};

// ##############################
// // // Variables - Styles that are used on more than one component
// #############################
const drawerWidth = 120;

export {
  hexToRgb,
  drawerWidth,
};
