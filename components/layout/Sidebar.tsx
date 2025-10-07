
// FIX: Corrected import paths to be absolute from the project root to resolve module resolution errors.
import React from 'react';
// FIX: Corrected import path to be relative.
import { useAuth } from '../../context/AuthContext';
// FIX: Corrected import path to be relative.
import { useApp } from '../../context/AppContext';
// FIX: Corrected import path to be relative.
import { VMixIcon } from '../icons/VMixIcon';
// FIX: Corrected import path to be relative.
import { LayoutDashboardIcon } from '../icons/LayoutDashboardIcon';
// FIX: Corrected import path to be relative.
import { FileVideoIcon } from '../icons/FileVideoIcon';
// FIX: Corrected import path to be relative.
import { PlayIcon } from '../icons/PlayIcon';
// FIX: Corrected import path to be relative.
import { BarChartIcon } from '../icons/BarChartIcon';
// FIX: Corrected import path to be relative.
import { SettingsIcon } from '../icons/SettingsIcon';
// FIX: Corrected import path to be relative.
import { QuillIcon } from '../icons/QuillIcon';
// FIX: Corrected import path to be relative.
import { NewspaperIcon } from '../icons/NewspaperIcon';
// FIX: Corrected import path to be relative.
import { ClipboardListIcon } from '../icons/ClipboardListIcon';
// FIX: Corrected import path to be relative.
import { FileTextIcon } from '../icons/FileTextIcon';
// FIX: Corrected import path to be relative.
import { DownloadCloudIcon } from '../icons/DownloadCloudIcon';
// FIX: Corrected import path to be relative.
import { LightbulbIcon } from '../icons/LightbulbIcon';
// FIX: Corrected import path to be relative.
import { MicIcon } from '../icons/MicIcon';

const NavItem = ({ icon, label, page, currentPage, setCurrentPage, isSubItem = false }) => (
  <button
    onClick={() => setCurrentPage(page)}
    className={`w-full flex items-center text-sm font-medium rounded-md transition-colors duration-150 ${
      isSubItem ? 'pl-10 pr-2 py-2' : 'px-3 py-2'
    } ${
      currentPage === page
        ? 'bg-slate-800 text-white'
        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
    }`}
  >
    {icon && React.createElement(icon, { className: 'w-5 h-5 mr-3' })}
    <span>{label}</span>
  </button>
);

export const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { currentPage, setCurrentPage } = useApp();

  const journalismPages = [
    'journalism-rundown',
    'journalism-stories',
    'journalism-ingest',
    'journalism-pautas',
    'journalism-reportagem',
    'journalism-producao'
  ];

  const isJournalismActive = journalismPages.includes(currentPage);

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-4 no-print">
      <div className="flex items-center gap-3 mb-8">
        <VMixIcon className="w-8 h-8 text-blue-500" />
        <h1 className="text-xl font-bold text-white">Painel vMix</h1>
      </div>
      <nav className="flex-1 space-y-1">
        <NavItem icon={LayoutDashboardIcon} label="Painel" page="dashboard" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <NavItem icon={FileVideoIcon} label="MAM" page="mam" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <NavItem icon={PlayIcon} label="Playout" page="playout" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        
        {/* Journalism Dropdown */}
        <div>
          <button
            onClick={() => setCurrentPage('journalism-rundown')}
            className={`w-full flex items-center text-sm font-medium rounded-md px-3 py-2 transition-colors duration-150 ${
              isJournalismActive
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <NewspaperIcon className="w-5 h-5 mr-3" />
            <span>Jornalismo</span>
          </button>
          {isJournalismActive && (
            <div className="mt-1 space-y-1">
              <NavItem icon={ClipboardListIcon} label="Espelhos" page="journalism-rundown" currentPage={currentPage} setCurrentPage={setCurrentPage} isSubItem />
              <NavItem icon={FileTextIcon} label="Laudas" page="journalism-stories" currentPage={currentPage} setCurrentPage={setCurrentPage} isSubItem />
              <NavItem icon={DownloadCloudIcon} label="Ingestão" page="journalism-ingest" currentPage={currentPage} setCurrentPage={setCurrentPage} isSubItem />
              <NavItem icon={LightbulbIcon} label="Pautas" page="journalism-pautas" currentPage={currentPage} setCurrentPage={setCurrentPage} isSubItem />
              <NavItem icon={MicIcon} label="Reportagem" page="journalism-reportagem" currentPage={currentPage} setCurrentPage={setCurrentPage} isSubItem />
            </div>
          )}
        </div>
        
        <NavItem icon={QuillIcon} label="Roteirização" page="scripting" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <NavItem icon={BarChartIcon} label="Relatórios" page="reports" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <NavItem icon={SettingsIcon} label="Configurações" page="settings" currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </nav>
      <div className="mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-md bg-slate-800/50">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=0284c7&color=fff`}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.displayName || 'Usuário'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="text-slate-400 hover:text-white transition-colors text-xs"
            title="Sair"
          >
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
};
