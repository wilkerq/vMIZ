
import React, { useState, useEffect } from 'react';
import { usePlayout } from '../context/PlayoutContext';
import { Button } from '../components/Button';
import { PlayIcon } from '../components/icons/PlayIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { FolderOpenIcon } from '../components/icons/FolderOpenIcon';
import { SaveIcon } from '../components/icons/SaveIcon';
import { PlayoutItem, SourceType, SourceStatus, parseDurationToSeconds, formatSecondsToDuration } from '../types';
import { AlertTriangleIcon } from '../components/icons/AlertTriangleIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { AddSourceModal } from '../components/AddSourceModal';
import { SignalIcon } from '../components/icons/SignalIcon';
import { StreamIcon } from '../components/icons/StreamIcon';
import { FileVideoIcon } from '../components/icons/FileVideoIcon';
import { ImageIcon } from '../components/icons/ImageIcon';
import { MusicIcon } from '../components/icons/MusicIcon';
import { LoadPlaylistModal } from '../components/LoadPlaylistModal';
import { SavePlaylistModal } from '../components/SavePlaylistModal';
import { ServerIcon } from '../components/icons/ServerIcon';
import { BroadcastIcon } from '../components/icons/BroadcastIcon';

const getStatusIcon = (status: PlayoutItem['status']) => {
    switch (status) {
        case SourceStatus.OK: return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
        case SourceStatus.WARNING: return <AlertTriangleIcon className="w-4 h-4 text-yellow-500" />;
        case SourceStatus.ERROR: return <AlertTriangleIcon className="w-4 h-4 text-red-500" />;
        default: return null;
    }
};

const getTypeIcon = (type: PlayoutItem['type']) => {
    switch(type) {
        case SourceType.VIDEO: return <FileVideoIcon className="w-4 h-4 text-blue-400" />;
        case SourceType.IMAGE: return <ImageIcon className="w-4 h-4 text-purple-400" />;
        case SourceType.AUDIO: return <MusicIcon className="w-4 h-4 text-pink-400" />;
        case SourceType.NDI: return <SignalIcon className="w-4 h-4 text-teal-400" />;
        case SourceType.SDI: return <SignalIcon className="w-4 h-4 text-teal-400" />;
        case SourceType.SRT: return <StreamIcon className="w-4 h-4 text-cyan-400" />;
        case SourceType.RTMP: return <StreamIcon className="w-4 h-4 text-cyan-400" />;
        case 'GROUP_HEADER': return null;
        default: return <FileVideoIcon className="w-4 h-4 text-slate-500" />;
    }
};

