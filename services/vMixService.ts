type VmixConnectionSettings = {
    vMixIpAddress: string;
    vMixPort: number;
}

export const vMixService = (settings: VmixConnectionSettings) => {
    const { vMixIpAddress, vMixPort } = settings;
    const baseURL = `http://${vMixIpAddress}:${vMixPort}/api/`;

    const sendCommand = async (params: URLSearchParams) => {
        if (!vMixIpAddress || !vMixPort) {
            console.warn("[vMixService] vMix connection settings are not configured.");
            return;
        }
        try {
            // Using 'no-cors' is common for direct local network requests from a browser
            // to avoid CORS issues when the target device (vMix) doesn't send CORS headers.
            await fetch(`${baseURL}?${params.toString()}`, { mode: 'no-cors' });
        } catch (error) {
            console.error(`[vMixService] Failed to send command to vMix. Is vMix running and accessible at ${baseURL}?`, error);
        }
    };

    return {
        setActiveInput: (inputName: string) => {
            const params = new URLSearchParams({ Function: 'ActiveInput', Input: inputName });
            sendCommand(params);
        },
        setPreviewInput: (inputName: string) => {
            const params = new URLSearchParams({ Function: 'PreviewInput', Input: inputName });
            sendCommand(params);
        },
        transition: (inputName: string) => {
            const previewParams = new URLSearchParams({ Function: 'PreviewInput', Input: inputName });
            sendCommand(previewParams);
            setTimeout(() => {
                const transitionParams = new URLSearchParams({ Function: 'Cut' });
                sendCommand(transitionParams);
            }, 50); // Small delay to ensure preview is set before transition
        },
        stop: () => {
            const params = new URLSearchParams({ Function: 'Fade', Input: 'Black', Duration: '500' });
            sendCommand(params);
        },
        overlayInputOn: (inputName: string, overlayChannel: number) => {
            if (overlayChannel < 1 || overlayChannel > 4) return;
            const params = new URLSearchParams({ Function: `OverlayInput${overlayChannel}On`, Input: inputName });
            sendCommand(params);
        },
        overlayInputOff: (overlayChannel: number) => {
            if (overlayChannel < 1 || overlayChannel > 4) return;
            const params = new URLSearchParams({ Function: `OverlayInput${overlayChannel}Off` });
            sendCommand(params);
        }
    };
};
