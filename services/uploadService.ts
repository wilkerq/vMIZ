import { mamService } from 'services/mamService';
import { Asset } from 'types';

export const uploadService = {
  upload: async (file: File): Promise<void> => {
    // This is a mock upload service. In a real application, this would
    // upload the file to a server and return a URL.
    // Here, we'll just simulate it by adding it to our local MAM service.
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const assetType = file.type.startsWith('video') ? 'Video' :
                      file.type.startsWith('image') ? 'Image' :
                      file.type.startsWith('audio') ? 'Audio' : 'Video'; // Default to video

    const newAsset: Asset = {
        id: `asset_${Date.now()}`,
        name: file.name,
        type: assetType,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        tags: ['new', 'uploaded'],
        url: URL.createObjectURL(file), // Create a temporary local URL for preview
        duration: assetType === 'Video' || assetType === 'Audio' ? '00:00:00' : undefined,
        resolution: assetType === 'Image' ? 'N/A' : undefined,
    };
    
    await mamService.addAsset(newAsset);
  },
};