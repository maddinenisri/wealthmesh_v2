import { ReturnFocusContext } from './features/finance/focusContext';
import { FinancePage } from './features/finance/FinancePage';
import { AppHeader, Heading, PageTitle } from './features/finance/Navigation';
import { useNavigation } from './features/finance/useNavigation';
import { SetupStatus } from './features/system/SetupStatus';
export function App() {
  const navigation = useNavigation();
  const { path, announcement, revision, navigate } = navigation;
  return (
    <ReturnFocusContext value={navigation.returnFocus}>
      <div className="workspace" onClick={navigation.follow}>
        <PageTitle path={path} />
        <AppHeader path={path} />
        <main id="main" className="workspace-main" tabIndex={-1}>
          <p role="status" className="announcement">
            {announcement}
          </p>
          {path === '/setup' ? (
            <>
              <Heading>Setup status</Heading>
              <p>The screen reads the local server's installation record.</p>
              <SetupStatus />
            </>
          ) : (
            <FinancePage key={revision} path={path} navigate={navigate} />
          )}
        </main>
      </div>
    </ReturnFocusContext>
  );
}
