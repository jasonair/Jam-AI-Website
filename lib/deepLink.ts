/**
 * Deep linking utilities for Mac app integration
 */

/**
 * Generate a custom URL scheme for opening the Mac app
 * Format: jamai://auth?token=<idToken>&uid=<uid>
 */
export const generateMacAppAuthUrl = (idToken: string, uid: string): string => {
  const params = new URLSearchParams({
    token: idToken,
    uid: uid,
  });

  return `jamai://auth?${params.toString()}`;
};

/**
 * Open Mac app with authentication
 * This will attempt to open the Mac app with the auth token
 * If the app is not installed, it will show an error
 */
export const openMacAppWithAuth = async (idToken: string, uid: string): Promise<boolean> => {
  const deepLinkUrl = generateMacAppAuthUrl(idToken, uid);

  try {
    // Try to open the deep link
    window.location.href = deepLinkUrl;

    // Wait a bit to see if the app opens
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return true;
  } catch (error) {
    console.error('Failed to open Mac app:', error);
    return false;
  }
};

/**
 * Check if user is on macOS
 */
export const isMacOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
};

/**
 * Download link for Mac app
 * Replace with your actual download URL
 */
export const MAC_APP_DOWNLOAD_URL = 'https://jamai.app/download';
