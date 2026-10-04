import { ReturnFocusContext } from './focusContext';
import { useContext, useEffect, useRef } from 'react';
export type Navigate = (path: string, announcement?: string, returnFocus?: string) => void;
export function Heading({ children }: { children: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const returnFocus = useContext(ReturnFocusContext);
  useEffect(() => {
    const target = returnFocus ? document.getElementById(returnFocus) : null;
    (target ?? heading.current)?.focus();
  }, [returnFocus]);
  return (
    <h1 ref={heading} tabIndex={-1}>
      {children}
    </h1>
  );
}

export function AppHeader({ path }: { path: string }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="workspace-sidebar">
        <a className="brand" href="/">
          WealthMesh
        </a>
        <nav aria-label="Main navigation">
          <a
            className={path.startsWith('/accounts/') ? 'section-active' : undefined}
            href="/"
            aria-current={path === '/' ? 'page' : undefined}
          >
            Overview
          </a>
          <a href="/household" aria-current={path === '/household' ? 'page' : undefined}>
            Household
          </a>
        </nav>
      </header>
    </>
  );
}

export function PageTitle({ path, title }: { path: string; title?: string }) {
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Overview',
      '/household': 'Household',
      '/accounts/new': 'Add account',
      '/accounts/new/checking': 'Add checking account',
      '/setup': 'Setup status',
    };
    const account = /^\/accounts\/[0-9a-f-]{36}(\/edit)?$/i.exec(path);
    const accountTitle = account?.[1] ? 'Edit account' : 'Checking account';
    const page = title ?? titles[path] ?? (account ? accountTitle : 'Page not found');
    document.title = page + ' · WealthMesh';
  }, [path, title]);
  return null;
}
