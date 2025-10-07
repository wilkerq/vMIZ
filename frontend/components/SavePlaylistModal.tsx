
import React, { useState } from 'react';
import { usePlayout } from '../context/PlayoutContext';
import { Button } from './Button';
import { XIcon } from './icons/XIcon';

interface SavePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavePlaylistModal: React.FC<SavePlaylistModalProps> = ({ isOpen, onClose }) => {
  const { playlist, savePlaylist } = usePlayout();
  const [playlistName, setPlaylistName] = useState(playlist?.name || '');

  const handleSave = () => {
    if (playlistName) {
      savePlaylist(playlistName);
      onClose();
    }
  };
  
  React.useEffect(() => {
    if(isOpen) {
        setPlaylistName(playlist?.name || `Playlist ${new Date().toLocaleDateString()}`);
    }
  }, [isOpen, playlist?.name])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl w-full max-w-md">
        <header className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Salvar Playlist</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><XIcon className="w-5 h-5" /></Button>
        </header>
        <main className="p-6 space-y-4">
          <div>
            <label htmlFor="playlistName" className="block text-sm font-medium text-slate-300 mb-1">Nome da Playlist</label>
            <input
              id="playlistName"
              type="text"
              value={playlistName}
              onChange={e => setPlaylistName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </main>
        <footer className="flex justify-end gap-3 p-4 border-t border-slate-800 bg-slate-900/50">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={handleSave} disabled={!playlistName}>Salvar</Button>
        </footer>
      </div>
    </div>
  );
};
