
import React, { useState } from 'react';
import { useJournalism } from '../../context/JournalismContext';
import { RundownItem, RundownItemStatus, RundownItemType, Story, parseDurationToSeconds, formatSecondsToTime, formatSecondsToDuration, addDurations } from '../../types';
import { Button } from '../Button';
import { PlusIcon } from '../icons/PlusIcon';
import { SendIcon } from '../icons/SendIcon';
import { TvIcon } from '../icons/TvIcon';
import { StoryEditorModal } from './StoryEditorModal';
import { useContextMenu } from '../../context/ContextMenuContext';
import { MamAssetBrowserModal } from '../MamAssetBrowserModal';

const getStatusColor = (status: RundownItemStatus) => {
    switch (status) {
        case RundownItemStatus.READY: return 'text-green-400 bg-green-900/50';
        case RundownItemStatus.ON_AIR: return 'text-red-400 bg-red-900/50 animate-pulse';
        case RundownItemStatus.DONE: return 'text-slate-500 bg-slate-800';
        case RundownItemStatus.HOLD: return 'text-yellow-400 bg-yellow-900/50';
        default: return 'text-blue-400 bg-blue-900/50';
    }
}

export const RundownEditor: React.FC = () => {
    const { activeRundown, getStory, updateRundownItem, deleteRundownItem, createStory, addRundownItem, sendToPlayout, insertRundownItem } = useJournalism();
    const [editingStory, setEditingStory] = useState<Story | null>(null);
    const [linkingAssetItemId, setLinkingAssetItemId] = useState<string | null>(null);

    const { showContextMenu } = useContextMenu();

    const handleCreateAndLinkStory = async (itemId: string) => {
        const item = activeRundown?.items.find(i => i.id === itemId);
        if (!item) return;
        const newStory = await createStory(item.slug, itemId);
        if (newStory) {
            setEditingStory(newStory);
        }
    };

    const handleContextMenu = (e: React.MouseEvent, item: RundownItem, index: number) => {
        e.preventDefault();
        const story = item.storyId ? getStory(item.storyId) : null;
        const menuItems = [
            ...(story ? [{ label: 'Editar Lauda', action: () => setEditingStory(story) }] : [{ label: 'Criar Nova Lauda', action: () => handleCreateAndLinkStory(item.id) }]),
            ...(item.type === 'VT' ? [
                { label: 'Vincular VT do MAM', action: () => setLinkingAssetItemId(item.id) },
                 ...(item.linkedAssetId ? [{ label: 'Desvincular VT', action: () => updateRundownItem(item.id, { linkedAssetId: undefined, linkedAssetName: undefined }) }] : [])
            ] : []),
            { type: 'divider' },
            { label: 'Definir Status', subMenu: Object.values(RundownItemStatus).map(status => ({
                label: status,
                action: () => updateRundownItem(item.id, { status })
            }))},
            { type: 'divider' },
            { label: 'Inserir Item Acima', action: () => insertRundownItem(index, { ...item, id: `item_${Date.now()}`, slug: 'NOVO ITEM' }) },
            { label: 'Inserir Item Abaixo', action: () => insertRundownItem(index + 1, { ...item, id: `item_${Date.now()}`, slug: 'NOVO ITEM' }) },
            { type: 'divider' },
            { label: 'Excluir Item', action: () => deleteRundownItem(item.id), className: 'text-red-400' },
        ];
        showContextMenu(e, menuItems);
    }
    
    if (!activeRundown) {
        return <div className="flex-1 flex items-center justify-center text-slate-500">Selecione um espelho para começar.</div>;
    }
    
    const calculateTimings = () => {
        let runningTime = parseDurationToSeconds(activeRundown.startTime);
        return activeRundown.items.map(item => {
            const itemDurationSec = parseDurationToSeconds(item.estimatedDuration);
            const startTime = formatSecondsToTime(runningTime);
            runningTime += itemDurationSec;
            const endTime = formatSecondsToTime(runningTime);
            return { itemId: item.id, startTime, endTime };
        });
    };
    
    const timings = calculateTimings();
    
    const onAirItem = activeRundown.items.find(i => i.status === RundownItemStatus.ON_AIR);
    let timeRemaining = activeRundown.estimatedTotalDuration;
    if (onAirItem) {
        const onAirIndex = activeRundown.items.findIndex(i => i.id === onAirItem.id);
        const remainingItems = activeRundown.items.slice(onAirIndex + 1);
        const remainingSeconds = remainingItems.reduce((acc, item) => acc + parseDurationToSeconds(item.estimatedDuration), 0);
        timeRemaining = formatSecondsToDuration(remainingSeconds);
    }


    return (
        <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <header className="px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">{activeRundown.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-slate-400 font-mono">
                        <span>Início: {activeRundown.startTime}</span>
                        <span>Duração: {activeRundown.estimatedTotalDuration}</span>
                        <span>Restante: {timeRemaining}</span>
                        <span>Fim: {addDurations(activeRundown.startTime, activeRundown.estimatedTotalDuration)}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><TvIcon className="w-4 h-4 mr-2"/> Teleprompter</Button>
                    <Button variant="default" onClick={sendToPlayout}><SendIcon className="w-4 h-4 mr-2"/> Enviar para Playout</Button>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-slate-900/80 backdrop-blur-sm">
                        <tr>
                            <th className="px-3 py-2 text-left font-semibold w-10">#</th>
                            <th className="px-3 py-2 text-left font-semibold">TIPO</th>
                            <th className="px-3 py-2 text-left font-semibold">SLUG</th>
                            <th className="px-3 py-2 text-left font-semibold">APRES.</th>
                            <th className="px-3 py-2 text-left font-semibold">CÂM</th>
                            <th className="px-3 py-2 text-left font-semibold">INÍCIO</th>
                            <th className="px-3 py-2 text-left font-semibold">FIM</th>
                            <th className="px-3 py-2 text-left font-semibold">DUR. EST.</th>
                            <th className="px-3 py-2 text-left font-semibold">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeRundown.items.map((item, index) => {
                             const story = item.storyId ? getStory(item.storyId) : null;
                             const timing = timings.find(t => t.itemId === item.id);
                            return (
                                <tr key={item.id} className="border-t border-slate-800 hover:bg-slate-800/50" onContextMenu={(e) => handleContextMenu(e, item, index)}>
                                    <td className="px-3 py-2 text-slate-500">{index + 1}</td>
                                    <td className="px-3 py-2 font-semibold text-slate-400">{item.type}</td>
                                    <td className="px-3 py-2">
                                        <p className="font-semibold text-slate-200">{item.slug}</p>
                                        {(story || item.linkedAssetName) && <p className="text-xs text-blue-400">{story?.title || item.linkedAssetName}</p>}
                                    </td>
                                    <td className="px-3 py-2">{item.talent}</td>
                                    <td className="px-3 py-2">{item.camera}</td>
                                    <td className="px-3 py-2 font-mono text-slate-400">{timing?.startTime}</td>
                                    <td className="px-3 py-2 font-mono text-slate-400">{timing?.endTime}</td>
                                    <td className="px-3 py-2 font-mono">{item.estimatedDuration}</td>
                                    <td className="px-3 py-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>{item.status}</span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <footer className="px-4 py-2 border-t border-slate-800 flex items-center gap-2">
                <span className="text-sm font-semibold mr-2">Adicionar Item:</span>
                <Button variant="outline" size="sm" onClick={() => addRundownItem(RundownItemType.STORY, 'NOVA MATÉRIA')}>Matéria</Button>
                <Button variant="outline" size="sm" onClick={() => addRundownItem(RundownItemType.LIVE, 'AO VIVO')}>Vivo</Button>
                <Button variant="outline" size="sm" onClick={() => addRundownItem(RundownItemType.VT, 'VT')}>VT</Button>
                <Button variant="outline" size="sm" onClick={() => addRundownItem(RundownItemType.GRAPHIC, 'GC')}>GC</Button>
                <Button variant="outline" size="sm" onClick={() => addRundownItem(RundownItemType.COMMERCIAL, 'BLOCO COMERCIAL')}>Comercial</Button>
            </footer>
            {editingStory && <StoryEditorModal story={editingStory} onClose={() => setEditingStory(null)} />}
            {linkingAssetItemId && <MamAssetBrowserModal 
                isOpen={!!linkingAssetItemId} 
                onClose={() => setLinkingAssetItemId(null)}
                filterByType="Video"
                onAssetSelect={(asset) => {
                    updateRundownItem(linkingAssetItemId, { linkedAssetId: asset.id, linkedAssetName: asset.name, estimatedDuration: asset.duration || '00:00:00' });
                    setLinkingAssetItemId(null);
                }}
            />}
        </div>
    );
};
