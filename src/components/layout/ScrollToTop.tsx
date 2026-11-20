import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures that on any route or query param change (e.g. tapping "Jeans" from Home),
 * the window instantly scrolls to the top (0, 0) so the first product is shown.
 */
export function ScrollToTop(): null {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
