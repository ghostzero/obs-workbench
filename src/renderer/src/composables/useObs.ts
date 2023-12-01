//@ts-ignore
import OBSWebSocket from 'obs-websocket-js'

const obs = new OBSWebSocket()

export function useObs() {
    return {
        obs,
    }
}