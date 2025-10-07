import React from 'react';
import { RundownList } from 'components/journalism/RundownList';
import { RundownEditor } from 'components/journalism/RundownEditor';
import { useJournalism } from 'context/JournalismContext';
import { Spinner } from 'components/Spinner';

const RundownPage: React.FC = () => {
    const { isLoading } = useJournalism();

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Spinner /></div>;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Gerenciador de Espelhos</h1>
                <p className="text-slate-400 mt-1">
                    Crie, organize e gerencie os espelhos para seus programas de notícias.
                </p>
            </div>
            <div className="flex-1 flex gap-6 overflow-hidden">
                <RundownList />
                <RundownEditor />
            </div>
        </div>
    );
};

export default RundownPage;