const PlayoutPage: React.FC = () => {
  const { playlist, nowPlaying, nextItem, playNext, stop, addItem, targetVmix } = usePlayout();
  const [isAddSourceModalOpen, setAddSourceModalOpen] = useState(false);
  const [isLoadModalOpen, setLoadModalOpen] = useState(false);
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!nowPlaying) {
      setElapsedTime(0);
      return;
    }

    setElapsedTime(0);
    const totalDurationSeconds = parseDurationToSeconds(nowPlaying.duration);
    
    const interval = setInterval(() => {
      setElapsedTime(prev => {
        if (prev >= totalDurationSeconds) {
          clearInterval(interval);
          return totalDurationSeconds;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [nowPlaying]);

  const totalDurationSeconds = nowPlaying ? parseDurationToSeconds(nowPlaying.duration) : 0;
  const progressPercentage = totalDurationSeconds > 0 ? (elapsedTime / totalDurationSeconds) * 100 : 0;
  const timeRemainingSeconds = totalDurationSeconds - elapsedTime;
  const timeRemainingFormatted = formatSecondsToDuration(Math.max(0, timeRemainingSeconds));


  return (
    <div className="flex h-full gap-6">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">Controle de Playout</h1>
            <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                <ServerIcon className="w-4 h-4 text-slate-500" />
                <span>Destino vMix: <span className="font-semibold text-slate-300">{targetVmix.name} ({targetVmix.ip}:{targetVmix.port})</span></span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAddSourceModalOpen(true)}><PlusIcon className="w-4 h-4 mr-2" />Adicionar Fonte</Button>
            <Button variant="outline" onClick={() => setLoadModalOpen(true)}><FolderOpenIcon className="w-4 h-4 mr-2" />Carregar Playlist</Button>
            <Button variant="default" onClick={() => setSaveModalOpen(true)}><SaveIcon className="w-4 h-4 mr-2" />Salvar Playlist</Button>
          </div>
        </div>
        
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
            <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-800">
                <h2 className="text-lg font-semibold">{playlist?.name || 'Playlist Sem Título'}</h2>
            </div>
            <div className="overflow-y-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-900/50">
                        <tr>
                            <th className="px-4 py-2 text-left font-semibold w-12"></th>
                            <th className="px-4 py-2 text-left font-semibold">Nome</th>
                            <th className="px-4 py-2 text-left font-semibold w-24">Duração</th>
                            <th className="px-4 py-2 text-left font-semibold w-20">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playlist?.items.map((item, index) => (
                           <tr key={item.id} className={`border-t border-slate-800 transition-colors
                                ${nowPlaying?.id === item.id ? 'bg-red-500/20' : ''}
                                ${nextItem?.id === item.id ? 'bg-blue-500/10' : ''}
                                ${item.type === 'GROUP_HEADER' ? 'bg-slate-800 font-bold' : ''}
                           `}>
                                <td className="px-4 py-2">{getTypeIcon(item.type)}</td>
                                <td className="px-4 py-2 text-slate-200">{item.name}</td>
                                <td className="px-4 py-2 text-slate-400 font-mono">{item.duration}</td>
                                <td className="px-4 py-2 text-slate-400">{getStatusIcon(item.status)}</td>
                           </tr>
                        ))}
                    </tbody>
                </table>
                 {(!playlist || playlist.items.length === 0) && (
                    <div className="text-center py-10 text-slate-500">
                        <p>A playlist está vazia.</p>
                        <p className="text-sm">Adicione uma fonte ou carregue uma playlist para começar.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
      <div className="w-80 flex-shrink-0">
        <h2 className="text-xl font-bold mb-4">Controles</h2>
        <div className="space-y-6">
            <div className={`bg-slate-900 border ${nowPlaying ? 'border-red-500/50 animate-pulse' : 'border-slate-800'} rounded-lg p-4 transition-all duration-300`}>
                <div className="flex items-center gap-2 mb-3">
                  <BroadcastIcon className="w-5 h-5 text-red-400"/>
                  <h3 className="font-semibold text-red-400">AGORA NO AR</h3>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-md min-h-[120px] flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-xl leading-tight text-slate-100">{nowPlaying?.name || '---'}</p>
                    </div>
                    <div className="mt-2">
                        <p className="text-3xl text-slate-200 font-mono text-right">{nowPlaying ? timeRemainingFormatted : '00:00:00'}</p>
                        <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                            <div className="bg-red-500 h-1.5 rounded-full transition-all duration-1000 linear" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

             <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-blue-400">PRÓXIMO</h3>
                 <div className="bg-slate-800/50 p-4 rounded-md min-h-[90px]">
                    <p className="font-bold text-lg text-slate-200">{nextItem?.name || '---'}</p>
                    <p className="text-sm text-slate-400 font-mono mt-1">{nextItem?.duration || '00:00:00'}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-4">
                <Button variant="default" className="bg-green-600 hover:bg-green-700 col-span-2" onClick={playNext} disabled={!nextItem}>
                    <PlayIcon className="w-5 h-5 mr-2"/>
                    Tocar Próximo
                </Button>
                 <Button variant="outline" className="bg-red-600 hover:bg-red-700 border-red-500" onClick={stop}>Parar</Button>
                 <Button variant="outline">Pausar</Button>
            </div>
        </div>
      </div>
      <AddSourceModal isOpen={isAddSourceModalOpen} onClose={() => setAddSourceModalOpen(false)} onAdd={addItem} />
      <LoadPlaylistModal isOpen={isLoadModalOpen} onClose={() => setLoadModalOpen(false)} />
      <SavePlaylistModal isOpen={isSaveModalOpen} onClose={() => setSaveModalOpen(false)} />
    </div>
  );
};

export default PlayoutPage;
