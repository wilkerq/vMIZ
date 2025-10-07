
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MamPage from './pages/MamPage';
import ReportsPage from './pages/ReportsPage';
import { Spinner } from './components/Spinner';
import { AppProvider, useApp } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import PlayoutPage from './pages/PlayoutPage';
import { SettingsProvider } from './context/SettingsContext';
import SettingsPage from './pages/SettingsPage';
import { PlayoutProvider } from './context/PlayoutContext';
import ScriptingPage from './pages/ScriptingPage';
import { ContextMenuProvider } from './context/ContextMenuContext';
import { JournalismProvider } from './context/JournalismContext';
import RundownPage from './pages/journalism/RundownPage';
import IngestPage from './pages/journalism/IngestPage';
import PautasPage from './pages/journalism/PautasPage';
import ReportagemPage from './pages/journalism/ReportagemPage';
import ProducaoPage from './pages/journalism/ProducaoPage';
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
