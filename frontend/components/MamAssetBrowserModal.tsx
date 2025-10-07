
import React, { useState, useEffect } from 'react';
import { Asset } from '../types';
import { mamService } from '../services/mamService';
import { Button } from './Button';
import { XIcon } from './icons/XIcon';
import { Spinner } from './Spinner';
import { SearchIcon } from './icons/SearchIcon';
import { FileVideoIcon } from './icons/FileVideoIcon';
import { ImageIcon } from './icons/ImageIcon';
import { MusicIcon } from './icons/MusicIcon';

interface MamAssetBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetSelect: (asset: Asset) => void;
  filterByType?: Asset['type'];
}

const AssetTypeIcon = ({ type }: { type: Asset['type']}) => {
    switch (type) {
        case 'Video': return <FileVideoIcon className="w-5 h-5 text-blue-400" />;
        case 'Image': return <ImageIcon className="w-5 h-5 text-purple-400" />;
        case 'Audio': return <MusicIcon className="w-5 h-5 text-pink-400" />;
        default: return null;
    }
}


export const MamAssetBrowserModal: React.FC<MamAssetBrowserModalProps> = ({ isOpen, onClose, onAssetSelect, filterByType }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAssets = async (query = '') => {
    setIsLoading(true);
    let fetchedAssets = await mamService.searchAssets(query);
    if (filterByType) {
        fetchedAssets = fetchedAssets.filter(a => a.type === filterByType);
    }
    setAssets(fetchedAssets);
    setIsLoading(false);
  }

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAssets(searchQuery);
  };
  
  const handleSelect = () => {
    const selectedAsset = assets.find(a => a.id === selectedAssetId);
    if (selectedAsset) {
      onAssetSelect(selectedAsset);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Vincular Recurso do MAM</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><XIcon className="w-5 h-5" /></Button>
        </header>
        <div className="p-4">
            <form onSubmit={handleSearch} className="relative mb-4">
                <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome ou tag..."
                className="w-full bg-slate-800 border border-slate-700 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="w-5 h-5 text-slate-500" />
                </div>
            </form>
        </div>
        <main className="flex-1 overflow-y-auto px-4 pb-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full"><Spinner /></div>
          ) : (
            <div className="space-y-2">
              {assets.length > 0 ? assets.map(asset => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className={`p-3 rounded-md cursor-pointer transition-colors flex items-center gap-4 border ${selectedAssetId === asset.id ? 'bg-blue-500/20 border-blue-500' : 'border-transparent hover:bg-slate-800/50'}`}
                >
                    <AssetTypeIcon type={asset.type} />
                     <div className="flex-1">
                        <p className="font-semibold text-sm text-slate-200">{asset.name}</p>
                        <p className="text-xs text-slate-400">{asset.type} - {asset.fileSize} - {asset.duration || asset.resolution}</p>
                    </div>
                </div>
              )) : (
                <div className="text-center text-slate-500 py-10">
                    <p>Nenhum recurso encontrado.</p>
                </div>
              )}
            </div>
          )}
        </main>
        <footer className="flex justify-end gap-3 p-4 border-t border-slate-800 bg-slate-900/50">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={handleSelect} disabled={!selectedAssetId}>Vincular Selecionado</Button>
        </footer>
      </div>
    </div>
  );
};
