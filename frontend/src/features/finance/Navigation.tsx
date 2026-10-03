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
      <header>
        <a className="brand" href="/">
          WealthMesh
        </a>
        <span>Household financial health</span>
        <nav aria-label="Main navigation">
          <a href="/" aria-current={path === '/' ? 'page' : undefined}>
            Overview
          </a>
          <a href="/household" aria-current={path === '/household' ? 'page' : undefined}>
            Household
          </a>
          <a href="/setup" aria-current={path === '/setup' ? 'page' : undefined}>
            Setup status
          </a>
          <a href="http://127.0.0.1:5174">Documentation</a>
        </nav>
      </header>
    </>
  );
}
