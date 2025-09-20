/**
 * Simple network connectivity check for Filecoin uploads
 */
export const checkNetworkConnectivity = async (): Promise<boolean> => {
    try {
        // Try to fetch a simple endpoint to check network connectivity
        const response = await fetch('https://httpbin.org/get', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        });

        return response.ok;
    } catch (error) {
        console.warn('Network connectivity check failed:', error);
        return false;
    }
};

/**
 * Check if we're on Filecoin Calibration testnet
 */
export const checkFilecoinNetwork = (): boolean => {
    // Check if we're on the correct network
    const expectedChainId = 314159; // Filecoin Calibration testnet
    const currentChainId = window.ethereum?.chainId ? parseInt(window.ethereum.chainId, 16) : null;

    return currentChainId === expectedChainId;
};

/**
 * Get network troubleshooting tips
 */
export const getNetworkTroubleshootingTips = (): string[] => {
    return [
        "1. Check your internet connection",
        "2. Ensure you're connected to Filecoin Calibration testnet (Chain ID: 314159)",
        "3. Try refreshing the page and reconnecting your wallet",
        "4. Check if your USDFC balance is sufficient for storage",
        "5. Try uploading a smaller file first",
        "6. Wait a few minutes and try again (storage provider might be busy)"
    ];
};
