import { hexToRgb, whiteColor } from '../../onad';

const customTabsStyle = {
  displayNone: {
    display: 'none !important',
  },
  tabsRoot: {
    minHeight: 'unset !important',
    overflowX: 'visible',
    '& $tabRootButton': {
      fontSize: '0.875rem',
    },
  },
  tabRootButton: {
    minHeight: 'unset !important',
    minWidth: 'unset !important',
    width: 'unset !important',
    height: 'unset !important',
    maxWidth: 'unset !important',
    maxHeight: 'unset !important',
    padding: '10px 15px',
    borderRadius: '3px',
    lineHeight: '24px',
    border: '0 !important',
    color: `${whiteColor} !important`,
    marginLeft: '4px',
    '&:last-child': {
      marginLeft: '0px',
    },
  },
  tabSelected: {
    backgroundColor: `rgba(${hexToRgb(whiteColor)}, 0.2)`,
    transition: '0.2s background-color 0.1s',
  },
  tabWrapper: {
    display: 'inline-block',
    minHeight: 'unset !important',
    minWidth: 'unset !important',
    width: 'unset !important',
    height: 'unset !important',
    maxWidth: 'unset !important',
    maxHeight: 'unset !important',
    '& > svg,& > .material-icons': {
      verticalAlign: 'middle',
      margin: '-1px 5px 0 0',
    },
  },
};

export default customTabsStyle;
