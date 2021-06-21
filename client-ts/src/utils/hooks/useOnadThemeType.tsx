import React from 'react';

enum THEME_TYPE {
  DARK = 'dark',
  LIGHT = 'light',
}
export default function useOnadThemeType(): {
  themeType: 'light' | 'dark';
  handleThemeChange: () => void;
} {
  const currentTheme = localStorage.getItem('themeType') as THEME_TYPE | null;
  const [themeType, setTheme] = React.useState<THEME_TYPE>(currentTheme || THEME_TYPE.LIGHT);

  function handleThemeChange(): void {
    if (themeType === THEME_TYPE.DARK) {
      setTheme(THEME_TYPE.LIGHT);
      localStorage.setItem('themeType', THEME_TYPE.LIGHT);
    } else {
      setTheme(THEME_TYPE.DARK);
      localStorage.setItem('themeType', THEME_TYPE.DARK);
    }
  }

  return { themeType, handleThemeChange };
}
