import { storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { trackAppDownload } from './analytics';

/**
 * Get the download URL for the Jam AI DMG file from Firebase Storage
 * @returns Promise<string> - The download URL
 */
export async function getAppDownloadURL(): Promise<string> {
  try {
    // Reference to the DMG file in Firebase Storage
    // The file should be uploaded to: downloads/JamAI.dmg
    const dmgRef = ref(storage, 'downloads/JamAI.dmg');
    
    // Get the download URL
    const url = await getDownloadURL(dmgRef);
    return url;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw new Error('Failed to get download URL. Please try again later.');
  }
}

/**
 * Download the Jam AI app
 * Opens the download in a new tab and tracks the download
 * @param source - Where the download originated from (e.g., 'landing', 'account', 'success')
 * @param userId - Optional user ID if user is authenticated
 */
export async function downloadApp(source: string = 'unknown', userId?: string): Promise<void> {
  try {
    const downloadURL = await getAppDownloadURL();
    
    // Track the download (non-blocking)
    trackAppDownload(source, userId);
    
    // Open download in new tab
    window.open(downloadURL, '_blank');
  } catch (error) {
    console.error('Error downloading app:', error);
    throw error;
  }
}

/**
 * Get app file info (optional - for displaying file size, etc.)
 */
export async function getAppInfo() {
  try {
    const dmgRef = ref(storage, 'downloads/JamAI.dmg');
    const url = await getDownloadURL(dmgRef);
    
    return {
      url,
      filename: 'JamAI.dmg',
      size: '~60 MB',
      platform: 'macOS (M1+)',
    };
  } catch (error) {
    console.error('Error getting app info:', error);
    return null;
  }
}
