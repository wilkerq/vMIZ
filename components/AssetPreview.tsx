import React from 'react';
import { Asset } from 'types';

export const AssetPreview: React.FC<{ asset: Asset }> = ({ asset }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg h-full flex flex-col">
      <div className="aspect-video bg-black flex items-center justify-center">
         {asset.type === 'Video' && <video src={asset.url} controls className="w-full h-full" />}
         {asset.type === 'Image' && <img src={asset.url} alt={asset.name} className="max-w-full max-h-full object-contain" />}
         {asset.type === 'Audio' && <audio src={asset.url} controls className="w-full" />}
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4">{asset.name}</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
                <p className="text-slate-400">Tipo</p>
                <p className="text-slate-200 font-medium">{asset.type}</p>
            </div>
             <div>
                <p className="text-slate-400">Tamanho do Arquivo</p>
                <p className="text-slate-200 font-medium">{asset.fileSize}</p>
            </div>
             <div>
                <p className="text-slate-400">Data de Upload</p>
                <p className="text-slate-200 font-medium">{asset.uploadDate}</p>
            </div>
            {asset.duration && (
                 <div>
                    <p className="text-slate-400">Duração</p>
                    <p className="text-slate-200 font-medium font-mono">{asset.duration}</p>
                </div>
            )}
             {asset.resolution && (
                 <div>
                    <p className="text-slate-400">Resolução</p>
                    <p className="text-slate-200 font-medium">{asset.resolution}</p>
                </div>
            )}
            {asset.codec && (
                 <div>
                    <p className="text-slate-400">Codec</p>
                    <p className="text-slate-200 font-medium">{asset.codec}</p>
                </div>
            )}
            <div className="col-span-2">
                <p className="text-slate-400">Tags</p>
                <div className="flex flex-wrap gap-2 mt-1">
                    {asset.tags.map(tag => (
                        <span key={tag} className="bg-blue-500/10 text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};