
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Rundown, RundownItem, Story, NewsProgram, PlayoutItem, SourceType, SourceStatus, RundownItemStatus, RundownItemType, Asset, formatSecondsToDuration, parseDurationToSeconds } from '../types';
import { useSettings } from './SettingsContext';
import { journalismService } from '../services/journalismService';
import { usePlayout } from './PlayoutContext';
import { useApp } from './AppContext';
import { mamService } from '../services/mamService';

interface JournalismContextType {
  programs: NewsProgram[];
  rundowns: Rundown[];
  stories: Story[];
  activeRundown: Rundown | null;
  isLoading: boolean;
  setActiveRundownId: (id: string | null) => void;
  updateRundownItem: (itemId: string, updates: Partial<RundownItem>) => Promise<void>;
  updateRundown: (updates: Partial<Rundown>) => Promise<void>;
  getStory: (storyId: string) => Story | undefined;
  saveStory: (story: Story) => Promise<void>;
  createRundown: (programId: string, date: string, title: string) => Promise<void>;
  deleteRundown: (id: string) => Promise<void>;
  createStory: (title: string, linkToItemId?: string) => Promise<Story | undefined>;
  deleteStory: (storyId: string) => Promise<void>;
  addRundownItem: (type: RundownItem['type'], slug: string) => Promise<void>;
  deleteRundownItem: (itemId: string) => Promise<void>;
  insertRundownItem: (index: number, item: RundownItem) => Promise<void>;
  sendToPlayout: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const JournalismContext = createContext<JournalismContextType | undefined>(undefined);

export const JournalismProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [programs, setPrograms] = useState<NewsProgram[]>([]);
  const [rundowns, setRundowns] = useState<Rundown[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeRundownId, setActiveRundownId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { settings } = useSettings();
  const { loadPlaylistFromData } = usePlayout();
  const { setCurrentPage } = useApp();

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [loadedPrograms, loadedRundowns, loadedStories] = await Promise.all([
        journalismService.getPrograms(),
        journalismService.getRundowns(),
        journalismService.getStories()
      ]);
      setPrograms(loadedPrograms);
      setRundowns(loadedRundowns);
      setStories(loadedStories);
      if (loadedRundowns.length > 0 && !activeRundownId) {
        setActiveRundownId(loadedRundowns[0].id);
      } else if (loadedRundowns.length === 0) {
        setActiveRundownId(null);
      }
    } catch (error) {
        console.error("Falha ao atualizar dados de jornalismo:", error);
    } finally {
        setIsLoading(false);
    }
  }, [activeRundownId]);

  useEffect(() => {
    refreshData();
  }, []);
  
  const activeRundown = rundowns.find(r => r.id === activeRundownId) || null;

  const createRundown = async (programId: string, date: string, title: string) => {
    const program = programs.find(p => p.id === programId);
    if (!program) throw new Error("Programa não encontrado");

    const newRundownData: Rundown = {
        id: `run_${Date.now()}`,
        programId, date, title, items: [],
        startTime: program.defaultStartTime,
        estimatedTotalDuration: program.defaultDuration,
        status: 'RASCUNHO'
    };
    const newRundown = await journalismService.createRundown(newRundownData);
    await refreshData();
    setActiveRundownId(newRundown.id);
  };

  const deleteRundown = async (id: string) => {
    await journalismService.deleteRundown(id);
    const remaining = rundowns.filter(r => r.id !== id);
    setRundowns(remaining);
    if (activeRundownId === id) {
      setActiveRundownId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const getStory = (storyId: string): Story | undefined => stories.find(s => s.id === storyId);
  
  const saveStory = async (story: Story) => {
    await journalismService.saveStory(story);
    await refreshData();
  };
  
  const createStory = async (title: string, linkToItemId?: string): Promise<Story | undefined> => {
      const newStoryData: Story = {
          id: `story_${Date.now()}`,
          title,
          script: `<h1>${title}</h1><p>Comece a escrever aqui...</p>`,
          status: 'RASCUNHO',
          estimatedScriptDuration: '00:00:00',
          linkedAssets: [],
      };
      const newStory = await journalismService.createStory(newStoryData);
      
      if (linkToItemId && activeRundown) {
          const newItems = activeRundown.items.map(item =>
              item.id === linkToItemId ? { ...item, storyId: newStory.id } : item
          );
          await updateRundown({ items: newItems });
      } else {
        await refreshData();
      }
      return newStory;
  };

  const deleteStory = async (storyId: string) => {
      await journalismService.deleteStory(storyId);
      // Desvincular de quaisquer espelhos
      for (const r of rundowns) {
          const needsUpdate = r.items.some(item => item.storyId === storyId);
          if (needsUpdate) {
              const newItems = r.items.map(item => {
                  if (item.storyId === storyId) {
                      const { storyId, ...rest } = item;
                      return rest as RundownItem;
                  }
                  return item;
              });
              await journalismService.saveRundown({ ...r, items: newItems });
          }
      }
      await refreshData();
  };

  const updateRundown = async (updates: Partial<Rundown>) => {
      if (!activeRundown) return;
      let updatedRundown = { ...activeRundown, ...updates };
      
      if (updates.items) {
          const totalSeconds = updates.items.reduce((acc, item) => acc + parseDurationToSeconds(item.estimatedDuration), 0);
          updatedRundown.estimatedTotalDuration = formatSecondsToDuration(totalSeconds);
      }
      
      await journalismService.saveRundown(updatedRundown);
      await refreshData();
  };
  
  const updateRundownItem = async (itemId: string, updates: Partial<RundownItem>) => {
    if (!activeRundown) return;
    const newItems = activeRundown.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    await updateRundown({ items: newItems });
  };

  const addRundownItem = async (type: RundownItem['type'], slug: string) => {
    if (!activeRundown) return;
    const newItem: RundownItem = {
      id: `item_${Date.now()}`,
      type, slug,
      estimatedDuration: type === 'MATÉRIA' ? '00:01:00' : '00:00:30',
      status: RundownItemStatus.DRAFT,
    };
    await updateRundown({ items: [...activeRundown.items, newItem] });
  };
  
  const deleteRundownItem = async (itemId: string) => {
    if (!activeRundown) return;
    await updateRundown({ items: activeRundown.items.filter(item => item.id !== itemId) });
  };
  
  const insertRundownItem = async (index: number, item: RundownItem) => {
      if (!activeRundown) return;
      const newItems = [...activeRundown.items];
      newItems.splice(index, 0, item);
      await updateRundown({ items: newItems });
  };

  const sendToPlayout = async () => {
    if (!activeRundown) return;
    
    const allAssets: Asset[] = await mamService.searchAssets('');
    const assetMap = new Map(allAssets.map(asset => [asset.id, asset]));

    const playoutItems: PlayoutItem[] = [];

    for (const item of activeRundown.items) {
      if (item.type === RundownItemType.VT && item.linkedAssetId) {
        const asset = assetMap.get(item.linkedAssetId);
        if (asset) {
          playoutItems.push({
            id: `playout_${item.id}`, name: asset.name, type: SourceType.VIDEO,
            duration: item.estimatedDuration, status: SourceStatus.OK, url: asset.url,
            inPoint: asset.inPoint, outPoint: asset.outPoint, graphicsEvents: asset.graphicsEvents
          });
        } else {
           playoutItems.push({ id: `playout_missing_${item.id}`, name: `FALTANDO: ${item.slug}`, type: SourceType.VIDEO, duration: item.estimatedDuration, status: SourceStatus.ERROR });
        }
      } else if (item.type === RundownItemType.COMMERCIAL) {
          playoutItems.push({ id: `playout_${item.id}`, name: item.slug, type: 'GROUP_HEADER', duration: item.estimatedDuration, status: SourceStatus.OK });
      }
    }
    
    const program = programs.find(p => p.id === activeRundown.programId);
    const targetVmix = {
        name: program?.name || 'Playout Principal (Padrão)',
        ip: program?.vMixIpAddress || settings.vMixIpAddress,
        port: program?.vMixPort || settings.vMixPort
    };
    
    loadPlaylistFromData(activeRundown.title, playoutItems, targetVmix);
    setCurrentPage('playout');
  };

  const value = {
    programs, rundowns, stories, activeRundown, isLoading, setActiveRundownId,
    updateRundownItem, updateRundown, getStory, saveStory, createRundown, deleteRundown,
    createStory, deleteStory, addRundownItem, deleteRundownItem, insertRundownItem,
    sendToPlayout, refreshData
  };

  return <JournalismContext.Provider value={value}>{children}</JournalismContext.Provider>;
};

export const useJournalism = () => {
  const context = useContext(JournalismContext);
  if (context === undefined) {
    throw new Error('useJournalism deve ser usado dentro de um JournalismProvider');
  }
  return context;
};
