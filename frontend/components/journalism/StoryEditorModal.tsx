
import React, { useState, useEffect } from 'react';
import { Story } from '../../types';
import { useJournalism } from '../../context/JournalismContext';
import { Button } from '../Button';
import { XIcon } from '../icons/XIcon';

interface StoryEditorModalProps {
  story: Story;
  onClose: () => void;
}

export const StoryEditorModal: React.FC<StoryEditorModalProps> = ({ story, onClose }) => {
  const { saveStory } = useJournalism();
  const [localStory, setLocalStory] = useState(story);

  useEffect(() => {
    setLocalStory(story);
  }, [story]);

  const handleSave = () => {
    saveStory(localStory);
    onClose();
  };
  
  const handleContentChange = (content: string) => {
    // This is a placeholder for a real rich text editor's onChange event
    // In a real implementation, you'd use a library like Quill or TipTap
    setLocalStory(prev => ({ ...prev, script: content }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Editar Lauda</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><XIcon className="w-5 h-5" /></Button>
        </header>
        <main className="flex-1 p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="storyTitle" className="block text-sm font-medium text-slate-300 mb-1">Título</label>
            <input
              id="storyTitle"
              type="text"
              value={localStory.title}
              onChange={e => setLocalStory(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-lg font-bold"
            />
          </div>
          <div>
             <label htmlFor="storyStatus" className="block text-sm font-medium text-slate-300 mb-1">Status</label>
             <select id="storyStatus" value={localStory.status} onChange={e => setLocalStory(prev => ({...prev, status: e.target.value as Story['status']}))} className="bg-slate-800 border-slate-700 rounded-md">
                <option value="DRAFT">Rascunho</option>
                <option value="WRITING">Escrevendo</option>
                <option value="APPROVED">Aprovado</option>
                <option value="READY">Pronto</option>
             </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Roteiro</label>
            {/* Replace this with a real Rich Text Editor component */}
            <textarea
                value={localStory.script}
                onChange={e => handleContentChange(e.target.value)}
                className="w-full h-96 bg-slate-800 border border-slate-700 rounded-md p-3 text-base"
            ></textarea>
          </div>
        </main>
        <footer className="flex justify-end gap-3 p-4 border-t border-slate-800 bg-slate-900/50">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={handleSave}>Salvar Alterações</Button>
        </footer>
      </div>
    </div>
  );
};
