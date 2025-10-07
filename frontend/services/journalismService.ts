import { NewsProgram, Rundown, Story } from '../types';
import { apiService } from './apiService';

export const journalismService = {
  // Programs
  getPrograms: (): Promise<NewsProgram[]> => apiService.get('/programs'),
  saveProgram: (program: Partial<NewsProgram>): Promise<NewsProgram[]> => apiService.post('/programs', program),
  deleteProgram: (id: string): Promise<void> => apiService.del(`/programs/${id}`),

  // Rundowns
  getRundowns: (): Promise<Rundown[]> => apiService.get('/rundowns'),
  createRundown: (rundown: Rundown): Promise<Rundown> => apiService.post('/rundowns', rundown),
  saveRundown: (rundown: Rundown): Promise<Rundown> => apiService.put(`/rundowns/${rundown.id}`, rundown),
  deleteRundown: (id: string): Promise<void> => apiService.del(`/rundowns/${id}`),
  
  // Stories
  getStories: (): Promise<Story[]> => apiService.get('/stories'),
  createStory: (story: Story): Promise<Story> => apiService.post('/stories', story),
  saveStory: (story: Story): Promise<Story> => apiService.put(`/stories/${story.id}`, story),
  deleteStory: (id: string): Promise<void> => apiService.del(`/stories/${id}`),
};
