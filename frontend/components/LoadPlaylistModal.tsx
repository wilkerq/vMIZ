
import React, { useState, useEffect } from 'react';
import { Playlist } from '../types';
import { playlistService } from '../services/playlistService';
import { usePlayout } from '../context/PlayoutContext';
import { Button } from './Button';
import { XIcon } from './icons/XIcon';
import { Spinner } from './Spinner';

interface LoadPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoadPlaylistModal: React.FC<LoadPlaylistModalProps> = ({ isOpen, onClose }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const { loadPlaylist } = usePlayout();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      playlistService.getAllPlaylists().then(data => {
        setPlaylists(data);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  const handleLoad = () => {
    if (selectedPlaylistId) {
      loadPlaylist(selectedPlaylistId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl w-full max-w-md">
        <header className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Carregar Playlist</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><XIcon className="w-5 h-5" /></Button>
        </header>
        <main className="p-6 h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full"><Spinner /></div>
          ) : (
            <div className="space-y-2">
              {playlists.length > 0 ? playlists.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlaylistId(p.id)}
                  className={`p-3 rounded-md cursor-pointer transition-colors border ${selectedPlaylistId === p.id ? 'bg-blue-500/20 border-blue-500' : 'border-transparent hover:bg-slate-800/50'}`}
                >
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.items.length} itens - Duração Total: {p.totalDuration}</p>
                </div>
              )) : (
                 <p className="text-slate-500 text-center pt-10">Nenhuma playlist salva encontrada.</p>
              )}
            </div>
          )}
        </main>
        <footer className="flex justify-end gap-3 p-4 border-t border-slate-800 bg-slate-900/50">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={handleLoad} disabled={!selectedPlaylistId}>Carregar</Button>
        </footer>
      </div>
    </div>
  );
};
