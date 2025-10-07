
// FIX: Corrected import paths to be absolute from the project root to resolve module resolution errors.
import React from 'react';
// FIX: Corrected import path to be relative.
import { QuillIcon } from '../components/icons/QuillIcon';

const ScriptingPage: React.FC = () => {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <QuillIcon className="w-10 h-10 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">Roteirização</h1>
          <p className="text-slate-400 mt-1">
            Crie e gerencie roteiros de duas colunas (áudio/vídeo). (Em desenvolvimento)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScriptingPage;
