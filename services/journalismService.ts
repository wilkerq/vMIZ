import { NewsProgram, Rundown, RundownItemStatus, RundownItemType, Story } from '../types';

const PROGRAMS_KEY = 'journalism_programs';
const RUNDOWNS_KEY = 'journalism_rundowns';
const STORIES_KEY = 'journalism_stories';

const getInitialData = () => {
    const today = new Date().toISOString().split('T')[0];
    const initialStories: Story[] = [
        { id: 'story1', title: 'CORRUPÇÃO NA PREFEITURA', script: '<h1>CORRUPÇÃO NA PREFEITURA</h1><p>Fontes de dentro da prefeitura revelaram um possível escândalo de corrupção em andamento...</p><p><b>APRESENTADOR:</b> Vamos agora ao vivo com nosso repórter na cena.</p>', status: 'PRONTO', estimatedScriptDuration: '00:00:15', linkedAssets: [] }
    ];
    const initialRundowns: Rundown[] = [
        {
          id: 'run1', programId: 'prog2', date: today, title: `Jornal da Noite - ${today}`,
          items: [
            { id: 'item1', type: RundownItemType.OPENER, slug: 'ABERTURA FRIA', estimatedDuration: '00:01:30', status: RundownItemStatus.READY },
            { id: 'item2', type: RundownItemType.STORY, slug: 'CORRUPÇÃO PREFEITURA', talent: 'Anna', camera: '1', estimatedDuration: '00:02:45', status: RundownItemStatus.READY, storyId: 'story1' },
          ],
          startTime: '19:00:00', estimatedTotalDuration: '00:26:30', status: 'PRONTO'
        }
    ];
    const initialPrograms: NewsProgram[] = [
        { id: 'prog1', name: 'Jornal da Manhã', defaultStartTime: '07:00:00', defaultDuration: '00:56:30', vMixIpAddress: '192.168.1.101', vMixPort: 8088 },
        { id: 'prog2', name: 'Jornal da Noite', defaultStartTime: '19:00:00', defaultDuration: '00:26:30' },
    ];
    return { initialPrograms, initialRundowns, initialStories };
};

const getFromStorage = <T,>(key: string, initialData: T[]): T[] => {
    try {
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
        localStorage.setItem(key, JSON.stringify(initialData));
        return initialData;
    } catch (e) {
        console.error(`Failed to read ${key} from storage`, e);
        return initialData;
    }
};

const saveToStorage = <T,>(key: string, data: T[]) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const { initialPrograms, initialRundowns, initialStories } = getInitialData();

export const journalismService = {
  // Programs
  getPrograms: async (): Promise<NewsProgram[]> => getFromStorage<NewsProgram>(PROGRAMS_KEY, initialPrograms),
  saveProgram: async (program: Partial<NewsProgram>): Promise<NewsProgram[]> => {
      const programs = await journalismService.getPrograms();
      if (program.id) { // Update
          const index = programs.findIndex(p => p.id === program.id);
          if (index > -1) programs[index] = { ...programs[index], ...program } as NewsProgram;
      } else { // Create
          const newProgram: NewsProgram = {
              id: `prog_${Date.now()}`,
              name: program.name || 'Novo Programa',
              defaultStartTime: program.defaultStartTime || '12:00:00',
              defaultDuration: program.defaultDuration || '00:28:00',
              ...program,
          };
          programs.push(newProgram);
      }
      saveToStorage(PROGRAMS_KEY, programs);
      return programs;
  },
  deleteProgram: async (id: string): Promise<void> => {
      let programs = await journalismService.getPrograms();
      programs = programs.filter(p => p.id !== id);
      saveToStorage(PROGRAMS_KEY, programs);
  },

  // Rundowns
  getRundowns: async (): Promise<Rundown[]> => getFromStorage<Rundown>(RUNDOWNS_KEY, initialRundowns),
  createRundown: async (rundown: Rundown): Promise<Rundown> => {
      const rundowns = await journalismService.getRundowns();
      rundowns.push(rundown);
      saveToStorage(RUNDOWNS_KEY, rundowns);
      return rundown;
  },
  saveRundown: async (rundown: Rundown): Promise<Rundown> => {
      let rundowns = await journalismService.getRundowns();
      const index = rundowns.findIndex(r => r.id === rundown.id);
      if (index > -1) {
          rundowns[index] = rundown;
          saveToStorage(RUNDOWNS_KEY, rundowns);
      }
      return rundown;
  },
  deleteRundown: async (id: string): Promise<void> => {
      let rundowns = await journalismService.getRundowns();
      rundowns = rundowns.filter(r => r.id !== id);
      saveToStorage(RUNDOWNS_KEY, rundowns);
  },
  
  // Stories
  getStories: async (): Promise<Story[]> => getFromStorage<Story>(STORIES_KEY, initialStories),
  createStory: async (story: Story): Promise<Story> => {
      const stories = await journalismService.getStories();
      stories.push(story);
      saveToStorage(STORIES_KEY, stories);
      return story;
  },
  saveStory: async (story: Story): Promise<Story> => {
      let stories = await journalismService.getStories();
      const index = stories.findIndex(s => s.id === story.id);
      if (index > -1) {
          stories[index] = story;
          saveToStorage(STORIES_KEY, stories);
      }
      return story;
  },
  deleteStory: async (id: string): Promise<void> => {
      let stories = await journalismService.getStories();
      stories = stories.filter(s => s.id !== id);
      saveToStorage(STORIES_KEY, stories);
  },
};
