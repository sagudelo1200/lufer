import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the window to top
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (e) {
      window.scrollTo(0, 0);
    }

    // Some mobile browsers may need both body and documentElement reset
    if (document.body) document.body.scrollTop = 0;
    if (document.documentElement) document.documentElement.scrollTop = 0;

    // If there's a main content container, scroll it to top as well
    const main = document.getElementById('main-content');
    if (main) {
      try {
        main.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      } catch (e) {
        main.scrollTop = 0;
      }
    }
  }, [pathname]);

  return null;
}
