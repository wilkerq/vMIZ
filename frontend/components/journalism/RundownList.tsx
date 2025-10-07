
import React, { useState } from 'react';
import { useJournalism } from '../../context/JournalismContext';
import { Button } from '../Button';
import { PlusIcon } from '../icons/PlusIcon';
import { NewRundownModal } from './NewRundownModal';
import { format, parseISO } from 'date-fns';

export const RundownList: React.FC = () => {
    const { rundowns, activeRundown, setActiveRundownId, programs } = useJournalism();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getProgramName = (programId: string) => {
        return programs.find(p => p.id === programId)?.name || 'Desconhecido';
    };

    return (
        <div className="w-80 flex-shrink-0 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Espelhos</h2>
                <Button variant="default" size="sm" onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="w-4 h-4 mr-1"/>
                    Novo Espelho
                </Button>
            </div>
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg overflow-y-auto">
                <div className="space-y-1 p-2">
                    {rundowns.map(r => (
                        <div key={r.id}
                            onClick={() => setActiveRundownId(r.id)}
                            className={`p-3 rounded-md cursor-pointer transition-colors ${activeRundown?.id === r.id ? 'bg-blue-500/10' : 'hover:bg-slate-800/50'}`}
                        >
                            <p className="font-semibold text-sm text-slate-200">{r.title}</p>
                            <div className="text-xs text-slate-400 mt-1 flex justify-between items-center">
                                <span>{getProgramName(r.programId)}</span>
                                <span>{format(parseISO(r.date), "dd/MM/yyyy")}</span>
                                <span>{r.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <NewRundownModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};
