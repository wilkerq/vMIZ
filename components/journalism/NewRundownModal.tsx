
// FIX: Corrected import paths to be absolute from the project root to resolve module resolution errors.
import React, { useState } from 'react';
// FIX: Corrected import path to be relative.
import { useJournalism } from '../../context/JournalismContext';
// FIX: Corrected import path to be relative.
import { Button } from '../Button';
// FIX: Corrected import path to be relative.
import { XIcon } from '../icons/XIcon';
import { format } from 'date-fns';

interface NewRundownModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewRundownModal: React.FC<NewRundownModalProps> = ({ isOpen, onClose }) => {
  const { programs, createRundown } = useJournalism();
  const [programId, setProgramId] = useState(programs[0]?.id || '');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [title, setTitle] = useState('');

  const handleCreate = async () => {
    if (!programId || !date || !title) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    await createRundown(programId, date, title);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl w-full max-w-md">
        <header className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Criar Novo Espelho</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><XIcon className="w-5 h-5" /></Button>
        </header>
        <main className="p-6 space-y-4">
          <div>
            <label htmlFor="program" className="block text-sm font-medium text-slate-300 mb-1">Programa</label>
            <select id="program" value={programId} onChange={e => setProgramId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm">
                <option value="">Selecione um programa</option>
                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">Data</label>
            <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm"/>
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Título</label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Jornal da Noite - 26/07" className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm"/>
          </div>
        </main>
        <footer className="flex justify-end gap-3 p-4 border-t border-slate-800 bg-slate-900/50">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={handleCreate}>Criar Espelho</Button>
        </footer>
      </div>
    </div>
  );
};
