import { apiService } from './apiService';

type VmixConnectionSettings = {
    vMixIpAddress: string;
    vMixPort: number;
}

export const vMixService = (settings: VmixConnectionSettings) => {
    const { vMixIpAddress, vMixPort } = settings;

    const sendCommand = async (params: URLSearchParams) => {
        try {
            await apiService.post('/vmix/command', {
                ip: vMixIpAddress,
                port: vMixPort,
                command: params.toString()
            });
        } catch (error) {
            console.error(`[vMixService] Falha ao enviar comando via proxy do backend. O servidor backend está rodando?`, error);
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
            }, 50);
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
