import { Playlist } from 'types';

const PLAYLISTS_KEY = 'vmix_playlists';

const getPlaylists = (): Playlist[] => {
    const data = localStorage.getItem(PLAYLISTS_KEY);
    return data ? JSON.parse(data) : [];
}

const savePlaylists = (playlists: Playlist[]) => {
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
}

export const playlistService = {
    getAllPlaylists: async (): Promise<Playlist[]> => {
        return getPlaylists();
    },
    getPlaylistById: async (id: string): Promise<Playlist | undefined> => {
        return getPlaylists().find(p => p.id === id);
    },
    savePlaylist: async (playlist: Playlist): Promise<Playlist> => {
        const playlists = getPlaylists();
        const existingIndex = playlists.findIndex(p => p.id === playlist.id);
        if (existingIndex > -1) {
            playlists[existingIndex] = playlist;
        } else {
            playlists.push(playlist);
        }
        savePlaylists(playlists);
        return playlist;
    }
}