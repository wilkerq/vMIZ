
import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Button } from '../components/Button';
import { Settings, NewsProgram } from '../types';
import { journalismService } from '../services/journalismService';
import { PlusIcon } from '../components/icons/PlusIcon';
import { TrashIcon } from '../components/icons/TrashIcon';

const SettingsPage: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [programs, setPrograms] = useState<NewsProgram[]>([]);
  const [editingProgram, setEditingProgram] = useState<Partial<NewsProgram> | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const fetchPrograms = async () => {
      const progs = await journalismService.getPrograms();
      setPrograms(progs);
  };

  useEffect(() => {
    setLocalSettings(settings);
    fetchPrograms();
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }));
    setIsSaved(false);
  };
  
  const handleProgramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProgram) return;
    const { name, value, type } = e.target;
    setEditingProgram(prev => ({
        ...prev,
        [name]: type === 'number' ? (value ? parseInt(value, 10) : undefined) : value,
    }));
  };
  
  const handleSaveProgram = async () => {
      if (!editingProgram || !editingProgram.name) return;
      await journalismService.saveProgram(editingProgram);
      await fetchPrograms();
      setEditingProgram(null);
  };

  const handleDeleteProgram = async (id: string) => {
      if (window.confirm("Você tem certeza que deseja excluir este programa? Esta ação não pode ser desfeita.")) {
          await journalismService.deleteProgram(id);
          await fetchPrograms();
      }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000); // Oculta a mensagem após 2 segundos
  };
  
  const renderProgramForm = () => (
    <div className="bg-slate-800/50 p-4 rounded-md mt-4 space-y-3">
        <h4 className="font-semibold text-slate-200">{editingProgram?.id ? 'Editar Programa' : 'Adicionar Novo Programa'}</h4>
        <input type="text" name="name" value={editingProgram?.name || ''} onChange={handleProgramChange} placeholder="Nome do Programa" className="w-full bg-slate-700 border-slate-600 rounded-md p-2 text-sm" />
        <div className="grid grid-cols-2 gap-3">
            <input type="text" name="defaultStartTime" value={editingProgram?.defaultStartTime || ''} onChange={handleProgramChange} placeholder="Horário de Início (HH:MM:SS)" className="w-full bg-slate-700 border-slate-600 rounded-md p-2 text-sm font-mono" />
            <input type="text" name="defaultDuration" value={editingProgram?.defaultDuration || ''} onChange={handleProgramChange} placeholder="Duração (HH:MM:SS)" className="w-full bg-slate-700 border-slate-600 rounded-md p-2 text-sm font-mono" />
        </div>
         <p className="text-xs text-slate-400 pt-2 border-t border-slate-700">Opcional: Substituir a conexão vMix padrão para este programa.</p>
        <div className="grid grid-cols-2 gap-3">
            <input type="text" name="vMixIpAddress" value={editingProgram?.vMixIpAddress || ''} onChange={handleProgramChange} placeholder="Endereço IP do vMix" className="w-full bg-slate-700 border-slate-600 rounded-md p-2 text-sm font-mono" />
            <input type="number" name="vMixPort" value={editingProgram?.vMixPort || ''} onChange={handleProgramChange} placeholder="Porta do vMix" className="w-full bg-slate-700 border-slate-600 rounded-md p-2 text-sm font-mono" />
        </div>
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingProgram(null)}>Cancelar</Button>
            <Button variant="default" onClick={handleSaveProgram}>Salvar Programa</Button>
        </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-slate-400 mt-1">
          Configure as definições e integrações da aplicação.
        </p>
      </div>

      <div className="max-w-xl space-y-6">
        <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4">Conexão vMix Padrão</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="vMixIpAddress" className="block text-sm font-medium text-slate-300 mb-1">Endereço IP</label>
                <input
                  id="vMixIpAddress"
                  name="vMixIpAddress"
                  type="text"
                  value={localSettings.vMixIpAddress}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <div>
                <label htmlFor="vMixPort" className="block text-sm font-medium text-slate-300 mb-1">Porta</label>
                <input
                  id="vMixPort"
                  name="vMixPort"
                  type="number"
                  value={localSettings.vMixPort}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
              {isSaved && <p className="text-sm text-green-400">Configurações salvas com sucesso!</p>}
              <Button type="submit" variant="default">Salvar Configurações</Button>
          </div>
        </form>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-4">
                <h2 className="text-xl font-semibold text-slate-200">Gerenciar Programas</h2>
                <Button variant="default" onClick={() => setEditingProgram({})} className="px-2 py-1 text-xs"><PlusIcon className="w-4 h-4 mr-1"/> Adicionar Programa</Button>
            </div>
            <div className="space-y-2">
                {programs.map(p => (
                    <div key={p.id} className="bg-slate-800/50 p-3 rounded-md flex justify-between items-center group">
                        <div>
                            <p className="font-semibold text-slate-100">{p.name}</p>
                            <p className="text-xs text-slate-400 font-mono">
                                {p.vMixIpAddress && p.vMixPort ? `Destino vMix: ${p.vMixIpAddress}:${p.vMixPort}` : 'Usa a conexão vMix padrão'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" onClick={() => setEditingProgram(p)} className="text-xs px-2 py-1">Editar</Button>
                            <Button variant="outline" onClick={() => handleDeleteProgram(p.id)} className="text-xs px-2 py-1 hover:bg-red-500/20 hover:border-red-500 hover:text-red-400"><TrashIcon className="w-3 h-3"/></Button>
                        </div>
                    </div>
                ))}
            </div>
            {editingProgram && renderProgramForm()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
