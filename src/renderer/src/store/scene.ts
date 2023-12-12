import { defineStore } from 'pinia'
import { useObs } from '../composables/useObs'
import { usePopupStore } from './popup'
import { useNotificationStore } from './notification'
import { SceneItem } from './app'

const {obs} = useObs()

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {}

export const useSceneStore = defineStore('scene', {
    state: (): RootState => {
        return {}
    },
    actions: {
        async removeScene(sceneName: string) {
            const popup = usePopupStore()
            const result = await popup.confirm({
                title: 'Remove Scene',
                message: `Are you sure you want to remove the scene "${sceneName}"?`,
            })

            if (result) {
                await obs.call('RemoveScene', {sceneName})
            }
        },
        async removeSceneItem(sceneName: string, item: SceneItem) {
            const popup = usePopupStore()
            const result = await popup.confirm({
                title: 'Remove Input',
                message: `Are you sure you want to remove the input "${item.sourceName}"?`,
            })

            if (result) {
                await obs.call('RemoveSceneItem', {
                    sceneName,
                    sceneItemId: item.sceneItemId,
                })
            }
        },
        async createSrtSource(
            sceneName: string,
            inputName: string,
            mode: 'listener' | 'caller' = 'listener',
        ) {
            try {
                await obs.call('CreateInput', {
                    sceneName,
                    inputName,
                    inputKind: 'ffmpeg_source',
                    inputSettings: {
                        input: `srt://127.0.0.1:10000?mode=${mode}&timeout=5000000&latency=200000`,
                        buffering_mb: 1,
                        hw_decode: true,
                        input_format: 'mpegts',
                        is_local_file: false,
                        reconnect_delay_sec: 1,
                    },
                })
            } catch (e: any) {
                const {exception} = useNotificationStore()
                exception(e)
                throw e
            }
        },
    },
})
