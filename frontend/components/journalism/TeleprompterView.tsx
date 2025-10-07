
import React from 'react';
import { Story } from '../../types';
import { Button } from '../Button';
import { PrintIcon } from '../icons/PrintIcon';

interface TeleprompterViewProps {
  story: Story;
}

export const TeleprompterView: React.FC<TeleprompterViewProps> = ({ story }) => {
    const handlePrint = () => {
        window.print();
    }
  return (
    <div className="p-8 bg-slate-950 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 no-print">
            <h1 className="text-2xl font-bold text-slate-200">{story.title}</h1>
            <Button variant="outline" onClick={handlePrint}><PrintIcon className="w-4 h-4 mr-2" /> Imprimir Roteiro</Button>
        </div>
        <div 
            className="teleprompter-print-view printable-area flex-1 overflow-y-auto p-4 bg-slate-900 border border-slate-800 rounded-md prose prose-invert prose-lg max-w-none prose-p:my-2 prose-h1:mb-4 prose-h1:text-3xl"
            dangerouslySetInnerHTML={{ __html: story.script }}
        />
    </div>
  );
};
