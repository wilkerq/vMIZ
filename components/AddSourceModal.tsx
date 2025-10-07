
// FIX: Corrected import paths to be absolute from the project root to resolve module resolution errors.
import React, { useState } from 'react';
// FIX: Corrected import path to be relative.
import { PlayoutItem, SourceStatus, SourceType } from '../types';
// FIX: Corrected import path to be relative.
import { Button } from './Button';
// FIX: Corrected import path to be relative.
import { XIcon } from './icons/XIcon';
// FIX: Corrected import path to be relative.
import { SignalIcon } from './icons/SignalIcon';
// FIX: Corrected import path to be relative.
import { StreamIcon } from './icons/StreamIcon';
// FIX: Corrected import path to be relative.
import { FileVideoIcon } from './icons/FileVideoIcon';
// FIX: Corrected import path to be relative.
import { ImageIcon } from './icons/ImageIcon';
// FIX: Corrected import path to be relative.
import { MusicIcon } from './icons/MusicIcon';


const sourceTypes = [
  { id: SourceType.VIDEO, label: 'Vídeo (Arquivo)', icon: FileVideoIcon },
  { id: SourceType.IMAGE, label: 'Imagem (Arquivo)', icon: ImageIcon },
  { id: SourceType.AUDIO, label: 'Áudio (Arquivo)', icon: MusicIcon },
  { id: SourceType.NDI, label: 'NDI', icon: SignalIcon },
  { id: SourceType.SDI, label: 'SDI', icon: SignalIcon },
  { id: SourceType.SRT, label: 'SRT', icon: StreamIcon },
  { id: SourceType.RTMP, label: 'RTMP', icon: StreamIcon },
];

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: PlayoutItem) => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [selectedType, setSelectedType] = useState<SourceType>(SourceType.VIDEO);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('00:00:00');
  const [url, setUrl] = useState('');

  const handleAdd = () => {
    if (!name) return;
    const newItem: PlayoutItem = {
      id: `item_${Date.now()}`,
      name,
      type: selectedType,
      duration,
      status: SourceStatus.OK, // Assume OK for manually added sources
      url: url || undefined,
    };
    onAdd(newItem);
    onClose();
    // Reset form
    setName('');
    setDuration('00:00:00');
    setUrl('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl w-full max-w-md">
        <header className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Adicionar Fonte à Playlist</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><XIcon className="w-5 h-5" /></Button>
        </header>
        <main className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Fonte</label>
                <div className="grid grid-cols-3 gap-2">
                    {sourceTypes.map(type => (
                        <button key={type.id} onClick={() => setSelectedType(type.id)}
                            className={`p-3 rounded-md text-sm flex flex-col items-center justify-center gap-2 border transition-colors ${selectedType === type.id ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'}`}
                        >
                            <type.icon className="w-5 h-5" />
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
                <input id="itemName" type="text" value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm"
                />
            </div>
            { [SourceType.SRT, SourceType.RTMP, SourceType.NDI].includes(selectedType) &&
                <div>
                    <label htmlFor="itemUrl" className="block text-sm font-medium text-slate-300 mb-1">URL / Nome da Fonte</label>
                    <input id="itemUrl" type="text" value={url} onChange={e => setUrl(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm font-mono"
                    />
                </div>
            }
             <div>
                <label htmlFor="itemDuration" className="block text-sm font-medium text-slate-300 mb-1">Duração</label>
                <input id="itemDuration" type="text" value={duration} onChange={e => setDuration(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm font-mono"
                />
            </div>
        </main>
        <footer className="flex justify-end gap-3 p-4 border-t border-slate-800 bg-slate-900/50">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button variant="default" onClick={handleAdd}>Adicionar Fonte</Button>
        </footer>
      </div>
    </div>
  );
};
