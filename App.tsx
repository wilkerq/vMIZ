
// FIX: Corrected import paths to be absolute from the project root to resolve module resolution errors.
import React from 'react';
// FIX: Corrected import path to be relative.
import { AuthProvider, useAuth } from './context/AuthContext';
// FIX: Corrected import path to be relative.
import LoginPage from './components/LoginPage';
// FIX: Corrected import path to be relative.
import DashboardPage from './pages/DashboardPage';
// FIX: Corrected import path to be relative.
import MamPage from './pages/MamPage';
// FIX: Corrected import path to be relative.
import ReportsPage from './pages/ReportsPage';
// FIX: Corrected import path to be relative.
import { Spinner } from './components/Spinner';
// FIX: Corrected import path to be relative.
import { AppProvider, useApp } from './context/AppContext';
// FIX: Corrected import path to be relative.
import { MainLayout } from './components/layout/MainLayout';
// FIX: Corrected import path to be relative.
import PlayoutPage from './pages/PlayoutPage';
// FIX: Corrected import path to be relative.
import { SettingsProvider } from './context/SettingsContext';
// FIX: Corrected import path to be relative.
import SettingsPage from './pages/SettingsPage';
// FIX: Corrected import path to be relative.
import { PlayoutProvider } from './context/PlayoutContext';
// FIX: Corrected import path to be relative.
import ScriptingPage from './pages/ScriptingPage';
// FIX: Corrected import path to be relative.
import { ContextMenuProvider } from './context/ContextMenuContext';
// FIX: Corrected import path to be relative.
import { JournalismProvider } from './context/JournalismContext';
// FIX: Corrected import path to be relative.
import RundownPage from './pages/journalism/RundownPage';
// FIX: Corrected import path to be relative.
import IngestPage from './pages/journalism/IngestPage';
// FIX: Corrected import path to be relative.
import PautasPage from './pages/journalism/PautasPage';
// FIX: Corrected import path to be relative.
import ReportagemPage from './pages/journalism/ReportagemPage';
// FIX: Corrected import path to be relative.
import ProducaoPage from './pages/journalism/ProducaoPage';
// FIX: Corrected import path to be relative.
import StoryEditorPage from './pages/journalism/StoryEditorPage';


const PageRenderer: React.FC = () => {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'dashboard':
      return <DashboardPage />;
    case 'mam':
      return <MamPage />;
    case 'reports':
      return <ReportsPage />;
    case 'playout':
      return <PlayoutPage />;
    case 'settings':
      return <SettingsPage />;
    case 'scripting':
      return <ScriptingPage />;
    case 'journalism-rundown':
      return <RundownPage />;
    case 'journalism-stories':
      return <StoryEditorPage />;
    case 'journalism-ingest':
      return <IngestPage />;
    case 'journalism-pautas':
      return <PautasPage />;
    case 'journalism-reportagem':
      return <ReportagemPage />;
    case 'journalism-producao':
      return <ProducaoPage />;
    default:
      return <DashboardPage />;
  }
};


const AppContent: React.FC = () => {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <Spinner />
      </div>
    );
  }

  /*
  if (status === 'unauthenticated') {
    return <LoginPage />;
  }
  */
  
  return (
    <AppProvider>
      <SettingsProvider>
        <PlayoutProvider>
          <ContextMenuProvider>
            <JournalismProvider>
              <MainLayout>
                <PageRenderer />
              </MainLayout>
            </JournalismProvider>
          </ContextMenuProvider>
        </PlayoutProvider>
      </SettingsProvider>
    </AppProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
