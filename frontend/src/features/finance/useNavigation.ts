import { useEffect, useState } from 'react';
function ordinaryClick(event: React.MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}
function internalAnchor(target: EventTarget) {
  if (!(target instanceof Element)) return null;
  const anchor = target.closest('a');
  if (!anchor || anchor.target || anchor.origin !== window.location.origin || anchor.hash)
    return null;
  return anchor;
}
export function useNavigation() {
  const [returnFocus, setReturnFocus] = useState<string | null>(null);
  const [path, setPath] = useState(window.location.pathname);
  const [announcement, setAnnouncement] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const update = () => {
      setPath(window.location.pathname);
      setAnnouncement('');
      setReturnFocus(null);
      setRevision((value) => value + 1);
    };
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  function navigate(next: string, message = '', focusId?: string) {
    window.history.pushState(null, '', next);
    setPath(next);
    setAnnouncement(message);
    setReturnFocus(focusId ?? null);
    setRevision((value) => value + 1);
  }
  function follow(event: React.MouseEvent) {
    if (!ordinaryClick(event)) return;
    const anchor = internalAnchor(event.target);
    if (!anchor) return;
    event.preventDefault();
    navigate(anchor.pathname, '', anchor.dataset.returnFocus);
  }
  return { path, announcement, revision, navigate, follow, returnFocus };
}
