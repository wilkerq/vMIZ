import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { NewsProgram, Rundown, Story, Script, Playlist, RundownItemType, RundownItemStatus } from '../frontend/types'; // Assumindo que os tipos estão em frontend/types.ts

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'db.json');

interface DbSchema {
  programs: NewsProgram[];
  rundowns: Rundown[];
  stories: Story[];
  scripts: Script[];
  playlists: Playlist[];
}

const getInitialData = (): DbSchema => {
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
    return {
        programs: [
            { id: 'prog1', name: 'Jornal da Manhã', defaultStartTime: '07:00:00', defaultDuration: '00:56:30', vMixIpAddress: '192.168.1.101', vMixPort: 8088 },
            { id: 'prog2', name: 'Jornal da Noite', defaultStartTime: '19:00:00', defaultDuration: '00:26:30' },
        ],
        rundowns: initialRundowns,
        stories: initialStories,
        scripts: [],
        playlists: []
    };
};

const readDb = (): DbSchema => {
  try {
    if (!fs.existsSync(dbPath)) {
      const initialData = getInitialData();
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler do BD, retornando dados iniciais.', error);
    return getInitialData();
  }
};

const writeDb = (data: DbSchema) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

export const db = {
  read: readDb,
  write: writeDb,
};
