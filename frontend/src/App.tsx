import { SetupStatus } from './features/system/SetupStatus';

export function App() {
  return (
    <>
      <header>
        <span className="brand">WealthMesh</span>
        <span>Household financial health</span>
      </header>
      <main>
        <p className="eyebrow">Project setup</p>
        <h1>A clear starting point</h1>
        <p className="intro">
          Your household finance application is taking shape. This first step checks that the
          screen, server, and database work together.
        </p>
        <SetupStatus />
        <aside>
          <h2>Understand what is being built</h2>
          <p>
            Read the agent-written feature plans, decisions, final checks, and operating guides.
          </p>
          <a href="http://127.0.0.1:5174">Open project documentation</a>
        </aside>
        <p className="scope">Localhost only · No login · Finance features are pending</p>
      </main>
    </>
  );
}
