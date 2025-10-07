import { Asset } from 'types';

const ASSETS_KEY = 'mam_assets';

// Mock data, as if it was uploaded previously
const getInitialAssets = (): Asset[] => [
  {
    id: 'asset1',
    name: 'Opening Scene.mp4',
    type: 'Video',
    fileSize: '128 MB',
    uploadDate: '2024-07-25',
    tags: ['opener', 'show', 'intro'],
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    resolution: '1920x1080',
    duration: '00:09:56',
    codec: 'H.264',
  },
  {
    id: 'asset2',
    name: 'Lower Third BG.png',
    type: 'Image',
    fileSize: '1.2 MB',
    uploadDate: '2024-07-24',
    tags: ['graphics', 'lower-third'],
    url: 'https://via.placeholder.com/1920x1080.png?text=Sample+Image',
    resolution: '1920x1080',
  },
  {
    id: 'asset3',
    name: 'Background Music.mp3',
    type: 'Audio',
    fileSize: '4.5 MB',
    uploadDate: '2024-07-24',
    tags: ['music', 'background'],
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', // Using a video URL for audio placeholder
    duration: '00:03:15',
  },
    {
    id: 'asset4',
    name: 'Reportagem Corrupção.mp4',
    type: 'Video',
    fileSize: '89 MB',
    uploadDate: '2024-07-26',
    tags: ['jornalismo', 'reportagem', 'corrupcao'],
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    resolution: '1920x1080',
    duration: '00:00:15',
    codec: 'H.264',
  },
];

const getAssets = (): Asset[] => {
  try {
    const assetsJson = localStorage.getItem(ASSETS_KEY);
    if (assetsJson) {
      return JSON.parse(assetsJson);
    } else {
      const initialAssets = getInitialAssets();
      localStorage.setItem(ASSETS_KEY, JSON.stringify(initialAssets));
      return initialAssets;
    }
  } catch (error) {
    console.error("Failed to parse assets from localStorage", error);
    return getInitialAssets();
  }
};

const saveAssets = (assets: Asset[]) => {
  localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
};

export const mamService = {
  searchAssets: async (query: string): Promise<Asset[]> => {
    const assets = getAssets();
    if (!query) {
      return assets;
    }
    const lowercasedQuery = query.toLowerCase();
    return assets.filter(asset =>
      asset.name.toLowerCase().includes(lowercasedQuery) ||
      asset.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
    );
  },
  addAsset: async (asset: Asset): Promise<void> => {
      const assets = getAssets();
      assets.unshift(asset); // Add to the top
      saveAssets(assets);
  }
};