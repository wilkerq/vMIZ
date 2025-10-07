import React from 'react';
import { MamModule } from '../components/MamModule';

const MamPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Mídia (MAM)</h1>
        <p className="text-slate-400 mt-1">
          Navegue, gerencie e edite seus recursos de mídia.
        </p>
      </div>
      <MamModule />
    </div>
  );
};

export default MamPage;