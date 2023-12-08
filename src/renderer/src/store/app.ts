import { defineStore } from 'pinia'
import { EventSubscription, OBSEventTypes } from 'obs-websocket-js'
import { useObs } from '../composables/useObs'

const { obs: app } = useObs()

export interface SceneItem {
  inputKind: string,
  isGroup: null | boolean,
  sceneItemBlendMode: 'OBS_BLEND_NORMAL',
  sceneItemEnabled: boolean,
  sceneItemId: number,
  sceneItemIndex: number,
  sceneItemLocked: boolean
  sceneItemTransform: any,
  sourceName: string,
  sourceType: 'OBS_SOURCE_TYPE_INPUT',
}

export interface InputVolumeMeter {
  inputLevelsMul: number[][],
  inputName: string,
}

export interface State {
  url: string,
  connected: boolean,
  currentPreviewSceneName: string,
  currentProgramSceneName: string,
  scenes: {
    sceneIndex: number,
    sceneName: string
  }[],
  inputs: {
    inputKind: string,
    inputName: string,
    unversionedInputKind: string
  }[],
  inputVolumeMeters: InputVolumeMeter[],
  inputVolumes: {
    [key: string]: {
      inputVolumeDb: number,
      inputVolumeMul: number,
      inputMuted: boolean,
    }
  }
  sceneItems: SceneItem[],
  hello: {
    rpcVersion: number,
    obsWebsocketVersion: string,
    negotiatedRpcVersion: number,
  }
  version: {
    availableRequests: string[]
    obsVersion: string
    obsWebSocketVersion: string
    platform: string
    platformDescription: string
    rpcVersion: number
    supportedImageExportFormats: string[]
  },
  stats: {
    cpuUsage: number,
    memoryUsage: number,
    availableDiskSpace: number,
    activeFps: number,
    renderSkippedFrames: number,
    outputSkippedFrames: number,
  }
  videoSettings: {
    fpsNumerator: number,
    fpsDenominator: number,
    baseWidth: number,
    baseHeight: number,
    outputWidth: number,
    outputHeight: number,
  }
  recordStatus: {
    outputActive: boolean,
    outputPaused: boolean,
    outputTimecode: string,
    outputDuration: number,
    outputBytes: number
  }
  streamStatus: {
    outputActive: boolean,
    outputReconnecting: boolean,
    outputTimecode: string,
    outputDuration: number,
    outputBytes: number,
    outputCongestion: number,
    outputSkippedFrames: number,
    outputTotalFrames: number,
  }
}

