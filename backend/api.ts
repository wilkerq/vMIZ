import { Router } from 'express';
import { db } from './db';
import { NewsProgram, Rundown, Story, Script, Playlist } from '../frontend/types';
import fetch from 'node-fetch';

export const apiRouter = Router();

// --- JORNALISMO: PROGRAMAS ---
apiRouter.get('/programs', (req, res) => {
  res.json(db.read().programs);
});

apiRouter.post('/programs', (req, res) => {
  const data = db.read();
  const program = req.body as Partial<NewsProgram>;

  if (program.id) { // Atualizar
    const index = data.programs.findIndex(p => p.id === program.id);
    if (index > -1) {
      data.programs[index] = { ...data.programs[index], ...program };
    }
  } else { // Criar
    const newProgram: NewsProgram = {
      id: `prog_${Date.now()}`,
      name: program.name || 'Novo Programa',
      defaultStartTime: program.defaultStartTime || '12:00:00',
      defaultDuration: program.defaultDuration || '00:28:00',
      vMixIpAddress: program.vMixIpAddress,
      vMixPort: program.vMixPort
    };
    data.programs.push(newProgram);
  }
  db.write(data);
  res.json(data.programs);
});

apiRouter.delete('/programs/:id', (req, res) => {
  const { id } = req.params;
  const data = db.read();
  data.programs = data.programs.filter(p => p.id !== id);
  db.write(data);
  res.status(204).send();
});


// --- JORNALISMO: ESPELHOS ---
apiRouter.get('/rundowns', (req, res) => {
    res.json(db.read().rundowns);
});

apiRouter.post('/rundowns', (req, res) => {
    const data = db.read();
    const newRundown = req.body as Rundown;
    data.rundowns.push(newRundown);
    db.write(data);
    res.status(201).json(newRundown);
});

apiRouter.put('/rundowns/:id', (req, res) => {
    const { id } = req.params;
    const updatedRundown = req.body as Rundown;
    const data = db.read();
    const index = data.rundowns.findIndex(r => r.id === id);
    if (index > -1) {
        data.rundowns[index] = updatedRundown;
        db.write(data);
        res.json(updatedRundown);
    } else {
        res.status(404).json({ message: 'Espelho não encontrado' });
    }
});

apiRouter.delete('/rundowns/:id', (req, res) => {
    const { id } = req.params;
    const data = db.read();
    data.rundowns = data.rundowns.filter(r => r.id !== id);
    db.write(data);
    res.status(204).send();
});


// --- JORNALISMO: LAUDAS ---
apiRouter.get('/stories', (req, res) => {
    res.json(db.read().stories);
});

apiRouter.post('/stories', (req, res) => {
    const data = db.read();
    const newStory = req.body as Story;
    data.stories.push(newStory);
    db.write(data);
    res.status(201).json(newStory);
});

apiRouter.put('/stories/:id', (req, res) => {
    const { id } = req.params;
    const updatedStory = req.body as Story;
    const data = db.read();
    const index = data.stories.findIndex(s => s.id === id);
    if (index > -1) {
        data.stories[index] = updatedStory;
        db.write(data);
        res.json(updatedStory);
    } else {
        res.status(404).json({ message: 'Lauda não encontrada' });
    }
});

apiRouter.delete('/stories/:id', (req, res) => {
    const { id } = req.params;
    const data = db.read();
    data.stories = data.stories.filter(s => s.id !== id);
    db.write(data);
    res.status(204).send();
});


// --- PROXY DE COMANDOS VMIX ---
apiRouter.post('/vmix/command', async (req, res) => {
    const { ip, port, command } = req.body;
    if (!ip || !port || !command) {
        return res.status(400).json({ message: 'Faltando ip, porta ou comando' });
    }

    const commandUrl = `http://${ip}:${port}/api/?${command}`;
    console.log(`[Backend] Enviando comando vMix via proxy: ${commandUrl}`);

    try {
        await fetch(commandUrl);
        res.status(200).json({ message: 'Comando enviado' });
    } catch (error) {
        console.error(`[Backend] Erro ao enviar comando vMix via proxy:`, error);
        res.status(500).json({ message: 'Falha ao conectar à instância do vMix' });
    }
});
