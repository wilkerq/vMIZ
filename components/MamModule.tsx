
// FIX: Corrected import paths to be absolute from the project root to resolve module resolution errors.
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
// FIX: Corrected import path to be relative.
import { Spinner } from './Spinner';
// FIX: Corrected import path to be relative.
import { uploadService } from '../services/uploadService';
// FIX: Corrected import path to be relative.
import { Asset } from '../types';
// FIX: Corrected import path to be relative.
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
// FIX: Corrected import path to be relative.
import { CheckCircleIcon } from './icons/CheckCircleIcon';
// FIX: Corrected import path to be relative.
import { TrashIcon } from './icons/TrashIcon';
// FIX: Corrected import path to be relative.
import { PlusCircleIcon } from './icons/PlusCircleIcon';
// FIX: Corrected import path to be relative.
import { ListIcon } from './icons/ListIcon';
// FIX: Corrected import path to be relative.
import { Button } from './Button';
// FIX: Corrected import path to be relative.
import { AssetPreview } from './AssetPreview';
// FIX: Corrected import path to be relative.
import { mamService } from '../services/mamService';
// FIX: Corrected import path to be relative.
import { SearchIcon } from './icons/SearchIcon';
// FIX: Corrected import path to be relative.
import { FileVideoIcon } from './icons/FileVideoIcon';
// FIX: Corrected import path to be relative.
import { ImageIcon } from './icons/ImageIcon';
// FIX: Corrected import path to be relative.
import { MusicIcon } from './icons/MusicIcon';


const AssetTypeIcon = ({ type }: { type: Asset['type']}) => {
    switch (type) {
        case 'Video': return <FileVideoIcon className="w-5 h-5 text-blue-400" />;
        case 'Image': return <ImageIcon className="w-5 h-5 text-purple-400" />;
        case 'Audio': return <MusicIcon className="w-5 h-5 text-pink-400" />;
        default: return null;
    }
}

export const MamModule: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAssets = async (query = '') => {
    setIsLoading(true);
    const fetchedAssets = await mamService.searchAssets(query);
    setAssets(fetchedAssets);
    setIsLoading(false);
  }

  React.useEffect(() => {
    fetchAssets();
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAssets(searchQuery);
  };


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
        setIsLoading(true);
        for (const file of acceptedFiles) {
            await uploadService.upload(file);
        }
        await fetchAssets();
    },
    accept: {
        'video/*': ['.mp4', '.mov', '.mkv'],
        'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
        'audio/*': ['.mp3', '.wav']
    }
  });

  return (
    <div className="flex h-[calc(100vh-150px)] gap-6">
      <div className="w-1/3 flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Biblioteca de Mídia</h2>
            <Button variant="default" onClick={() => getRootProps().onClick}>
                <PlusCircleIcon className="w-4 h-4 mr-2"/>
                Carregar
            </Button>
        </div>
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
        <div 
          {...getRootProps()} 
          className={`flex-1 bg-slate-900 border-2 ${isDragActive ? 'border-blue-500' : 'border-slate-800'} border-dashed rounded-lg overflow-y-auto p-2 transition-colors`}
        >
          <input {...getInputProps()} />
          {isLoading ? (
            <div className="flex justify-center items-center h-full"><Spinner /></div>
          ) : (
             <div className="space-y-2">
                {assets.length === 0 ? (
                     <div className="text-center text-slate-500 py-10">
                        <p>Nenhum recurso encontrado.</p>
                        <p className="text-sm">Arraste e solte arquivos aqui para carregar.</p>
                    </div>
                ) : assets.map(asset => (
                    <div 
                        key={asset.id} 
                        onClick={() => setSelectedAsset(asset)}
                        className={`p-3 rounded-md cursor-pointer transition-colors flex items-center gap-4 ${selectedAsset?.id === asset.id ? 'bg-blue-500/10' : 'hover:bg-slate-800/50'}`}
                    >
                        <AssetTypeIcon type={asset.type} />
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-slate-200">{asset.name}</p>
                            <p className="text-xs text-slate-400">{asset.type} - {asset.fileSize}</p>
                        </div>
                    </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <div className="w-2/3">
        {selectedAsset ? (
            <AssetPreview asset={selectedAsset} />
        ) : (
            <div className="flex justify-center items-center h-full bg-slate-900 border border-slate-800 rounded-lg">
                <div className="text-center text-slate-500">
                    <ListIcon className="w-12 h-12 mx-auto mb-2" />
                    <p>Selecione um recurso para ver os detalhes</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
