
import React, { useState, useEffect } from 'react';
import { useJournalism } from '../../context/JournalismContext';
import { Story, Asset } from '../../types';
import { Button } from '../../components/Button';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { SearchIcon } from '../../components/icons/SearchIcon';
import { Spinner } from '../../components/Spinner';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { LinkIcon } from '../../components/icons/LinkIcon';
import { MamAssetBrowserModal } from '../../components/MamAssetBrowserModal';

// A basic Rich Text Editor placeholder. Replace with a real one like TipTap or Quill.
// FIX: Added explicit types to prevent type errors.
const RichTextEditor: React.FC<{ value: string; onChange: (value: string) => void; }> = ({ value, onChange }) => (
    <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-full bg-slate-800 border border-slate-700 rounded-md p-4 text-base font-serif leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
);

const StoryEditorPage: React.FC = () => {
    const { stories, createStory, saveStory, deleteStory, isLoading: isJournalismLoading } = useJournalism();
    const [activeStory, setActiveStory] = useState<Story | null>(null);
    const [filteredStories, setFilteredStories] = useState<Story[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLinkingAsset, setIsLinkingAsset] = useState(false);


    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        setFilteredStories(stories.filter(s => s.title.toLowerCase().includes(lowercasedQuery)));
    }, [searchQuery, stories]);
    
    useEffect(() => {
      // If the active story is deleted or the stories list changes, update it
      if (activeStory && !stories.find(s => s.id === activeStory.id)) {
        setActiveStory(null);
      }
    }, [stories, activeStory]);


    const handleCreateStory = async () => {
        const newStory = await createStory('Lauda Sem Título');
        if (newStory) {
            setActiveStory(newStory);
        }
    };

    const handleDeleteStory = async () => {
        if (activeStory && window.confirm(`Tem certeza que deseja excluir a lauda "${activeStory.title}"?`)) {
            await deleteStory(activeStory.id);
            setActiveStory(null);
        }
    };
    
    const handleSaveStory = () => {
      if (activeStory) {
        saveStory(activeStory);
      }
    };

    const handleUpdateActiveStory = (field: keyof Story, value: any) => {
        if (activeStory) {
            setActiveStory(prev => prev ? { ...prev, [field]: value } : null);
        }
    };
    
    const handleAssetSelect = (asset: Asset) => {
        if (!activeStory) return;
        const newAssetLink = { id: asset.id, name: asset.name, type: asset.type };
        const updatedAssets = [...(activeStory.linkedAssets || []), newAssetLink];
        handleUpdateActiveStory('linkedAssets', updatedAssets);
        setIsLinkingAsset(false);
    };

    const handleUnlinkAsset = (assetId: string) => {
        if (!activeStory) return;
        const updatedAssets = activeStory.linkedAssets?.filter(a => a.id !== assetId);
        handleUpdateActiveStory('linkedAssets', updatedAssets);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Editor de Laudas</h1>
                <p className="text-slate-400 mt-1">
                    Crie, gerencie e escreva o conteúdo de todas as suas matérias aqui.
                </p>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Story List Panel */}
                <div className="w-1/3 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">Todas as Laudas</h2>
                        <Button variant="default" size="sm" onClick={handleCreateStory}><PlusIcon className="w-4 h-4 mr-1"/> Nova Lauda</Button>
                    </div>
                    <div className="relative mb-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar laudas..."
                            className="w-full bg-slate-800 border-slate-700 rounded-md pl-9 pr-3 py-1.5 text-sm"
                        />
                        <SearchIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"/>
                    </div>
                    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-md overflow-y-auto">
                        {isJournalismLoading ? <Spinner /> : (
                            <div className="p-2 space-y-1">
                                {filteredStories.length > 0 ? filteredStories.map(story => (
                                    <div key={story.id} onClick={() => setActiveStory(story)}
                                        className={`p-2 rounded-md cursor-pointer ${activeStory?.id === story.id ? 'bg-blue-500/10' : 'hover:bg-slate-800/50'}`}
                                    >
                                        <p className="font-medium text-sm truncate text-slate-200">{story.title}</p>
                                        <p className="text-xs text-slate-400">{story.status}</p>
                                    </div>
                                )) : (
                                    <p className="text-center text-sm text-slate-500 p-4">Nenhuma lauda encontrada.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Editor Panel */}
                <div className="w-2/3 flex flex-col bg-slate-900 border border-slate-800 rounded-md">
                    {activeStory ? (
                        <>
                            <header className="p-4 border-b border-slate-800 space-y-3">
                                <input 
                                    type="text"
                                    value={activeStory.title}
                                    onChange={(e) => handleUpdateActiveStory('title', e.target.value)}
                                    className="w-full bg-transparent text-2xl font-bold focus:outline-none"
                                />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="storyStatus" className="text-sm font-medium text-slate-400">Status:</label>
                                        <select id="storyStatus" value={activeStory.status} onChange={e => handleUpdateActiveStory('status', e.target.value as Story['status'])} className="bg-slate-800 border-slate-700 rounded-md text-sm py-1">
                                            <option value="RASCUNHO">Rascunho</option>
                                            <option value="ESCREVENDO">Escrevendo</option>
                                            <option value="APROVADO">Aprovado</option>
                                            <option value="PRONTO">Pronto</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={handleDeleteStory}><TrashIcon className="w-4 h-4"/></Button>
                                        <Button variant="default" size="sm" onClick={handleSaveStory}>Salvar Lauda</Button>
                                    </div>
                                </div>
                            </header>
                            <main className="flex-1 flex overflow-hidden">
                                <div className="w-2/3 p-4 overflow-y-auto">
                                   <RichTextEditor value={activeStory.script} onChange={(content) => handleUpdateActiveStory('script', content)} />
                                </div>
                                <div className="w-1/3 border-l border-slate-800 p-4 overflow-y-auto">
                                    <h3 className="font-semibold mb-3">Mídia Vinculada</h3>
                                    <div className="space-y-2">
                                        {activeStory.linkedAssets?.map(asset => (
                                            <div key={asset.id} className="bg-slate-800/50 p-2 rounded-md flex justify-between items-center text-sm">
                                               <span className="truncate">{asset.name}</span>
                                               <button onClick={() => handleUnlinkAsset(asset.id)} className="text-slate-500 hover:text-red-400"><TrashIcon className="w-3 h-3"/></button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setIsLinkingAsset(true)}>
                                        <LinkIcon className="w-4 h-4 mr-2"/> Vincular Mídia do MAM
                                    </Button>
                                </div>
                            </main>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500">
                            <p>Selecione uma lauda para começar a editar.</p>
                        </div>
                    )}
                </div>
            </div>
            <MamAssetBrowserModal 
                isOpen={isLinkingAsset}
                onClose={() => setIsLinkingAsset(false)}
                onAssetSelect={handleAssetSelect}
            />
        </div>
    );
};

export default StoryEditorPage;
