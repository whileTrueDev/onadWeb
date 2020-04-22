import theme from '../../../theme';

const HOST_URL = `${window.location.protocol}//${window.location.host}/mypage/`;

function LinkText(string: string, link: string, usertype = 'creator'): string {
  return `<a href="${HOST_URL}${usertype}/${link}" style="background-color: ${theme.lightTheme.palette.secondary.main}; color: ${theme.lightTheme.palette.text.primary}; padding: 3px">${string}</a>`;
}

function styledText(string: string): string {
  return `<span style="background-color: ${theme.lightTheme.palette.primary.main}; color:#eeeeee; padding: 3px">${string}</span>`;
}

function styledTextSecondary(string: string): string {
  return `<span style="background-color: ${theme.lightTheme.palette.secondary.main}; color:#eeeeee; padding: 3px">${string}</span>`;
}

const styledBlock = (string: string): string => `<div style="background-color: #FFECC5; color: ${theme.lightTheme.palette.text.primary}; border-radius: 5px; padding: 10px;">${string}</div>`;

export default {
  LinkText,
  styledText,
  styledTextSecondary,
  styledBlock
};
