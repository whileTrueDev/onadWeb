import theme from '../../../theme';

const HOST_URL = `${window.location.protocol}//${window.location.host}/mypage/`;

function LinkText(string: string, link: string, usertype = 'creator'): string {
  return `<a href="${HOST_URL}${usertype}/${link}" style="background-color: ${theme.rawTheme.palette.secondary.main}; color: rgba(0, 0, 0, 0.54); padding: 3px">${string}</a>`;
}

function styledText(string: string): string {
  return `<span style="background-color: ${theme.rawTheme.palette.primary.main}; color:#eeeeee; padding: 3px">${string}</span>`;
}

function styledTextSecondary(string: string): string {
  return `<span style="background-color: ${theme.rawTheme.palette.secondary.main}; color:#eeeeee; padding: 3px">${string}</span>`;
}

const styledBlock = (string: string): string =>
  `<div style="background-color: #FFECC5; color: rgba(0, 0, 0, 0.54); border-radius: 5px; padding: 10px;">${string}</div>`;

export default {
  LinkText,
  styledText,
  styledTextSecondary,
  styledBlock,
};
