import { useState, useEffect } from 'react';

export default function useMypageScrollToTop(): void {
  const mainPanel = document.getElementById('onad-main-panel');

  const [currentPath, setCurPath] = useState('');
  const [prevPath, setPrevPath] = useState('');
  useEffect(() => {
    setCurPath(window.location.pathname);
    if (currentPath !== prevPath) {
      if (mainPanel) mainPanel.scroll({ top: 0, behavior: 'smooth' });
      setPrevPath(currentPath);
    }
  }, [currentPath, mainPanel, prevPath]);
}