export const useAppStore = defineStore('obs', {
  state: (): State => {
    return {
      url: '',
      connected: false,
      currentPreviewSceneName: '',
      currentProgramSceneName: '',
      scenes: [],
      inputs: [],
      sceneItems: [],
      inputVolumeMeters: [],
      inputVolumes: {},
      hello: {
        rpcVersion: 0,
        obsWebsocketVersion: '',
        negotiatedRpcVersion: 0
      },
      version: {
        obsVersion: '',
        obsWebSocketVersion: '',
        platform: '',
        platformDescription: '',
        rpcVersion: 0,
        availableRequests: [],
        supportedImageExportFormats: []
      },
      stats: {
        cpuUsage: 0,
        memoryUsage: 0,
        availableDiskSpace: 0,
        activeFps: 0,
        renderSkippedFrames: 0,
        outputSkippedFrames: 0
      },
      videoSettings: {
        fpsNumerator: 0,
        fpsDenominator: 0,
        baseWidth: 0,
        baseHeight: 0,
        outputWidth: 0,
        outputHeight: 0
      },
      recordStatus: {
        outputActive: false,
        outputPaused: false,
        outputTimecode: '0:00:00',
        outputDuration: 0,
        outputBytes: 0
      },
      streamStatus: {
        outputActive: false,
        outputReconnecting: false,
        outputTimecode: '0:00:00',
        outputDuration: 0,
        outputBytes: 0,
        outputCongestion: 0,
        outputSkippedFrames: 0,
        outputTotalFrames: 0
      }
    }
  },
  getters: {
    currentSceneName(): string {
      return this.currentPreviewSceneName || this.currentProgramSceneName
    }
  },
  actions: {
    async connect(url: string, password: string): Promise<void> {
      this.url = url
      this.hello = await app.connect(url, password, {
        eventSubscriptions: EventSubscription.All | EventSubscription.InputVolumeMeters,
        rpcVersion: 1
      }) as unknown as State['hello']
      this.version = await app.call('GetVersion') as unknown as State['version']

      console.log('hello', this.hello)
      console.log('version', this.version)

      await app.call('SetStudioModeEnabled', {
        studioModeEnabled: true
      })

      const response = await app.call('GetSceneList')

      if (!response.currentPreviewSceneName) {
        throw new Error('Only Studio Mode is supported, yet.')
      }

      this.currentPreviewSceneName = response.currentPreviewSceneName
      this.currentProgramSceneName = response.currentProgramSceneName
      this.scenes = response.scenes as unknown as State['scenes']
      this.inputs = (await app.call('GetInputList')).inputs as unknown as State['inputs']
      this.stats = await app.call('GetStats')
      this.videoSettings = await app.call('GetVideoSettings')
      this.recordStatus = await app.call('GetRecordStatus')
      this.streamStatus = await app.call('GetStreamStatus')
      this.videoSettings = await app.call('GetVideoSettings')
      await this.updateSceneItems()

      console.log('inputs', this.inputs)

      this.inputs.forEach((input) => {
        app.call('GetInputVolume', { inputName: input.inputName }).then((response) => {
          this.inputVolumes[input.inputName] = {
            inputVolumeDb: response.inputVolumeDb,
            inputVolumeMul: response.inputVolumeMul,
            inputMuted: this.inputVolumes[input.inputName]?.inputMuted ?? false
          }
        })
        app.call('GetInputMute', { inputName: input.inputName }).then((response) => {
          this.inputVolumes[input.inputName] = {
            inputVolumeDb: this.inputVolumes[input.inputName]?.inputVolumeDb ?? 0,
            inputVolumeMul: this.inputVolumes[input.inputName]?.inputVolumeMul ?? 0,
            inputMuted: response.inputMuted
          }
        })
      })

      setInterval(async () => {
        this.recordStatus = await app.call('GetRecordStatus')
        this.streamStatus = await app.call('GetStreamStatus')
      }, 1000)

      setInterval(async () => {
        this.stats = await app.call('GetStats')
      }, 3000)

      app.on('CurrentProgramSceneChanged', (e: OBSEventTypes['CurrentProgramSceneChanged']) => {
        this.currentProgramSceneName = e.sceneName
      })
      app.on('CurrentPreviewSceneChanged', (e: OBSEventTypes['CurrentPreviewSceneChanged']) => {
        this.currentPreviewSceneName = e.sceneName
        app.call('GetSceneItemList', {
          sceneName: e.sceneName
        }).then((response) => {
          this.sceneItems = response.sceneItems as unknown as SceneItem[]
        })
      })
      app.on('SceneItemListReindexed', (e: OBSEventTypes['SceneItemListReindexed']) => {
        if (this.currentPreviewSceneName === e.sceneName) {
          console.log(e.sceneItems) // {sceneItemId: 13, sceneItemIndex: 1}[]
          console.log(this.sceneItems) // {sceneItemId: 13, sceneItemIndex: 1}[]

        }
      })
      app.on('SceneItemEnableStateChanged', (e: OBSEventTypes['SceneItemEnableStateChanged']) => {
        if (this.currentPreviewSceneName === e.sceneName) {
          // update sceneItem in sceneItems
          const sceneItem = this.sceneItems
            .find((sceneItem) => sceneItem.sceneItemId === e.sceneItemId)
          if (sceneItem) {
            sceneItem.sceneItemEnabled = e.sceneItemEnabled
          }
        }
      })
      app.on('SceneItemLockStateChanged', (e: OBSEventTypes['SceneItemLockStateChanged']) => {
        if (this.currentPreviewSceneName === e.sceneName) {
          // update sceneItem in sceneItems
          const sceneItem = this.sceneItems
            .find((sceneItem) => sceneItem.sceneItemId === e.sceneItemId)
          if (sceneItem) {
            sceneItem.sceneItemLocked = e.sceneItemLocked
          }
        }
      })
      // Audio API

      app.on('InputVolumeMeters', (e: OBSEventTypes['InputVolumeMeters']) => {
        // update inputVolumeMeters
        this.inputVolumeMeters = e.inputs as unknown as InputVolumeMeter[]
      })

      app.on('StreamStateChanged', (e: OBSEventTypes['StreamStateChanged']) => {
        this.streamStatus.outputActive = e.outputActive
      })

      app.on('InputVolumeChanged', (e: OBSEventTypes['InputVolumeChanged']) => {
        this.inputVolumes[e.inputName] = {
          inputVolumeDb: e.inputVolumeDb,
          inputVolumeMul: e.inputVolumeMul,
          inputMuted: this.inputVolumes[e.inputName]?.inputMuted ?? false
        }
      })

      app.on('InputMuteStateChanged', (e: OBSEventTypes['InputMuteStateChanged']) => {
        this.inputVolumes[e.inputName] = {
          inputVolumeDb: this.inputVolumes[e.inputName]?.inputVolumeDb ?? 0,
          inputVolumeMul: this.inputVolumes[e.inputName]?.inputVolumeMul ?? 0,
          inputMuted: e.inputMuted
        }
      })

      app.on('RecordStateChanged', (e: OBSEventTypes['RecordStateChanged']) => {
        this.recordStatus.outputActive = e.outputActive
      })

      app.on('SceneListChanged', (e: OBSEventTypes['SceneListChanged']) => {
        this.scenes = e.scenes as unknown as State['scenes']
      })


      const list = ['SceneItemCreated', 'SceneItemRemoved', 'SceneItemListReindexed']
      list.forEach((event: any) => app.on(event, () => this.updateSceneItems()))

      this.connected = true
    },
    async updateSceneItems() {
      this.sceneItems = (await app.call('GetSceneItemList', {
        sceneName: this.currentPreviewSceneName
      })).sceneItems as unknown as State['sceneItems']
    },
    setInputVolume(inputName: string, inputVolumeDb: number) {
      // noinspection JSIgnoredPromiseFromCall
      app.call('SetInputVolume', {
        inputName,
        inputVolumeDb
      })
    }
  }
})
