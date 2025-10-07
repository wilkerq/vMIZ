
// FIX: Corrected import paths to be absolute from the project root to resolve module resolution errors.
import React from 'react';
// FIX: Corrected import path to be relative.
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
  return (
    <div>
      <h1 className="text-3xl font-bold">Painel</h1>
      <p className="text-slate-400 mt-1">
        Bem-vindo de volta, {user?.displayName || 'usuário'}. Aqui está um resumo do seu sistema.
      </p>
    </div>
  );
};

export default DashboardPage;
