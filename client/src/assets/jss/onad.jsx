import { grey } from '@material-ui/core/colors';

const hexToRgb = (paramInput) => {
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
  input = input.toUpperCase(input);
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

const transition = {
  transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
};

const container = {
  paddingRight: '15px',
  paddingLeft: '15px',
  marginRight: 'auto',
  marginLeft: 'auto',
};

const cardActions = {
  margin: '0 20px 10px',
  paddingTop: '10px',
  borderTop: `1px solid ${grey[300]}`,
  height: 'auto',
};

const cardHeader = {
  margin: '-20px 15px 0',
  borderRadius: '3px',
  padding: '15px',
};

const card = {
  display: 'inline-block',
  position: 'relative',
  width: '100%',
  margin: '25px 0',
  boxShadow: `0 1px 4px 0 rgba(${hexToRgb('#333')}, 0.14)`,
  borderRadius: '3px',
  color: `rgba(${hexToRgb('#333')}, 0.87)`,
  background: 'inherit',
};

const defaultBoxShadow = {
  border: '0',
  borderRadius: '3px',
  boxShadow:
    `0 10px 20px -12px rgba(${
      hexToRgb('#333')
    }, 0.42), 0 3px 20px 0px rgba(${
      hexToRgb('#333')
    }, 0.12), 0 8px 10px -5px rgba(${
      hexToRgb('#333')
    }, 0.2)`,
  padding: '10px 0',
  transition: 'all 150ms ease 0s',
};

const title = {
  color: grey[200],
  textDecoration: 'none',
  fontWeight: '300',
  marginTop: '30px',
  marginBottom: '25px',
  minHeight: '32px',
  '& small': {
    color: grey[300],
    fontWeight: '400',
    lineHeight: '1',
  },
};

const cardTitle = {
  ...title,
  marginTop: '0',
  marginBottom: '3px',
  minHeight: 'auto',
  '& a': {
    ...title,
    marginTop: '.625rem',
    marginBottom: '0.75rem',
    minHeight: 'auto',
  },
};

const cardSubtitle = {
  marginTop: '-.375rem',
};

const cardLink = {
  '& + $cardLink': {
    marginLeft: '1.25rem',
  },
};

export {
  hexToRgb,
  // variables
  drawerWidth,
  transition,
  container,
  card,
  cardActions,
  cardHeader,
  defaultBoxShadow,
  title,
  cardTitle,
  cardSubtitle,
  cardLink,
};
